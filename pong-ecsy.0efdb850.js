// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"41671e6ffbb618e7e29ef6b38e78fb96":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = 1234;
var HMR_ENV_HASH = "d751713988987e9331980363e24189ce";
module.bundle.HMR_BUNDLE_ID = "0efdb850f55523af9515bca1ca062935";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH */

var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept, acceptedAssets; // eslint-disable-next-line no-redeclare

var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = HMR_HOST || (location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
  var port = HMR_PORT || location.port;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    acceptedAssets = {};
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      // Remove error overlay if there is one
      removeErrorOverlay();
      let assets = data.assets.filter(asset => asset.envHash === HMR_ENV_HASH); // Handle HMR Update

      var handled = false;
      assets.forEach(asset => {
        var didAccept = asset.type === 'css' || hmrAcceptCheck(global.parcelRequire, asset.id);

        if (didAccept) {
          handled = true;
        }
      });

      if (handled) {
        console.clear();
        assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });

        for (var i = 0; i < assetsToAccept.length; i++) {
          var id = assetsToAccept[i][1];

          if (!acceptedAssets[id]) {
            hmrAcceptRun(assetsToAccept[i][0], id);
          }
        }
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'error') {
      // Log parcel errors to console
      for (let ansiDiagnostic of data.diagnostics.ansi) {
        let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
        console.error('🚨 [parcel]: ' + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
      } // Render the fancy html overlay


      removeErrorOverlay();
      var overlay = createErrorOverlay(data.diagnostics.html);
      document.body.appendChild(overlay);
    }
  };

  ws.onerror = function (e) {
    console.error(e.message);
  };

  ws.onclose = function (e) {
    console.warn('[parcel] 🚨 Connection to the HMR server was lost');
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
    console.log('[parcel] ✨ Error resolved');
  }
}

function createErrorOverlay(diagnostics) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';

  for (let diagnostic of diagnostics) {
    let stack = diagnostic.codeframe ? diagnostic.codeframe : diagnostic.stack;
    errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>
          ${stack}
        </pre>
        <div>
          ${diagnostic.hints.map(hint => '<div>' + hint + '</div>').join('')}
        </div>
      </div>
    `;
  }

  errorHTML += '</div>';
  overlay.innerHTML = errorHTML;
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push([bundle, k]);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    if (link.parentNode !== null) {
      link.parentNode.removeChild(link);
    }
  };

  newLink.setAttribute('href', link.getAttribute('href').split('?')[0] + '?' + Date.now());
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      var absolute = /^https?:\/\//i.test(links[i].getAttribute('href'));

      if (!absolute) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    if (asset.type === 'css') {
      reloadCSS();
    } else {
      var fn = new Function('require', 'module', 'exports', asset.output);
      modules[asset.id] = [fn, asset.depsByBundle[bundle.HMR_BUNDLE_ID]];
    }
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (v) {
    return hmrAcceptCheck(v[0], v[1]);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached && cached.hot) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      var assetsToAlsoAccept = cb(function () {
        return getParents(global.parcelRequire, id);
      });

      if (assetsToAlsoAccept && assetsToAccept.length) {
        assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
      }
    });
  }

  acceptedAssets[id] = true;
}
},{}],"7843b3960e086726267ff606847fc92b":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.world = void 0;

var _ecsy = require("ecsy");

var _components = require("./components");

var _scenes = require("./scenes");

var _systems = require("./systems");

// Instantiate ECSY world
const world = new _ecsy.World(); // Register ECSY components

exports.world = world;
world.registerComponent(_components.BallComponent).registerComponent(_components.CanvasContextComponent).registerComponent(_components.CollisionBoxComponent).registerComponent(_components.GameStateComponent).registerComponent(_components.MovementComponent).registerComponent(_components.PositionComponent).registerComponent(_components.PaddleComponent).registerComponent(_components.RadiusComponent).registerComponent(_components.RenderComponent).registerComponent(_components.SizeComponent).registerSystem(_systems.GameSystem).registerSystem(_systems.CollisionSystem).registerSystem(_systems.RendererSystem).registerSystem(_systems.BallSystem).registerSystem(_systems.PaddleSystem).registerSystem(_systems.MovementSystem); // Initialize our GameState singleton

const gameStateEntity = world.createEntity().addComponent(_components.GameStateComponent);
const gameState = gameStateEntity.getMutableComponent(_components.GameStateComponent); // Get a reference to our canvas HTML element

const canvas = document.getElementById("game"); // Create CanvasContext singleton entity and provide it the canvas context and dimensions

world.createEntity().addComponent(_components.CanvasContextComponent, {
  ctx: canvas.getContext("2d"),
  width: canvas.width,
  height: canvas.height
}); // Load our game scene into the world

const pongScene = new _scenes.PongScene();
pongScene.load(world, canvas); // Monitor for keyboard events

window.addEventListener("keydown", e => {
  gameState.pressedKeyCodes = [...gameState.pressedKeyCodes, e.keyCode];
}, false);
window.addEventListener("keyup", e => {
  gameState.pressedKeyCodes = gameState.pressedKeyCodes.filter(keyCode => keyCode !== e.keyCode);
}, false); // Implement and execute game loop

function update() {
  world.execute();
  requestAnimationFrame(update);
}

update();
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","./components":"bc610deadc54a08eda6642f8b91e1a0d","./scenes":"8794890f3d3ff0e3e55daa8f63590080","./systems":"ae881ceed1c2eec2aa441b45d7233cc9"}],"322d3b240f66735bb9b56aa9d97788a0":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "World", {
  enumerable: true,
  get: function () {
    return _World.World;
  }
});
Object.defineProperty(exports, "System", {
  enumerable: true,
  get: function () {
    return _System.System;
  }
});
Object.defineProperty(exports, "Not", {
  enumerable: true,
  get: function () {
    return _System.Not;
  }
});
Object.defineProperty(exports, "Component", {
  enumerable: true,
  get: function () {
    return _Component.Component;
  }
});
Object.defineProperty(exports, "SystemStateComponent", {
  enumerable: true,
  get: function () {
    return _SystemStateComponent.SystemStateComponent;
  }
});
Object.defineProperty(exports, "TagComponent", {
  enumerable: true,
  get: function () {
    return _TagComponent.TagComponent;
  }
});
Object.defineProperty(exports, "ObjectPool", {
  enumerable: true,
  get: function () {
    return _ObjectPool.ObjectPool;
  }
});
Object.defineProperty(exports, "Types", {
  enumerable: true,
  get: function () {
    return _Types.Types;
  }
});
Object.defineProperty(exports, "createType", {
  enumerable: true,
  get: function () {
    return _Types.createType;
  }
});
Object.defineProperty(exports, "copyValue", {
  enumerable: true,
  get: function () {
    return _Types.copyValue;
  }
});
Object.defineProperty(exports, "cloneValue", {
  enumerable: true,
  get: function () {
    return _Types.cloneValue;
  }
});
Object.defineProperty(exports, "copyArray", {
  enumerable: true,
  get: function () {
    return _Types.copyArray;
  }
});
Object.defineProperty(exports, "cloneArray", {
  enumerable: true,
  get: function () {
    return _Types.cloneArray;
  }
});
Object.defineProperty(exports, "copyJSON", {
  enumerable: true,
  get: function () {
    return _Types.copyJSON;
  }
});
Object.defineProperty(exports, "cloneJSON", {
  enumerable: true,
  get: function () {
    return _Types.cloneJSON;
  }
});
Object.defineProperty(exports, "copyCopyable", {
  enumerable: true,
  get: function () {
    return _Types.copyCopyable;
  }
});
Object.defineProperty(exports, "cloneClonable", {
  enumerable: true,
  get: function () {
    return _Types.cloneClonable;
  }
});
Object.defineProperty(exports, "Version", {
  enumerable: true,
  get: function () {
    return _Version.Version;
  }
});
Object.defineProperty(exports, "enableRemoteDevtools", {
  enumerable: true,
  get: function () {
    return _index.enableRemoteDevtools;
  }
});
Object.defineProperty(exports, "_Entity", {
  enumerable: true,
  get: function () {
    return _Entity.Entity;
  }
});

var _World = require("./World.js");

var _System = require("./System.js");

var _Component = require("./Component.js");

var _SystemStateComponent = require("./SystemStateComponent.js");

var _TagComponent = require("./TagComponent.js");

var _ObjectPool = require("./ObjectPool.js");

var _Types = require("./Types.js");

var _Version = require("./Version.js");

var _index = require("./RemoteDevTools/index.js");

var _Entity = require("./Entity.js");
},{"./World.js":"85eb343a5386e5cdc59adf9cc96fe0bd","./System.js":"edd3b6a53f5a45bdf23cbb569da74c1f","./Component.js":"11000d279f9810140cb3aa95ad8ad686","./SystemStateComponent.js":"7cbbcf85beebef6b8dd885d2458961bb","./TagComponent.js":"b1557db12fe9c0891157f11c45e5f738","./ObjectPool.js":"6095906f1f7c0efe56961bec514882ca","./Types.js":"2656606b394597e33b0733507bcb59bd","./Version.js":"d3544807158df1cd8334ad52335ac145","./RemoteDevTools/index.js":"9279a9753522fe6332811b71a8274ab2","./Entity.js":"050d986e5e0d44e26e34e00076993d44"}],"85eb343a5386e5cdc59adf9cc96fe0bd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.World = void 0;

var _SystemManager = require("./SystemManager.js");

var _EntityManager = require("./EntityManager.js");

var _ComponentManager = require("./ComponentManager.js");

var _Version = require("./Version.js");

var _Utils = require("./Utils.js");

var _Entity = require("./Entity.js");

const DEFAULT_OPTIONS = {
  entityPoolSize: 0,
  entityClass: _Entity.Entity
};

class World {
  constructor(options = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.componentsManager = new _ComponentManager.ComponentManager(this);
    this.entityManager = new _EntityManager.EntityManager(this);
    this.systemManager = new _SystemManager.SystemManager(this);
    this.enabled = true;
    this.eventQueues = {};

    if (_Utils.hasWindow && typeof CustomEvent !== "undefined") {
      var event = new CustomEvent("ecsy-world-created", {
        detail: {
          world: this,
          version: _Version.Version
        }
      });
      window.dispatchEvent(event);
    }

    this.lastTime = (0, _Utils.now)() / 1000;
  }

  registerComponent(Component, objectPool) {
    this.componentsManager.registerComponent(Component, objectPool);
    return this;
  }

  registerSystem(System, attributes) {
    this.systemManager.registerSystem(System, attributes);
    return this;
  }

  hasRegisteredComponent(Component) {
    return this.componentsManager.hasComponent(Component);
  }

  unregisterSystem(System) {
    this.systemManager.unregisterSystem(System);
    return this;
  }

  getSystem(SystemClass) {
    return this.systemManager.getSystem(SystemClass);
  }

  getSystems() {
    return this.systemManager.getSystems();
  }

  execute(delta, time) {
    if (!delta) {
      time = (0, _Utils.now)() / 1000;
      delta = time - this.lastTime;
      this.lastTime = time;
    }

    if (this.enabled) {
      this.systemManager.execute(delta, time);
      this.entityManager.processDeferredRemoval();
    }
  }

  stop() {
    this.enabled = false;
  }

  play() {
    this.enabled = true;
  }

  createEntity(name) {
    return this.entityManager.createEntity(name);
  }

  stats() {
    var stats = {
      entities: this.entityManager.stats(),
      system: this.systemManager.stats()
    };
    return stats;
  }

}

exports.World = World;
},{"./SystemManager.js":"4d2755eb23c4923d117dc66bb6c21f99","./EntityManager.js":"45e7bf43d67ebb3fe2cc1dae17b12237","./ComponentManager.js":"114495e824c0a6a9922679e121d1405a","./Version.js":"d3544807158df1cd8334ad52335ac145","./Utils.js":"eaed502892a74ce35f6ebe97edbf8d55","./Entity.js":"050d986e5e0d44e26e34e00076993d44"}],"4d2755eb23c4923d117dc66bb6c21f99":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SystemManager = void 0;

var _Utils = require("./Utils.js");

class SystemManager {
  constructor(world) {
    this._systems = [];
    this._executeSystems = []; // Systems that have `execute` method

    this.world = world;
    this.lastExecutedSystem = null;
  }

  registerSystem(SystemClass, attributes) {
    if (!SystemClass.isSystem) {
      throw new Error(`System '${SystemClass.name}' does not extend 'System' class`);
    }

    if (this.getSystem(SystemClass) !== undefined) {
      console.warn(`System '${SystemClass.getName()}' already registered.`);
      return this;
    }

    var system = new SystemClass(this.world, attributes);
    if (system.init) system.init(attributes);
    system.order = this._systems.length;

    this._systems.push(system);

    if (system.execute) {
      this._executeSystems.push(system);

      this.sortSystems();
    }

    return this;
  }

  unregisterSystem(SystemClass) {
    let system = this.getSystem(SystemClass);

    if (system === undefined) {
      console.warn(`Can unregister system '${SystemClass.getName()}'. It doesn't exist.`);
      return this;
    }

    this._systems.splice(this._systems.indexOf(system), 1);

    if (system.execute) {
      this._executeSystems.splice(this._executeSystems.indexOf(system), 1);
    } // @todo Add system.unregister() call to free resources


    return this;
  }

  sortSystems() {
    this._executeSystems.sort((a, b) => {
      return a.priority - b.priority || a.order - b.order;
    });
  }

  getSystem(SystemClass) {
    return this._systems.find(s => s instanceof SystemClass);
  }

  getSystems() {
    return this._systems;
  }

  removeSystem(SystemClass) {
    var index = this._systems.indexOf(SystemClass);

    if (!~index) return;

    this._systems.splice(index, 1);
  }

  executeSystem(system, delta, time) {
    if (system.initialized) {
      if (system.canExecute()) {
        let startTime = (0, _Utils.now)();
        system.execute(delta, time);
        system.executeTime = (0, _Utils.now)() - startTime;
        this.lastExecutedSystem = system;
        system.clearEvents();
      }
    }
  }

  stop() {
    this._executeSystems.forEach(system => system.stop());
  }

  execute(delta, time, forcePlay) {
    this._executeSystems.forEach(system => (forcePlay || system.enabled) && this.executeSystem(system, delta, time));
  }

  stats() {
    var stats = {
      numSystems: this._systems.length,
      systems: {}
    };

    for (var i = 0; i < this._systems.length; i++) {
      var system = this._systems[i];
      var systemStats = stats.systems[system.getName()] = {
        queries: {},
        executeTime: system.executeTime
      };

      for (var name in system.ctx) {
        systemStats.queries[name] = system.ctx[name].stats();
      }
    }

    return stats;
  }

}

exports.SystemManager = SystemManager;
},{"./Utils.js":"eaed502892a74ce35f6ebe97edbf8d55"}],"eaed502892a74ce35f6ebe97edbf8d55":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getName = getName;
exports.componentPropertyName = componentPropertyName;
exports.queryKey = queryKey;
exports.componentRegistered = componentRegistered;
exports.now = exports.hasWindow = void 0;

/**
 * Return the name of a component
 * @param {Component} Component
 * @private
 */
function getName(Component) {
  return Component.name;
}
/**
 * Return a valid property name for the Component
 * @param {Component} Component
 * @private
 */


function componentPropertyName(Component) {
  return getName(Component);
}
/**
 * Get a key from a list of components
 * @param {Array(Component)} Components Array of components to generate the key
 * @private
 */


function queryKey(Components) {
  var ids = [];

  for (var n = 0; n < Components.length; n++) {
    var T = Components[n];

    if (!componentRegistered(T)) {
      throw new Error(`Tried to create a query with an unregistered component`);
    }

    if (typeof T === "object") {
      var operator = T.operator === "not" ? "!" : T.operator;
      ids.push(operator + T.Component._typeId);
    } else {
      ids.push(T._typeId);
    }
  }

  return ids.sort().join("-");
} // Detector for browser's "window"


const hasWindow = typeof window !== "undefined"; // performance.now() "polyfill"

exports.hasWindow = hasWindow;
const now = hasWindow && typeof window.performance !== "undefined" ? performance.now.bind(performance) : Date.now.bind(Date);
exports.now = now;

function componentRegistered(T) {
  return typeof T === "object" && T.Component._typeId !== undefined || T.isComponent && T._typeId !== undefined;
}
},{}],"45e7bf43d67ebb3fe2cc1dae17b12237":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EntityManager = void 0;

var _ObjectPool = require("./ObjectPool.js");

var _QueryManager = _interopRequireDefault(require("./QueryManager.js"));

var _EventDispatcher = _interopRequireDefault(require("./EventDispatcher.js"));

var _SystemStateComponent = require("./SystemStateComponent.js");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

class EntityPool extends _ObjectPool.ObjectPool {
  constructor(entityManager, entityClass, initialSize) {
    super(entityClass, undefined);
    this.entityManager = entityManager;

    if (typeof initialSize !== "undefined") {
      this.expand(initialSize);
    }
  }

  expand(count) {
    for (var n = 0; n < count; n++) {
      var clone = new this.T(this.entityManager);
      clone._pool = this;
      this.freeList.push(clone);
    }

    this.count += count;
  }

}
/**
 * @private
 * @class EntityManager
 */


class EntityManager {
  constructor(world) {
    this.world = world;
    this.componentsManager = world.componentsManager; // All the entities in this instance

    this._entities = [];
    this._nextEntityId = 0;
    this._entitiesByNames = {};
    this._queryManager = new _QueryManager.default(this);
    this.eventDispatcher = new _EventDispatcher.default();
    this._entityPool = new EntityPool(this, this.world.options.entityClass, this.world.options.entityPoolSize); // Deferred deletion

    this.entitiesWithComponentsToRemove = [];
    this.entitiesToRemove = [];
    this.deferredRemovalEnabled = true;
  }

  getEntityByName(name) {
    return this._entitiesByNames[name];
  }
  /**
   * Create a new entity
   */


  createEntity(name) {
    var entity = this._entityPool.acquire();

    entity.alive = true;
    entity.name = name || "";

    if (name) {
      if (this._entitiesByNames[name]) {
        console.warn(`Entity name '${name}' already exist`);
      } else {
        this._entitiesByNames[name] = entity;
      }
    }

    this._entities.push(entity);

    this.eventDispatcher.dispatchEvent(ENTITY_CREATED, entity);
    return entity;
  } // COMPONENTS

  /**
   * Add a component to an entity
   * @param {Entity} entity Entity where the component will be added
   * @param {Component} Component Component to be added to the entity
   * @param {Object} values Optional values to replace the default attributes
   */


  entityAddComponent(entity, Component, values) {
    // @todo Probably define Component._typeId with a default value and avoid using typeof
    if (typeof Component._typeId === "undefined" && !this.world.componentsManager._ComponentsMap[Component._typeId]) {
      throw new Error(`Attempted to add unregistered component "${Component.getName()}"`);
    }

    if (~entity._ComponentTypes.indexOf(Component)) {
      if ("development" !== "production") {
        console.warn("Component type already exists on entity.", entity, Component.getName());
      }

      return;
    }

    entity._ComponentTypes.push(Component);

    if (Component.__proto__ === _SystemStateComponent.SystemStateComponent) {
      entity.numStateComponents++;
    }

    var componentPool = this.world.componentsManager.getComponentsPool(Component);
    var component = componentPool ? componentPool.acquire() : new Component(values);

    if (componentPool && values) {
      component.copy(values);
    }

    entity._components[Component._typeId] = component;

    this._queryManager.onEntityComponentAdded(entity, Component);

    this.world.componentsManager.componentAddedToEntity(Component);
    this.eventDispatcher.dispatchEvent(COMPONENT_ADDED, entity, Component);
  }
  /**
   * Remove a component from an entity
   * @param {Entity} entity Entity which will get removed the component
   * @param {*} Component Component to remove from the entity
   * @param {Bool} immediately If you want to remove the component immediately instead of deferred (Default is false)
   */


  entityRemoveComponent(entity, Component, immediately) {
    var index = entity._ComponentTypes.indexOf(Component);

    if (!~index) return;
    this.eventDispatcher.dispatchEvent(COMPONENT_REMOVE, entity, Component);

    if (immediately) {
      this._entityRemoveComponentSync(entity, Component, index);
    } else {
      if (entity._ComponentTypesToRemove.length === 0) this.entitiesWithComponentsToRemove.push(entity);

      entity._ComponentTypes.splice(index, 1);

      entity._ComponentTypesToRemove.push(Component);

      entity._componentsToRemove[Component._typeId] = entity._components[Component._typeId];
      delete entity._components[Component._typeId];
    } // Check each indexed query to see if we need to remove it


    this._queryManager.onEntityComponentRemoved(entity, Component);

    if (Component.__proto__ === _SystemStateComponent.SystemStateComponent) {
      entity.numStateComponents--; // Check if the entity was a ghost waiting for the last system state component to be removed

      if (entity.numStateComponents === 0 && !entity.alive) {
        entity.remove();
      }
    }
  }

  _entityRemoveComponentSync(entity, Component, index) {
    // Remove T listing on entity and property ref, then free the component.
    entity._ComponentTypes.splice(index, 1);

    var component = entity._components[Component._typeId];
    delete entity._components[Component._typeId];
    component.dispose();
    this.world.componentsManager.componentRemovedFromEntity(Component);
  }
  /**
   * Remove all the components from an entity
   * @param {Entity} entity Entity from which the components will be removed
   */


  entityRemoveAllComponents(entity, immediately) {
    let Components = entity._ComponentTypes;

    for (let j = Components.length - 1; j >= 0; j--) {
      if (Components[j].__proto__ !== _SystemStateComponent.SystemStateComponent) this.entityRemoveComponent(entity, Components[j], immediately);
    }
  }
  /**
   * Remove the entity from this manager. It will clear also its components
   * @param {Entity} entity Entity to remove from the manager
   * @param {Bool} immediately If you want to remove the component immediately instead of deferred (Default is false)
   */


  removeEntity(entity, immediately) {
    var index = this._entities.indexOf(entity);

    if (!~index) throw new Error("Tried to remove entity not in list");
    entity.alive = false;

    if (entity.numStateComponents === 0) {
      // Remove from entity list
      this.eventDispatcher.dispatchEvent(ENTITY_REMOVED, entity);

      this._queryManager.onEntityRemoved(entity);

      if (immediately === true) {
        this._releaseEntity(entity, index);
      } else {
        this.entitiesToRemove.push(entity);
      }
    }

    this.entityRemoveAllComponents(entity, immediately);
  }

  _releaseEntity(entity, index) {
    this._entities.splice(index, 1);

    if (this._entitiesByNames[entity.name]) {
      delete this._entitiesByNames[entity.name];
    }

    entity._pool.release(entity);
  }
  /**
   * Remove all entities from this manager
   */


  removeAllEntities() {
    for (var i = this._entities.length - 1; i >= 0; i--) {
      this.removeEntity(this._entities[i]);
    }
  }

  processDeferredRemoval() {
    if (!this.deferredRemovalEnabled) {
      return;
    }

    for (let i = 0; i < this.entitiesToRemove.length; i++) {
      let entity = this.entitiesToRemove[i];

      let index = this._entities.indexOf(entity);

      this._releaseEntity(entity, index);
    }

    this.entitiesToRemove.length = 0;

    for (let i = 0; i < this.entitiesWithComponentsToRemove.length; i++) {
      let entity = this.entitiesWithComponentsToRemove[i];

      while (entity._ComponentTypesToRemove.length > 0) {
        let Component = entity._ComponentTypesToRemove.pop();

        var component = entity._componentsToRemove[Component._typeId];
        delete entity._componentsToRemove[Component._typeId];
        component.dispose();
        this.world.componentsManager.componentRemovedFromEntity(Component); //this._entityRemoveComponentSync(entity, Component, index);
      }
    }

    this.entitiesWithComponentsToRemove.length = 0;
  }
  /**
   * Get a query based on a list of components
   * @param {Array(Component)} Components List of components that will form the query
   */


  queryComponents(Components) {
    return this._queryManager.getQuery(Components);
  } // EXTRAS

  /**
   * Return number of entities
   */


  count() {
    return this._entities.length;
  }
  /**
   * Return some stats
   */


  stats() {
    var stats = {
      numEntities: this._entities.length,
      numQueries: Object.keys(this._queryManager._queries).length,
      queries: this._queryManager.stats(),
      numComponentPool: Object.keys(this.componentsManager._componentPool).length,
      componentPool: {},
      eventDispatcher: this.eventDispatcher.stats
    };

    for (var ecsyComponentId in this.componentsManager._componentPool) {
      var pool = this.componentsManager._componentPool[ecsyComponentId];
      stats.componentPool[pool.T.getName()] = {
        used: pool.totalUsed(),
        size: pool.count
      };
    }

    return stats;
  }

}

exports.EntityManager = EntityManager;
const ENTITY_CREATED = "EntityManager#ENTITY_CREATE";
const ENTITY_REMOVED = "EntityManager#ENTITY_REMOVED";
const COMPONENT_ADDED = "EntityManager#COMPONENT_ADDED";
const COMPONENT_REMOVE = "EntityManager#COMPONENT_REMOVE";
},{"./ObjectPool.js":"6095906f1f7c0efe56961bec514882ca","./QueryManager.js":"3e5003a7d4117170c467e1fccabe4d90","./EventDispatcher.js":"48cb04a1dcc3afe6e04dd1bd7d579530","./SystemStateComponent.js":"7cbbcf85beebef6b8dd885d2458961bb"}],"6095906f1f7c0efe56961bec514882ca":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectPool = void 0;

class ObjectPool {
  // @todo Add initial size
  constructor(T, initialSize) {
    this.freeList = [];
    this.count = 0;
    this.T = T;
    this.isObjectPool = true;

    if (typeof initialSize !== "undefined") {
      this.expand(initialSize);
    }
  }

  acquire() {
    // Grow the list by 20%ish if we're out
    if (this.freeList.length <= 0) {
      this.expand(Math.round(this.count * 0.2) + 1);
    }

    var item = this.freeList.pop();
    return item;
  }

  release(item) {
    item.reset();
    this.freeList.push(item);
  }

  expand(count) {
    for (var n = 0; n < count; n++) {
      var clone = new this.T();
      clone._pool = this;
      this.freeList.push(clone);
    }

    this.count += count;
  }

  totalSize() {
    return this.count;
  }

  totalFree() {
    return this.freeList.length;
  }

  totalUsed() {
    return this.count - this.freeList.length;
  }

}

exports.ObjectPool = ObjectPool;
},{}],"3e5003a7d4117170c467e1fccabe4d90":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Query = _interopRequireDefault(require("./Query.js"));

var _Utils = require("./Utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @private
 * @class QueryManager
 */
class QueryManager {
  constructor(world) {
    this._world = world; // Queries indexed by a unique identifier for the components it has

    this._queries = {};
  }

  onEntityRemoved(entity) {
    for (var queryName in this._queries) {
      var query = this._queries[queryName];

      if (entity.queries.indexOf(query) !== -1) {
        query.removeEntity(entity);
      }
    }
  }
  /**
   * Callback when a component is added to an entity
   * @param {Entity} entity Entity that just got the new component
   * @param {Component} Component Component added to the entity
   */


  onEntityComponentAdded(entity, Component) {
    // @todo Use bitmask for checking components?
    // Check each indexed query to see if we need to add this entity to the list
    for (var queryName in this._queries) {
      var query = this._queries[queryName];

      if (!!~query.NotComponents.indexOf(Component) && ~query.entities.indexOf(entity)) {
        query.removeEntity(entity);
        continue;
      } // Add the entity only if:
      // Component is in the query
      // and Entity has ALL the components of the query
      // and Entity is not already in the query


      if (!~query.Components.indexOf(Component) || !query.match(entity) || ~query.entities.indexOf(entity)) continue;
      query.addEntity(entity);
    }
  }
  /**
   * Callback when a component is removed from an entity
   * @param {Entity} entity Entity to remove the component from
   * @param {Component} Component Component to remove from the entity
   */


  onEntityComponentRemoved(entity, Component) {
    for (var queryName in this._queries) {
      var query = this._queries[queryName];

      if (!!~query.NotComponents.indexOf(Component) && !~query.entities.indexOf(entity) && query.match(entity)) {
        query.addEntity(entity);
        continue;
      }

      if (!!~query.Components.indexOf(Component) && !!~query.entities.indexOf(entity) && !query.match(entity)) {
        query.removeEntity(entity);
        continue;
      }
    }
  }
  /**
   * Get a query for the specified components
   * @param {Component} Components Components that the query should have
   */


  getQuery(Components) {
    var key = (0, _Utils.queryKey)(Components);
    var query = this._queries[key];

    if (!query) {
      this._queries[key] = query = new _Query.default(Components, this._world);
    }

    return query;
  }
  /**
   * Return some stats from this class
   */


  stats() {
    var stats = {};

    for (var queryName in this._queries) {
      stats[queryName] = this._queries[queryName].stats();
    }

    return stats;
  }

}

exports.default = QueryManager;
},{"./Query.js":"3ac97b36c22bd4dd86d2a14c4e5c2eef","./Utils.js":"eaed502892a74ce35f6ebe97edbf8d55"}],"3ac97b36c22bd4dd86d2a14c4e5c2eef":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _EventDispatcher = _interopRequireDefault(require("./EventDispatcher.js"));

var _Utils = require("./Utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Query {
  /**
   * @param {Array(Component)} Components List of types of components to query
   */
  constructor(Components, manager) {
    this.Components = [];
    this.NotComponents = [];
    Components.forEach(component => {
      if (typeof component === "object") {
        this.NotComponents.push(component.Component);
      } else {
        this.Components.push(component);
      }
    });

    if (this.Components.length === 0) {
      throw new Error("Can't create a query without components");
    }

    this.entities = [];
    this.eventDispatcher = new _EventDispatcher.default(); // This query is being used by a reactive system

    this.reactive = false;
    this.key = (0, _Utils.queryKey)(Components); // Fill the query with the existing entities

    for (var i = 0; i < manager._entities.length; i++) {
      var entity = manager._entities[i];

      if (this.match(entity)) {
        // @todo ??? this.addEntity(entity); => preventing the event to be generated
        entity.queries.push(this);
        this.entities.push(entity);
      }
    }
  }
  /**
   * Add entity to this query
   * @param {Entity} entity
   */


  addEntity(entity) {
    entity.queries.push(this);
    this.entities.push(entity);
    this.eventDispatcher.dispatchEvent(Query.prototype.ENTITY_ADDED, entity);
  }
  /**
   * Remove entity from this query
   * @param {Entity} entity
   */


  removeEntity(entity) {
    let index = this.entities.indexOf(entity);

    if (~index) {
      this.entities.splice(index, 1);
      index = entity.queries.indexOf(this);
      entity.queries.splice(index, 1);
      this.eventDispatcher.dispatchEvent(Query.prototype.ENTITY_REMOVED, entity);
    }
  }

  match(entity) {
    return entity.hasAllComponents(this.Components) && !entity.hasAnyComponents(this.NotComponents);
  }

  toJSON() {
    return {
      key: this.key,
      reactive: this.reactive,
      components: {
        included: this.Components.map(C => C.name),
        not: this.NotComponents.map(C => C.name)
      },
      numEntities: this.entities.length
    };
  }
  /**
   * Return stats for this query
   */


  stats() {
    return {
      numComponents: this.Components.length,
      numEntities: this.entities.length
    };
  }

}

exports.default = Query;
Query.prototype.ENTITY_ADDED = "Query#ENTITY_ADDED";
Query.prototype.ENTITY_REMOVED = "Query#ENTITY_REMOVED";
Query.prototype.COMPONENT_CHANGED = "Query#COMPONENT_CHANGED";
},{"./EventDispatcher.js":"48cb04a1dcc3afe6e04dd1bd7d579530","./Utils.js":"eaed502892a74ce35f6ebe97edbf8d55"}],"48cb04a1dcc3afe6e04dd1bd7d579530":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @private
 * @class EventDispatcher
 */
class EventDispatcher {
  constructor() {
    this._listeners = {};
    this.stats = {
      fired: 0,
      handled: 0
    };
  }
  /**
   * Add an event listener
   * @param {String} eventName Name of the event to listen
   * @param {Function} listener Callback to trigger when the event is fired
   */


  addEventListener(eventName, listener) {
    let listeners = this._listeners;

    if (listeners[eventName] === undefined) {
      listeners[eventName] = [];
    }

    if (listeners[eventName].indexOf(listener) === -1) {
      listeners[eventName].push(listener);
    }
  }
  /**
   * Check if an event listener is already added to the list of listeners
   * @param {String} eventName Name of the event to check
   * @param {Function} listener Callback for the specified event
   */


  hasEventListener(eventName, listener) {
    return this._listeners[eventName] !== undefined && this._listeners[eventName].indexOf(listener) !== -1;
  }
  /**
   * Remove an event listener
   * @param {String} eventName Name of the event to remove
   * @param {Function} listener Callback for the specified event
   */


  removeEventListener(eventName, listener) {
    var listenerArray = this._listeners[eventName];

    if (listenerArray !== undefined) {
      var index = listenerArray.indexOf(listener);

      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }
  /**
   * Dispatch an event
   * @param {String} eventName Name of the event to dispatch
   * @param {Entity} entity (Optional) Entity to emit
   * @param {Component} component
   */


  dispatchEvent(eventName, entity, component) {
    this.stats.fired++;
    var listenerArray = this._listeners[eventName];

    if (listenerArray !== undefined) {
      var array = listenerArray.slice(0);

      for (var i = 0; i < array.length; i++) {
        array[i].call(this, entity, component);
      }
    }
  }
  /**
   * Reset stats counters
   */


  resetCounters() {
    this.stats.fired = this.stats.handled = 0;
  }

}

exports.default = EventDispatcher;
},{}],"7cbbcf85beebef6b8dd885d2458961bb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SystemStateComponent = void 0;

var _Component = require("./Component");

class SystemStateComponent extends _Component.Component {}

exports.SystemStateComponent = SystemStateComponent;
SystemStateComponent.isSystemStateComponent = true;
},{"./Component":"11000d279f9810140cb3aa95ad8ad686"}],"11000d279f9810140cb3aa95ad8ad686":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Component = void 0;

class Component {
  constructor(props) {
    if (props !== false) {
      const schema = this.constructor.schema;

      for (const key in schema) {
        if (props && props.hasOwnProperty(key)) {
          this[key] = props[key];
        } else {
          const schemaProp = schema[key];

          if (schemaProp.hasOwnProperty("default")) {
            this[key] = schemaProp.type.clone(schemaProp.default);
          } else {
            const type = schemaProp.type;
            this[key] = type.clone(type.default);
          }
        }
      }

      if ("development" !== "production" && props !== undefined) {
        this.checkUndefinedAttributes(props);
      }
    }

    this._pool = null;
  }

  copy(source) {
    const schema = this.constructor.schema;

    for (const key in schema) {
      const prop = schema[key];

      if (source.hasOwnProperty(key)) {
        this[key] = prop.type.copy(source[key], this[key]);
      }
    } // @DEBUG


    if ("development" !== "production") {
      this.checkUndefinedAttributes(source);
    }

    return this;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  reset() {
    const schema = this.constructor.schema;

    for (const key in schema) {
      const schemaProp = schema[key];

      if (schemaProp.hasOwnProperty("default")) {
        this[key] = schemaProp.type.copy(schemaProp.default, this[key]);
      } else {
        const type = schemaProp.type;
        this[key] = type.copy(type.default, this[key]);
      }
    }
  }

  dispose() {
    if (this._pool) {
      this._pool.release(this);
    }
  }

  getName() {
    return this.constructor.getName();
  }

  checkUndefinedAttributes(src) {
    const schema = this.constructor.schema; // Check that the attributes defined in source are also defined in the schema

    Object.keys(src).forEach(srcKey => {
      if (!schema.hasOwnProperty(srcKey)) {
        console.warn(`Trying to set attribute '${srcKey}' not defined in the '${this.constructor.name}' schema. Please fix the schema, the attribute value won't be set`);
      }
    });
  }

}

exports.Component = Component;
Component.schema = {};
Component.isComponent = true;

Component.getName = function () {
  return this.displayName || this.name;
};
},{}],"114495e824c0a6a9922679e121d1405a":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentManager = void 0;

var _ObjectPool = require("./ObjectPool.js");

class ComponentManager {
  constructor() {
    this.Components = [];
    this._ComponentsMap = {};
    this._componentPool = {};
    this.numComponents = {};
    this.nextComponentId = 0;
  }

  hasComponent(Component) {
    return this.Components.indexOf(Component) !== -1;
  }

  registerComponent(Component, objectPool) {
    if (this.Components.indexOf(Component) !== -1) {
      console.warn(`Component type: '${Component.getName()}' already registered.`);
      return;
    }

    const schema = Component.schema;

    if (!schema) {
      throw new Error(`Component "${Component.getName()}" has no schema property.`);
    }

    for (const propName in schema) {
      const prop = schema[propName];

      if (!prop.type) {
        throw new Error(`Invalid schema for component "${Component.getName()}". Missing type for "${propName}" property.`);
      }
    }

    Component._typeId = this.nextComponentId++;
    this.Components.push(Component);
    this._ComponentsMap[Component._typeId] = Component;
    this.numComponents[Component._typeId] = 0;

    if (objectPool === undefined) {
      objectPool = new _ObjectPool.ObjectPool(Component);
    } else if (objectPool === false) {
      objectPool = undefined;
    }

    this._componentPool[Component._typeId] = objectPool;
  }

  componentAddedToEntity(Component) {
    this.numComponents[Component._typeId]++;
  }

  componentRemovedFromEntity(Component) {
    this.numComponents[Component._typeId]--;
  }

  getComponentsPool(Component) {
    return this._componentPool[Component._typeId];
  }

}

exports.ComponentManager = ComponentManager;
},{"./ObjectPool.js":"6095906f1f7c0efe56961bec514882ca"}],"d3544807158df1cd8334ad52335ac145":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Version = void 0;
const Version = "0.3.1";
exports.Version = Version;
},{}],"050d986e5e0d44e26e34e00076993d44":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Entity = void 0;

var _Query = _interopRequireDefault(require("./Query.js"));

var _WrapImmutableComponent = _interopRequireDefault(require("./WrapImmutableComponent.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

class Entity {
  constructor(entityManager) {
    this._entityManager = entityManager || null; // Unique ID for this entity

    this.id = entityManager._nextEntityId++; // List of components types the entity has

    this._ComponentTypes = []; // Instance of the components

    this._components = {};
    this._componentsToRemove = {}; // Queries where the entity is added

    this.queries = []; // Used for deferred removal

    this._ComponentTypesToRemove = [];
    this.alive = false; //if there are state components on a entity, it can't be removed completely

    this.numStateComponents = 0;
  } // COMPONENTS


  getComponent(Component, includeRemoved) {
    var component = this._components[Component._typeId];

    if (!component && includeRemoved === true) {
      component = this._componentsToRemove[Component._typeId];
    }

    return "development" !== "production" ? (0, _WrapImmutableComponent.default)(Component, component) : component;
  }

  getRemovedComponent(Component) {
    const component = this._componentsToRemove[Component._typeId];
    return "development" !== "production" ? (0, _WrapImmutableComponent.default)(Component, component) : component;
  }

  getComponents() {
    return this._components;
  }

  getComponentsToRemove() {
    return this._componentsToRemove;
  }

  getComponentTypes() {
    return this._ComponentTypes;
  }

  getMutableComponent(Component) {
    var component = this._components[Component._typeId];

    if (!component) {
      return;
    }

    for (var i = 0; i < this.queries.length; i++) {
      var query = this.queries[i]; // @todo accelerate this check. Maybe having query._Components as an object
      // @todo add Not components

      if (query.reactive && query.Components.indexOf(Component) !== -1) {
        query.eventDispatcher.dispatchEvent(_Query.default.prototype.COMPONENT_CHANGED, this, component);
      }
    }

    return component;
  }

  addComponent(Component, values) {
    this._entityManager.entityAddComponent(this, Component, values);

    return this;
  }

  removeComponent(Component, forceImmediate) {
    this._entityManager.entityRemoveComponent(this, Component, forceImmediate);

    return this;
  }

  hasComponent(Component, includeRemoved) {
    return !!~this._ComponentTypes.indexOf(Component) || includeRemoved === true && this.hasRemovedComponent(Component);
  }

  hasRemovedComponent(Component) {
    return !!~this._ComponentTypesToRemove.indexOf(Component);
  }

  hasAllComponents(Components) {
    for (var i = 0; i < Components.length; i++) {
      if (!this.hasComponent(Components[i])) return false;
    }

    return true;
  }

  hasAnyComponents(Components) {
    for (var i = 0; i < Components.length; i++) {
      if (this.hasComponent(Components[i])) return true;
    }

    return false;
  }

  removeAllComponents(forceImmediate) {
    return this._entityManager.entityRemoveAllComponents(this, forceImmediate);
  }

  copy(src) {
    // TODO: This can definitely be optimized
    for (var ecsyComponentId in src._components) {
      var srcComponent = src._components[ecsyComponentId];
      this.addComponent(srcComponent.constructor);
      var component = this.getComponent(srcComponent.constructor);
      component.copy(srcComponent);
    }

    return this;
  }

  clone() {
    return new Entity(this._entityManager).copy(this);
  }

  reset() {
    this.id = this._entityManager._nextEntityId++;
    this._ComponentTypes.length = 0;
    this.queries.length = 0;

    for (var ecsyComponentId in this._components) {
      delete this._components[ecsyComponentId];
    }
  }

  remove(forceImmediate) {
    return this._entityManager.removeEntity(this, forceImmediate);
  }

}

exports.Entity = Entity;
},{"./Query.js":"3ac97b36c22bd4dd86d2a14c4e5c2eef","./WrapImmutableComponent.js":"fe5958539a0447823ee921bdb0ed2815"}],"fe5958539a0447823ee921bdb0ed2815":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = wrapImmutableComponent;
const proxyMap = new WeakMap();
const proxyHandler = {
  set(target, prop) {
    throw new Error(`Tried to write to "${target.constructor.getName()}#${String(prop)}" on immutable component. Use .getMutableComponent() to modify a component.`);
  }

};

function wrapImmutableComponent(T, component) {
  if (component === undefined) {
    return undefined;
  }

  let wrappedComponent = proxyMap.get(component);

  if (!wrappedComponent) {
    wrappedComponent = new Proxy(component, proxyHandler);
    proxyMap.set(component, wrappedComponent);
  }

  return wrappedComponent;
}
},{}],"edd3b6a53f5a45bdf23cbb569da74c1f":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Not = Not;
exports.System = void 0;

var _Query = _interopRequireDefault(require("./Query.js"));

var _Utils = require("./Utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class System {
  canExecute() {
    if (this._mandatoryQueries.length === 0) return true;

    for (let i = 0; i < this._mandatoryQueries.length; i++) {
      var query = this._mandatoryQueries[i];

      if (query.entities.length === 0) {
        return false;
      }
    }

    return true;
  }

  getName() {
    return this.constructor.getName();
  }

  constructor(world, attributes) {
    this.world = world;
    this.enabled = true; // @todo Better naming :)

    this._queries = {};
    this.queries = {};
    this.priority = 0; // Used for stats

    this.executeTime = 0;

    if (attributes && attributes.priority) {
      this.priority = attributes.priority;
    }

    this._mandatoryQueries = [];
    this.initialized = true;

    if (this.constructor.queries) {
      for (var queryName in this.constructor.queries) {
        var queryConfig = this.constructor.queries[queryName];
        var Components = queryConfig.components;

        if (!Components || Components.length === 0) {
          throw new Error("'components' attribute can't be empty in a query");
        } // Detect if the components have already been registered


        let unregisteredComponents = Components.filter(Component => !(0, _Utils.componentRegistered)(Component));

        if (unregisteredComponents.length > 0) {
          throw new Error(`Tried to create a query '${this.constructor.name}.${queryName}' with unregistered components: [${unregisteredComponents.map(c => c.getName()).join(", ")}]`);
        }

        var query = this.world.entityManager.queryComponents(Components);
        this._queries[queryName] = query;

        if (queryConfig.mandatory === true) {
          this._mandatoryQueries.push(query);
        }

        this.queries[queryName] = {
          results: query.entities
        }; // Reactive configuration added/removed/changed

        var validEvents = ["added", "removed", "changed"];
        const eventMapping = {
          added: _Query.default.prototype.ENTITY_ADDED,
          removed: _Query.default.prototype.ENTITY_REMOVED,
          changed: _Query.default.prototype.COMPONENT_CHANGED // Query.prototype.ENTITY_CHANGED

        };

        if (queryConfig.listen) {
          validEvents.forEach(eventName => {
            if (!this.execute) {
              console.warn(`System '${this.getName()}' has defined listen events (${validEvents.join(", ")}) for query '${queryName}' but it does not implement the 'execute' method.`);
            } // Is the event enabled on this system's query?


            if (queryConfig.listen[eventName]) {
              let event = queryConfig.listen[eventName];

              if (eventName === "changed") {
                query.reactive = true;

                if (event === true) {
                  // Any change on the entity from the components in the query
                  let eventList = this.queries[queryName][eventName] = [];
                  query.eventDispatcher.addEventListener(_Query.default.prototype.COMPONENT_CHANGED, entity => {
                    // Avoid duplicates
                    if (eventList.indexOf(entity) === -1) {
                      eventList.push(entity);
                    }
                  });
                } else if (Array.isArray(event)) {
                  let eventList = this.queries[queryName][eventName] = [];
                  query.eventDispatcher.addEventListener(_Query.default.prototype.COMPONENT_CHANGED, (entity, changedComponent) => {
                    // Avoid duplicates
                    if (event.indexOf(changedComponent.constructor) !== -1 && eventList.indexOf(entity) === -1) {
                      eventList.push(entity);
                    }
                  });
                } else {
                  /*
                  // Checking just specific components
                  let changedList = (this.queries[queryName][eventName] = {});
                  event.forEach(component => {
                    let eventList = (changedList[
                      componentPropertyName(component)
                    ] = []);
                    query.eventDispatcher.addEventListener(
                      Query.prototype.COMPONENT_CHANGED,
                      (entity, changedComponent) => {
                        if (
                          changedComponent.constructor === component &&
                          eventList.indexOf(entity) === -1
                        ) {
                          eventList.push(entity);
                        }
                      }
                    );
                  });
                  */
                }
              } else {
                let eventList = this.queries[queryName][eventName] = [];
                query.eventDispatcher.addEventListener(eventMapping[eventName], entity => {
                  // @fixme overhead?
                  if (eventList.indexOf(entity) === -1) eventList.push(entity);
                });
              }
            }
          });
        }
      }
    }
  }

  stop() {
    this.executeTime = 0;
    this.enabled = false;
  }

  play() {
    this.enabled = true;
  } // @question rename to clear queues?


  clearEvents() {
    for (let queryName in this.queries) {
      var query = this.queries[queryName];

      if (query.added) {
        query.added.length = 0;
      }

      if (query.removed) {
        query.removed.length = 0;
      }

      if (query.changed) {
        if (Array.isArray(query.changed)) {
          query.changed.length = 0;
        } else {
          for (let name in query.changed) {
            query.changed[name].length = 0;
          }
        }
      }
    }
  }

  toJSON() {
    var json = {
      name: this.getName(),
      enabled: this.enabled,
      executeTime: this.executeTime,
      priority: this.priority,
      queries: {}
    };

    if (this.constructor.queries) {
      var queries = this.constructor.queries;

      for (let queryName in queries) {
        let query = this.queries[queryName];
        let queryDefinition = queries[queryName];
        let jsonQuery = json.queries[queryName] = {
          key: this._queries[queryName].key
        };
        jsonQuery.mandatory = queryDefinition.mandatory === true;
        jsonQuery.reactive = queryDefinition.listen && (queryDefinition.listen.added === true || queryDefinition.listen.removed === true || queryDefinition.listen.changed === true || Array.isArray(queryDefinition.listen.changed));

        if (jsonQuery.reactive) {
          jsonQuery.listen = {};
          const methods = ["added", "removed", "changed"];
          methods.forEach(method => {
            if (query[method]) {
              jsonQuery.listen[method] = {
                entities: query[method].length
              };
            }
          });
        }
      }
    }

    return json;
  }

}

exports.System = System;
System.isSystem = true;

System.getName = function () {
  return this.displayName || this.name;
};

function Not(Component) {
  return {
    operator: "not",
    Component: Component
  };
}
},{"./Query.js":"3ac97b36c22bd4dd86d2a14c4e5c2eef","./Utils.js":"eaed502892a74ce35f6ebe97edbf8d55"}],"b1557db12fe9c0891157f11c45e5f738":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagComponent = void 0;

var _Component = require("./Component");

class TagComponent extends _Component.Component {
  constructor() {
    super(false);
  }

}

exports.TagComponent = TagComponent;
TagComponent.isTagComponent = true;
},{"./Component":"11000d279f9810140cb3aa95ad8ad686"}],"2656606b394597e33b0733507bcb59bd":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createType = createType;
exports.Types = exports.cloneClonable = exports.copyCopyable = exports.cloneJSON = exports.copyJSON = exports.cloneArray = exports.copyArray = exports.cloneValue = exports.copyValue = void 0;

const copyValue = src => src;

exports.copyValue = copyValue;

const cloneValue = src => src;

exports.cloneValue = cloneValue;

const copyArray = (src, dest) => {
  if (!src) {
    return src;
  }

  if (!dest) {
    return src.slice();
  }

  dest.length = 0;

  for (let i = 0; i < src.length; i++) {
    dest.push(src[i]);
  }

  return dest;
};

exports.copyArray = copyArray;

const cloneArray = src => src && src.slice();

exports.cloneArray = cloneArray;

const copyJSON = src => JSON.parse(JSON.stringify(src));

exports.copyJSON = copyJSON;

const cloneJSON = src => JSON.parse(JSON.stringify(src));

exports.cloneJSON = cloneJSON;

const copyCopyable = (src, dest) => {
  if (!src) {
    return src;
  }

  if (!dest) {
    return src.clone();
  }

  return dest.copy(src);
};

exports.copyCopyable = copyCopyable;

const cloneClonable = src => src && src.clone();

exports.cloneClonable = cloneClonable;

function createType(typeDefinition) {
  var mandatoryProperties = ["name", "default", "copy", "clone"];
  var undefinedProperties = mandatoryProperties.filter(p => {
    return !typeDefinition.hasOwnProperty(p);
  });

  if (undefinedProperties.length > 0) {
    throw new Error(`createType expects a type definition with the following properties: ${undefinedProperties.join(", ")}`);
  }

  typeDefinition.isType = true;
  return typeDefinition;
}
/**
 * Standard types
 */


const Types = {
  Number: createType({
    name: "Number",
    default: 0,
    copy: copyValue,
    clone: cloneValue
  }),
  Boolean: createType({
    name: "Boolean",
    default: false,
    copy: copyValue,
    clone: cloneValue
  }),
  String: createType({
    name: "String",
    default: "",
    copy: copyValue,
    clone: cloneValue
  }),
  Array: createType({
    name: "Array",
    default: [],
    copy: copyArray,
    clone: cloneArray
  }),
  Ref: createType({
    name: "Ref",
    default: undefined,
    copy: copyValue,
    clone: cloneValue
  }),
  JSON: createType({
    name: "JSON",
    default: null,
    copy: copyJSON,
    clone: cloneJSON
  })
};
exports.Types = Types;
},{}],"9279a9753522fe6332811b71a8274ab2":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enableRemoteDevtools = enableRemoteDevtools;

var _utils = require("./utils.js");

var _Utils = require("../Utils.js");

/* global Peer */
function hookConsoleAndErrors(connection) {
  var wrapFunctions = ["error", "warning", "log"];
  wrapFunctions.forEach(key => {
    if (typeof console[key] === "function") {
      var fn = console[key].bind(console);

      console[key] = (...args) => {
        connection.send({
          method: "console",
          type: key,
          args: JSON.stringify(args)
        });
        return fn.apply(null, args);
      };
    }
  });
  window.addEventListener("error", error => {
    connection.send({
      method: "error",
      error: JSON.stringify({
        message: error.error.message,
        stack: error.error.stack
      })
    });
  });
}

function includeRemoteIdHTML(remoteId) {
  let infoDiv = document.createElement("div");
  infoDiv.style.cssText = `
    align-items: center;
    background-color: #333;
    color: #aaa;
    display:flex;
    font-family: Arial;
    font-size: 1.1em;
    height: 40px;
    justify-content: center;
    left: 0;
    opacity: 0.9;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  `;
  infoDiv.innerHTML = `Open ECSY devtools to connect to this page using the code:&nbsp;<b style="color: #fff">${remoteId}</b>&nbsp;<button onClick="generateNewCode()">Generate new code</button>`;
  document.body.appendChild(infoDiv);
  return infoDiv;
}

function enableRemoteDevtools(remoteId) {
  if (!_Utils.hasWindow) {
    console.warn("Remote devtools not available outside the browser");
    return;
  }

  window.generateNewCode = () => {
    window.localStorage.clear();
    remoteId = (0, _utils.generateId)(6);
    window.localStorage.setItem("ecsyRemoteId", remoteId);
    window.location.reload(false);
  };

  remoteId = remoteId || window.localStorage.getItem("ecsyRemoteId");

  if (!remoteId) {
    remoteId = (0, _utils.generateId)(6);
    window.localStorage.setItem("ecsyRemoteId", remoteId);
  }

  let infoDiv = includeRemoteIdHTML(remoteId);
  window.__ECSY_REMOTE_DEVTOOLS_INJECTED = true;
  window.__ECSY_REMOTE_DEVTOOLS = {};
  let Version = ""; // This is used to collect the worlds created before the communication is being established

  let worldsBeforeLoading = [];

  let onWorldCreated = e => {
    var world = e.detail.world;
    Version = e.detail.version;
    worldsBeforeLoading.push(world);
  };

  window.addEventListener("ecsy-world-created", onWorldCreated);

  let onLoaded = () => {
    // var peer = new Peer(remoteId);
    var peer = new Peer(remoteId, {
      host: "peerjs.ecsy.io",
      secure: true,
      port: 443,
      config: {
        iceServers: [{
          url: "stun:stun.l.google.com:19302"
        }, {
          url: "stun:stun1.l.google.com:19302"
        }, {
          url: "stun:stun2.l.google.com:19302"
        }, {
          url: "stun:stun3.l.google.com:19302"
        }, {
          url: "stun:stun4.l.google.com:19302"
        }]
      },
      debug: 3
    });
    peer.on("open", () =>
    /* id */
    {
      peer.on("connection", connection => {
        window.__ECSY_REMOTE_DEVTOOLS.connection = connection;
        connection.on("open", function () {
          // infoDiv.style.visibility = "hidden";
          infoDiv.innerHTML = "Connected"; // Receive messages

          connection.on("data", function (data) {
            if (data.type === "init") {
              var script = document.createElement("script");
              script.setAttribute("type", "text/javascript");

              script.onload = () => {
                script.parentNode.removeChild(script); // Once the script is injected we don't need to listen

                window.removeEventListener("ecsy-world-created", onWorldCreated);
                worldsBeforeLoading.forEach(world => {
                  var event = new CustomEvent("ecsy-world-created", {
                    detail: {
                      world: world,
                      version: Version
                    }
                  });
                  window.dispatchEvent(event);
                });
              };

              script.innerHTML = data.script;
              (document.head || document.documentElement).appendChild(script);
              script.onload();
              hookConsoleAndErrors(connection);
            } else if (data.type === "executeScript") {
              let value = eval(data.script);

              if (data.returnEval) {
                connection.send({
                  method: "evalReturn",
                  value: value
                });
              }
            }
          });
        });
      });
    });
  }; // Inject PeerJS script


  (0, _utils.injectScript)("https://cdn.jsdelivr.net/npm/peerjs@0.3.20/dist/peer.min.js", onLoaded);
}

if (_Utils.hasWindow) {
  const urlParams = new URLSearchParams(window.location.search); // @todo Provide a way to disable it if needed

  if (urlParams.has("enable-remote-devtools")) {
    enableRemoteDevtools();
  }
}
},{"./utils.js":"0ab90c70078eddd4601a0cf761df4279","../Utils.js":"eaed502892a74ce35f6ebe97edbf8d55"}],"0ab90c70078eddd4601a0cf761df4279":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateId = generateId;
exports.injectScript = injectScript;

function generateId(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function injectScript(src, onLoad) {
  var script = document.createElement("script"); // @todo Use link to the ecsy-devtools repo?

  script.src = src;
  script.onload = onLoad;
  (document.head || document.documentElement).appendChild(script);
}
},{}],"bc610deadc54a08eda6642f8b91e1a0d":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BallComponent = require("./BallComponent");

Object.keys(_BallComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BallComponent[key];
    }
  });
});

var _CanvasContextComponent = require("./CanvasContextComponent");

Object.keys(_CanvasContextComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _CanvasContextComponent[key];
    }
  });
});

var _CollisionBoxComponent = require("./CollisionBoxComponent");

Object.keys(_CollisionBoxComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _CollisionBoxComponent[key];
    }
  });
});

var _GameStateComponent = require("./GameStateComponent");

Object.keys(_GameStateComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _GameStateComponent[key];
    }
  });
});

var _MovementComponent = require("./MovementComponent");

Object.keys(_MovementComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _MovementComponent[key];
    }
  });
});

var _PaddleComponent = require("./PaddleComponent");

Object.keys(_PaddleComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PaddleComponent[key];
    }
  });
});

var _PositionComponent = require("./PositionComponent");

Object.keys(_PositionComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PositionComponent[key];
    }
  });
});

var _RadiusComponent = require("./RadiusComponent");

Object.keys(_RadiusComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _RadiusComponent[key];
    }
  });
});

var _RenderComponent = require("./RenderComponent");

Object.keys(_RenderComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _RenderComponent[key];
    }
  });
});

var _SizeComponent = require("./SizeComponent");

Object.keys(_SizeComponent).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SizeComponent[key];
    }
  });
});
},{"./BallComponent":"95879f8704174ee2f8eea604dd30974f","./CanvasContextComponent":"2f7388d86e1dfe4ee125444d1faa5dcc","./CollisionBoxComponent":"fc01209c3af5f4f74427b0fad3b5acb9","./GameStateComponent":"1f4e95d780e115914deb38e52f567b34","./MovementComponent":"080707a66a1d8eab770b0a4810258606","./PaddleComponent":"4967f4a07e5725883e957311f1b94757","./PositionComponent":"40338dd4a002c5131d4fe60be491f12f","./RadiusComponent":"1e993f5a6b09bbe1e4d0b514f22dadeb","./RenderComponent":"69d476ab34b7466e669fd112a763f133","./SizeComponent":"4df6879c3d836e9d4cd1b2e3f26a18e5"}],"95879f8704174ee2f8eea604dd30974f":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BallComponent = void 0;

var _ecsy = require("ecsy");

var _types = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BallComponent extends _ecsy.Component {}

exports.BallComponent = BallComponent;

_defineProperty(BallComponent, "schema", {
  initialPosition: {
    type: _types.Vector2Type
  },
  initialVelocity: {
    type: _ecsy.Types.Number
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../types":"5e9a35ee2f801f921f7d42a44841d8f1"}],"5e9a35ee2f801f921f7d42a44841d8f1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PlayerType = require("./PlayerType");

Object.keys(_PlayerType).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PlayerType[key];
    }
  });
});

var _Vector2Type = require("./Vector2Type");

Object.keys(_Vector2Type).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Vector2Type[key];
    }
  });
});
},{"./PlayerType":"e81574eaff8cf34345a1c4958d1c918f","./Vector2Type":"0d144aba2d0394558ce3f8bf75078649"}],"e81574eaff8cf34345a1c4958d1c918f":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerType = exports.Player = void 0;

var _ecsy = require("ecsy");

class Player {
  constructor(element = null, score = 0) {
    this.element = element;
    this.score = score;
  }

  copy(source) {
    this.score = source.score;
    this.element = source.element;
    return this;
  }

  clone() {
    return new Player(this.element, this.score);
  }

}

exports.Player = Player;
const PlayerType = (0, _ecsy.createType)({
  name: "Player",
  default: new Player(),
  copy: _ecsy.copyCopyable,
  clone: _ecsy.cloneClonable
});
exports.PlayerType = PlayerType;
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0"}],"0d144aba2d0394558ce3f8bf75078649":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector2Type = exports.Vector2 = void 0;

var _ecsy = require("ecsy");

class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  copy(source) {
    this.x = source.x;
    this.y = source.y;
    return this;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

}

exports.Vector2 = Vector2;
const Vector2Type = (0, _ecsy.createType)({
  name: "Vector2",
  default: new Vector2(),
  copy: _ecsy.copyCopyable,
  clone: _ecsy.cloneClonable
});
exports.Vector2Type = Vector2Type;
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0"}],"2f7388d86e1dfe4ee125444d1faa5dcc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasContextComponent = void 0;

var _ecsy = require("ecsy");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CanvasContextComponent extends _ecsy.Component {}

exports.CanvasContextComponent = CanvasContextComponent;

_defineProperty(CanvasContextComponent, "schema", {
  ctx: {
    type: _ecsy.Types.Ref
  },
  width: {
    type: _ecsy.Types.Number
  },
  height: {
    type: _ecsy.Types.Number
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0"}],"fc01209c3af5f4f74427b0fad3b5acb9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollisionBoxComponent = void 0;

var _ecsy = require("ecsy");

var _types = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CollisionBoxComponent extends _ecsy.Component {}

exports.CollisionBoxComponent = CollisionBoxComponent;

_defineProperty(CollisionBoxComponent, "schema", {
  box: {
    type: _types.Vector2Type
  },
  wallCollision: {
    type: _types.Vector2Type
  },
  collidingEntities: {
    type: _ecsy.Types.Array
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../types":"5e9a35ee2f801f921f7d42a44841d8f1"}],"1f4e95d780e115914deb38e52f567b34":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameStateComponent = void 0;

var _ecsy = require("ecsy");

var _enums = require("../types/enums");

var _types = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GameStateComponent extends _ecsy.Component {}

exports.GameStateComponent = GameStateComponent;

_defineProperty(GameStateComponent, "schema", {
  state: {
    type: _ecsy.Types.Number,
    default: _enums.GameState.Waiting
  },
  player1: {
    type: _types.PlayerType
  },
  player2: {
    type: _types.PlayerType
  },
  pressedKeyCodes: {
    type: _ecsy.Types.Array
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../types/enums":"d7fd32fb2b1feed90d31d3249297e0e3","../types":"5e9a35ee2f801f921f7d42a44841d8f1"}],"d7fd32fb2b1feed90d31d3249297e0e3":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerSchemeKeys = exports.GameState = void 0;
let GameState;
exports.GameState = GameState;

(function (GameState) {
  GameState[GameState["Waiting"] = 0] = "Waiting";
  GameState[GameState["Running"] = 1] = "Running";
})(GameState || (exports.GameState = GameState = {}));

let PlayerSchemeKeys;
exports.PlayerSchemeKeys = PlayerSchemeKeys;

(function (PlayerSchemeKeys) {
  PlayerSchemeKeys[PlayerSchemeKeys["ArrowUp"] = 38] = "ArrowUp";
  PlayerSchemeKeys[PlayerSchemeKeys["ArrowDown"] = 40] = "ArrowDown";
  PlayerSchemeKeys[PlayerSchemeKeys["W"] = 87] = "W";
  PlayerSchemeKeys[PlayerSchemeKeys["S"] = 83] = "S";
})(PlayerSchemeKeys || (exports.PlayerSchemeKeys = PlayerSchemeKeys = {}));
},{}],"080707a66a1d8eab770b0a4810258606":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovementComponent = void 0;

var _ecsy = require("ecsy");

var _types = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MovementComponent extends _ecsy.Component {}

exports.MovementComponent = MovementComponent;

_defineProperty(MovementComponent, "schema", {
  direction: {
    type: _types.Vector2Type
  },
  velocity: {
    type: _ecsy.Types.Number
  },
  isEnabled: {
    type: _ecsy.Types.Boolean,
    default: true
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../types":"5e9a35ee2f801f921f7d42a44841d8f1"}],"4967f4a07e5725883e957311f1b94757":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaddleComponent = void 0;

var _ecsy = require("ecsy");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PaddleComponent extends _ecsy.Component {}

exports.PaddleComponent = PaddleComponent;

_defineProperty(PaddleComponent, "schema", {
  playerIndex: {
    type: _ecsy.Types.Number
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0"}],"40338dd4a002c5131d4fe60be491f12f":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionComponent = void 0;

var _ecsy = require("ecsy");

var _Vector2Type = require("../types/Vector2Type");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PositionComponent extends _ecsy.Component {}

exports.PositionComponent = PositionComponent;

_defineProperty(PositionComponent, "schema", {
  value: {
    type: _Vector2Type.Vector2Type
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../types/Vector2Type":"0d144aba2d0394558ce3f8bf75078649"}],"1e993f5a6b09bbe1e4d0b514f22dadeb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadiusComponent = void 0;

var _ecsy = require("ecsy");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RadiusComponent extends _ecsy.Component {}

exports.RadiusComponent = RadiusComponent;

_defineProperty(RadiusComponent, "schema", {
  value: {
    type: _ecsy.Types.Number
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0"}],"69d476ab34b7466e669fd112a763f133":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderComponent = void 0;

var _ecsy = require("ecsy");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RenderComponent extends _ecsy.Component {}

exports.RenderComponent = RenderComponent;

_defineProperty(RenderComponent, "schema", {
  primitive: {
    type: _ecsy.Types.String,
    default: "box"
  },
  isEnabled: {
    type: _ecsy.Types.Boolean,
    default: true
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0"}],"4df6879c3d836e9d4cd1b2e3f26a18e5":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SizeComponent = void 0;

var _ecsy = require("ecsy");

var _types = require("../types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class SizeComponent extends _ecsy.Component {}

exports.SizeComponent = SizeComponent;

_defineProperty(SizeComponent, "schema", {
  value: {
    type: _types.Vector2Type
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../types":"5e9a35ee2f801f921f7d42a44841d8f1"}],"8794890f3d3ff0e3e55daa8f63590080":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PongScene = require("./PongScene");

Object.keys(_PongScene).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PongScene[key];
    }
  });
});
},{"./PongScene":"301d1b66b4d9cd046fc421f9a52cd502"}],"301d1b66b4d9cd046fc421f9a52cd502":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PongScene = void 0;

var _prefabs = require("../prefabs");

var _types = require("../types");

var _utils = require("../utils");

class PongScene {
  load(world, canvas) {
    const ballRadius = 10; // Instantiate a circle entity on the middle of the canvas

    this.ball = (0, _prefabs.createBall)(world, new _types.Vector2(canvas.width / 2 - ballRadius, canvas.height / 2 - ballRadius), _utils.Random.getRandomDirection(), 10, 3); // Instantiate paddles

    const paddleSize = new _types.Vector2(20, 120);
    const paddleSpeed = 6;
    const paddleOffset = 10; // Player 1

    this.paddle1 = (0, _prefabs.createPaddle)(world, 0, new _types.Vector2(paddleOffset, canvas.height / 2 - paddleSize.y / 2), new _types.Vector2(), paddleSpeed, paddleSize); // Player 2

    this.paddle2 = (0, _prefabs.createPaddle)(world, 1, new _types.Vector2(canvas.width - paddleSize.x - paddleOffset, canvas.height / 2 - paddleSize.y / 2), new _types.Vector2(), paddleSpeed, paddleSize);
  }

  unload() {
    this.ball.remove();
    this.paddle1.remove();
    this.paddle2.remove();
  }

}

exports.PongScene = PongScene;
},{"../prefabs":"8faaa58b1cd4c3ad86314bd9694a5aeb","../types":"5e9a35ee2f801f921f7d42a44841d8f1","../utils":"5f24944aa7d2b85fc56215858c2e7056"}],"8faaa58b1cd4c3ad86314bd9694a5aeb":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Ball = require("./Ball");

Object.keys(_Ball).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Ball[key];
    }
  });
});

var _Paddle = require("./Paddle");

Object.keys(_Paddle).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Paddle[key];
    }
  });
});
},{"./Ball":"6f0abe1e0437d89e72e0bb3a1662d39b","./Paddle":"ce3d652b0ecb12a1c3093751d3d327a7"}],"6f0abe1e0437d89e72e0bb3a1662d39b":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBall = createBall;

var _components = require("../components");

var _types = require("../types");

function createBall(world, position, direction, radius, velocity) {
  return world.createEntity().addComponent(_components.BallComponent, {
    initialPosition: position,
    initialVelocity: velocity
  }).addComponent(_components.RenderComponent, {
    primitive: "circle"
  }).addComponent(_components.MovementComponent, {
    direction,
    velocity
  }).addComponent(_components.PositionComponent, {
    value: position
  }).addComponent(_components.RadiusComponent, {
    value: radius
  }).addComponent(_components.CollisionBoxComponent, {
    box: new _types.Vector2(radius * 2, radius * 2)
  });
}
},{"../components":"bc610deadc54a08eda6642f8b91e1a0d","../types":"5e9a35ee2f801f921f7d42a44841d8f1"}],"ce3d652b0ecb12a1c3093751d3d327a7":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPaddle = createPaddle;

var _components = require("../components");

function createPaddle(world, playerIndex, position, direction, velocity, size) {
  return world.createEntity().addComponent(_components.PaddleComponent, {
    playerIndex
  }).addComponent(_components.RenderComponent, {
    primitive: "rect"
  }).addComponent(_components.MovementComponent, {
    direction,
    velocity
  }).addComponent(_components.PositionComponent, {
    value: position
  }).addComponent(_components.SizeComponent, {
    value: size
  }).addComponent(_components.CollisionBoxComponent, {
    box: size
  });
}
},{"../components":"bc610deadc54a08eda6642f8b91e1a0d"}],"5f24944aa7d2b85fc56215858c2e7056":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BoxCollision = require("./BoxCollision");

Object.keys(_BoxCollision).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BoxCollision[key];
    }
  });
});

var _Random = require("./Random");

Object.keys(_Random).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _Random[key];
    }
  });
});

var _VectorMath = require("./VectorMath");

Object.keys(_VectorMath).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _VectorMath[key];
    }
  });
});
},{"./BoxCollision":"d66a1d625a67c864bb0c581076e41c42","./Random":"3b6ca754cb6df94668213983e316db17","./VectorMath":"8c1a49eef4c6f1a4a0600d269a9bf9e1"}],"d66a1d625a67c864bb0c581076e41c42":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxCollision = void 0;

class BoxCollision {
  static isColliding(boxA, boxB) {
    return boxA.position.x < boxB.position.x + boxB.dimensions.x && boxA.position.x + boxA.dimensions.x > boxB.position.x && boxA.position.y < boxB.position.y + boxB.dimensions.y && boxA.position.y + boxA.dimensions.y > boxB.position.y;
  }

}

exports.BoxCollision = BoxCollision;
},{}],"3b6ca754cb6df94668213983e316db17":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Random = void 0;

var _types = require("../types");

class Random {
  static getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  static getMinusOrPlusOne() {
    return Random.getRandomArbitrary(0, 1) < 0.5 ? -1 : 1;
  }

  static getRandomDirection() {
    return new _types.Vector2(Random.getMinusOrPlusOne(), Random.getMinusOrPlusOne());
  }

}

exports.Random = Random;
},{"../types":"5e9a35ee2f801f921f7d42a44841d8f1"}],"8c1a49eef4c6f1a4a0600d269a9bf9e1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VectorMath = void 0;

var _types = require("../types");

class VectorMath {
  static add(a, b) {
    return new _types.Vector2(a.x + b.x, a.y + b.y);
  }

  static multiply(a, b) {
    if (b instanceof _types.Vector2) {
      return new _types.Vector2(a.x * b.x, a.y * b.y);
    } else {
      return new _types.Vector2(a.x * b, a.y * b);
    }
  }

}

exports.VectorMath = VectorMath;
},{"../types":"5e9a35ee2f801f921f7d42a44841d8f1"}],"ae881ceed1c2eec2aa441b45d7233cc9":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _BallSystem = require("./BallSystem");

Object.keys(_BallSystem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _BallSystem[key];
    }
  });
});

var _CollisionSystem = require("./CollisionSystem");

Object.keys(_CollisionSystem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _CollisionSystem[key];
    }
  });
});

var _GameSystem = require("./GameSystem");

Object.keys(_GameSystem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _GameSystem[key];
    }
  });
});

var _MovementSystem = require("./MovementSystem");

Object.keys(_MovementSystem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _MovementSystem[key];
    }
  });
});

var _PaddleSystem = require("./PaddleSystem");

Object.keys(_PaddleSystem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _PaddleSystem[key];
    }
  });
});

var _RendererSystem = require("./RendererSystem");

Object.keys(_RendererSystem).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _RendererSystem[key];
    }
  });
});
},{"./BallSystem":"1f029996ae3a148757e7f47a9d8abcf8","./CollisionSystem":"603000d7ef661abab81f8828746c55e1","./GameSystem":"2966c200f0b5fefaa71129fcf5b46589","./MovementSystem":"11bf7ad375d9029eaad09408c3ef6622","./PaddleSystem":"0d7ade6f35e3cd314bb9f79897a6ae58","./RendererSystem":"7492a0598b81b7202e3243a1e7828ebc"}],"1f029996ae3a148757e7f47a9d8abcf8":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BallSystem = void 0;

var _ecsy = require("ecsy");

var _components = require("../components");

var _utils = require("../utils");

var _types = require("../types");

var _enums = require("../types/enums");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class BallSystem extends _ecsy.System {
  execute() {
    const gameStateEntity = this.queries.gameState.results[0];
    const balls = this.queries.balls.results;
    const gameState = gameStateEntity.getMutableComponent(_components.GameStateComponent);
    balls.forEach(entity => {
      // Get entity components
      const {
        wallCollision,
        collidingEntities
      } = entity.getComponent(_components.CollisionBoxComponent);
      const radius = entity.getComponent(_components.RadiusComponent);
      const position = entity.getMutableComponent(_components.PositionComponent);
      const movement = entity.getMutableComponent(_components.MovementComponent);

      if (wallCollision.y !== 0) {
        movement.direction.y = -movement.direction.y;
        movement.velocity += 0.2;
        position.value.y = position.value.y + radius.value / 2 * movement.direction.y;
      }

      if (wallCollision.x !== 0) {
        const {
          initialPosition,
          initialVelocity
        } = entity.getComponent(_components.BallComponent);
        position.value = initialPosition;
        movement.velocity = initialVelocity;
        movement.direction = new _types.Vector2(movement.direction.x, _utils.Random.getMinusOrPlusOne());
        gameState[wallCollision.x == 1 ? "player1" : "player2"].score++;
        gameState.state = _enums.GameState.Waiting;
      }

      if (collidingEntities.length) {
        movement.direction.x = -movement.direction.x;
        position.value.x = position.value.x + radius.value / 2 * movement.direction.x;
      }
    });
  }

}

exports.BallSystem = BallSystem;

_defineProperty(BallSystem, "queries", {
  gameState: {
    components: [_components.GameStateComponent]
  },
  balls: {
    components: [_components.BallComponent]
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../components":"bc610deadc54a08eda6642f8b91e1a0d","../utils":"5f24944aa7d2b85fc56215858c2e7056","../types":"5e9a35ee2f801f921f7d42a44841d8f1","../types/enums":"d7fd32fb2b1feed90d31d3249297e0e3"}],"603000d7ef661abab81f8828746c55e1":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollisionSystem = void 0;

var _ecsy = require("ecsy");

var _components = require("../components");

var _utils = require("../utils");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CollisionSystem extends _ecsy.System {
  execute() {
    const canvasEntity = this.queries.canvas.results[0];
    const collidables = this.queries.collidables.results; // Get canvas dimensions

    const canvas = canvasEntity.getComponent(_components.CanvasContextComponent);
    collidables.forEach(entity => {
      // Get entity components
      const collider = entity.getMutableComponent(_components.CollisionBoxComponent);
      const position = entity.getMutableComponent(_components.PositionComponent); // Clear collisions from past frame

      collider.collidingEntities = []; // Check collision against stage Y

      if (position.value.y > canvas.height - collider.box.y) {
        collider.wallCollision.y = 1;
      } else if (position.value.y < 0) {
        collider.wallCollision.y = -1;
      } else {
        collider.wallCollision.y = 0;
      } // Check collision against stage X


      if (position.value.x > canvas.width - collider.box.x) {
        collider.wallCollision.x = 1;
      } else if (position.value.x < 0) {
        collider.wallCollision.x = -1;
      } else {
        collider.wallCollision.x = 0;
      } // Check collision between entities


      collidables.filter(b => b.id != entity.id).forEach(b => {
        const bCollision = b.getComponent(_components.CollisionBoxComponent);
        const bPosition = b.getComponent(_components.PositionComponent);

        if (_utils.BoxCollision.isColliding({
          dimensions: collider.box,
          position: position.value
        }, {
          dimensions: bCollision.box,
          position: bPosition.value
        })) {
          collider.collidingEntities.push(b);
        }
      });
    });
  }

}

exports.CollisionSystem = CollisionSystem;

_defineProperty(CollisionSystem, "queries", {
  canvas: {
    components: [_components.CanvasContextComponent]
  },
  collidables: {
    components: [_components.CollisionBoxComponent]
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../components":"bc610deadc54a08eda6642f8b91e1a0d","../utils":"5f24944aa7d2b85fc56215858c2e7056"}],"2966c200f0b5fefaa71129fcf5b46589":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameSystem = void 0;

var _ecsy = require("ecsy");

var _components = require("../components");

var _enums = require("../types/enums");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GameSystem extends _ecsy.System {
  execute() {
    const addedEntity = this.queries.gameState.added[0];

    if (addedEntity) {
      const {
        player1,
        player2
      } = addedEntity.getMutableComponent(_components.GameStateComponent);
      player1.element = document.querySelector('[data-player="1"]');
      player2.element = document.querySelector('[data-player="2"]');
      return;
    }

    const entity = this.queries.gameState.results[0];
    const gameState = entity.getMutableComponent(_components.GameStateComponent);
    const stateSystems = {
      [_enums.GameState.Waiting]: this.waitingState,
      [_enums.GameState.Running]: this.runningState,
      [_enums.GameState.Paused]: this.pausedState
    };
    stateSystems[gameState.state](gameState);
  }

  waitingState(gameState) {
    const {
      player1,
      player2
    } = gameState;
    player1.element.innerText = `${player1.score}`;
    player2.element.innerText = `${player2.score}`;
    const playerSchemeKeys = [_enums.PlayerSchemeKeys.ArrowUp, _enums.PlayerSchemeKeys.ArrowDown, _enums.PlayerSchemeKeys.W, _enums.PlayerSchemeKeys.S];

    if (playerSchemeKeys.some(keyCode => gameState.pressedKeyCodes.includes(keyCode))) {
      gameState.state = _enums.GameState.Running;
    }
  }

  runningState(gameState) {}

  pausedState(gameState) {}

}

exports.GameSystem = GameSystem;

_defineProperty(GameSystem, "queries", {
  gameState: {
    components: [_components.GameStateComponent],
    listen: {
      added: true
    }
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../components":"bc610deadc54a08eda6642f8b91e1a0d","../types/enums":"d7fd32fb2b1feed90d31d3249297e0e3"}],"11bf7ad375d9029eaad09408c3ef6622":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovementSystem = void 0;

var _ecsy = require("ecsy");

var _components = require("../components");

var _utils = require("../utils");

var _enums = require("../types/enums");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class MovementSystem extends _ecsy.System {
  execute() {
    const gameStateEntity = this.queries.gameState.results[0];
    const movables = this.queries.movable.results;
    const gameState = gameStateEntity.getComponent(_components.GameStateComponent); // If gamestate is not Running, skip movement logic

    if (gameState.state != _enums.GameState.Running) return;
    movables.forEach(entity => {
      // Get entity movement and position components
      const movement = entity.getMutableComponent(_components.MovementComponent);
      const position = entity.getMutableComponent(_components.PositionComponent); // If entity movement is not enabled, skip this

      if (!movement.isEnabled) return;

      let appliedMovement = _utils.VectorMath.multiply(movement.direction, movement.velocity);

      position.value = _utils.VectorMath.add(position.value, appliedMovement);
    });
  }

}

exports.MovementSystem = MovementSystem;

_defineProperty(MovementSystem, "queries", {
  gameState: {
    components: [_components.GameStateComponent]
  },
  movable: {
    components: [_components.MovementComponent, _components.PositionComponent]
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../components":"bc610deadc54a08eda6642f8b91e1a0d","../utils":"5f24944aa7d2b85fc56215858c2e7056","../types/enums":"d7fd32fb2b1feed90d31d3249297e0e3"}],"0d7ade6f35e3cd314bb9f79897a6ae58":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaddleSystem = void 0;

var _ecsy = require("ecsy");

var _components = require("../components");

var _enums = require("../types/enums");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PaddleSystem extends _ecsy.System {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "playersControlSchemes", {
      0: {
        up: _enums.PlayerSchemeKeys.W,
        down: _enums.PlayerSchemeKeys.S
      },
      1: {
        up: _enums.PlayerSchemeKeys.ArrowUp,
        down: _enums.PlayerSchemeKeys.ArrowDown
      }
    });
  }

  execute() {
    const paddles = this.queries.paddles.results;
    const gameStateEntity = this.queries.gameState.results[0];
    const gameState = gameStateEntity.getComponent(_components.GameStateComponent);
    paddles.forEach(entity => {
      // Get entity components
      const paddle = entity.getComponent(_components.PaddleComponent);
      const movement = entity.getMutableComponent(_components.MovementComponent);
      const collision = entity.getComponent(_components.CollisionBoxComponent); // Get control scheme according to player index

      const paddleControlScheme = this.playersControlSchemes[paddle.playerIndex]; // Reset movement to 0;

      movement.direction.y = 0; // Check for up/down movement

      if (gameState.pressedKeyCodes.includes(paddleControlScheme.up) && collision.wallCollision.y != -1) movement.direction.y -= 1;
      if (gameState.pressedKeyCodes.includes(paddleControlScheme.down) && collision.wallCollision.y != 1) movement.direction.y += 1;
    });
  }

}

exports.PaddleSystem = PaddleSystem;

_defineProperty(PaddleSystem, "queries", {
  paddles: {
    components: [_components.PaddleComponent]
  },
  gameState: {
    components: [_components.GameStateComponent]
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../components":"bc610deadc54a08eda6642f8b91e1a0d","../types/enums":"d7fd32fb2b1feed90d31d3249297e0e3"}],"7492a0598b81b7202e3243a1e7828ebc":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RendererSystem = void 0;

var _ecsy = require("ecsy");

var _components = require("../components");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class RendererSystem extends _ecsy.System {
  execute() {
    const canvas = this.queries.canvas.results[0];
    const {
      ctx,
      width: canvasWidth,
      height: canvasHeight
    } = canvas.getComponent(_components.CanvasContextComponent);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Draw a line and a circle on the middle of the canvas,
    // because I couldn't be bothered to make a system for that!

    ctx.strokeStyle = "gray";
    ctx.fillStyle = "gray";
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvasWidth / 2, canvasHeight / 2, 10, 0, 2 * Math.PI, false);
    ctx.fill();
    this.queries.renderables.results.forEach(entity => {
      const {
        primitive,
        isEnabled
      } = entity.getComponent(_components.RenderComponent); // If not enabled, skip render

      if (!isEnabled) return;
      const renderFunctions = {
        rect: this.renderRect,
        circle: this.renderCircle
      };

      if (renderFunctions[primitive]) {
        renderFunctions[primitive](ctx, entity);
      } else {
        console.log(`${primitive} primitive does not implement a render function`);
      }
    });
  }

  renderRect(ctx, entity) {
    const position = entity.getComponent(_components.PositionComponent);
    const size = entity.getComponent(_components.SizeComponent);
    ctx.beginPath();
    ctx.rect(position.value.x, position.value.y, size.value.x, size.value.y);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  renderCircle(ctx, entity) {
    const position = entity.getComponent(_components.PositionComponent);
    const radius = entity.getComponent(_components.RadiusComponent);
    ctx.beginPath();
    ctx.arc(position.value.x + radius.value, position.value.y + radius.value, radius.value, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
  }

}

exports.RendererSystem = RendererSystem;

_defineProperty(RendererSystem, "queries", {
  canvas: {
    components: [_components.CanvasContextComponent]
  },
  renderables: {
    components: [_components.RenderComponent]
  }
});
},{"ecsy":"322d3b240f66735bb9b56aa9d97788a0","../components":"bc610deadc54a08eda6642f8b91e1a0d"}]},{},["41671e6ffbb618e7e29ef6b38e78fb96","7843b3960e086726267ff606847fc92b"], null)

//# sourceMappingURL=pong-ecsy.0efdb850.js.map
