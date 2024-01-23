import { 
	createDutyWithPoolConnection,
	getDutiesWithPoolConnection,
	getDutyWithPoolConnection,
	updateDutyWithPoolConnection,
	updateDutiesWithPoolConnection,
	upsertDutiesWithPoolConnection,
} from ".";
import * as pg from 'pg';

/**
 * In this test, we will just mock the pg client to test the functionality
 * It won't connect to the mock DB
 */

// Mock pg pool
jest.mock('pg', () => {
  const mock = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mock) };
});
const pgMock = pg as jest.Mocked<typeof pg>;
const pgPoolMock = new pgMock.Pool();

afterEach(() => {
	jest.clearAllMocks();
});

describe("test all duty functions", () => {
	const mockName = "mockName";
	const mockId = "mockId";
	const mockDuty1 = { id: mockId, name: mockName };
	const mockDuty2 = { id: "mockId2", name: 'mockName2' };
	const mockDuty3 = { id: "temp-mockId3", name: 'mockName3' };
	const mockResult = {
		rows: [
			mockDuty1,
			mockDuty2,
		]
	};
	
	const mockError = new Error("db error");

	describe("test createDutyWithPoolConnection function", () => {
		it("should return newly created duty", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			spy.mockImplementationOnce(() => Promise.resolve(mockResult));
			await expect(createDutyWithPoolConnection(pgPoolMock)(mockName)).resolves.toStrictEqual(mockResult);
		});
		it("should return error if it fails to create duty", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			spy.mockImplementationOnce(() => Promise.reject(mockError));
      await expect(createDutyWithPoolConnection(pgPoolMock)(mockName)).rejects.toThrow(mockError)
		});
	});
	describe("test getDutiesWithPoolConnection function", () => {
		it("should return all duties", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			const mockResult = {
				rows: [
					{ id: mockId, name: 'mockName' },
					{ id: "mockId2", name: 'mockName2' },
				]
			};
			spy.mockImplementationOnce(() => Promise.resolve(mockResult));
			await expect(getDutiesWithPoolConnection(pgPoolMock)()).resolves.toStrictEqual(mockResult);
		});
		it("should return error if it fails to all duties", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			spy.mockImplementationOnce(() => Promise.reject(mockError));
      await expect(getDutiesWithPoolConnection(pgPoolMock)()).rejects.toThrow(mockError);
		});
	});
	describe("test getDutyWithPoolConnection function", () => {
		it("should return the duty", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			const mockResult = {
				rows: [
					mockDuty1,
				]
			};
			spy.mockImplementationOnce(() => Promise.resolve(mockResult));
			await expect(getDutyWithPoolConnection(pgPoolMock)(mockId)).resolves.toStrictEqual(mockResult);
		});
		it("should return error if it fails to all duties", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			spy.mockImplementationOnce(() => Promise.reject(mockError));
      await expect(getDutyWithPoolConnection(pgPoolMock)(mockId)).rejects.toThrow(mockError);
		});
	});
	describe("test updateDutyWithPoolConnection function", () => {
		it("should return the updated duty", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			const mockResult = {
				rows: [
					mockDuty2,
				]
			};
			spy.mockImplementationOnce(() => Promise.resolve(mockResult));
			await expect(updateDutyWithPoolConnection(pgPoolMock)(mockDuty2)).resolves.toStrictEqual(mockResult);
		});
		it("should return error if it fails to update the duty", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			spy.mockImplementationOnce(() => Promise.reject(mockError));
      await expect(updateDutyWithPoolConnection(pgPoolMock)(mockDuty1)).rejects.toThrow(mockError);
		});
	});
	describe("test updateDutiesWithPoolConnection function", () => {
		it("should return the updated duties", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			const mockResult = {
				rows: [
					mockDuty1,
					mockDuty2,
				]
			};
			spy.mockImplementationOnce(() => Promise.resolve(mockResult));
			await expect(updateDutiesWithPoolConnection(pgPoolMock)([mockDuty1, mockDuty2])).resolves.toStrictEqual(mockResult);
		});
		it("should return error if it fails to update all duties", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			spy.mockImplementationOnce(() => Promise.reject(mockError));
      await expect(updateDutiesWithPoolConnection(pgPoolMock)([mockDuty1, mockDuty2])).rejects.toThrow(mockError);
		});
	});

	describe("test upsertDutiesWithPoolConnection function", () => {
		it("should return the duties and query has been called 1 time (onlt get)", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			const mockResult = {
				rows: [
					mockDuty1,
					mockDuty2,
				]
			};
			spy.mockImplementation(() => Promise.resolve(mockResult));
			await expect(upsertDutiesWithPoolConnection(pgPoolMock)([]))
				.resolves.toStrictEqual(mockResult)
			expect(spy).toHaveBeenCalledTimes(1);
		});
		it("should return the duties and query has been called 2 times (only update and get)", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			const mockResult = {
				rows: [
					mockDuty1,
					mockDuty2,
				]
			};
			spy.mockImplementation(() => Promise.resolve(mockResult));
			await expect(upsertDutiesWithPoolConnection(pgPoolMock)([mockDuty1, mockDuty2]))
				.resolves.toStrictEqual(mockResult)
			expect(spy).toHaveBeenCalledTimes(2);
		});
		it("should return the duties and query has been called 2 times (only insert and get)", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			const mockResult = {
				rows: [
					mockDuty1,
					mockDuty2,
				]
			};
			spy.mockImplementation(() => Promise.resolve(mockResult));
			await expect(upsertDutiesWithPoolConnection(pgPoolMock)([mockDuty3]))
				.resolves.toStrictEqual(mockResult)
			expect(spy).toHaveBeenCalledTimes(2);
		});
		it("should return the duties and query has been called 3 times (insert, update and get)", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			const mockResult = {
				rows: [
					mockDuty1,
					mockDuty2,
				]
			};
			spy.mockImplementation(() => Promise.resolve(mockResult));
			await expect(upsertDutiesWithPoolConnection(pgPoolMock)([mockDuty1, mockDuty2, mockDuty3]))
				.resolves.toStrictEqual(mockResult)
			expect(spy).toHaveBeenCalledTimes(3);
		});
		it("should return error if it fails", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			spy.mockImplementationOnce(() => Promise.reject(mockError));
      await expect(upsertDutiesWithPoolConnection(pgPoolMock)([mockDuty1, mockDuty2])).rejects.toThrow(mockError);
		});
	});
});
