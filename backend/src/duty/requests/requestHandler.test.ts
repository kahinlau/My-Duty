import * as request from "supertest";
import * as http from "http";
import * as express from "express";
import { Pool } from "pg";
import { getDutiesRequestHandlers, getDutyRequestHandlers, postDutiesRequestHandlers, postDutyRequestHandlers, putDutyRequestHandlers } from ".";
import * as postgresModule from "../../db/postgres";
import { DutyRecordErrors, GeneralErrors } from "../../errors/errors";
import { initalizeDataBase, initalizeDutyTable } from "../../db/postgres";

/**
 * In this test, we will use the mock DB to test against the endpoint
 */
const mockDBPool = new Pool({
  database: 'dutymock',
  user: 'postgres',
  password: "mysecretpassword",
});


// Create mock server
const app = express();
app.disable("x-powered-by");
app.use(express.json());
app.get("/duty/:id", ...getDutyRequestHandlers);
app.get("/duties", ...getDutiesRequestHandlers);
app.post("/duty", ...postDutyRequestHandlers);
app.post("/duties", ...postDutiesRequestHandlers);
app.put("/duty", ...putDutyRequestHandlers);
const httpServer = http.createServer(app);


// Some mock data
// defaultMockDutyIds are the default records stored in the DB that won't be deleted after cleanup
/**
 *  Some mock data 
 *  cleanUp function will be triggered after POST/PUT Request to remove the testing data
 *  defaultMockDutyIds are the default records stored in the DB that won't be deleted after cleanup
 */
const cleanUp = async (id: string) => {
  if (defaultMockDutyIds.includes(id)) return;
  await mockDBPool.query(`DELETE FROM duty WHERE id = '${id}'`);
};
const defaultMockDutyIds = ['bbbe6676-e3e4-4864-9c49-a47ed0cce78d', '2ae3742b-aecc-4529-9b86-ca61b43d9471']
const reqMock = {
  body: {
    "name": "randomMockValue"
  },
};
const invalidReqMock = {
  body: {
    "random": "randomMock"
  },
};

beforeAll(async () => {
	httpServer.listen(3013, () => console.log("Testing Server listening on 3013"));
  await initalizeDataBase(false)(mockDBPool)(["dutymock"])();
  await mockDBPool.query(`INSERT INTO duty(id, name) VALUES ('${defaultMockDutyIds[0]}','defaultMockValue1'), ('${defaultMockDutyIds[1]}','defaultMockValue2');`)
});
afterAll(() => {
	httpServer.close();
  mockDBPool.end();
});

describe("test endpoints", () => {
  describe("test GET /duty/:id ", () => {
    it("should return status 422 due to id is not UUID", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).get("/duty/ab").send();
      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("error")
    });
    it("should return status 404 due to record not found", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).get("/duty/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa").send();
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toStrictEqual(DutyRecordErrors.NotFoundError);
    });
    it("should return status 500 due to db error", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const querySpy = jest.spyOn(mockDBPool, "query");
      querySpy.mockImplementationOnce(() => Promise.reject("mock db error"));
      const res = await request(httpServer).get("/duty/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa").send();
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toStrictEqual(GeneralErrors.DatabaseError);
    });
    it("should return status 200 due to record found", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).get(`/duty/${defaultMockDutyIds[0]}`).send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data")
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.id).toStrictEqual(defaultMockDutyIds[0]);
    });
  })

  describe("test GET /duties ", () => {
    it("should return status 500 due to db error", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const querySpy = jest.spyOn(mockDBPool, "query");
      querySpy.mockImplementationOnce(() => Promise.reject("mock db error"));
      const res = await request(httpServer).get("/duties").send();
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toStrictEqual(GeneralErrors.DatabaseError)
    });
    it("should return status 200 due to records found", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).get("/duties").send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveLength(2);
    });
  })

  describe("test POST /duty", () => {
    it("should return status 422 due to invalid input", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).post("/duty").send(invalidReqMock.body);
      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("error");
    });
    it("should return status 500 due to db error", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const querySpy = jest.spyOn(mockDBPool, "query");
      querySpy.mockImplementationOnce(() => Promise.reject("mock db error"));
      const res = await request(httpServer).post("/duty").send(reqMock.body);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toStrictEqual(GeneralErrors.DatabaseError)
    });
    it("should return status 200", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).post("/duty").send(reqMock.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data");
      await cleanUp(res.body.data.id);
    });
  })

  describe("test POST /duties", () => {
    it("should return status 422 due to invalid input", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).post("/duties").send(invalidReqMock.body);
      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("error");
    });

    it("should return status 422 due to invalid input", async () => {
      const invalidReqMock = {
        body: {
          "duties": [
            { a: "1", name: "sd"}
          ]
        },
      }
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).post("/duties").send(invalidReqMock.body);
      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("error")
    });
    it("should return status 500 due to db error", async () => {
      const reqMock = {
        body: {
          "duties": [
            { id: "temp-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "sd"}
          ]
        },
      }
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const querySpy = jest.spyOn(mockDBPool, "query");
      querySpy.mockImplementationOnce(() => Promise.reject("mock db error"));
      const res = await request(httpServer).post("/duties").send(reqMock.body);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toStrictEqual(GeneralErrors.DatabaseError)
    });
    it("should return status 200", async () => {
      const reqMock = {
        body: {
          "duties": [
            { id: "temp-aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "sd"}
          ]
        },
      }
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).post("/duties").send(reqMock.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data");
      await Promise.all(res.body.data.map(duty => cleanUp(duty.id)));
    });
  })

  describe("test PUT /duty", () => {
    it("should return status 422 due to invalid input", async () => {
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).put("/duty").send(invalidReqMock.body);
      expect(res.statusCode).toEqual(422);
      expect(res.body).toHaveProperty("error")
    });
    it("should return status 404 due to record not found", async () => {
      const reqMock = {
        body: {
          id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", name: "sd"
        },
      }
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).put("/duty").send(reqMock.body);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toStrictEqual(DutyRecordErrors.NotFoundError);
    });
    it("should return status 500 due to db error", async () => {
      const reqMock = {
        body: {
          id: defaultMockDutyIds[0], name: "modifiedMockValue1"
        },
      }
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const querySpy = jest.spyOn(mockDBPool, "query");
      querySpy.mockImplementationOnce(() => Promise.reject("mock db error"));
      const res = await request(httpServer).put("/duty").send(reqMock.body);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toStrictEqual(GeneralErrors.DatabaseError)
    });
    it("should return status 200 due to record found", async () => {
      const reqMock = {
        body: {
          id: defaultMockDutyIds[0], name: "modifiedMockValue1"
        },
      }
      const spy = jest.spyOn(postgresModule, "getPool");
      spy.mockImplementation(() => mockDBPool);
      const res = await request(httpServer).put(`/duty`).send(reqMock.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("data");
      expect(res.body.data).toHaveProperty("id");
      expect(res.body.data.id).toStrictEqual(reqMock.body.id);
      expect(res.body.data.name).toStrictEqual(reqMock.body.name);
    });
  })
})