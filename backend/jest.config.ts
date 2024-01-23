/* eslint-disable */
export default {
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": "ts-jest",
	},
  verbose: true,
  modulePathIgnorePatterns: ['dist'],
	moduleFileExtensions: ["ts", "js"],
  coverageDirectory: './coverage/',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
};
