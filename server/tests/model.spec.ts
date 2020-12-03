import { response } from "express";
import Model, { sqlQuery } from "../source/model";

// eslint-disable-next-line @typescript-eslint/camelcase
const output: [{ folder_id: string }] = [{ folder_id: undefined }];

beforeAll(async () => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  output[0].folder_id = Model.rootId;
});

describe("Unit tests for PostgreSQL", () => {
  test("should return root id", async () => {
    return sqlQuery("SELECT folder_id FROM Folders WHERE title = 'Root'").then(
      response => {
        expect(response).toEqual(output);
      }
    );
  });
});
