/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/.pnpm/@serwist+next@9.0.12_next@15.1.7_@opentelemetry+api@1.9.0_react-dom@19.0.0_react@19.0.0__react@19.0.0__typescript@5.7.3/node_modules/@serwist/next/dist/sw-entry-worker.js":
/*!*******************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/.pnpm/@serwist+next@9.0.12_next@15.1.7_@opentelemetry+api@1.9.0_react-dom@19.0.0_react@19.0.0__react@19.0.0__typescript@5.7.3/node_modules/@serwist/next/dist/sw-entry-worker.js ***!
  \*******************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\nself.onmessage = async (ev)=>{\n    switch(ev.data.type){\n        case \"__START_URL_CACHE__\":\n            {\n                const url = ev.data.url;\n                const response = await fetch(url);\n                if (!response.redirected) {\n                    const startUrlCache = await caches.open(\"start-url\");\n                    return startUrlCache.put(url, response);\n                }\n                return Promise.resolve();\n            }\n        case \"__FRONTEND_NAV_CACHE__\":\n            {\n                const url = ev.data.url;\n                const pagesCache = await caches.open(\"pages\");\n                const isPageCached = !!await pagesCache.match(url, {\n                    ignoreSearch: true\n                });\n                if (isPageCached) {\n                    return;\n                }\n                const page = await fetch(url);\n                if (!page.ok) {\n                    return;\n                }\n                pagesCache.put(url, page.clone());\n                return Promise.resolve();\n            }\n        default:\n            return Promise.resolve();\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9ub2RlX21vZHVsZXMvLnBucG0vQHNlcndpc3QrbmV4dEA5LjAuMTJfbmV4dEAxNS4xLjdfQG9wZW50ZWxlbWV0cnkrYXBpQDEuOS4wX3JlYWN0LWRvbUAxOS4wLjBfcmVhY3RAMTkuMC4wX19yZWFjdEAxOS4wLjBfX3R5cGVzY3JpcHRANS43LjMvbm9kZV9tb2R1bGVzL0BzZXJ3aXN0L25leHQvZGlzdC9zdy1lbnRyeS13b3JrZXIuanMiLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvY2hvZWphZXNvbmcvRG9jdW1lbnRzL2dpdGh1Yi9nb3NwZWwtaG91c2Uvbm9kZV9tb2R1bGVzLy5wbnBtL0BzZXJ3aXN0K25leHRAOS4wLjEyX25leHRAMTUuMS43X0BvcGVudGVsZW1ldHJ5K2FwaUAxLjkuMF9yZWFjdC1kb21AMTkuMC4wX3JlYWN0QDE5LjAuMF9fcmVhY3RAMTkuMC4wX190eXBlc2NyaXB0QDUuNy4zL25vZGVfbW9kdWxlcy9Ac2Vyd2lzdC9uZXh0L2Rpc3Qvc3ctZW50cnktd29ya2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInNlbGYub25tZXNzYWdlID0gYXN5bmMgKGV2KT0+e1xuICAgIHN3aXRjaChldi5kYXRhLnR5cGUpe1xuICAgICAgICBjYXNlIFwiX19TVEFSVF9VUkxfQ0FDSEVfX1wiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IGV2LmRhdGEudXJsO1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLnJlZGlyZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRVcmxDYWNoZSA9IGF3YWl0IGNhY2hlcy5vcGVuKFwic3RhcnQtdXJsXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RhcnRVcmxDYWNoZS5wdXQodXJsLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgY2FzZSBcIl9fRlJPTlRFTkRfTkFWX0NBQ0hFX19cIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBldi5kYXRhLnVybDtcbiAgICAgICAgICAgICAgICBjb25zdCBwYWdlc0NhY2hlID0gYXdhaXQgY2FjaGVzLm9wZW4oXCJwYWdlc1wiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1BhZ2VDYWNoZWQgPSAhIWF3YWl0IHBhZ2VzQ2FjaGUubWF0Y2godXJsLCB7XG4gICAgICAgICAgICAgICAgICAgIGlnbm9yZVNlYXJjaDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChpc1BhZ2VDYWNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBwYWdlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICAgICAgICAgICAgICBpZiAoIXBhZ2Uub2spIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYWdlc0NhY2hlLnB1dCh1cmwsIHBhZ2UuY2xvbmUoKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICAgIH1cbn07XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/.pnpm/@serwist+next@9.0.12_next@15.1.7_@opentelemetry+api@1.9.0_react-dom@19.0.0_react@19.0.0__react@19.0.0__typescript@5.7.3/node_modules/@serwist/next/dist/sw-entry-worker.js\n"));

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types policy */
/******/ 	(() => {
/******/ 		var policy;
/******/ 		__webpack_require__.tt = () => {
/******/ 			// Create Trusted Type policy if Trusted Types are available and the policy doesn't exist yet.
/******/ 			if (policy === undefined) {
/******/ 				policy = {
/******/ 					createScript: (script) => (script)
/******/ 				};
/******/ 				if (typeof trustedTypes !== "undefined" && trustedTypes.createPolicy) {
/******/ 					policy = trustedTypes.createPolicy("nextjs#bundler", policy);
/******/ 				}
/******/ 			}
/******/ 			return policy;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/trusted types script */
/******/ 	(() => {
/******/ 		__webpack_require__.ts = (script) => (__webpack_require__.tt().createScript(script));
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/react refresh */
/******/ 	(() => {
/******/ 		if (__webpack_require__.i) {
/******/ 		__webpack_require__.i.push((options) => {
/******/ 			const originalFactory = options.factory;
/******/ 			options.factory = (moduleObject, moduleExports, webpackRequire) => {
/******/ 				const hasRefresh = typeof self !== "undefined" && !!self.$RefreshInterceptModuleExecution$;
/******/ 				const cleanup = hasRefresh ? self.$RefreshInterceptModuleExecution$(moduleObject.id) : () => {};
/******/ 				try {
/******/ 					originalFactory.call(this, moduleObject, moduleExports, webpackRequire);
/******/ 				} finally {
/******/ 					cleanup();
/******/ 				}
/******/ 			}
/******/ 		})
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	
/******/ 	// noop fns to prevent runtime errors during initialization
/******/ 	if (typeof self !== "undefined") {
/******/ 		self.$RefreshReg$ = function () {};
/******/ 		self.$RefreshSig$ = function () {
/******/ 			return function (type) {
/******/ 				return type;
/******/ 			};
/******/ 		};
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./node_modules/.pnpm/@serwist+next@9.0.12_next@15.1.7_@opentelemetry+api@1.9.0_react-dom@19.0.0_react@19.0.0__react@19.0.0__typescript@5.7.3/node_modules/@serwist/next/dist/sw-entry-worker.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;