/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "1602aca08a50c5f30ad1";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/source/controller.ts":
/*!*************************************!*\
  !*** ./server/source/controller.ts ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return checkEvent; });\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model */ \"./server/source/model.ts\");\n/* harmony import */ var _wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wrikeDataExchange */ \"./server/source/wrikeDataExchange.ts\");\n/**\n * Required External Modules\n */\n\n\n/**\n * Wrike's webhook event handlers\n */\nfunction checkEvent(item) {\n    if (Object.prototype.hasOwnProperty.call(item, \"eventType\")) {\n        //The switch distributes Wrike's events\n        switch (item.eventType) {\n            case \"TaskCreated\":\n                Object(_wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__[\"taskCreated\"])(item.taskId).catch(function (err) {\n                    return console.error(\"Internal error executing the function taskCreated! \" + err);\n                });\n                break;\n            case \"FolderCustomFieldChanged\":\n                if (\n                //Custom fields to be inherited\n                item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[0] ||\n                    item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[1] ||\n                    item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[2] ||\n                    item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[3] ||\n                    item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[7]) {\n                    Object(_wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__[\"projectFieldChanged\"])(item.folderId, item.customFieldId)\n                        .then(function () {\n                        if (item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[7])\n                            Object(_wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__[\"notifyUser\"])(item.folderId, item.value, \"folders\", item.customFieldId).catch(function (err) {\n                                return console.error(\"Internal error executing the function notifyUser! \" + err);\n                            });\n                    })\n                        .catch(function (err) {\n                        return console.error(\"Internal error executing the function projectFieldChanged! \" +\n                            err);\n                    });\n                }\n                break;\n            case \"TaskCustomFieldChanged\":\n                {\n                    if (item.customFieldId === _model__WEBPACK_IMPORTED_MODULE_0__[\"default\"].customField[8]) {\n                        Object(_wrikeDataExchange__WEBPACK_IMPORTED_MODULE_1__[\"notifyUser\"])(item.taskId, item.value, \"tasks\", item.customFieldId).catch(function (err) {\n                            return console.error(\"Internal error executing the function notifyUser! \" + err);\n                        });\n                    }\n                }\n                break;\n            default:\n        }\n    }\n}\n\n\n//# sourceURL=webpack:///./server/source/controller.ts?");

/***/ }),

/***/ "./server/source/erpDataExchange.ts":
/*!******************************************!*\
  !*** ./server/source/erpDataExchange.ts ***!
  \******************************************/
/*! exports provided: checkErpData, updateErpData, setBudget, setBudgetData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"checkErpData\", function() { return checkErpData; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"updateErpData\", function() { return updateErpData; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setBudget\", function() { return setBudget; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"setBudgetData\", function() { return setBudgetData; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"tslib\");\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./service */ \"./server/source/service.ts\");\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model */ \"./server/source/model.ts\");\n/**\n * Required External Modules\n */\n\n\n\n\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n/**\n * Call ERP's service\n */\n//The function that update ERP's data information table in Wrike\nfunction checkErpData() {\n    var _this = this;\n    var promise = new Promise(function (resolve, reject) {\n        //request Wrike's space Id that is stored in the database\n        return Object(_model__WEBPACK_IMPORTED_MODULE_2__[\"sqlQuery\"])(\"SELECT space_id FROM Spaces WHERE title = '1C'\")\n            .then(function (response) {\n            if (response.length)\n                return response[0].space_id;\n            else {\n                throw \"The SQL record doesn't exists in the database!\";\n            }\n        })\n            .catch(function (error) {\n            throw \"The first step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) {\n            //Request all tasks in the space\n            if (!response.length)\n                throw \"The SQL record is empty!\";\n            return Object(_service__WEBPACK_IMPORTED_MODULE_1__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_API +\n                \"/spaces/\" +\n                response +\n                \"/tasks?descendants=true&fields=[parentIds] \"))\n                .then(function (response) {\n                return response;\n            })\n                .catch(function (err) {\n                throw \"Wrike's folder GET method error: \" + err;\n            });\n        })\n            .catch(function (error) {\n            throw \"The second step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var tasks, len, table, index;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                switch (_a.label) {\n                    case 0:\n                        tasks = JSON.parse(response);\n                        len = 2;\n                        if (response === null || response === undefined)\n                            throw \"Wrike's space does not exist!\";\n                        if (!tasks.data.length)\n                            throw \"Wrike's space is empty!\";\n                        table = { columnHeaders: [] };\n                        index = 0;\n                        _a.label = 1;\n                    case 1:\n                        if (!(index < len)) return [3 /*break*/, 7];\n                        if (!(tasks.data[index].parentIds[0] === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].se)) return [3 /*break*/, 3];\n                        table.urlMessage = process.env.ERP_BUDGET_PATH_MESSAGE;\n                        table.urlData = process.env.ERP_BUDGET_PATH_DATA;\n                        table.columnHeaders[0] = \"Номер сообщения из 1С\";\n                        table.columnHeaders[1] = \"Идентификатор проекта\";\n                        return [4 /*yield*/, updateErpDataTable(tasks.data[index].id, table).catch(function (error) {\n                                reject(\"Function updateTable returns an error: \" + error);\n                            })];\n                    case 2:\n                        _a.sent();\n                        return [3 /*break*/, 6];\n                    case 3:\n                        if (!(tasks.data[index].parentIds[0] === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].se_up)) return [3 /*break*/, 5];\n                        table.urlMessage = process.env.ERP_SPEC_PATH_MESSAGE;\n                        table.urlData = process.env.ERP_SPEC_PATH_DATA;\n                        table.columnHeaders[0] = \"Номер сообщения из 1С\";\n                        table.columnHeaders[1] = \"Идентификатор cпецификации\";\n                        return [4 /*yield*/, updateErpDataTable(tasks.data[index].id, table).catch(function (error) {\n                                reject(\"Function updateTable returns an error: \" + error);\n                            })];\n                    case 4:\n                        _a.sent();\n                        return [3 /*break*/, 6];\n                    case 5: throw \"The task folder not found!\";\n                    case 6:\n                        index++;\n                        return [3 /*break*/, 1];\n                    case 7:\n                        table = null; //Release the object from the memory\n                        resolve(response);\n                        return [2 /*return*/];\n                }\n            });\n        }); })\n            .catch(function (error) {\n            reject(\"The last step in the promise chain returns an error: \" + error);\n        });\n    });\n    return promise;\n}\n//The function updates description of Wrike's task that contains ERP's data\nfunction updateErpDataTable(taskId, table) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function () {\n        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n            return [2 /*return*/, checkQueue(table.urlMessage, table.urlData)\n                    .then(function (response) {\n                    //Wrap the ERP's data into an HMLT table\n                    if (response === null || response === undefined) {\n                        if (!response.length)\n                            return \"\";\n                        throw \"Function checkQueue returns: \" + response;\n                    }\n                    var description = \"\";\n                    if (response !== null) {\n                        description =\n                            \"<table><tr><td><h1>\" +\n                                table.columnHeaders[0] +\n                                \"</h1></td>\" +\n                                \"<td><h1>\" +\n                                table.columnHeaders[1] +\n                                \"</h1></td></tr>\";\n                        var len = response.length;\n                        var str = \"\";\n                        for (var i = 0; i < len; i++) {\n                            str +=\n                                \"<tr><td>\" +\n                                    response[i].message +\n                                    \"</td>\" +\n                                    \"<td>\" +\n                                    (table.urlMessage === process.env.ERP_BUDGET_PATH_MESSAGE\n                                        ? response[i][\"projects\"].join(\"<br>\")\n                                        : response[i][\"specifications\"].join(\"<br>\")) +\n                                    \"</td></tr>\";\n                        }\n                        description += str + \"</table>\";\n                        return description;\n                    }\n                })\n                    .catch(function (error) {\n                    throw \"The first step in the promise chain returns an error: \" + error;\n                })\n                    .then(function (description) {\n                    //Call the PUT method to update Wrike's task description\n                    return Object(_service__WEBPACK_IMPORTED_MODULE_1__[\"requestHttp\"])(\"PUT\", encodeURI(process.env.WRIKE_TASKS + \"/\" + taskId + \"?description=\" + description));\n                })\n                    .catch(function (error) {\n                    throw new Error(\"The last step in the promise chain returns an error: \" + error);\n                })];\n        });\n    });\n}\n//The function request necessary ERP's data for Wrike's information table\nfunction checkQueue(messageUrl, dataUrl) {\n    var _this = this;\n    var promise = new Promise(function (resolve, reject) {\n        if (messageUrl === undefined ||\n            !messageUrl.length ||\n            dataUrl === undefined ||\n            !dataUrl.length) {\n            reject(\"An invalid parameter was passed to the function checkQueue!\");\n        }\n        requestErpMessage(messageUrl)\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var result, len, index, _a, _b;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_c) {\n                switch (_c.label) {\n                    case 0:\n                        if (!(response === null)) return [3 /*break*/, 1];\n                        resolve(response);\n                        throw \"Function requestErpMessage returns null\";\n                    case 1:\n                        result = [];\n                        len = response.length;\n                        index = 0;\n                        _c.label = 2;\n                    case 2:\n                        if (!(index < len)) return [3 /*break*/, 5];\n                        _b = (_a = result).push;\n                        return [4 /*yield*/, requestErpDataIds(response[index].message, dataUrl).catch(function (error) {\n                                reject(\"Function requestErpDataIds returns an error: \" + error);\n                            })];\n                    case 3:\n                        _b.apply(_a, [_c.sent()]);\n                        _c.label = 4;\n                    case 4:\n                        index++;\n                        return [3 /*break*/, 2];\n                    case 5:\n                        resolve(result);\n                        _c.label = 6;\n                    case 6: return [2 /*return*/];\n                }\n            });\n        }); })\n            .catch(function (error) {\n            reject(\"Internal error executing the function checkQueue \" + error);\n        });\n    });\n    return promise;\n}\n//The function accomplishes ERP's budget and specification data transfer to Wrike\nfunction updateErpData(messageUrl, dataUrl) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function () {\n        var promise;\n        var _this = this;\n        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n            promise = new Promise(function (resolve, reject) {\n                if (messageUrl === undefined ||\n                    !messageUrl.length ||\n                    dataUrl === undefined ||\n                    !dataUrl.length) {\n                    throw \"An invalid parameter was passed to the function updateErpData!\";\n                }\n                //request ERP's data message from http-service\n                return requestErpMessage(messageUrl)\n                    .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n                    var arr, len, index, result, _a;\n                    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_b) {\n                        switch (_b.label) {\n                            case 0:\n                                arr = [];\n                                if (!(response !== null)) return [3 /*break*/, 5];\n                                len = response.length;\n                                index = 0;\n                                _b.label = 1;\n                            case 1:\n                                if (!(index < len)) return [3 /*break*/, 4];\n                                result = {\n                                    status: \"error\",\n                                    delete: false,\n                                    value: []\n                                };\n                                //request ERP's budget or specification Ids\n                                _a = result;\n                                return [4 /*yield*/, requestErpDataIds(response[index].message, dataUrl)];\n                            case 2:\n                                //request ERP's budget or specification Ids\n                                _a.value = _b.sent();\n                                if (!Array.isArray(result.value) &&\n                                    result.value.message !== undefined) {\n                                    result.status = response[index].status;\n                                    arr.push(result);\n                                }\n                                _b.label = 3;\n                            case 3:\n                                index++;\n                                return [3 /*break*/, 1];\n                            case 4: return [3 /*break*/, 6];\n                            case 5: throw \"ERP's message is empty!\";\n                            case 6: return [2 /*return*/, arr];\n                        }\n                    });\n                }); })\n                    .catch(function (error) {\n                    throw \"The first step in the promise chain returns an error: \" +\n                        error;\n                })\n                    .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n                    var len, index, param, len_1, deleteMessage, i, result;\n                    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                        switch (_a.label) {\n                            case 0:\n                                len = response.length;\n                                if (!len)\n                                    throw \"The request returns an empty array!\";\n                                index = 0;\n                                _a.label = 1;\n                            case 1:\n                                if (!(index < len)) return [3 /*break*/, 8];\n                                if (!(response[index].status !== \"error\")) return [3 /*break*/, 7];\n                                param = \"\";\n                                if (messageUrl === process.env.ERP_BUDGET_PATH_MESSAGE &&\n                                    dataUrl === process.env.ERP_BUDGET_PATH_DATA) {\n                                    param = \"projects\";\n                                }\n                                else if (messageUrl === process.env.ERP_SPEC_PATH_MESSAGE &&\n                                    dataUrl === process.env.ERP_SPEC_PATH_DATA) {\n                                    param = \"specification\";\n                                }\n                                else {\n                                    throw \"An invalid url was passed to the function updateErpData!\";\n                                }\n                                if (!Object.prototype.hasOwnProperty.call(response[index].value, param))\n                                    throw \"The object parameter doesn't exist!\";\n                                len_1 = response[index].value[param].length;\n                                deleteMessage = true;\n                                i = 0;\n                                _a.label = 2;\n                            case 2:\n                                if (!(i < len_1)) return [3 /*break*/, 6];\n                                result = false;\n                                if (!(param === \"projects\")) return [3 /*break*/, 4];\n                                return [4 /*yield*/, setBudget(response[index].value[param][i])];\n                            case 3:\n                                //assign ERP's budget data to Wrike's projects\n                                result = _a.sent();\n                                return [3 /*break*/, 4];\n                            case 4:\n                                if (result === false)\n                                    deleteMessage = false;\n                                _a.label = 5;\n                            case 5:\n                                i++;\n                                return [3 /*break*/, 2];\n                            case 6:\n                                response[index].delete = deleteMessage;\n                                _a.label = 7;\n                            case 7:\n                                index++;\n                                return [3 /*break*/, 1];\n                            case 8: return [2 /*return*/, response];\n                        }\n                    });\n                }); })\n                    .catch(function (error) {\n                    throw \"The second step in the promise chain returns an error: \" +\n                        error;\n                })\n                    .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n                    var len, index;\n                    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                        switch (_a.label) {\n                            case 0:\n                                //delete ERP's data message\n                                try {\n                                    response.sort(function (a, b) { return Number(a) - Number(b); });\n                                }\n                                catch (err) {\n                                    throw \"Invalid Array Sort arguments\" + err;\n                                }\n                                len = response.length;\n                                index = 0;\n                                _a.label = 1;\n                            case 1:\n                                if (!(index < len)) return [3 /*break*/, 5];\n                                if (!(response[index].delete === true)) return [3 /*break*/, 3];\n                                return [4 /*yield*/, deleteErpMessage(response[index].value.message, dataUrl).catch(function (err) {\n                                        reject(\"Function deleteBudgerMessage returns an error! \" + err);\n                                    })];\n                            case 2:\n                                _a.sent();\n                                return [3 /*break*/, 4];\n                            case 3: return [3 /*break*/, 5];\n                            case 4:\n                                index++;\n                                return [3 /*break*/, 1];\n                            case 5:\n                                resolve(response);\n                                return [2 /*return*/];\n                        }\n                    });\n                }); })\n                    .catch(function (error) {\n                    reject(\"The last step in the promise chain returns an error: \" + error);\n                });\n            });\n            return [2 /*return*/, promise];\n        });\n    });\n}\n//The function returns a new collection of ERP's data message\nfunction requestErpMessage(url) {\n    var promise = new Promise(function (resolve, reject) {\n        if (url === undefined || !url.length) {\n            reject(\"An invalid parameter was passed to the function requestBudgetMessage!\");\n        }\n        _service__WEBPACK_IMPORTED_MODULE_1__[\"erpHttps\"]\n            .requestHttps(\"GET\", url)\n            .then(function (response) {\n            if (response[\"#type\"] === \"Empty\") {\n                resolve(null);\n            }\n            else {\n                resolve(response[\"#value\"]);\n            }\n        })\n            .catch(function (error) {\n            reject(\"Internal error executing the function requestBudgetMessage \" + error);\n        });\n    });\n    return promise;\n}\n//The function deletes ERP's data collection\nfunction deleteErpMessage(messageNumber, url) {\n    var promise = new Promise(function (resolve, reject) {\n        if (url === undefined || !url.length) {\n            reject(\"An invalid parameter was passed to the function deleteBudgerMessage!\");\n        }\n        _service__WEBPACK_IMPORTED_MODULE_1__[\"erpHttps\"]\n            .requestHttps(\"DELETE\", url + \"?message=\" + messageNumber)\n            .then(function (response) {\n            resolve(String(response));\n        })\n            .catch(function (error) {\n            reject(\"error\" + error);\n        });\n    });\n    return promise;\n}\n//the function returns an array of ERP's data\nfunction requestErpDataIds(message, url) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function () {\n        var response, error_1;\n        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    _a.trys.push([0, 2, , 3]);\n                    return [4 /*yield*/, requestErpData(message, url)];\n                case 1:\n                    response = _a.sent();\n                    return [2 /*return*/, response[\"#value\"]];\n                case 2:\n                    error_1 = _a.sent();\n                    return [2 /*return*/, []];\n                case 3: return [2 /*return*/];\n            }\n        });\n    });\n}\n//The function requests ERP's data collection\nfunction requestErpData(message, url) {\n    var param = \"\";\n    if (parseInt(message))\n        param = \"?message=\" + message;\n    var promise = new Promise(function (resolve, reject) {\n        if (url === undefined || !url.length) {\n            reject(\"An invalid parameter was passed to the function requestBudgetData!\");\n        }\n        _service__WEBPACK_IMPORTED_MODULE_1__[\"erpHttps\"]\n            .requestHttps(\"GET\", url + param)\n            .then(function (response) {\n            resolve(response);\n        })\n            .catch(function (error) {\n            reject(\"Internal error executing the function requestBudgetData: \" + error);\n        });\n    });\n    return promise;\n}\n//The wrapper function returns a boolean value\nfunction setBudget(projectId) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function () {\n        var response, e_1;\n        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    _a.trys.push([0, 2, , 3]);\n                    return [4 /*yield*/, setBudgetData(projectId)];\n                case 1:\n                    response = _a.sent();\n                    if (response !== undefined && response.length) {\n                        return [2 /*return*/, true];\n                    }\n                    else\n                        return [2 /*return*/, false];\n                    return [3 /*break*/, 3];\n                case 2:\n                    e_1 = _a.sent();\n                    return [2 /*return*/, false];\n                case 3: return [2 /*return*/];\n            }\n        });\n    });\n}\n//The function requests Wrike's project folders with the given Id\nfunction setBudgetData(erpProjectId) {\n    var _this = this;\n    var promise = new Promise(function (resolve, reject) {\n        if (erpProjectId === undefined || !erpProjectId.length)\n            throw \"An invalid parameter was passed to the function setBudgetData!\";\n        var rootProjectBudget = null;\n        var rootProjectId = null;\n        var totalBudgetGroupedBy = null;\n        var result = [];\n        //request ERP's budget data for the project\n        var erpData = _service__WEBPACK_IMPORTED_MODULE_1__[\"erpHttps\"].requestHttps(\"GET\", process.env.ERP_BUDGET_DATA + \"?id=[\" + erpProjectId + \"]\");\n        //ERP's budget data validation\n        erpData\n            .then(function (response) {\n            if (Object.prototype.hasOwnProperty.call(response[\"#value\"][0], \"error\")) {\n                if (Array.isArray(response[\"#value\"][0][\"error\"])) {\n                    throw \"ERP's http-service returns an internal error! \" +\n                        response[\"#value\"][0][\"error\"].join();\n                }\n                else\n                    throw \"ERP's http-service returns an error without description!\";\n            }\n            if (!response[\"#value\"].length)\n                throw \"ERP's http-service returns an empty array!\";\n            if (response[\"#value\"][0].posted === false)\n                resolve([erpProjectId]);\n            if (typeof response[\"#value\"][0].amount === \"number\") {\n                if (response[\"#value\"][0].currency === \"UAH\") {\n                    rootProjectBudget = response[\"#value\"][0].amount;\n                    totalBudgetGroupedBy = sumBudget(response[\"#value\"][0].efforts);\n                }\n                else\n                    throw \"Invalid currency type!\";\n            }\n            else {\n                resolve([erpProjectId]);\n                throw \"ERP's budget value is not a number\";\n            }\n            return response;\n        })\n            .catch(function (error) {\n            throw \"The first step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) {\n            //request Wrike's root project with the given Id\n            if (Object.prototype.hasOwnProperty.call(response[\"#value\"][0], \"number\")) {\n                return Object(_service__WEBPACK_IMPORTED_MODULE_1__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_FOLDERS +\n                    \"/?customField={'id':'\" +\n                    _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].customField[0] +\n                    \"','value':'\" +\n                    response[\"#value\"][0].number +\n                    \"'}&project=true\"));\n            }\n            else\n                throw \"ERP's http-service returns data without the project identifier!\";\n        })\n            .catch(function (error) {\n            throw \"The second step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) {\n            //assign ERP's budget data to the root project\n            var folders = JSON.parse(response);\n            rootProjectId = findProjectRoot(folders);\n            if (!rootProjectId.length || rootProjectId === null)\n                throw \"The root project was not found!\";\n            if (isNaN(rootProjectBudget))\n                throw \"ERP's budget for the root project was not found\";\n            return Object(_service__WEBPACK_IMPORTED_MODULE_1__[\"requestHttp\"])(\"PUT\", encodeURI(process.env.WRIKE_FOLDERS +\n                \"/\" +\n                rootProjectId +\n                \"?customFields=[{'id':'\" +\n                _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].customField[10] +\n                \"','value':' \" +\n                rootProjectBudget +\n                \"'}]\"));\n        })\n            .catch(function (error) {\n            throw \"The third step in the promise chain returns an error: \" + error;\n        })\n            .then(function () {\n            //request Wrike's project childs without an order number\n            return Object(_service__WEBPACK_IMPORTED_MODULE_1__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_FOLDERS +\n                \"/\" +\n                rootProjectId +\n                \"/folders?customField={id:'\" +\n                _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].customField[1] +\n                \"',comparator:'IsEmpty'}&project=true&descendants=false&fields=[customFields]\"));\n        })\n            .catch(function (error) {\n            throw \"The fourth step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var folders;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                switch (_a.label) {\n                    case 0:\n                        folders = JSON.parse(response);\n                        if (totalBudgetGroupedBy === null)\n                            throw \"ERP's budget data was not found!\";\n                        return [4 /*yield*/, setProjectsWithoutOrder(totalBudgetGroupedBy, folders)\n                                .then(function (response) {\n                                if (Array.isArray(response) && response.length)\n                                    result = response;\n                            })\n                                .catch(function (error) {\n                                reject(\"Internal error executing the function setProjectsWithoutOrder: \" +\n                                    error);\n                            })];\n                    case 1:\n                        _a.sent();\n                        console.log(result);\n                        return [2 /*return*/];\n                }\n            });\n        }); })\n            .catch(function (error) {\n            throw \"The fourth step in the promise chain returns an error: \" + error;\n        })\n            .then(function () {\n            //request Wrike's project childs with an order number\n            return Object(_service__WEBPACK_IMPORTED_MODULE_1__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_FOLDERS +\n                \"/\" +\n                rootProjectId +\n                \"/folders?customField={id:'\" +\n                _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].customField[1] +\n                \"',comparator:'IsNotEmpty'}&project=true&descendants=true&fields=[customFields]\"));\n        })\n            .catch(function (error) {\n            throw \"The fourth step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var folders, groupedProjects;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                folders = JSON.parse(response);\n                groupedProjects = projectGroupBy(folders.data, \"value\");\n                setProjectsWithOrder(totalBudgetGroupedBy, groupedProjects)\n                    .then(function (response) {\n                    if (Array.isArray(response) && response.length)\n                        resolve(response);\n                    //return an array of project Ids\n                    else\n                        resolve(result);\n                })\n                    .catch(function (error) {\n                    if (!result.length) {\n                        reject(\"Internal error executing the function setBudgetData: \" + error);\n                    }\n                    else\n                        resolve(result); //return an array of project Ids from the previous step\n                });\n                return [2 /*return*/];\n            });\n        }); })\n            .catch(function (error) {\n            reject(\"The last step in the promise chain returns an error: \" + error);\n        })\n            .finally(function () {\n            // Release the objects from the memory\n            rootProjectBudget = null;\n            rootProjectId = null;\n            totalBudgetGroupedBy = null;\n        });\n    });\n    return promise;\n}\n//The function that assigns ERP's budget data to Wrike's projects without an order number\nfunction setProjectsWithoutOrder(totalBudget, projects) {\n    var _this = this;\n    var promise = new Promise(function (resolve, reject) {\n        if (!totalBudget.length || !projects.data.length)\n            reject(\"An invalid parameter was passed to the setProjectsWithoutOrder function!\");\n        var result = [];\n        var budgetFiltered = filterBudgetData(totalBudget);\n        var budgetLen = budgetFiltered.length;\n        if (!budgetLen)\n            reject(\"The filterBudgetData function returns an empty array!\");\n        var erpWorkType = [];\n        for (var index = 0; index < budgetLen; index++) {\n            erpWorkType.push(\"'\" + Object.getOwnPropertyNames(budgetFiltered[index]) + \"'\");\n        }\n        if (!erpWorkType.length)\n            reject(\"ERP's worktype is undefined!\");\n        //request Wrike's space data that is stored in the database\n        return Object(_model__WEBPACK_IMPORTED_MODULE_2__[\"sqlQuery\"])(\"SELECT project_title, erp_work_type, workflow_id \" +\n            \"FROM Spaces_info WHERE erp_work_type IN(\" +\n            erpWorkType.join() +\n            \")\")\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var sqlQueryLen, projectLen, i, x, y;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                switch (_a.label) {\n                    case 0:\n                        sqlQueryLen = response.length;\n                        projectLen = projects.data.length;\n                        if (!sqlQueryLen)\n                            reject(\"SELECT query response is empty!\");\n                        i = 0;\n                        _a.label = 1;\n                    case 1:\n                        if (!(i < projectLen)) return [3 /*break*/, 8];\n                        x = 0;\n                        _a.label = 2;\n                    case 2:\n                        if (!(x < sqlQueryLen)) return [3 /*break*/, 7];\n                        if (!(projects.data[i].title.search(response[x].project_title) !== -1)) return [3 /*break*/, 6];\n                        if (!(response[x].workflow_id === projects.data[i].workflowId)) return [3 /*break*/, 6];\n                        y = 0;\n                        _a.label = 3;\n                    case 3:\n                        if (!(y < budgetLen)) return [3 /*break*/, 6];\n                        if (!(budgetFiltered[y][response[x].erp_work_type] !== undefined)) return [3 /*break*/, 5];\n                        //Assign ERP's budget data to Wrike's project folder using the PUT method\n                        return [4 /*yield*/, Object(_service__WEBPACK_IMPORTED_MODULE_1__[\"requestHttp\"])(\"PUT\", encodeURI(process.env.WRIKE_FOLDERS +\n                                \"/\" +\n                                projects.data[i].id +\n                                \"?customFields=[{'id': '\" +\n                                _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].customField[10] +\n                                \"', 'value': '\" +\n                                budgetFiltered[y][response[x].erp_work_type] +\n                                \"'}]\"))\n                                .then(function (response) {\n                                var folders = JSON.parse(response);\n                                result.push(folders.data[0].id);\n                            })\n                                .catch(function (err) {\n                                reject(\"ERP's budget data PUT method error: \" + err);\n                            })];\n                    case 4:\n                        //Assign ERP's budget data to Wrike's project folder using the PUT method\n                        _a.sent();\n                        _a.label = 5;\n                    case 5:\n                        y++;\n                        return [3 /*break*/, 3];\n                    case 6:\n                        x++;\n                        return [3 /*break*/, 2];\n                    case 7:\n                        i++;\n                        return [3 /*break*/, 1];\n                    case 8:\n                        //return an array of folders Ids\n                        resolve(result);\n                        return [2 /*return*/];\n                }\n            });\n        }); })\n            .catch(function (error) {\n            reject(\"The last step in the promise chain returns an error: \" + error);\n        });\n    });\n    return promise;\n}\n//The function that assigns ERP's budget data to Wrike's projects with an order number\nfunction setProjectsWithOrder(totalBudget, groupedProjects) {\n    var _this = this;\n    var promise = new Promise(function (resolve, reject) {\n        var len = Object.keys(groupedProjects).length;\n        if (totalBudget === null)\n            reject(\"The ERP data collection is empty!\");\n        if (!len)\n            reject(\"The Wrike data collection is empty!\");\n        //request Wrike's space data that is stored in the database\n        return Object(_model__WEBPACK_IMPORTED_MODULE_2__[\"sqlQuery\"])(\"SELECT project_title, erp_work_type, workflow_id FROM Spaces_info\")\n            .then(function (response) {\n            return response;\n        })\n            .catch(function (error) {\n            throw \"The first step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var responseLen, result, _a, _b, _i, key, regExp, num, len_2, index, i;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_c) {\n                switch (_c.label) {\n                    case 0:\n                        responseLen = response.length;\n                        result = [];\n                        _a = [];\n                        for (_b in groupedProjects)\n                            _a.push(_b);\n                        _i = 0;\n                        _c.label = 1;\n                    case 1:\n                        if (!(_i < _a.length)) return [3 /*break*/, 8];\n                        key = _a[_i];\n                        if (!Object.prototype.hasOwnProperty.call(groupedProjects, key)) return [3 /*break*/, 7];\n                        regExp = key.match(/[^.][0-9]$/);\n                        if (regExp === null)\n                            throw \"The regular expression returns null!\";\n                        num = parseInt(regExp[0]);\n                        if (isNaN(num))\n                            throw \"The custom field value is not a number!\";\n                        len_2 = groupedProjects[key].length;\n                        index = 0;\n                        _c.label = 2;\n                    case 2:\n                        if (!(index < len_2)) return [3 /*break*/, 7];\n                        i = 0;\n                        _c.label = 3;\n                    case 3:\n                        if (!(i < responseLen)) return [3 /*break*/, 6];\n                        if (!(groupedProjects[key][index].title.search(response[i].project_title) !== -1)) return [3 /*break*/, 5];\n                        if (!Object.prototype.hasOwnProperty.call(totalBudget[num], response[i].erp_work_type)) return [3 /*break*/, 5];\n                        if (!(groupedProjects[key][index].workflowId ===\n                            response[i].workflow_id)) return [3 /*break*/, 5];\n                        //The data structure singularity handling\n                        if (response[i].erp_work_type === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[5] ||\n                            response[i].erp_work_type === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[6]) {\n                            if (response[i].erp_work_type === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[5]) {\n                                if (Object.prototype.hasOwnProperty.call(totalBudget[num], _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[6])) {\n                                    totalBudget[num][_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[5]] +=\n                                        totalBudget[num][_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[6]];\n                                    delete totalBudget[num][_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[6]];\n                                }\n                            }\n                            else {\n                                if (Object.prototype.hasOwnProperty.call(totalBudget[num], _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[5])) {\n                                    totalBudget[num][_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[6]] +=\n                                        totalBudget[num][_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[5]];\n                                    delete totalBudget[num][_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[5]];\n                                }\n                            }\n                        }\n                        //Assign ERP's budget data to Wrike's project folder using the PUT method\n                        return [4 /*yield*/, Object(_service__WEBPACK_IMPORTED_MODULE_1__[\"requestHttp\"])(\"PUT\", encodeURI(process.env.WRIKE_FOLDERS +\n                                \"/\" +\n                                groupedProjects[key][index].id +\n                                \"?customFields=[{'id': '\" +\n                                _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].customField[10] +\n                                \"', 'value': '\" +\n                                totalBudget[num][response[i].erp_work_type] +\n                                \"'}]\"))\n                                .then(function (response) {\n                                var folders = JSON.parse(response);\n                                result.push(folders.data[0].id);\n                            })\n                                .catch(function (err) {\n                                reject(\"Update ERP's budget data PUT request error: \" + err);\n                            })];\n                    case 4:\n                        //Assign ERP's budget data to Wrike's project folder using the PUT method\n                        _c.sent();\n                        _c.label = 5;\n                    case 5:\n                        i++;\n                        return [3 /*break*/, 3];\n                    case 6:\n                        index++;\n                        return [3 /*break*/, 2];\n                    case 7:\n                        _i++;\n                        return [3 /*break*/, 1];\n                    case 8:\n                        //return an array of folders Ids\n                        resolve(result);\n                        return [2 /*return*/];\n                }\n            });\n        }); })\n            .catch(function (error) {\n            reject(\"The last step in the promise chain returns an error: \" + error);\n        });\n    });\n    return promise;\n}\n//The function returns an array of objects grouped by key\nfunction groupBy(array, key) {\n    return array.reduce(function (result, currentValue) {\n        // If an array already present for key, push it to the array. Else create an array and push the object\n        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);\n        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate\n        return result;\n    }, {}); // empty object is the initial value for result object\n}\nfunction filterBudgetData(arr) {\n    //the function returns an array of ERP's data filtered by work item types\n    var fieldsArr = arr.filter(function (item) {\n        return item[_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[0]] !== undefined ||\n            item[_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[1]] !== undefined ||\n            item[_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[2]] !== undefined ||\n            item[_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[3]] !== undefined ||\n            item[_model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workTypes[4]] !== undefined;\n    });\n    return fieldsArr;\n}\n//The function that summarize ERP's budget data\nfunction sumBudget(budgetData) {\n    var len = budgetData.length;\n    if (!len)\n        return null;\n    //ERP's data group by an order number\n    var numberGroupedBy = groupBy(budgetData, \"N\");\n    var sumBudgetResult = {};\n    var resultArr = [{ null: 0 }];\n    for (var property in numberGroupedBy) {\n        var len_3 = numberGroupedBy[property].length;\n        for (var y = 0; y < len_3; y++) {\n            if (!Object.prototype.hasOwnProperty.call(numberGroupedBy[property][y], \"workType\")) {\n                numberGroupedBy[property][y].workType = null;\n            }\n        }\n        numberGroupedBy[property];\n        //ERP's data group by a work type\n        var workTypeGroupedBy = groupBy(numberGroupedBy[property], \"workType\");\n        for (var workType in workTypeGroupedBy) {\n            var len_4 = workTypeGroupedBy[workType].length;\n            var total = 0;\n            if (len_4) {\n                for (var x = 0; x < len_4; x++) {\n                    if (Object.prototype.hasOwnProperty.call(workTypeGroupedBy[workType][x], \"totalBudget\")) {\n                        total += workTypeGroupedBy[workType][x].totalBudget;\n                    }\n                }\n            }\n            var num = Number(total.toFixed(2));\n            if (!isNaN(num))\n                sumBudgetResult[workType] = num;\n            else\n                sumBudgetResult[workType] = 0;\n        }\n        var clonedObject = Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"])({}, sumBudgetResult);\n        sumBudgetResult = {};\n        resultArr.push(clonedObject);\n        clonedObject = null;\n    }\n    //return an array of ERP's budget data\n    return resultArr;\n}\n//The function returns an array of Wrike's projects grouped by key\nfunction projectGroupBy(array, key) {\n    return array.reduce(function (result, currentValue) {\n        // If an array already present for key, push it to the array. Else create an array and push the object\n        var len = currentValue.customFields.length;\n        for (var index = 0; index < len; index++) {\n            if (currentValue.customFields[index].id === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].customField[1]) {\n                (result[currentValue.customFields[index][key]] =\n                    result[currentValue.customFields[index][key]] || []).push(currentValue);\n                break;\n            }\n        }\n        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate\n        return result;\n    }, {}); // empty object is the initial value for result object\n}\n//The function search for the root of the project\nfunction findProjectRoot(folders) {\n    var arr = [];\n    var fieldsArr = folders.data.filter(function (item) {\n        var len = item.parentIds.length;\n        for (var index = 0; index < len; index++) {\n            if ((item.parentIds[index] === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].draft ||\n                item.parentIds[index] === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].work) &&\n                item.parentIds.length &&\n                item.workflowId === _model__WEBPACK_IMPORTED_MODULE_2__[\"default\"].workflows[3] //Wrike's default workflow\n            ) {\n                return item.parentIds;\n            }\n        }\n    });\n    fieldsArr.forEach(function (project) {\n        arr.push(project.id);\n    });\n    return arr.join();\n}\n\n\n//# sourceURL=webpack:///./server/source/erpDataExchange.ts?");

/***/ }),

/***/ "./server/source/index.ts":
/*!********************************!*\
  !*** ./server/source/index.ts ***!
  \********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"tslib\");\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _routes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./routes */ \"./server/source/routes.ts\");\n/* harmony import */ var _erpDataExchange__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./erpDataExchange */ \"./server/source/erpDataExchange.ts\");\n/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./service */ \"./server/source/service.ts\");\n/**\n * Required External Modules\n */\n\nvar express = __webpack_require__(/*! express */ \"express\");\nvar cors = __webpack_require__(/*! cors */ \"cors\");\nvar helmet = __webpack_require__(/*! helmet */ \"helmet\");\n\n\n\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n\n/**\n * App Variables\n */\nif (!process.env.PORT) {\n    process.exit(1);\n}\nvar PORT = parseInt(process.env.PORT, 10);\nvar app = express();\n/**\n *  App Configuration\n */\napp.use(helmet());\napp.use(cors());\napp.use(express.json({\n    verify: function (req, res, buf) {\n        req.rawBody = buf;\n    }\n}));\napp.use(express.urlencoded({ extended: false }));\n/**\n * Server Activation\n */\napp.use(\"/api\", _routes__WEBPACK_IMPORTED_MODULE_1__[\"router\"]);\nvar server = app.listen(PORT, function () {\n    return console.log(\"API running on localhost:\" + PORT);\n});\n/**\n * Power BI's data refresh initialization\n */\nvar powerBiRefresh = new _service__WEBPACK_IMPORTED_MODULE_3__[\"DataRefresh\"](23, 59, 86400000); //call the callback function every 24 hours\npowerBiRefresh.initInterval(function () { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(void 0, void 0, void 0, function () {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n        switch (_a.label) {\n            case 0: return [4 /*yield*/, Object(_erpDataExchange__WEBPACK_IMPORTED_MODULE_2__[\"checkErpData\"])().catch(function (err) {\n                    console.log(\"ERP's information update error \" + err);\n                })];\n            case 1:\n                _a.sent();\n                return [4 /*yield*/, Object(_erpDataExchange__WEBPACK_IMPORTED_MODULE_2__[\"updateErpData\"])(process.env.ERP_BUDGET_PATH_MESSAGE, process.env.ERP_BUDGET_PATH_DATA).catch(function (err) {\n                        console.log(\"ERP's data refresh error \" + err);\n                    })];\n            case 2:\n                _a.sent();\n                return [2 /*return*/];\n        }\n    });\n}); });\n/**\n * ERP's data refresh initialization\n */\nvar erpRefresh = new _service__WEBPACK_IMPORTED_MODULE_3__[\"DataRefresh\"](23, 59, 1800000); //call the callback function every 30 minutes\nerpRefresh.initInterval(function () { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(void 0, void 0, void 0, function () {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n        switch (_a.label) {\n            case 0: return [4 /*yield*/, Object(_service__WEBPACK_IMPORTED_MODULE_3__[\"requestHttp\"])(\"POST\", process.env.POWER_BI_URL).catch(function (err) {\n                    console.log(\"Power BI's data refresh error \" + err);\n                })];\n            case 1:\n                _a.sent();\n                return [2 /*return*/];\n        }\n    });\n}); });\nif (true) {\n    module.hot.accept();\n    module.hot.dispose(function () { return server.close(); });\n}\n\n\n//# sourceURL=webpack:///./server/source/index.ts?");

/***/ }),

/***/ "./server/source/model.ts":
/*!********************************!*\
  !*** ./server/source/model.ts ***!
  \********************************/
/*! exports provided: default, client, sqlQuery */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"client\", function() { return client; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"sqlQuery\", function() { return sqlQuery; });\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pg */ \"pg\");\n/* harmony import */ var pg__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(pg__WEBPACK_IMPORTED_MODULE_0__);\n\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n/**\n * Wrike's data model\n */\nvar Model = /** @class */ (function () {\n    function Model() {\n    }\n    Model.rootId = \"IEACSBIHI7777777\"; //Root\n    Model.recBin = \"IEACSBIHI7777776\"; //Recycle Bin\n    Model.draft = \"IEACSBIHI4L674CJ\"; //+Draft\n    Model.work = \"IEACSBIHI4PA5HVY\"; //В работе\n    Model.se = \"IEACSBIHI4RFFGAK\"; //SE\n    Model.se_up = \"IEACSBIHI4RFFF5Q\"; //SE_UP\n    Model.customField = [\n        \"IEACSBIHJUAA6PRN\",\n        \"IEACSBIHJUABCSJD\",\n        \"IEACSBIHJUABHUNK\",\n        \"IEACSBIHJUABE3ON\",\n        \"IEACSBIHJUABJJWQ\",\n        \"IEACSBIHJUABCHCG\",\n        \"IEACSBIHJUABKUQL\",\n        \"IEACSBIHJUAA6ORD\",\n        \"IEACSBIHJUABOOFO\",\n        \"IEACSBIHJUABJQ26\",\n        \"IEACSBIHJUABFE3I\"\n    ];\n    Model.workTypes = [\n        \"КТО\",\n        \"Электротехническая лаборатория\",\n        \"Проектные работы\",\n        \"Монтажные работы\",\n        \"Пусконаладочные работы\",\n        \"Разработка програмного обеспечения\",\n        \"ПМК\",\n        \"ИЭТЛ\",\n        \"ЭТП\"\n    ];\n    //\"IEACSBIHJUAA6PRN\" - ТКП\n    //\"IEACSBIHJUABCSJD\" - № Заказа\n    //\"IEACSBIHJUABHUNK\" - Кол. панелей\n    //\"IEACSBIHJUABE3ON\" - Тип продукции\n    //\"IEACSBIHJUABJJWQ\" - Контрагент\n    //\"IEACSBIHJUABCHCG\" - Дата КД\n    //\"IEACSBIHJUABKUQL\" - Дата поставки\n    //\"IEACSBIHJUAA6ORD\" - ГИП\n    //\"IEACSBIHJUABOOFO\" - Виновник\n    //\"IEACSBIHJUABJQ26\" - Бюджет Единиц\n    //\"IEACSBIHJUABFE3I\" - Бюджет грн. без НДС\n    Model.workflows = [\n        \"IEACSBIHK4BC2SOI\",\n        \"IEACSBIHK4BBWS3U\",\n        \"IEACSBIHK4BPBTUO\",\n        \"IEACSBIHK775N6XZ\"\n    ];\n    //\"IEACSBIHK4BC2SOI\" - Производство\n    //\"IEACSBIHK4BBWS3U\" - ДП\n    //\"IEACSBIHK4BPBTUO\" - ОТК\n    //\"IEACSBIHK775N6XZ\" - Default Workflow\n    //Wrike's spaces information\n    Model.spaces = [\n        {\n            id: \"IEACSBIHI4KNZAFO\",\n            title: \"ДП\",\n            new: \"IEACSBIHI4ORFYHS\",\n            text: [\"(КД)\", \"(Проект)\"] //the text for search in the title\n        },\n        {\n            id: \"IEACSBIHI4LNDHYK\",\n            title: \"УРПО\",\n            new: \"IEACSBIHI4ORF2XY\",\n            text: [\"(ПО - Завод)\", \"(ПО)\"]\n        },\n        {\n            id: \"IEACSBIHI4LNDJNA\",\n            title: \"ПНУ\",\n            new: \"IEACSBIHI4ORF2SO\",\n            text: [\"(ПНР завод)\", \"(ПНР)\"]\n        },\n        {\n            id: \"IEACSBIHI4LNDJRC\",\n            title: \"ПТО\",\n            new: \"IEACSBIHI4ORF2WZ\",\n            text: [\"(ПТО)\"]\n        },\n        {\n            id: \"IEACSBIHI4LNDJT4\",\n            title: \"ЭТЛ\",\n            new: \"IEACSBIHI4ORF22N\",\n            text: [\"(ОТК)\", \"(ЭТЛ завод)\", \"(ЭТЛ)\", \"(ЭТЛ объект)\"]\n        },\n        {\n            id: \"IEACSBIHI4LQPPAS\",\n            title: \"Производство\",\n            new: \"IEACSBIHI4ORF2QK\",\n            text: [\"(ПР)\"]\n        },\n        {\n            id: \"IEACSBIHI4NBNA5A\",\n            title: \"ЭМУ\",\n            new: \"IEACSBIHI4ORF2YZ\",\n            text: [\"(Монтаж)\"]\n        },\n        {\n            id: \"IEACSBIHI4P4CYGK\",\n            title: \"Журнал учёта несоответствий\",\n            new: null,\n            text: null\n        }\n    ];\n    return Model;\n}());\n/* harmony default export */ __webpack_exports__[\"default\"] = (Model);\n/**\n * Postgres database connection\n */\nvar client = new pg__WEBPACK_IMPORTED_MODULE_0__[\"Client\"]({\n    connectionString: process.env.DATABASE_URL,\n    ssl: {\n        rejectUnauthorized: false\n    }\n});\n//Connect to the database if the environment variable is created\nif (process.env.DATABASE_URL !== undefined)\n    client.connect();\nfunction sqlQuery(queryString) {\n    //Return a new promise.\n    return client\n        .query(queryString)\n        .then(function (res) {\n        return res.rows;\n    })\n        .catch(function (err) {\n        throw err;\n    });\n}\n\n\n//# sourceURL=webpack:///./server/source/model.ts?");

/***/ }),

/***/ "./server/source/routes.ts":
/*!*********************************!*\
  !*** ./server/source/routes.ts ***!
  \*********************************/
/*! exports provided: router */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"router\", function() { return router; });\n/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./controller */ \"./server/source/controller.ts\");\nvar express = __webpack_require__(/*! express */ \"express\");\nvar crypto = __webpack_require__(/*! crypto */ \"crypto\");\n\nvar router = express.Router();\n/**\n *Express routing\n */\nrouter.post(\"/post\", //responds to HTTP POST requests.\nfunction (req, res) {\n    if (\"x-hook-secret\" in req.headers) {\n        //secret to check authenticity of the events\n        var hash = crypto\n            .createHmac(\"sha256\", process.env.SECRET)\n            .update(req.headers[\"x-hook-secret\"])\n            .digest(\"hex\");\n        if (req.headers[\"x-hook-secret\"] ===\n            crypto\n                .createHmac(\"sha256\", process.env.SECRET)\n                .update(req.rawBody.toString())\n                .digest(\"hex\")) {\n            //X-Hook-Secret header with value hmacSha256 is equal to request body\n            if (Array.isArray(req.body) && req.body.length) {\n                req.body.forEach(_controller__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n            }\n        }\n        res.writeHead(200, { \"X-Hook-Secret\": hash });\n        res.status(200).end();\n    }\n    else\n        res.status(401).end(\"The request you have made requires authentication\");\n});\n\n\n//# sourceURL=webpack:///./server/source/routes.ts?");

/***/ }),

/***/ "./server/source/service.ts":
/*!**********************************!*\
  !*** ./server/source/service.ts ***!
  \**********************************/
/*! exports provided: GmailMessage, requestHttp, erpHttps, DataRefresh */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"GmailMessage\", function() { return GmailMessage; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"requestHttp\", function() { return requestHttp; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"erpHttps\", function() { return erpHttps; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DataRefresh\", function() { return DataRefresh; });\nvar https = __webpack_require__(/*! https */ \"https\");\nvar fs = __webpack_require__(/*! fs */ \"fs\");\nvar readline = __webpack_require__(/*! readline */ \"readline\");\nvar google = __webpack_require__(/*! googleapis */ \"googleapis\").google;\nvar XMLHttpRequest = __webpack_require__(/*! xmlhttprequest */ \"xmlhttprequest\").XMLHttpRequest;\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n/**\n * Gmail service\n */\nvar GmailMessage = /** @class */ (function () {\n    function GmailMessage(subject, message, user) {\n        this.subject = subject;\n        this.message = message;\n        this.user = user;\n    }\n    GmailMessage.prototype.gmailMessage = function (objSelf) {\n        // If modifying these scopes, delete token.json.\n        var SCOPES = [\n            \"https://www.googleapis.com/auth/gmail.send\",\n            \"https://www.googleapis.com/auth/gmail.readonly\"\n        ];\n        // The file token.json stores the user's access and refresh tokens, and is\n        // created automatically when the authorization flow completes for the first\n        // time.\n        var TOKEN_PATH = \"token.json\";\n        // Load client secrets from a local file.\n        fs.readFile(\"./credentials.json\", function processClientSecrets(err, content) {\n            if (err) {\n                console.log(\"Error loading client secret file: \" + err);\n                return;\n            }\n            // Authorize a client with the loaded credentials, then call the\n            // Gmail API.\n            authorize(JSON.parse(content), sendMessage.bind(objSelf));\n        });\n        /**\n         * Create an OAuth2 client with the given credentials, and then execute the\n         * given callback function.\n         * @param {Object} credentials The authorization client credentials.\n         * @param {function} callback The callback to call with the authorized client.\n         */\n        function authorize(credentials, callback) {\n            var clientSecret = credentials.web.client_secret;\n            var clientId = credentials.web.client_id;\n            var redirectUrl = credentials.web.redirect_uris[0];\n            var oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUrl);\n            // Check if we have previously stored a token.\n            fs.readFile(TOKEN_PATH, function (err, token) {\n                if (err)\n                    return getNewToken(oAuth2Client, callback);\n                oAuth2Client.on(\"tokens\", function (tokens) {\n                    if (tokens.refresh_token) {\n                        // store the refresh_token in the root folder!\n                        fs.writeFile(TOKEN_PATH, JSON.stringify(tokens), function (err) {\n                            if (err)\n                                return console.error(err);\n                            console.log(\"Token stored to\", TOKEN_PATH);\n                        });\n                    }\n                    //console.log(tokens.access_token);\n                });\n                oAuth2Client.setCredentials(JSON.parse(token));\n                callback(oAuth2Client);\n            });\n        }\n        /**\n         * Get and store new token after prompting for user authorization, and then\n         * execute the given callback with the authorized OAuth2 client.\n         * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.\n         * @param {getEventsCallback} callback The callback for the authorized client.\n         */\n        function getNewToken(oAuth2Client, callback) {\n            var authUrl = oAuth2Client.generateAuthUrl({\n                // eslint-disable-next-line @typescript-eslint/camelcase\n                access_type: \"offline\",\n                scope: SCOPES\n            });\n            console.log(\"Authorize this app by visiting this url:\", authUrl);\n            var rl = readline.createInterface({\n                input: process.stdin,\n                output: process.stdout\n            });\n            rl.question(\"Enter the code from that page here: \", function (code) {\n                rl.close();\n                oAuth2Client.getToken(code, function (err, token) {\n                    if (err)\n                        return console.error(\"Error retrieving access token\", err);\n                    oAuth2Client.setCredentials(token);\n                    // Store the token to disk for later program executions\n                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {\n                        if (err)\n                            return console.error(err);\n                        console.log(\"Token stored to\", TOKEN_PATH);\n                    });\n                    callback(oAuth2Client);\n                });\n            });\n        }\n        /**\n         * Send message to the user's.\n         *\n         * @param {google.auth.OAuth2} auth An authorized OAuth2 client.\n         */\n        function makeBody(to, from, subject, message) {\n            var str = [\n                'Content-Type: text/plain; charset=\"UTF-8\"\\n',\n                \"MIME-Version: 1.0\\n\",\n                \"Content-Transfer-Encoding: 7bit\\n\",\n                \"to: \",\n                to,\n                \"\\n\",\n                \"from: \",\n                from,\n                \"\\n\",\n                \"subject: \",\n                subject,\n                \"\\n\\n\",\n                message\n            ].join(\"\");\n            var encodedMail = Buffer.from(str)\n                .toString(\"base64\")\n                .replace(/\\+/g, \"-\")\n                .replace(/\\//g, \"_\");\n            return encodedMail;\n        }\n        function sendMessage(auth) {\n            var gmail = google.gmail(\"v1\");\n            var raw = makeBody(this.user, \"wrike@se.ua\", this.subject, this.message);\n            gmail.users.messages.send({\n                auth: auth,\n                userId: \"me\",\n                resource: {\n                    raw: raw\n                }\n            }, function (err, res) {\n                console.log(err || res.status);\n            });\n        }\n    };\n    return GmailMessage;\n}());\n\n/**\n * Wrike http-service\n */\nfunction requestHttp(method, url) {\n    // Return a new promise.\n    return new Promise(function (resolve, reject) {\n        // Do the usual XHR stuff\n        var req = new XMLHttpRequest();\n        req.open(method, url, true);\n        req.setRequestHeader(\"Authorization\", \"Bearer \" + process.env.TOKEN);\n        //req.responseType = 'json';\n        req.onload = function () {\n            // This is called even on 404 etc\n            // so check the status\n            if (req.status >= 200 && req.status < 300) {\n                // Resolve the promise with the response text\n                resolve(this.responseText);\n            }\n            else {\n                // Otherwise reject with the status text\n                // which will hopefully be a meaningful error\n                reject(Error(this.statusText));\n            }\n        };\n        // Handle network errors\n        req.onerror = function () {\n            reject(Error(\"Network Error on http request \" + method + \":\" + url));\n        };\n        // Make the request\n        req.send();\n    });\n}\n/**\n * ERP https-service\n */\nvar ErpHttpsService = /** @class */ (function () {\n    function ErpHttpsService(port, host) {\n        // Read SSL-certificate and private key\n        this.certs = {\n            key: fs.readFileSync(\"./client.key\"),\n            cert: fs.readFileSync(\"./client-cert.pem\")\n        };\n        this.port = port;\n        this.host = host;\n    }\n    ErpHttpsService.prototype.requestHttps = function (method, path) {\n        var options = {\n            hostname: this.host,\n            port: this.port,\n            path: path,\n            method: method,\n            key: this.certs.key,\n            cert: this.certs.cert,\n            passphrase: \"\",\n            rejectUnauthorized: false\n        };\n        // Return a new promise.\n        return new Promise(function (resolve, reject) {\n            var response = \"\";\n            var req = https.request(options, function (res) {\n                res.on(\"data\", function (data) {\n                    response += data;\n                });\n                // Handle network errors\n                req.on(\"error\", function (err) {\n                    reject(\"Https request error \" + err);\n                });\n                res.on(\"end\", function () {\n                    try {\n                        resolve(JSON.parse(response));\n                    }\n                    catch (err) {\n                        reject(\"Https JSON parse error \" + err);\n                    }\n                });\n            });\n            // Close the request\n            req.end();\n        });\n    };\n    return ErpHttpsService;\n}());\nvar erpHttps = new ErpHttpsService(parseInt(process.env.ERP_PORT), process.env.ERP_HOST);\n/**\n * Power BI and ERP data refresh service\n */\n// The function call a callback function at an interval of time\nvar DataRefresh = /** @class */ (function () {\n    // The first two arguments of the constructor are the start time\n    function DataRefresh(hour, minute, interval) {\n        this.hour = hour;\n        this.minute = minute;\n        this.interval = interval;\n    }\n    DataRefresh.prototype.forceTargetTime = function () {\n        var t = new Date();\n        t.setHours(this.hour);\n        t.setMinutes(this.minute);\n        t.setSeconds(0);\n        t.setMilliseconds(0);\n        return t;\n    };\n    DataRefresh.prototype.timeNow = function () {\n        return new Date().getTime();\n    };\n    DataRefresh.prototype.timeOffset = function () {\n        return this.forceTargetTime().getTime() - this.timeNow();\n    };\n    DataRefresh.prototype.initInterval = function (callback) {\n        var _this = this;\n        this.repeat = function () {\n            callback();\n            clearTimeout(_this.timerId);\n            _this.timerId = setTimeout(_this.repeat, _this.interval); // Call the function every the interval milliseconds\n        };\n        this.timerId = setTimeout(this.repeat, this.timeOffset()); // Call the function the first time after the offset\n    };\n    return DataRefresh;\n}());\n\n\n\n//# sourceURL=webpack:///./server/source/service.ts?");

/***/ }),

/***/ "./server/source/wrikeDataExchange.ts":
/*!********************************************!*\
  !*** ./server/source/wrikeDataExchange.ts ***!
  \********************************************/
/*! exports provided: taskCreated, projectFieldChanged, notifyUser */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"taskCreated\", function() { return taskCreated; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"projectFieldChanged\", function() { return projectFieldChanged; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"notifyUser\", function() { return notifyUser; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"tslib\");\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(tslib__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model */ \"./server/source/model.ts\");\n/* harmony import */ var _service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./service */ \"./server/source/service.ts\");\n\n\n\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\n//The recursive function search for the root task Wrike's directory tree\nfunction loopParentTasks(initId) {\n    var promise = new Promise(function (resolve, reject) {\n        (function nextParentRequest() {\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function () {\n                return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                    switch (_a.label) {\n                        case 0: return [4 /*yield*/, Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_TASKS + \"/\" + initId))\n                                .then(function (response) {\n                                var taskObj = JSON.parse(response);\n                                if (Array.isArray(taskObj.data[0].superTaskIds) &&\n                                    taskObj.data[0].superTaskIds.length) {\n                                    initId = taskObj.data[0].superTaskIds[0];\n                                }\n                                else\n                                    initId = null;\n                                var res = filterCustomField(taskObj.data[0].customFields);\n                                //Go to the next parent, If there are no elements which passed the filter\n                                if (res.length === 0 && initId !== null)\n                                    nextParentRequest();\n                                else\n                                    res.length === 0 ? resolve(null) : resolve(res);\n                            })\n                                .catch(function () {\n                                return reject(\"Internal error executing the function loopParentTasks!\");\n                            })];\n                        case 1:\n                            _a.sent();\n                            return [2 /*return*/];\n                    }\n                });\n            });\n        })();\n    });\n    return promise;\n}\nfunction filterCustomField(arr) {\n    //the function returns an array of the custom fileds filtered by the Ids\n    var fieldsArr = arr.filter(function (item) {\n        return (item.id === _model__WEBPACK_IMPORTED_MODULE_1__[\"default\"].customField[0] ||\n            item.id === _model__WEBPACK_IMPORTED_MODULE_1__[\"default\"].customField[1] ||\n            item.id === _model__WEBPACK_IMPORTED_MODULE_1__[\"default\"].customField[2] ||\n            item.id === _model__WEBPACK_IMPORTED_MODULE_1__[\"default\"].customField[3] ||\n            item.id === _model__WEBPACK_IMPORTED_MODULE_1__[\"default\"].customField[7]) &&\n            item.value.length;\n    });\n    return fieldsArr;\n}\n//the function assigns a specified custom field to the created task\nfunction taskCreated(taskId) {\n    var _this = this;\n    var promise = new Promise(function (resolve, reject) {\n        if (taskId === undefined || !taskId.length)\n            reject(\"An invalid parameter was passed to the function taskCreated!\");\n        var objTask;\n        Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_TASKS + \"/\" + taskId))\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                objTask = JSON.parse(response);\n                if (Array.isArray(objTask.data[0].superParentIds) &&\n                    objTask.data[0].superParentIds.length) {\n                    return [2 /*return*/, objTask.data[0].superParentIds[0]]; //the object is sub-task\n                }\n                else\n                    return [2 /*return*/, objTask.data[0].parentIds[0]]; //the object is task\n                return [2 /*return*/];\n            });\n        }); })\n            .catch(function (error) {\n            throw \"The first step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) {\n            if (response.length) {\n                return Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_FOLDERS + \"/\" + response));\n            }\n            else\n                throw \"The parent name string is empty!\";\n        })\n            .catch(function (error) {\n            throw \"The second step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) {\n            if (response === null) {\n                if (Array.isArray(objTask.data[0].superTaskIds) &&\n                    objTask.data[0].superTaskIds.length) {\n                    //search through the parent tasks\n                    return loopParentTasks(objTask.data[0].superTaskIds[0]);\n                }\n                else\n                    return null;\n            }\n            else\n                return response;\n        })\n            .catch(function (error) {\n            throw \"The third step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var taskCustomField, result;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                switch (_a.label) {\n                    case 0:\n                        if (!(response !== null && response.length && response !== undefined)) return [3 /*break*/, 2];\n                        taskCustomField = JSON.stringify(response);\n                        return [4 /*yield*/, Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"PUT\", encodeURI(process.env.WRIKE_TASKS +\n                                \"/\" +\n                                taskId +\n                                \"?customFields=\" +\n                                taskCustomField)).catch(function (error) {\n                                reject(\"The PUT method returns an error: \" + error);\n                            })];\n                    case 1:\n                        result = _a.sent();\n                        resolve(result);\n                        return [3 /*break*/, 3];\n                    case 2: throw \"An invalid parameter was passed to the PUT method!\";\n                    case 3: return [2 /*return*/];\n                }\n            });\n        }); })\n            .catch(function (error) {\n            reject(\"The last step in the promise chain returns an error: \" + error);\n        });\n    });\n    return promise;\n}\n//The function returns an array of the folder's childs or null\nfunction loopChilds(initId, apiMethod, objParam) {\n    var promise = new Promise(function (resolve, reject) {\n        if (initId === undefined || objParam === undefined || !initId.length)\n            reject(\"An invalid parameter was passed to the function loopChilds!\");\n        return Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_FOLDERS + \"/\" + initId + apiMethod))\n            .then(function (response) {\n            var folderObj = JSON.parse(response);\n            var arr = [];\n            if (Array.isArray(folderObj.data) && folderObj.data.length) {\n                folderObj.data.forEach(function (field) {\n                    if (Array.isArray(field[objParam]) && field[objParam].length) {\n                        arr.push(field[objParam]);\n                    }\n                    if (typeof field[objParam] === \"string\" &&\n                        field[objParam].length) {\n                        //push the folder's child parameter to an array\n                        arr.push(field[objParam]);\n                    }\n                });\n            }\n            else\n                resolve(null);\n            resolve(arr);\n        })\n            .catch(function (error) {\n            return reject(\"Internal error executing the function loopChilds! \" + error);\n        });\n    });\n    return promise;\n}\n//The function call the PUT method that assigns a specified custom field to the item's child\nfunction putCustomField(itemType, itemIds, customFieldId, value) {\n    var promise = new Promise(function (resolve, reject) {\n        if (itemType === undefined ||\n            itemIds === undefined ||\n            customFieldId === undefined ||\n            value === undefined ||\n            !itemType.length ||\n            !itemIds.length ||\n            !customFieldId.length ||\n            !value.length)\n            reject(\"An invalid parameter was passed to the function putCustomField!\");\n        return Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"PUT\", encodeURI(process.env.WRIKE_API +\n            \"/\" +\n            itemType +\n            \"/\" +\n            itemIds +\n            '?customFields=[{\"id\":\"' +\n            customFieldId +\n            '\",\"value\":' +\n            value +\n            \"}]\"))\n            .then(function (response) {\n            resolve(response);\n        })\n            .catch(function (error) {\n            return reject(\"Internal error executing the function putCustomField! \" + error);\n        });\n    });\n    return promise;\n}\n//The function search for the project childs and then call the PUT method\nfunction projectFieldChanged(folderId, customFieldId, value) {\n    var _this = this;\n    var promise = new Promise(function (resolve, reject) {\n        if (folderId === undefined ||\n            customFieldId === undefined ||\n            !folderId.length ||\n            !customFieldId.length)\n            reject(\"An invalid parameter was passed to the function projectFieldChanged!\");\n        //request the project data\n        return Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_FOLDERS + \"/\" + folderId))\n            .then(function (response) {\n            if (value === undefined) {\n                //search for custom fields of the project\n                var folderObj = JSON.parse(response);\n                if (Array.isArray(folderObj.data[0].customFields) &&\n                    folderObj.data[0].customFields.length) {\n                    var len = folderObj.data[0].customFields.length;\n                    for (var i = 0; i < len; i++) {\n                        if (folderObj.data[0].customFields[i].id === customFieldId) {\n                            value = \"'\" + folderObj.data[0].customFields[i].value + \"'\";\n                            return;\n                        }\n                    }\n                }\n                throw \"No custom fields found!\";\n            }\n            else\n                return;\n        })\n            .catch(function (error) {\n            throw \"The first step in the promise chain returns an error: \" + error;\n        })\n            .then(function () {\n            //search for child projects\n            return loopChilds(folderId, \"/folders\", \"childIds\");\n        })\n            .catch(function (error) {\n            throw \"The second step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var result, len, x, strArr;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                switch (_a.label) {\n                    case 0:\n                        //assign the custom field to the child projects\n                        if (response === null || !response.length)\n                            return [2 /*return*/];\n                        if (!(value !== undefined)) return [3 /*break*/, 5];\n                        result = void 0;\n                        len = response.length;\n                        x = 0;\n                        _a.label = 1;\n                    case 1:\n                        if (!(x < len)) return [3 /*break*/, 4];\n                        strArr = response.slice(x, x + 98);\n                        return [4 /*yield*/, putCustomField(\"folders\", strArr.join(), customFieldId, value)];\n                    case 2:\n                        result = _a.sent();\n                        _a.label = 3;\n                    case 3:\n                        x += 98;\n                        return [3 /*break*/, 1];\n                    case 4: return [2 /*return*/, result];\n                    case 5: throw \"An invalid parameter in the request\";\n                }\n            });\n        }); })\n            .catch(function (error) {\n            throw \"The third step in the promise chain returns an error: \" + error;\n        })\n            .then(function () {\n            //search for child tasks\n            return loopChilds(folderId, \"/tasks?descendants=true&subTasks=true\", \"id\");\n        })\n            .catch(function (error) {\n            throw \"The fourth step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) { return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(_this, void 0, void 0, function () {\n            var result, len, x, strArr;\n            return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n                switch (_a.label) {\n                    case 0:\n                        //assign the custom field to the child tasks\n                        if (response === null || !response.length)\n                            throw \"Child tasks or subtasks not found!\";\n                        if (!(value !== undefined)) return [3 /*break*/, 5];\n                        len = response.length;\n                        x = 0;\n                        _a.label = 1;\n                    case 1:\n                        if (!(x < len)) return [3 /*break*/, 4];\n                        strArr = response.slice(x, x + 98);\n                        return [4 /*yield*/, putCustomField(\"tasks\", strArr.join(), customFieldId, value).catch(function (error) {\n                                reject(\"The PUT method returns an error: \" + error);\n                            })];\n                    case 2:\n                        result = _a.sent();\n                        _a.label = 3;\n                    case 3:\n                        x += 98;\n                        return [3 /*break*/, 1];\n                    case 4: return [3 /*break*/, 6];\n                    case 5: throw \"An invalid parameter in the request\";\n                    case 6:\n                        resolve(result);\n                        return [2 /*return*/];\n                }\n            });\n        }); })\n            .catch(function (error) {\n            reject(\"The last step in the promise chain returns an error: \" + error);\n        });\n    });\n    return promise;\n}\n//the object is able to send an Email-message using Gmail API\nvar createMessage = new _service__WEBPACK_IMPORTED_MODULE_2__[\"GmailMessage\"](\"subject\", \"message\", \"volodymyr.yovchenko@gmail.com\");\n//The function returns Wrike's user information\nfunction getUsers(users) {\n    return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__awaiter\"])(this, void 0, void 0, function () {\n        var arrValue, usersData, len, i;\n        return Object(tslib__WEBPACK_IMPORTED_MODULE_0__[\"__generator\"])(this, function (_a) {\n            switch (_a.label) {\n                case 0:\n                    arrValue = users.split(\",\");\n                    usersData = [];\n                    len = arrValue.length;\n                    i = 0;\n                    _a.label = 1;\n                case 1:\n                    if (!(i < len)) return [3 /*break*/, 4];\n                    if (!arrValue[i].length)\n                        return [2 /*return*/, null];\n                    return [4 /*yield*/, Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_API + \"/users/\" + arrValue[i]))\n                            .then(function (response) {\n                            var objUser = JSON.parse(response);\n                            usersData.push({\n                                userFullName: objUser.data[0].firstName + \" \" + objUser.data[0].lastName,\n                                userEmail: objUser.data[0].profiles[0].email\n                            });\n                        })\n                            .catch(function () {\n                            usersData = null;\n                        })];\n                case 2:\n                    _a.sent();\n                    _a.label = 3;\n                case 3:\n                    i++;\n                    return [3 /*break*/, 1];\n                case 4: return [2 /*return*/, usersData];\n            }\n        });\n    });\n}\n//The function send an e-mail to user when the custom field changes\nfunction notifyUser(objId, value, objType, customFieldId) {\n    var promise = new Promise(function (resolve, reject) {\n        if (value === undefined ||\n            !value.length ||\n            objId === undefined ||\n            !objId.length ||\n            objType === undefined ||\n            !objType.length)\n            reject(\"An invalid parameter was passed to the function!\");\n        var obj;\n        Object(_service__WEBPACK_IMPORTED_MODULE_2__[\"requestHttp\"])(\"GET\", encodeURI(process.env.WRIKE_API + \"/\" + objType + \"/\" + objId))\n            .then(function (response) {\n            //Check-in the custom fields\n            obj = JSON.parse(response);\n            if (Array.isArray(obj.data[0].customFields) &&\n                obj.data[0].customFields.length) {\n                var len = obj.data[0].customFields.length;\n                for (var i = 0; i < len; i++) {\n                    if (obj.data[0].customFields[i].id === customFieldId) {\n                        return obj.data[0].customFields[i].value;\n                    }\n                }\n            }\n            throw \"No custom fields found!\";\n        })\n            .catch(function (error) {\n            throw \"The first step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) {\n            return getUsers(response);\n        })\n            .catch(function (error) {\n            throw \"The second step in the promise chain returns an error: \" + error;\n        })\n            .then(function (response) {\n            //Send an e-mail using Gmail API\n            if (response !== null &&\n                Array.isArray(response) &&\n                response.length > 0) {\n                var len = response.length;\n                var str = void 0;\n                if (customFieldId === _model__WEBPACK_IMPORTED_MODULE_1__[\"default\"].customField[8])\n                    str = \"Вам присвоено несоответствие - \";\n                else\n                    str = \"Вам назначен проект - \";\n                for (var i = 0; i < len; i++) {\n                    createMessage.subject = \"Wrike message\";\n                    createMessage.message =\n                        \"Добрый день, \" +\n                            response[i].userFullName +\n                            \".\\n\" +\n                            str +\n                            obj.data[0].title +\n                            \"\\n\" +\n                            obj.data[0].permalink +\n                            \"\\n\" +\n                            \"Best regards!\";\n                    createMessage.user = response[i].userEmail;\n                    createMessage.gmailMessage(createMessage);\n                }\n            }\n            else\n                throw \"Function getUsers returns an empty value!\";\n            resolve(response);\n        })\n            .catch(function (error) {\n            reject(\"The last step in the promise chain returns an error: \" + error);\n        });\n    });\n    return promise;\n}\n\n\n//# sourceURL=webpack:///./server/source/wrikeDataExchange.ts?");

/***/ }),

/***/ 0:
/*!**************************************!*\
  !*** multi ./server/source/index.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./server/source/index.ts */\"./server/source/index.ts\");\n\n\n//# sourceURL=webpack:///multi_./server/source/index.ts?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"crypto\");\n\n//# sourceURL=webpack:///external_%22crypto%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"fs\");\n\n//# sourceURL=webpack:///external_%22fs%22?");

/***/ }),

/***/ "googleapis":
/*!*****************************!*\
  !*** external "googleapis" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"googleapis\");\n\n//# sourceURL=webpack:///external_%22googleapis%22?");

/***/ }),

/***/ "helmet":
/*!*************************!*\
  !*** external "helmet" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"helmet\");\n\n//# sourceURL=webpack:///external_%22helmet%22?");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"https\");\n\n//# sourceURL=webpack:///external_%22https%22?");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"pg\");\n\n//# sourceURL=webpack:///external_%22pg%22?");

/***/ }),

/***/ "readline":
/*!***************************!*\
  !*** external "readline" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"readline\");\n\n//# sourceURL=webpack:///external_%22readline%22?");

/***/ }),

/***/ "tslib":
/*!************************!*\
  !*** external "tslib" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"tslib\");\n\n//# sourceURL=webpack:///external_%22tslib%22?");

/***/ }),

/***/ "xmlhttprequest":
/*!*********************************!*\
  !*** external "xmlhttprequest" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"xmlhttprequest\");\n\n//# sourceURL=webpack:///external_%22xmlhttprequest%22?");

/***/ })

/******/ });