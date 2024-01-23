import { getErrorMessage } from "./errors";

describe("test errors", () => {
	describe("test getErrorMessage function", () => {
		it("should return error message if it is an Error type", () => {
			const result = getErrorMessage(new Error("mockError message"));
      expect(result).toStrictEqual('mockError message')
		});
		it("should return the string if it is a string type", () => {
			const result = getErrorMessage("mockError message");
      expect(result).toStrictEqual('mockError message')
		});
		it("should 'Unknown error type' if it is neither Error or string", () => {
			const result = getErrorMessage({});
      expect(result).toStrictEqual('Unknown error type')
		});
		it("should 'Unknown error type' if it is neither Error or string", () => {
			const result = getErrorMessage([]);
      expect(result).toStrictEqual('Unknown error type')
		});
		it("should 'Unknown error type' if it is neither Error or string", () => {
			const result = getErrorMessage(123);
      expect(result).toStrictEqual('Unknown error type')
		});
		it("should 'Unknown error type' if it is neither Error or string", () => {
			const result = getErrorMessage(true);
      expect(result).toStrictEqual('Unknown error type')
		});
		it("should 'Unknown error type' if it is neither Error or string", () => {
			const result = getErrorMessage(undefined);
      expect(result).toStrictEqual('Unknown error type')
		});
		it("should 'Unknown error type' if it is neither Error or string", () => {
			const result = getErrorMessage(null);
      expect(result).toStrictEqual('Unknown error type')
		});
		it("should 'Unknown error type' if it is neither Error or string", () => {
			const result = getErrorMessage(Symbol("sd"));
      expect(result).toStrictEqual('Unknown error type')
		});
	});
});
