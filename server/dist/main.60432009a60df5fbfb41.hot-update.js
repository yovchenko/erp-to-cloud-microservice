exports.id = "main";
exports.modules = {

/***/ "./server/source/controller.ts":
/*!*************************************!*\
  !*** ./server/source/controller.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return checkEvent; });\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model */ \"./server/source/model.ts\");\n/* harmony import */ var _wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wrikeDataExchange */ \"./server/source/wrikeDataExchange.ts\");\n/**\n * Required External Modules\n */\n\n\n/**\n * Wrike's webhook event handlers\n */\nfunction checkEvent(item) {\n    if (Object.prototype.hasOwnProperty.call(item, \"eventType\")) {\n        //The switch distributes Wrike's events\n        switch (item.eventType) {\n            case \"TaskCreated\":\n                Object(_wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__[\"taskCreated\"])(item.taskId).catch(function (err) {\n                    return console.error(\"Internal error executing the function taskCreated! \" + err);\n                });\n                break;\n            case \"FolderCustomFieldChanged\":\n                if (\n                //Custom fields to be inherited\n                item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[0] ||\n                    item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[1] ||\n                    item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[2] ||\n                    item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[3] ||\n                    item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[7]) {\n                    Object(_wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__[\"projectFieldChanged\"])(item.folderId, item.customFieldId)\n                        .then(function () {\n                        if (item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[7])\n                            Object(_wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__[\"notifyUser\"])(item.folderId, item.value, \"folders\", item.customFieldId).catch(function (err) {\n                                return console.error(\"Internal error executing the function notifyUser! \" + err);\n                            });\n                    })\n                        .catch(function (err) {\n                        return console.error(\"Internal error executing the function projectFieldChanged! \" +\n                            err);\n                    });\n                }\n                break;\n            case \"TaskCustomFieldChanged\":\n                {\n                    if (item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[8]) {\n                        Object(_wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__[\"notifyUser\"])(item.taskId, item.value, \"tasks\", item.customFieldId).catch(function (err) {\n                            return console.error(\"Internal error executing the function notifyUser! \" + err);\n                        });\n                    }\n                }\n                break;\n            default:\n        }\n    }\n}\n\nObject(_model__WEBPACK_IMPORTED_MODULE_0__[\"sqlQuery\"])(\"SELECT DISTINCT erp_work_type FROM Spaces_info\")\n    .then(function (response) {\n    console.log(response);\n})\n    .catch(function (err) {\n    console.error(err);\n});\nvar workTypes = [];\n_model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].workTypes.forEach(function (str) {\n    // eslint-disable-next-line @typescript-eslint/camelcase\n    //workTypes.push(Object.assign({}, str))\n    return console.log(str);\n});\n;\nconsole.log(workTypes);\n\n\n//# sourceURL=webpack:///./server/source/controller.ts?");

/***/ }),

/***/ "./server/source/routes.ts":
/*!*********************************!*\
  !*** ./server/source/routes.ts ***!
  \*********************************/
/*! exports provided: router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"router\", function() { return router; });\n/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ \"./server/source/controller.ts\");\nvar express = __webpack_require__(/*! express */ \"express\");\nvar crypto = __webpack_require__(/*! crypto */ \"crypto\");\n\nvar router = express.Router();\n/**\n *Express routing\n */\nrouter.post(\"/post\", //responds to HTTP POST requests.\nfunction (req, res) {\n    if (\"x-hook-secret\" in req.headers) {\n        //secret to check authenticity of the events\n        var hash = crypto\n            .createHmac(\"sha256\", process.env.SECRET)\n            .update(req.headers[\"x-hook-secret\"])\n            .digest(\"hex\");\n        if (req.headers[\"x-hook-secret\"] ===\n            crypto\n                .createHmac(\"sha256\", process.env.SECRET)\n                .update(req.rawBody.toString())\n                .digest(\"hex\")) {\n            //X-Hook-Secret header with value hmacSha256 is equal to request body\n            if (Array.isArray(req.body) && req.body.length) {\n                req.body.forEach(_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n            }\n        }\n        res.writeHead(200, { \"X-Hook-Secret\": hash });\n        res.status(200).end();\n    }\n    else\n        res.status(401).end(\"The request you have made requires authentication\");\n});\n\n\n//# sourceURL=webpack:///./server/source/routes.ts?");

/***/ })

};