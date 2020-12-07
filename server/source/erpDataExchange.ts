/**
 * Required External Modules
 */

import { requestHttp, erpHttps } from "./service";
import { sqlQuery } from "./model";
import * as interfaces from "./interfaces";
import Model from "./model";
require("dotenv").config();

/**
 * Call ERP's service
 */

//The function that update ERP's data information table in Wrike
export function checkErpData(): Promise<interfaces.Tasks> {
  const promise = new Promise<interfaces.Tasks>((resolve, reject) => {
    //request Wrike's space Id that is stored in the database
    return sqlQuery("SELECT space_id FROM Spaces WHERE title = '1C'")
      .then((response: [{ space_id: string }]) => {
        if (response.length) return response[0].space_id;
        else {
          throw "The SQL record doesn't exists in the database!";
        }
      })
      .catch(error => {
        throw "The first step in the promise chain returns an error: " + error;
      })
      .then((response: string) => {
        //Request all tasks in the space
        if (!response.length) throw "The SQL record is empty!";
        return requestHttp(
          "GET",
          encodeURI(
            process.env.WRIKE_API +
              "/spaces/" +
              response +
              "/tasks?descendants=true&fields=[parentIds] "
          )
        )
          .then(response => {
            return response;
          })
          .catch(err => {
            throw "Wrike's folder GET method error: " + err;
          });
      })
      .catch(error => {
        throw "The second step in the promise chain returns an error: " + error;
      })
      .then(async (response: string) => {
        const tasks: interfaces.Tasks = JSON.parse(response);
        //There are only two folders in the space
        const len = 2;
        if (response === null || response === undefined)
          throw "Wrike's space does not exist!";
        if (!tasks.data.length) throw "Wrike's space is empty!";
        let table = { columnHeaders: [] } as interfaces.TableInfo;
        for (let index = 0; index < len; index++) {
          if (tasks.data[index].parentIds[0] === Model.se) {
            table.urlMessage = process.env.ERP_BUDGET_PATH_MESSAGE;
            table.urlData = process.env.ERP_BUDGET_PATH_DATA;
            table.columnHeaders[0] = "Номер сообщения из 1С";
            table.columnHeaders[1] = "Идентификатор проекта";
            await updateErpDataTable(tasks.data[index].id, table).catch(
              error => {
                reject("Function updateTable returns an error: " + error);
              }
            );
          } else if (tasks.data[index].parentIds[0] === Model.se_up) {
            table.urlMessage = process.env.ERP_SPEC_PATH_MESSAGE;
            table.urlData = process.env.ERP_SPEC_PATH_DATA;
            table.columnHeaders[0] = "Номер сообщения из 1С";
            table.columnHeaders[1] = "Идентификатор cпецификации";
            await updateErpDataTable(tasks.data[index].id, table).catch(
              error => {
                reject("Function updateTable returns an error: " + error);
              }
            );
          } else throw "The task folder not found!";
        }
        table = null; //Release the object from the memory
        resolve(tasks);
      })
      .catch(error => {
        reject("The last step in the promise chain returns an error: " + error);
      });
  });
  return promise;
}

//The function updates description of Wrike's task that contains ERP's data
async function updateErpDataTable(
  taskId: string,
  table: interfaces.TableInfo
): Promise<unknown | Error> {
  return checkQueue(table.urlMessage, table.urlData)
    .then(
      (
        response:
          | null
          | [interfaces.BudgetValue]
          | [interfaces.SpecificationValue]
      ) => {
        //Wrap the ERP's data into an HMLT table
        if (response === null || response === undefined) {
          if (!response.length) return "";
          throw "Function checkQueue returns: " + response;
        }
        let description = "";
        if (response !== null) {
          description =
            "<table><tr><td><h1>" +
            table.columnHeaders[0] +
            "</h1></td>" +
            "<td><h1>" +
            table.columnHeaders[1] +
            "</h1></td></tr>";
          const len = response.length;
          let str = "";
          for (let i = 0; i < len; i++) {
            str +=
              "<tr><td>" +
              response[i].message +
              "</td>" +
              "<td>" +
              (table.urlMessage === process.env.ERP_BUDGET_PATH_MESSAGE
                ? response[i]["projects"].join("<br>")
                : response[i]["specifications"].join("<br>")) +
              "</td></tr>";
          }
          description += str + "</table>";
          return description;
        }
      }
    )
    .catch(error => {
      throw "The first step in the promise chain returns an error: " + error;
    })
    .then((description: string) => {
      //Call the PUT method to update Wrike's task description
      return requestHttp(
        "PUT",
        encodeURI(
          process.env.WRIKE_TASKS + "/" + taskId + "?description=" + description
        )
      );
    })
    .catch(error => {
      throw new Error(
        "The last step in the promise chain returns an error: " + error
      );
    });
}

//The function request necessary ERP's data for Wrike's information table
function checkQueue(messageUrl: string, dataUrl: string): Promise<unknown> {
  const promise = new Promise((resolve, reject) => {
    if (
      messageUrl === undefined ||
      !messageUrl.length ||
      dataUrl === undefined ||
      !dataUrl.length
    ) {
      reject("An invalid parameter was passed to the function checkQueue!");
    }
    requestErpMessage(messageUrl)
      .then(async (response: null | interfaces.BudgetMessageValue[]) => {
        //return an array of Ids or null
        if (response === null) {
          resolve(response);
          throw "Function requestErpMessage returns null";
        } else {
          const result = [];
          const len = response.length;
          for (let index = 0; index < len; index++) {
            result.push(
              await requestErpDataIds(response[index].message, dataUrl).catch(
                error => {
                  reject(
                    "Function requestErpDataIds returns an error: " + error
                  );
                }
              )
            );
          }
          resolve(result);
        }
      })
      .catch(error => {
        reject("Internal error executing the function checkQueue " + error);
      });
  });
  return promise;
}

//The function accomplishes ERP's budget and specification data transfer to Wrike
export async function updateErpData(
  messageUrl: string,
  dataUrl: string
): Promise<string | [interfaces.LocalBudgetValue]> {
  const promise = new Promise<string | [interfaces.LocalBudgetValue]>(
    (resolve, reject) => {
      if (
        messageUrl === undefined ||
        !messageUrl.length ||
        dataUrl === undefined ||
        !dataUrl.length
      ) {
        throw "An invalid parameter was passed to the function updateErpData!";
      }
      //request ERP's data message from http-service
      return requestErpMessage(messageUrl)
        .then(async (response: null | interfaces.BudgetMessageValue[]) => {
          const arr = [];
          if (response !== null) {
            const len = response.length;
            for (let index = 0; index < len; index++) {
              const result: {
                status: string;
                delete: boolean;
                value:
                  | interfaces.BudgetValue
                  | []
                  | interfaces.SpecificationValue;
              } = {
                status: "error",
                delete: false,
                value: []
              };
              //request ERP's budget or specification Ids
              result.value = await requestErpDataIds(
                response[index].message,
                dataUrl
              );
              if (
                !Array.isArray(result.value) &&
                result.value.message !== undefined
              ) {
                result.status = response[index].status;
                arr.push(result);
              }
            }
          } else throw "ERP's message is empty!";
          return arr;
        })
        .catch(error => {
          throw "The first step in the promise chain returns an error: " +
            error;
        })
        .then(async (response: [interfaces.LocalBudgetValue]) => {
          //send ERP's data message to Wrike
          const len = response.length;
          if (!len) throw "The request returns an empty array!";
          for (let index = 0; index < len; index++) {
            if (response[index].status !== "error") {
              let param = "";
              if (
                messageUrl === process.env.ERP_BUDGET_PATH_MESSAGE &&
                dataUrl === process.env.ERP_BUDGET_PATH_DATA
              ) {
                param = "projects";
              } else if (
                messageUrl === process.env.ERP_SPEC_PATH_MESSAGE &&
                dataUrl === process.env.ERP_SPEC_PATH_DATA
              ) {
                param = "specification";
              } else {
                throw "An invalid url was passed to the function updateErpData!";
              }
              if (
                !Object.prototype.hasOwnProperty.call(
                  response[index].value,
                  param
                )
              )
                throw "The object parameter doesn't exist!";
              const len = response[index].value[param].length;
              let deleteMessage = true;
              for (let i = 0; i < len; i++) {
                let result = false;
                if (param === "projects") {
                  //assign ERP's budget data to Wrike's projects
                  result = await setBudget(response[index].value[param][i]);
                } else {
                  //assign ERP's specification data to Wrike's projects
                  //call setSpecification();
                }
                if (result === false) deleteMessage = false;
              }
              response[index].delete = deleteMessage;
            }
          }
          return response;
        })
        .catch(error => {
          throw "The second step in the promise chain returns an error: " +
            error;
        })
        .then(async (response: [interfaces.LocalBudgetValue]) => {
          //delete ERP's data message
          try {
            response.sort((a, b) => Number(a) - Number(b));
          } catch (err) {
            throw "Invalid Array Sort arguments" + err;
          }
          const len = response.length;
          for (let index = 0; index < len; index++) {
            if (response[index].delete === true) {
              await deleteErpMessage(
                response[index].value.message,
                dataUrl
              ).catch(err => {
                reject("Function deleteBudgerMessage returns an error! " + err);
              });
            } else break;
          }
          resolve(response);
        })
        .catch(error => {
          reject(
            "The last step in the promise chain returns an error: " + error
          );
        });
    }
  );
  return promise;
}

//The function returns a new collection of ERP's data message
function requestErpMessage(url: string): Promise<unknown> {
  const promise = new Promise((resolve, reject) => {
    if (url === undefined || !url.length) {
      reject(
        "An invalid parameter was passed to the function requestBudgetMessage!"
      );
    }
    erpHttps
      .requestHttps("GET", url)
      .then((response: interfaces.BudgetMessage | string) => {
        if (response["#type"] === "Empty") {
          resolve(null);
        } else {
          resolve(response["#value"]);
        }
      })
      .catch((error: Error) => {
        reject(
          "Internal error executing the function requestBudgetMessage " + error
        );
      });
  });
  return promise;
}

//The function deletes ERP's data collection
function deleteErpMessage(messageNumber: string, url: string): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => {
    if (url === undefined || !url.length) {
      reject(
        "An invalid parameter was passed to the function deleteBudgerMessage!"
      );
    }
    erpHttps
      .requestHttps("DELETE", url + "?message=" + messageNumber)
      .then(response => {
        resolve(String(response));
      })
      .catch(error => {
        reject("error" + error);
      });
  });
  return promise;
}

//the function returns an array of ERP's data
async function requestErpDataIds(
  message: string,
  url: string
): Promise<interfaces.BudgetValue | [] | interfaces.SpecificationValue> {
  try {
    const response = await requestErpData(message, url);
    return response["#value"];
  } catch (error) {
    return [];
  }
}

//The function requests ERP's data collection
function requestErpData(
  message: string | undefined,
  url: string
): Promise<unknown> {
  let param = "";
  if (parseInt(message)) param = "?message=" + message;
  const promise = new Promise((resolve, reject) => {
    if (url === undefined || !url.length) {
      reject(
        "An invalid parameter was passed to the function requestBudgetData!"
      );
    }
    erpHttps
      .requestHttps("GET", url + param)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(
          "Internal error executing the function requestBudgetData: " + error
        );
      });
  });
  return promise;
}

//The wrapper function returns a boolean value
export async function setBudget(projectId: string): Promise<boolean> {
  try {
    const response = await setBudgetData(projectId);
    if (response !== undefined && response.length) {
      return true;
    } else return false;
  } catch (e) {
    return false;
  }
}

//The function requests Wrike's project folders with the given Id
export function setBudgetData(
  erpProjectId: string
): Promise<string[] | never[]> {
  const promise = new Promise<string[] | never[]>((resolve, reject) => {
    if (erpProjectId === undefined || !erpProjectId.length)
      throw "An invalid parameter was passed to the function setBudgetData!";
    let rootProjectBudget: number | null = null;
    let rootProjectId: string | null = null;
    let totalBudgetGroupedBy: [interfaces.BudgetTotal] | null = null;
    let result: string[] | [] = [];
    //request ERP's budget data for the project
    const erpData = erpHttps.requestHttps(
      "GET",
      process.env.ERP_BUDGET_DATA + "?id=[" + erpProjectId + "]"
    );
    //ERP's budget data validation
    erpData
      .then((response: interfaces.BudgetResponse) => {
        if (
          Object.prototype.hasOwnProperty.call(response["#value"][0], "error")
        ) {
          if (Array.isArray(response["#value"][0]["error"])) {
            throw "ERP's http-service returns an internal error! " +
              response["#value"][0]["error"].join();
          } else
            throw "ERP's http-service returns an error without description!";
        }
        if (!response["#value"].length)
          throw "ERP's http-service returns an empty array!";
        if (response["#value"][0].posted === false) resolve([erpProjectId]);
        if (typeof response["#value"][0].amount === "number") {
          if (response["#value"][0].currency === "UAH") {
            rootProjectBudget = response["#value"][0].amount;
            totalBudgetGroupedBy = sumBudget(response["#value"][0].efforts);
          } else throw "Invalid currency type!";
        } else {
          resolve([erpProjectId]);
          throw "ERP's budget value is not a number";
        }
        return response;
      })
      .catch(error => {
        throw "The first step in the promise chain returns an error: " + error;
      })
      .then((response: interfaces.BudgetResponse) => {
        //request Wrike's root project with the given Id
        if (
          Object.prototype.hasOwnProperty.call(response["#value"][0], "number")
        ) {
          return requestHttp(
            "GET",
            encodeURI(
              process.env.WRIKE_FOLDERS +
                "/?customField={'id':'" +
                Model.customField[0] +
                "','value':'" +
                response["#value"][0].number +
                "'}&project=true"
            )
          );
        } else
          throw "ERP's http-service returns data without the project identifier!";
      })
      .catch(error => {
        throw "The second step in the promise chain returns an error: " + error;
      })
      .then((response: string) => {
        //assign ERP's budget data to the root project
        const folders: interfaces.Folder = JSON.parse(response);
        rootProjectId = findProjectRoot(folders);
        if (!rootProjectId.length || rootProjectId === null)
          throw "The root project was not found!";
        if (isNaN(rootProjectBudget))
          throw "ERP's budget for the root project was not found";
        return requestHttp(
          "PUT",
          encodeURI(
            process.env.WRIKE_FOLDERS +
              "/" +
              rootProjectId +
              "?customFields=[{'id':'" +
              Model.customField[10] +
              "','value':' " +
              rootProjectBudget +
              "'}]"
          )
        );
      })
      .catch(error => {
        throw "The third step in the promise chain returns an error: " + error;
      })
      .then(() => {
        //request Wrike's project childs without an order number
        return requestHttp(
          "GET",
          encodeURI(
            process.env.WRIKE_FOLDERS +
              "/" +
              rootProjectId +
              "/folders?customField={id:'" +
              Model.customField[1] +
              "',comparator:'IsEmpty'}&project=true&descendants=false&fields=[customFields]"
          )
        );
      })
      .catch(error => {
        throw "The fourth step in the promise chain returns an error: " + error;
      })

      .then(async (response: string) => {
        //request Wrike's project childs without an order number
        const folders: interfaces.Folder = JSON.parse(response);
        if (totalBudgetGroupedBy === null)
          throw "ERP's budget data was not found!";
        await setProjectsWithoutOrder(totalBudgetGroupedBy, folders)
          .then((response: never[]) => {
            if (Array.isArray(response) && response.length) result = response;
          })
          .catch(error => {
            reject(
              "Internal error executing the function setProjectsWithoutOrder: " +
                error
            );
          });
        console.log(result);
        return;
      })
      .catch(error => {
        throw "The fourth step in the promise chain returns an error: " + error;
      })
      .then(() => {
        //request Wrike's project childs with an order number
        return requestHttp(
          "GET",
          encodeURI(
            process.env.WRIKE_FOLDERS +
              "/" +
              rootProjectId +
              "/folders?customField={id:'" +
              Model.customField[1] +
              "',comparator:'IsNotEmpty'}&project=true&descendants=true&fields=[customFields]"
          )
        );
      })
      .catch(error => {
        throw "The fourth step in the promise chain returns an error: " + error;
      })
      .then(async (response: string) => {
        //assign ERP's budget data to the project childs
        const folders: interfaces.Folder = JSON.parse(response);
        const groupedProjects = projectGroupBy(folders.data, "value");
        setProjectsWithOrder(totalBudgetGroupedBy, groupedProjects)
          .then((response: never[]) => {
            if (Array.isArray(response) && response.length) resolve(response);
            //return an array of project Ids
            else resolve(result);
          })
          .catch(error => {
            if (!result.length) {
              reject(
                "Internal error executing the function setBudgetData: " + error
              );
            } else resolve(result); //return an array of project Ids from the previous step
          });
      })
      .catch(error => {
        reject("The last step in the promise chain returns an error: " + error);
      })
      .finally(() => {
        // Release the objects from the memory
        rootProjectBudget = null;
        rootProjectId = null;
        totalBudgetGroupedBy = null;
      });
  });
  return promise;
}

//The function that assigns ERP's budget data to Wrike's projects without an order number
function setProjectsWithoutOrder(
  totalBudget: Array<interfaces.BudgetTotal>,
  projects: interfaces.Folder
): Promise<string[] | never[]> {
  const promise = new Promise<string[] | never[]>((resolve, reject) => {
    if (!totalBudget.length || !projects.data.length)
      reject(
        "An invalid parameter was passed to the setProjectsWithoutOrder function!"
      );
    const result: string[] = [];
    const budgetFiltered = filterBudgetData(totalBudget);
    const budgetLen = budgetFiltered.length;
    if (!budgetLen)
      reject("The filterBudgetData function returns an empty array!");
    const erpWorkType: string[] = [];
    for (let index = 0; index < budgetLen; index++) {
      erpWorkType.push(
        "'" + Object.getOwnPropertyNames(budgetFiltered[index]) + "'"
      );
    }
    if (!erpWorkType.length) reject("ERP's worktype is undefined!");
    //request Wrike's space data that is stored in the database
    return sqlQuery(
      "SELECT project_title, erp_work_type, workflow_id " +
        "FROM Spaces_info WHERE erp_work_type IN(" +
        erpWorkType.join() +
        ")"
    )
      .then(async (response: [interfaces.SpaceInfo]) => {
        //Compare tree arrays of grouped data then call the PUT method
        const sqlQueryLen = response.length;
        const projectLen = projects.data.length;
        if (!sqlQueryLen) reject("SELECT query response is empty!");
        for (let i = 0; i < projectLen; i++) {
          for (let x = 0; x < sqlQueryLen; x++) {
            if (
              projects.data[i].title.search(response[x].project_title) !== -1
            ) {
              if (response[x].workflow_id === projects.data[i].workflowId) {
                for (let y = 0; y < budgetLen; y++) {
                  if (
                    budgetFiltered[y][response[x].erp_work_type] !== undefined
                  ) {
                    //Assign ERP's budget data to Wrike's project folder using the PUT method
                    await requestHttp(
                      "PUT",
                      encodeURI(
                        process.env.WRIKE_FOLDERS +
                          "/" +
                          projects.data[i].id +
                          "?customFields=[{'id': '" +
                          Model.customField[10] +
                          "', 'value': '" +
                          budgetFiltered[y][response[x].erp_work_type] +
                          "'}]"
                      )
                    )
                      .then((response: string) => {
                        const folders: interfaces.Folder = JSON.parse(response);
                        result.push(folders.data[0].id);
                      })
                      .catch(err => {
                        reject("ERP's budget data PUT method error: " + err);
                      });
                  }
                }
              }
            }
          }
        }
        //return an array of folders Ids
        resolve(result);
      })
      .catch(error => {
        reject("The last step in the promise chain returns an error: " + error);
      });
  });
  return promise;
}

//The function that assigns ERP's budget data to Wrike's projects with an order number
function setProjectsWithOrder(
  totalBudget: [interfaces.BudgetTotal],
  groupedProjects: interfaces.GroupedProjects
): Promise<string[] | never[]> {
  const promise = new Promise<string[] | never[]>((resolve, reject) => {
    const len = Object.keys(groupedProjects).length;
    if (totalBudget === null) reject("The ERP data collection is empty!");
    if (!len) reject("The Wrike data collection is empty!");
    //request Wrike's space data that is stored in the database
    return sqlQuery(
      "SELECT project_title, erp_work_type, workflow_id FROM Spaces_info"
    )
      .then((response: [interfaces.SpaceInfo]) => {
        return response;
      })
      .catch(error => {
        throw "The first step in the promise chain returns an error: " + error;
      })
      .then(async (response: [interfaces.SpaceInfo]) => {
        //Compare two arrays of grouped data then call the PUT method
        const responseLen = response.length;
        const result: string[] = [];
        for (const key in groupedProjects) {
          if (Object.prototype.hasOwnProperty.call(groupedProjects, key)) {
            const regExp = key.match(/[^.][0-9]$/); //The reqular expression returns digits after the first dot
            if (regExp === null) throw "The regular expression returns null!";
            const num = parseInt(regExp[0]);
            if (isNaN(num)) throw "The custom field value is not a number!";
            const len = groupedProjects[key].length;
            for (let index = 0; index < len; index++) {
              for (let i = 0; i < responseLen; i++) {
                if (
                  groupedProjects[key][index].title.search(
                    response[i].project_title
                  ) !== -1
                ) {
                  if (
                    Object.prototype.hasOwnProperty.call(
                      totalBudget[num],
                      response[i].erp_work_type
                    )
                  ) {
                    //Assign ERP's budget data to Wrike's project folder using the PUT method
                    await requestHttp(
                      "PUT",
                      encodeURI(
                        process.env.WRIKE_FOLDERS +
                          "/" +
                          groupedProjects[key][index].id +
                          "?customFields=[{'id': '" +
                          Model.customField[10] +
                          "', 'value': '" +
                          totalBudget[num][response[i].erp_work_type] +
                          "'}]"
                      )
                    )
                      .then((response: string) => {
                        const folders: interfaces.Folder = JSON.parse(response);
                        result.push(folders.data[0].id);
                      })
                      .catch(err => {
                        reject(
                          "Update ERP's budget data PUT request error: " + err
                        );
                      });
                  }
                }
              }
            }
          }
        }
        //return an array of folders Ids
        resolve(result);
      })
      .catch(error => {
        reject("The last step in the promise chain returns an error: " + error);
      });
  });
  return promise;
}

//The function returns an array of objects grouped by key
function groupBy(
  array: interfaces.BudgetSubProject[],
  key: string
): {
  [key: string]: [interfaces.BudgetSubProject];
} {
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[currentValue[key]] = result[currentValue[key]] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
}

function filterBudgetData(
  arr: Array<interfaces.BudgetTotal>
): Array<interfaces.BudgetTotal> {
  //the function returns an array of ERP's data filtered by work item types
  const fieldsArr = arr.filter(
    item =>
      item[Model.workTypes[0]] !== undefined ||
      item[Model.workTypes[1]] !== undefined ||
      item[Model.workTypes[2]] !== undefined ||
      item[Model.workTypes[3]] !== undefined ||
      item[Model.workTypes[4]] !== undefined
  );
  return fieldsArr;
}

//The function that summarize ERP's budget data
function sumBudget(
  budgetData: interfaces.BudgetSubProject[]
): null | [interfaces.BudgetTotal] {
  const len = budgetData.length;
  if (!len) return null;
  //ERP's data group by an order number
  const numberGroupedBy: {
    [key: string]: [interfaces.BudgetSubProject];
  } = groupBy(budgetData, "N");
  let sumBudgetResult: interfaces.BudgetTotal = {};
  const resultArr: [interfaces.BudgetTotal] = [{ null: 0 }];
  for (const property in numberGroupedBy) {
    const len = numberGroupedBy[property].length;
    for (let y = 0; y < len; y++) {
      if (
        !Object.prototype.hasOwnProperty.call(
          numberGroupedBy[property][y],
          "workType"
        )
      ) {
        numberGroupedBy[property][y].workType = null;
      }
    }
    numberGroupedBy[property];
    //ERP's data group by a work type
    const workTypeGroupedBy = groupBy(numberGroupedBy[property], "workType");
    for (const workType in workTypeGroupedBy) {
      const len = workTypeGroupedBy[workType].length;
      let total = 0;
      if (len) {
        for (let x = 0; x < len; x++) {
          if (
            Object.prototype.hasOwnProperty.call(
              workTypeGroupedBy[workType][x],
              "totalBudget"
            )
          ) {
            total += workTypeGroupedBy[workType][x].totalBudget;
          }
        }
      }
      const num = Number(total.toFixed(2));
      if (!isNaN(num)) sumBudgetResult[workType] = num;
      else sumBudgetResult[workType] = 0;
    }
    let clonedObject = { ...sumBudgetResult };
    sumBudgetResult = {};
    resultArr.push(clonedObject);
    clonedObject = null;
  }
  //return an array of ERP's budget data
  return resultArr;
}

//The function returns an array of Wrike's projects grouped by key
export function projectGroupBy(
  array: interfaces.Project[],
  key: string
): interfaces.GroupedProjects {
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    const len = currentValue.customFields.length;
    for (let index = 0; index < len; index++) {
      if (currentValue.customFields[index].id === Model.customField[1]) {
        (result[currentValue.customFields[index][key]] =
          result[currentValue.customFields[index][key]] || []).push(
          currentValue
        );
        break;
      }
    }

    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
}

//The function search for the root of the project
function findProjectRoot(folders: interfaces.Folder): string {
  const arr: string[] = [];
  const fieldsArr = folders.data.filter(item => {
    const len = item.parentIds.length;
    for (let index = 0; index < len; index++) {
      if (
        (item.parentIds[index] === Model.draft ||
          item.parentIds[index] === Model.work) &&
        item.parentIds.length &&
        item.workflowId === Model.workflows[3] //Wrike's default workflow
      ) {
        return item.parentIds;
      }
    }
  });
  fieldsArr.forEach(project => {
    arr.push(project.id);
  });
  return arr.join();
}
