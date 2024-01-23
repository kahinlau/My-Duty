import { getInsertQueryText, getInsertSingleQueryText, getSelectQueryText, getUpdateQueryText } from ".";

// Some mock Data
const mockDuties = [
  {
    "id": "f70ca1ce-6e14-4e1b-a9d6-2bbdff75a55c",
    "name": "hello"
  },
  {
      "id": "254041a9-6a9d-4509-8f9a-b50397958fc7",
      "name": "bye"
  },
  {
      "id": "49351802-9e0f-4b28-9511-f8d1e4bd2280",
      "name": "mic"
  }
]

describe("test all queries function", () => {
	describe("test getSelectQueryText function", () => {
		it("should return query text of all duties if no id is provided", () => {
			const result = getSelectQueryText();
      expect(result).toStrictEqual('SELECT * FROM duty')
		});
		it("should return  query text of the duty with the id", () => {
      const mockId = mockDuties[0].id;
			const result = getSelectQueryText(mockId);
      expect(result).toStrictEqual(`SELECT id, name FROM duty WHERE id = '${mockId}'`)
		});
	});
  describe("test getUpdateQueryText function", () => {
		it("should return query text of empty text if duties is an empty array", () => {
			const result = getUpdateQueryText([]);
      expect(result).toStrictEqual('')
		});
		it("should return update query text of the duties", () => {
			const result = getUpdateQueryText(mockDuties);
      expect(result).toStrictEqual(`UPDATE duty as d SET name=c.name FROM (VALUES ('${mockDuties[0].id}','${mockDuties[0].name}'), ('${mockDuties[1].id}','${mockDuties[1].name}'), ('${mockDuties[2].id}','${mockDuties[2].name}')) AS c(id, name) WHERE d.id::text = c.id::text RETURNING *`)
		});
	});
  describe("test getInsertSingleQueryText function", () => {
		it("should return insert query text of the duty with the name", () => {
      const mockName = mockDuties[0].name;
			const result = getInsertSingleQueryText(mockName);
      expect(result).toStrictEqual( `INSERT INTO duty(name) VALUES('${mockName}') RETURNING *`)
		});
	});
  describe("test getInsertQueryText function", () => {
		it("should return query text of empty text if duties is an empty array", () => {
			const result = getInsertQueryText([]);
      expect(result).toStrictEqual('')
		});
		it("should return insert query text of the duties", () => {
			const result = getInsertQueryText(mockDuties);
      expect(result).toStrictEqual(`INSERT INTO duty(name) VALUES ('${mockDuties[0].name}'), ('${mockDuties[1].name}'), ('${mockDuties[2].name}') RETURNING *`)
		});
	});
});
