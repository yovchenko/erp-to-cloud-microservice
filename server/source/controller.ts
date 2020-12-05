/**
 * Required External Modules
 */

import Model from "./model";
import {
  taskCreated,
  projectFieldChanged,
  notifyUser
} from "./wrikeDataExchange";

/**
 * Wrike's webhook event handlers
 */

export default function checkEvent(item: {
  taskId: string;
  folderId: string;
  status: string;
  eventType: string;
  customFieldId: string;
  dates?: {
    dueDate: string;
  };
  value: string;
}): void {
  if (Object.prototype.hasOwnProperty.call(item, "eventType")) {
    //The switch distributes Wrike's events
    switch (item.eventType) {
      case "TaskCreated":
        taskCreated(item.taskId).catch(err =>
          console.error(
            "Internal error executing the function taskCreated! " + err
          )
        );
        break;
      case "FolderCustomFieldChanged":
        if (
          //Custom fields to be inherited
          item.customFieldId === Model.customField[0] ||
          item.customFieldId === Model.customField[1] ||
          item.customFieldId === Model.customField[2] ||
          item.customFieldId === Model.customField[3] ||
          item.customFieldId === Model.customField[7]
        ) {
          projectFieldChanged(item.folderId, item.customFieldId)
            .then(() => {
              if (item.customFieldId === Model.customField[7])
                notifyUser(
                  item.folderId,
                  item.value,
                  "folders",
                  item.customFieldId
                ).catch(err =>
                  console.error(
                    "Internal error executing the function notifyUser! " + err
                  )
                );
            })
            .catch(err =>
              console.error(
                "Internal error executing the function projectFieldChanged! " +
                  err
              )
            );
        }
        break;
      case "TaskCustomFieldChanged":
        {
          if (item.customFieldId === Model.customField[8]) {
            notifyUser(
              item.taskId,
              item.value,
              "tasks",
              item.customFieldId
            ).catch(err =>
              console.error(
                "Internal error executing the function notifyUser! " + err
              )
            );
          }
        }
        break;
      default:
    }
  }
}

import { sqlQuery } from "./model";

sqlQuery(`SELECT DISTINCT erp_work_type FROM Spaces_info`)
  .then(response => {
    console.log(response);
  })
  .catch(err => {
    console.error(err);
  });
