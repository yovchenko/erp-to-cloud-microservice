/* eslint-disable @typescript-eslint/camelcase */
import Model, { sqlQuery } from "../source/model";

const root: [{ folder_id: string | null }] = [{ folder_id: null }];
const workTypes: Array<{ erp_work_type: string }> = [];

beforeAll(async () => {
  // Model static class initialization
  root[0]["folder_id"] = Model.rootId;
  Model.workTypes.forEach(str => {
    workTypes.push(Object.assign({ erp_work_type: str }));
  });
});

describe("unit tests for PostgreSQL database", () => {
  test("should return the root id", () => {
    return expect(
      sqlQuery("SELECT folder_id FROM Folders WHERE title = 'Root'")
    ).resolves.toStrictEqual(root);
  });

  test("should throw a syntax error", () => {
    expect(
      sqlQuery("SELECT FROM Folders WHERE title = 'Root'")
    ).rejects.toThrow();
  });

  test("should resolve an array of ERP's work types", () => {
    expect(
      sqlQuery("SELECT DISTINCT erp_work_type FROM Spaces_info")
    ).resolves.toEqual(expect.arrayContaining(workTypes));
  });
});
