import { checkErpData } from "../source/erpDataExchange";
import { projectGroupBy } from "../source/erpDataExchange";
import * as interfaces from "../source/interfaces";
import Model from "../source/model";

describe("unit tests for epr http-service", () => {
  test("should return a set of grouped projects", () => {
    const projectsArr: interfaces.Project[] = [
      {
        id: "1",
        title: "test-1",
        customFields: [
          {
            id: Model.customField[2],
            value: "XXX"
          },
          {
            id: Model.customField[1],
            value: "2"
          }
        ]
      },
      {
        id: "2",
        title: "test-2",
        customFields: [
          {
            id: Model.customField[2],
            value: "XXX"
          },
          {
            id: Model.customField[1],
            value: "1"
          }
        ]
      }
    ];

    expect(projectGroupBy(projectsArr, "value")).toMatchObject({
      "1": [{ id: "2", title: "test-2" }],
      "2": [{ id: "1", title: "test-1" }]
    });
  });

  test("should resolve an object with the predefined structure", () => {
    const response = {
      kind: "tasks",
      data: [
        {
          title: "Изменения - спецификации"
        },
        {
          title: "Изменения - бюджет"
        }
      ]
    };
    return expect(checkErpData()).resolves.toMatchObject(response);
  });
});
