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
  test("should resolve the root id as a string", () => {
    return expect(
      sqlQuery("SELECT folder_id FROM Folders WHERE title = 'Root'")
    ).resolves.toStrictEqual(root);
  });

  test("should throw a syntax error", async () => {
    await expect(sqlQuery("SELECTFROM Folders")).rejects.toThrow();
  });

  test("should resolve an array of ERP's work types", () => {
    return expect(
      sqlQuery("SELECT DISTINCT erp_work_type FROM Spaces_info")
    ).resolves.toEqual(workTypes);
  });

  test("should resolve SQL join result set", () => {
    return expect(
      sqlQuery(`SELECT inf.project_title, 
      wf.prop_hidden 
      FROM Spaces_info AS inf 
      LEFT JOIN Workflows AS wf 
      ON inf.workflow_id = wf.workflow_id 
      GROUP BY project_title, prop_hidden;`)
    ).resolves.toEqual(
      expect.arrayContaining([
        expect.not.objectContaining({ prop_hidden: null })
      ])
    );
  });
});
