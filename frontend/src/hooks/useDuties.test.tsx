import { act, renderHook, waitFor } from "@testing-library/react";
import useDuties from "./useDuties";

const mockSuccessResponseData = {"data":[{"id":"cb7e97d9-44fb-423f-b9c1-1dae99096491","name":"mockDataName"}]}
const type: ResponseType = "default";
const mockSuccessResponse = {
  body: null,
  headers: {
    append: function (name: string, value: string): void {
      throw new Error("Function not implemented.");
    },
    delete: function (name: string): void {
      throw new Error("Function not implemented.");
    },
    get: function (name: string): string | null {
      throw new Error("Function not implemented.");
    },
    has: function (name: string): boolean {
      throw new Error("Function not implemented.");
    },
    set: function (name: string, value: string): void {
      throw new Error("Function not implemented.");
    },
    forEach: function (callbackfn: (value: string, key: string, parent: Headers) => void, thisArg?: any): void {
      throw new Error("Function not implemented.");
    },
    entries: function (): IterableIterator<[string, string]> {
      throw new Error("Function not implemented.");
    },
    keys: function (): IterableIterator<string> {
      throw new Error("Function not implemented.");
    },
    values: function (): IterableIterator<string> {
      throw new Error("Function not implemented.");
    },
    [Symbol.iterator]: function (): IterableIterator<[string, string]> {
      throw new Error("Function not implemented.");
    },
    getSetCookie: function (): string[] {
      throw new Error("Function not implemented.");
    }
  },
  ok: true,
  redirected: false,
  status: 200,
  statusText: "OK",
  type,
  url: "http://localhost:3000/dutiesss",
  clone: function (): Response {
    throw new Error("Function not implemented.");
  },
  bodyUsed: false,
  arrayBuffer: function (): Promise<ArrayBuffer> {
    throw new Error("Function not implemented.");
  },
  blob: function (): Promise<Blob> {
    throw new Error("Function not implemented.");
  },
  formData: function (): Promise<FormData> {
    throw new Error("Function not implemented.");
  },
  json: () => Promise.resolve(mockSuccessResponseData),
  text: function (): Promise<string> {
    throw new Error("Function not implemented.");
  }
}

const mockFailResponseData = {"error": "mock fetch fail"};
const mockFailResponse = {
  ...mockSuccessResponse,
  json: () => Promise.resolve(mockFailResponseData),
}

// Suppressing unnecessary warnings from the official doc
const originalError = console.error

beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
});

afterAll(() => {
  console.error = originalError
});

afterEach(() => {
  jest.resetAllMocks();
});

describe("test useDuties", () => {
  it("should return the initial values for duties, isLoading and initialDuites without fetching", async () => {
    const { result } = renderHook(useDuties);
    const { duties, initialDuites, isLoading } = result.current;
    expect(duties).toStrictEqual([]);
    expect(initialDuites).toStrictEqual([]);
    expect(isLoading).toStrictEqual(true);
  });

  it("should return the updated values for duties, isLoading and initialDuites after fetching successfully", async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockSuccessResponse);
    const { result, rerender } = renderHook(useDuties);
    await waitFor(() => {});
    act(() => {
      rerender();
    }); 
    
    const { duties, initialDuites, isLoading } = result.current;
    expect(duties).toStrictEqual((await mockSuccessResponse.json()).data);
    expect(initialDuites).toStrictEqual((await mockSuccessResponse.json()).data);
    expect(isLoading).toStrictEqual(false);
  });
  it("should return the default values for duties, isLoading and initialDuites after fetching unsuccessfully", async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(mockFailResponse);
    const { result, rerender } = renderHook(useDuties);
    await waitFor(() => {});
    act(() => {
      rerender();
    }); 
    const { duties, initialDuites, isLoading } = result.current;
    expect(duties).toStrictEqual([]);
    expect(initialDuites).toStrictEqual([]);
    expect(isLoading).toStrictEqual(false);
  });
  it("should return the default values for duties, isLoading and initialDuites due to unexpected erros", async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce("mock fetch fail")
    const { result, rerender } = renderHook(useDuties);
    await waitFor(() => {});
    act(() => {
      rerender();
    }); 
    const { duties, initialDuites, isLoading } = result.current;
    expect(duties).toStrictEqual([]);
    expect(initialDuites).toStrictEqual([]);
    expect(isLoading).toStrictEqual(false);
  });
});