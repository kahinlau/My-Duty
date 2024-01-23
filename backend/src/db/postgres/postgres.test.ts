import { 
  queryWithPoolConnection,
  getPool,
} from ".";
import * as pg from 'pg';

/**
 * In this test, we will just mock the pg client to test the functionality
 * It won't connect to the mock DB
 */

// Mock pg pool
jest.mock('pg', () => {
  const mock = {
    connect: jest.fn(),
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mock) };
});
const pgMock = pg as jest.Mocked<typeof pg>;
const pgPoolMock = new pgMock.Pool();

afterEach(() => {
	jest.clearAllMocks();
});

describe("test all db functions", () => {
	// Some mock Data
	const mockError = new Error("get client pool error");
  const mockFnInput = "mockFnInput";
  const mockErrorFn = (_: pg.Pool) => (_: string) => Promise.reject("mockError");
  const mockQueryResult = {
		rows: [
      { id: "mockId", name: "mockName"}
		]
	} as pg.QueryResult;
  const mockResult = { data: mockQueryResult }
  const mockFn = (_: pg.Pool) => (_: string) => Promise.resolve(mockQueryResult);
  const mockErrorResult = {"description": "get client pool error", "name": "A database error was found."};

  describe("test queryWithPoolConnection function", () => {
		it("should return query result", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
			spy.mockImplementationOnce(() => Promise.resolve(mockQueryResult));
			await expect(queryWithPoolConnection(mockFn)(mockFnInput)).resolves.toStrictEqual(mockResult);
		});
		it("should return error result if it fails to get query result", async () => {
			const spy = jest.spyOn(pgPoolMock, "query");
      spy.mockImplementationOnce(() => Promise.reject(mockError));
			await expect(queryWithPoolConnection(mockErrorFn)(mockFnInput)).resolves.toStrictEqual(mockErrorResult);
		});
	});
	
  describe("test queryWithPoolConnection function", () => {
		it("should return pool", () => {
			expect(getPool()).toStrictEqual(pgPoolMock);
		});
	});
});