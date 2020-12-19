import Model from "./model";
import { GmailMessage, requestHttp } from "./service";
import * as types from "./types";
require("dotenv").config();

//The recursive function search for the root task Wrike's directory tree
function loopParentTasks(initId: string): Promise<null | types.CustomField[]> {
  const promise = new Promise<null | types.CustomField[]>((resolve, reject) => {
    (async function nextParentRequest(): Promise<void> {
      await requestHttp(
        "GET",
        encodeURI(process.env.WRIKE_TASKS + "/" + initId)
      )
        .then((response: string) => {
          const taskObj: types.Tasks = JSON.parse(response);
          if (
            Array.isArray(taskObj.data[0].superTaskIds) &&
            taskObj.data[0].superTaskIds.length
          ) {
            initId = taskObj.data[0].superTaskIds[0];
          } else initId = null;
          const res = filterCustomField(taskObj.data[0].customFields);
          //Go to the next parent, If there are no elements which passed the filter
          if (res.length === 0 && initId !== null) nextParentRequest();
          else res.length === 0 ? resolve(null) : resolve(res);
        })
        .catch(() =>
          reject("Internal error executing the function loopParentTasks!")
        );
    })();
  });
  return promise;
}

function filterCustomField(arr: types.CustomField[]): types.CustomField[] {
  //the function returns an array of the custom fileds filtered by the Ids
  const fieldsArr = arr.filter(
    item =>
      (item.id === Model.customField[0] ||
        item.id === Model.customField[1] ||
        item.id === Model.customField[2] ||
        item.id === Model.customField[3] ||
        item.id === Model.customField[7]) &&
      item.value.length
  );
  return fieldsArr;
}

//the function assigns a specified custom field to the created task
export function taskCreated(taskId: string): Promise<unknown> {
  const promise = new Promise<unknown>((resolve, reject) => {
    if (taskId === undefined || !taskId.length)
      reject("An invalid parameter was passed to the function taskCreated!");
    let objTask: types.Tasks;
    requestHttp("GET", encodeURI(process.env.WRIKE_TASKS + "/" + taskId))
      .then(async (response: string) => {
        objTask = JSON.parse(response);
        if (
          Array.isArray(objTask.data[0].superParentIds) &&
          objTask.data[0].superParentIds.length
        ) {
          return objTask.data[0].superParentIds[0]; //the object is sub-task
        } else return objTask.data[0].parentIds[0]; //the object is task
      })
      .catch(error => {
        throw "The first step in the promise chain returns an error: " + error;
      })
      .then((response: string) => {
        if (response.length) {
          return requestHttp(
            "GET",
            encodeURI(process.env.WRIKE_FOLDERS + "/" + response)
          );
        } else throw "The parent name string is empty!";
      })
      .catch(error => {
        throw "The second step in the promise chain returns an error: " + error;
      })
      .then((response: null | types.CustomField[]) => {
        if (response === null) {
          if (
            Array.isArray(objTask.data[0].superTaskIds) &&
            objTask.data[0].superTaskIds.length
          ) {
            //search through the parent tasks
            return loopParentTasks(objTask.data[0].superTaskIds[0]);
          } else return null;
        } else return response;
      })
      .catch(error => {
        throw "The third step in the promise chain returns an error: " + error;
      })
      .then(async (response: null | types.CustomField[]) => {
        if (response !== null && response.length && response !== undefined) {
          const taskCustomField = JSON.stringify(response);
          const result = await requestHttp(
            "PUT",
            encodeURI(
              process.env.WRIKE_TASKS +
                "/" +
                taskId +
                "?customFields=" +
                taskCustomField
            )
          ).catch(error => {
            reject("The PUT method returns an error: " + error);
          });
          resolve(result);
        } else throw "An invalid parameter was passed to the PUT method!";
      })
      .catch(error => {
        reject("The last step in the promise chain returns an error: " + error);
      });
  });
  return promise;
}

//The function returns an array of the folder's childs or null
function loopChilds(
  initId: string,
  apiMethod: string,
  objParam: string
): Promise<string | null | string[]> {
  const promise = new Promise<string | null | string[]>((resolve, reject) => {
    if (initId === undefined || objParam === undefined || !initId.length)
      reject("An invalid parameter was passed to the function loopChilds!");
    return requestHttp(
      "GET",
      encodeURI(process.env.WRIKE_FOLDERS + "/" + initId + apiMethod)
    )
      .then((response: string) => {
        const folderObj = JSON.parse(response);
        const arr = [];
        if (Array.isArray(folderObj.data) && folderObj.data.length) {
          folderObj.data.forEach(
            (field: { id: string; childIds: string[] }) => {
              if (Array.isArray(field[objParam]) && field[objParam].length) {
                arr.push(field[objParam]);
              }
              if (
                typeof field[objParam] === "string" &&
                field[objParam].length
              ) {
                //push the folder's child parameter to an array
                arr.push(field[objParam]);
              }
            }
          );
        } else resolve(null);
        resolve(arr);
      })
      .catch(error =>
        reject("Internal error executing the function loopChilds! " + error)
      );
  });
  return promise;
}

//The function call the PUT method that assigns a specified custom field to the item's child
function putCustomField(
  itemType: string,
  itemIds: string,
  customFieldId: string,
  value: string
): Promise<string> {
  const promise = new Promise<string>((resolve, reject) => {
    if (
      itemType === undefined ||
      itemIds === undefined ||
      customFieldId === undefined ||
      value === undefined ||
      !itemType.length ||
      !itemIds.length ||
      !customFieldId.length ||
      !value.length
    )
      reject("An invalid parameter was passed to the function putCustomField!");
    return requestHttp(
      "PUT",
      encodeURI(
        process.env.WRIKE_API +
          "/" +
          itemType +
          "/" +
          itemIds +
          '?customFields=[{"id":"' +
          customFieldId +
          '","value":' +
          value +
          "}]"
      )
    )
      .then((response: string) => {
        resolve(response);
      })
      .catch(error =>
        reject("Internal error executing the function putCustomField! " + error)
      );
  });
  return promise;
}

//The function search for the project childs and then call the PUT method
export function projectFieldChanged(
  folderId: string,
  customFieldId: string,
  value?: string
): Promise<string | void> {
  const promise = new Promise<string | void>((resolve, reject) => {
    if (
      folderId === undefined ||
      customFieldId === undefined ||
      !folderId.length ||
      !customFieldId.length
    )
      reject(
        "An invalid parameter was passed to the function projectFieldChanged!"
      );
    //request the project data
    return requestHttp(
      "GET",
      encodeURI(process.env.WRIKE_FOLDERS + "/" + folderId)
    )
      .then((response: string) => {
        if (value === undefined) {
          //search for custom fields of the project
          const folderObj: types.Folder = JSON.parse(response);
          if (
            Array.isArray(folderObj.data[0].customFields) &&
            folderObj.data[0].customFields.length
          ) {
            const len = folderObj.data[0].customFields.length;
            for (let i = 0; i < len; i++) {
              if (folderObj.data[0].customFields[i].id === customFieldId) {
                value = "'" + folderObj.data[0].customFields[i].value + "'";
                return;
              }
            }
          }
          throw "No custom fields found!";
        } else return;
      })
      .catch(error => {
        throw "The first step in the promise chain returns an error: " + error;
      })
      .then(() => {
        //search for child projects
        return loopChilds(folderId, "/folders", "childIds");
      })
      .catch(error => {
        throw "The second step in the promise chain returns an error: " + error;
      })
      .then(async (response: string[] | null) => {
        //assign the custom field to the child projects
        if (response === null || !response.length) return;
        if (value !== undefined) {
          let result: unknown;
          const len = response.length;
          for (let x = 0; x < len; x += 98) {
            const strArr: string[] = response.slice(x, x + 98);
            result = await putCustomField(
              "folders",
              strArr.join(),
              customFieldId,
              value
            );
          }
          return result;
        }
        throw "An invalid parameter in the request";
      })
      .catch(error => {
        throw "The third step in the promise chain returns an error: " + error;
      })
      .then(() => {
        //search for child tasks
        return loopChilds(
          folderId,
          "/tasks?descendants=true&subTasks=true",
          "id"
        );
      })
      .catch(error => {
        throw "The fourth step in the promise chain returns an error: " + error;
      })
      .then(async (response: string[] | null) => {
        //assign the custom field to the child tasks
        if (response === null || !response.length)
          throw "Child tasks or subtasks not found!";
        let result: string | void;
        if (value !== undefined) {
          const len = response.length;
          for (let x = 0; x < len; x += 98) {
            const strArr: string[] = response.slice(x, x + 98);
            result = await putCustomField(
              "tasks",
              strArr.join(),
              customFieldId,
              value
            ).catch(error => {
              reject("The PUT method returns an error: " + error);
            });
          }
        } else throw "An invalid parameter in the request";
        resolve(result);
      })
      .catch(error => {
        reject("The last step in the promise chain returns an error: " + error);
      });
  });
  return promise;
}

//the object is able to send an Email-message using Gmail API
const createMessage = new GmailMessage(
  "subject",
  "message",
  "volodymyr.yovchenko@gmail.com"
);

//The function returns Wrike's user information
async function getUsers(users: string): Promise<object[] | null> {
  const arrValue = users.split(",");
  let usersData: Array<{ userFullName: string; userEmail: string }> = [];
  const len = arrValue.length;
  for (let i = 0; i < len; i++) {
    if (!arrValue[i].length) return null;
    await requestHttp(
      "GET",
      encodeURI(process.env.WRIKE_API + "/users/" + arrValue[i])
    )
      .then((response: string) => {
        const objUser: types.Users = JSON.parse(response);
        usersData.push({
          userFullName:
            objUser.data[0].firstName + " " + objUser.data[0].lastName,
          userEmail: objUser.data[0].profiles[0].email
        });
      })
      .catch(() => {
        usersData = null;
      });
  }
  return usersData;
}

//The function send an e-mail to user when the custom field changes
export function notifyUser(
  objId: string,
  value: string,
  objType: string,
  customFieldId: string
): Promise<string | Array<{ userFullName: string; userEmail: string }>> {
  const promise = new Promise<
    string | Array<{ userFullName: string; userEmail: string }>
  >((resolve, reject) => {
    if (
      value === undefined ||
      !value.length ||
      objId === undefined ||
      !objId.length ||
      objType === undefined ||
      !objType.length
    )
      reject("An invalid parameter was passed to the function!");
    let obj: types.Tasks | types.Folder;
    requestHttp(
      "GET",
      encodeURI(process.env.WRIKE_API + "/" + objType + "/" + objId)
    )
      .then((response: string) => {
        //Check-in the custom fields
        obj = JSON.parse(response);
        if (
          Array.isArray(obj.data[0].customFields) &&
          obj.data[0].customFields.length
        ) {
          const len = obj.data[0].customFields.length;

          for (let i = 0; i < len; i++) {
            if (obj.data[0].customFields[i].id === customFieldId) {
              return obj.data[0].customFields[i].value;
            }
          }
        }
        throw "No custom fields found!";
      })
      .catch(error => {
        throw "The first step in the promise chain returns an error: " + error;
      })
      .then((response: string) => {
        return getUsers(response);
      })
      .catch(error => {
        throw "The second step in the promise chain returns an error: " + error;
      })
      .then(
        (
          response: null | Array<{ userFullName: string; userEmail: string }>
        ) => {
          //Send an e-mail using Gmail API
          if (
            response !== null &&
            Array.isArray(response) &&
            response.length > 0
          ) {
            const len = response.length;
            let str: string;
            if (customFieldId === Model.customField[8])
              str = "Вам присвоено несоответствие - ";
            else str = "Вам назначен проект - ";
            for (let i = 0; i < len; i++) {
              createMessage.subject = "Wrike message";
              createMessage.message =
                "Добрый день, " +
                response[i].userFullName +
                ".\n" +
                str +
                obj.data[0].title +
                "\n" +
                obj.data[0].permalink +
                "\n" +
                "Best regards!";
              createMessage.user = response[i].userEmail;
              createMessage.gmailMessage(createMessage);
            }
          } else throw "Function getUsers returns an empty value!";
          resolve(response);
        }
      )
      .catch(error => {
        reject("The last step in the promise chain returns an error: " + error);
      });
  });
  return promise;
}
