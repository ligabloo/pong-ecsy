// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
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
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/ecsy/src/Utils.js":[function(require,module,exports) {
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
},{}],"../node_modules/ecsy/src/SystemManager.js":[function(require,module,exports) {
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
},{"./Utils.js":"../node_modules/ecsy/src/Utils.js"}],"../node_modules/ecsy/src/ObjectPool.js":[function(require,module,exports) {
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
},{}],"../node_modules/ecsy/src/EventDispatcher.js":[function(require,module,exports) {
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
},{}],"../node_modules/ecsy/src/Query.js":[function(require,module,exports) {
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
},{"./EventDispatcher.js":"../node_modules/ecsy/src/EventDispatcher.js","./Utils.js":"../node_modules/ecsy/src/Utils.js"}],"../node_modules/ecsy/src/QueryManager.js":[function(require,module,exports) {
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
},{"./Query.js":"../node_modules/ecsy/src/Query.js","./Utils.js":"../node_modules/ecsy/src/Utils.js"}],"../node_modules/ecsy/src/Component.js":[function(require,module,exports) {
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
},{}],"../node_modules/ecsy/src/SystemStateComponent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SystemStateComponent = void 0;

var _Component = require("./Component");

class SystemStateComponent extends _Component.Component {}

exports.SystemStateComponent = SystemStateComponent;
SystemStateComponent.isSystemStateComponent = true;
},{"./Component":"../node_modules/ecsy/src/Component.js"}],"../node_modules/ecsy/src/EntityManager.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EntityManager = void 0;

var _ObjectPool = require("./ObjectPool.js");

var _QueryManager = _interopRequireDefault(require("./QueryManager.js"));

var _EventDispatcher = _interopRequireDefault(require("./EventDispatcher.js"));

var _SystemStateComponent = require("./SystemStateComponent.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
},{"./ObjectPool.js":"../node_modules/ecsy/src/ObjectPool.js","./QueryManager.js":"../node_modules/ecsy/src/QueryManager.js","./EventDispatcher.js":"../node_modules/ecsy/src/EventDispatcher.js","./SystemStateComponent.js":"../node_modules/ecsy/src/SystemStateComponent.js"}],"../node_modules/ecsy/src/ComponentManager.js":[function(require,module,exports) {
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
},{"./ObjectPool.js":"../node_modules/ecsy/src/ObjectPool.js"}],"../node_modules/ecsy/src/Version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Version = void 0;
const Version = "0.3.1";
exports.Version = Version;
},{}],"../node_modules/ecsy/src/WrapImmutableComponent.js":[function(require,module,exports) {
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
},{}],"../node_modules/ecsy/src/Entity.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Entity = void 0;

var _Query = _interopRequireDefault(require("./Query.js"));

var _WrapImmutableComponent = _interopRequireDefault(require("./WrapImmutableComponent.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
},{"./Query.js":"../node_modules/ecsy/src/Query.js","./WrapImmutableComponent.js":"../node_modules/ecsy/src/WrapImmutableComponent.js"}],"../node_modules/ecsy/src/World.js":[function(require,module,exports) {
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
},{"./SystemManager.js":"../node_modules/ecsy/src/SystemManager.js","./EntityManager.js":"../node_modules/ecsy/src/EntityManager.js","./ComponentManager.js":"../node_modules/ecsy/src/ComponentManager.js","./Version.js":"../node_modules/ecsy/src/Version.js","./Utils.js":"../node_modules/ecsy/src/Utils.js","./Entity.js":"../node_modules/ecsy/src/Entity.js"}],"../node_modules/ecsy/src/System.js":[function(require,module,exports) {
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
},{"./Query.js":"../node_modules/ecsy/src/Query.js","./Utils.js":"../node_modules/ecsy/src/Utils.js"}],"../node_modules/ecsy/src/TagComponent.js":[function(require,module,exports) {
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
},{"./Component":"../node_modules/ecsy/src/Component.js"}],"../node_modules/ecsy/src/Types.js":[function(require,module,exports) {
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
},{}],"../node_modules/ecsy/src/RemoteDevTools/utils.js":[function(require,module,exports) {
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
},{}],"../node_modules/ecsy/src/RemoteDevTools/index.js":[function(require,module,exports) {
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
},{"./utils.js":"../node_modules/ecsy/src/RemoteDevTools/utils.js","../Utils.js":"../node_modules/ecsy/src/Utils.js"}],"../node_modules/ecsy/src/index.js":[function(require,module,exports) {
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
},{"./World.js":"../node_modules/ecsy/src/World.js","./System.js":"../node_modules/ecsy/src/System.js","./Component.js":"../node_modules/ecsy/src/Component.js","./SystemStateComponent.js":"../node_modules/ecsy/src/SystemStateComponent.js","./TagComponent.js":"../node_modules/ecsy/src/TagComponent.js","./ObjectPool.js":"../node_modules/ecsy/src/ObjectPool.js","./Types.js":"../node_modules/ecsy/src/Types.js","./Version.js":"../node_modules/ecsy/src/Version.js","./RemoteDevTools/index.js":"../node_modules/ecsy/src/RemoteDevTools/index.js","./Entity.js":"../node_modules/ecsy/src/Entity.js"}],"components/BallComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BallComponent = void 0;

var ecsy_1 = require("ecsy");

var BallComponent =
/** @class */
function (_super) {
  __extends(BallComponent, _super);

  function BallComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return BallComponent;
}(ecsy_1.TagComponent);

exports.BallComponent = BallComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js"}],"components/CanvasContextComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CanvasContextComponent = void 0;

var ecsy_1 = require("ecsy");

var CanvasContextComponent =
/** @class */
function (_super) {
  __extends(CanvasContextComponent, _super);

  function CanvasContextComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  CanvasContextComponent.schema = {
    ctx: {
      type: ecsy_1.Types.Ref
    },
    width: {
      type: ecsy_1.Types.Number
    },
    height: {
      type: ecsy_1.Types.Number
    }
  };
  return CanvasContextComponent;
}(ecsy_1.Component);

exports.CanvasContextComponent = CanvasContextComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js"}],"types/Vector2Type.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector2Type = exports.Vector2 = void 0;

var ecsy_1 = require("ecsy");

var Vector2 =
/** @class */
function () {
  function Vector2(x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    this.x = x;
    this.y = y;
  }

  Vector2.prototype.set = function (x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  Vector2.prototype.copy = function (source) {
    this.x = source.x;
    this.y = source.y;
    return this;
  };

  Vector2.prototype.clone = function () {
    return new Vector2().set(this.x, this.y);
  };

  return Vector2;
}();

exports.Vector2 = Vector2;
exports.Vector2Type = ecsy_1.createType({
  name: "Vector2",
  default: new Vector2(),
  copy: ecsy_1.copyCopyable,
  clone: ecsy_1.cloneClonable
});
},{"ecsy":"../node_modules/ecsy/src/index.js"}],"components/CollidableComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollidableComponent = void 0;

var ecsy_1 = require("ecsy");

var Vector2Type_1 = require("../types/Vector2Type");

var CollidableComponent =
/** @class */
function (_super) {
  __extends(CollidableComponent, _super);

  function CollidableComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  CollidableComponent.schema = {
    box: {
      type: Vector2Type_1.Vector2Type
    },
    wallCollision: {
      type: Vector2Type_1.Vector2Type
    },
    collidingEntities: {
      type: ecsy_1.Types.Array
    }
  };
  return CollidableComponent;
}(ecsy_1.Component);

exports.CollidableComponent = CollidableComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js","../types/Vector2Type":"types/Vector2Type.ts"}],"components/GameStateComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameStateComponent = void 0;

var ecsy_1 = require("ecsy");

var GameStateComponent =
/** @class */
function (_super) {
  __extends(GameStateComponent, _super);

  function GameStateComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  GameStateComponent.schema = {
    player1Points: {
      type: ecsy_1.Types.Number
    },
    player2Points: {
      type: ecsy_1.Types.Number
    },
    pressedKeyCodes: {
      type: ecsy_1.Types.Array
    }
  };
  return GameStateComponent;
}(ecsy_1.Component);

exports.GameStateComponent = GameStateComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js"}],"components/MovementComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovementComponent = void 0;

var ecsy_1 = require("ecsy");

var Vector2Type_1 = require("../types/Vector2Type");

var MovementComponent =
/** @class */
function (_super) {
  __extends(MovementComponent, _super);

  function MovementComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MovementComponent.schema = {
    direction: {
      type: Vector2Type_1.Vector2Type
    },
    velocity: {
      type: ecsy_1.Types.Number
    },
    isEnabled: {
      type: ecsy_1.Types.Boolean,
      default: true
    }
  };
  return MovementComponent;
}(ecsy_1.Component);

exports.MovementComponent = MovementComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js","../types/Vector2Type":"types/Vector2Type.ts"}],"components/PaddleComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaddleComponent = void 0;

var ecsy_1 = require("ecsy");

var PaddleComponent =
/** @class */
function (_super) {
  __extends(PaddleComponent, _super);

  function PaddleComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  PaddleComponent.schema = {
    playerIndex: {
      type: ecsy_1.Types.Number
    }
  };
  return PaddleComponent;
}(ecsy_1.Component);

exports.PaddleComponent = PaddleComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js"}],"components/PositionComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PositionComponent = void 0;

var ecsy_1 = require("ecsy");

var Vector2Type_1 = require("../types/Vector2Type");

var PositionComponent =
/** @class */
function (_super) {
  __extends(PositionComponent, _super);

  function PositionComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  PositionComponent.schema = {
    value: {
      type: Vector2Type_1.Vector2Type
    }
  };
  return PositionComponent;
}(ecsy_1.Component);

exports.PositionComponent = PositionComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js","../types/Vector2Type":"types/Vector2Type.ts"}],"components/RadiusComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadiusComponent = void 0;

var ecsy_1 = require("ecsy");

var RadiusComponent =
/** @class */
function (_super) {
  __extends(RadiusComponent, _super);

  function RadiusComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  RadiusComponent.schema = {
    value: {
      type: ecsy_1.Types.Number
    }
  };
  return RadiusComponent;
}(ecsy_1.Component);

exports.RadiusComponent = RadiusComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js"}],"components/RenderComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderComponent = void 0;

var ecsy_1 = require("ecsy");

var RenderComponent =
/** @class */
function (_super) {
  __extends(RenderComponent, _super);

  function RenderComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  RenderComponent.schema = {
    primitive: {
      type: ecsy_1.Types.String,
      default: "box"
    },
    isEnabled: {
      type: ecsy_1.Types.Boolean,
      default: true
    }
  };
  return RenderComponent;
}(ecsy_1.Component);

exports.RenderComponent = RenderComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js"}],"components/SizeComponent.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SizeComponent = void 0;

var ecsy_1 = require("ecsy");

var Vector2Type_1 = require("../types/Vector2Type");

var SizeComponent =
/** @class */
function (_super) {
  __extends(SizeComponent, _super);

  function SizeComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  SizeComponent.schema = {
    value: {
      type: Vector2Type_1.Vector2Type
    }
  };
  return SizeComponent;
}(ecsy_1.Component);

exports.SizeComponent = SizeComponent;
},{"ecsy":"../node_modules/ecsy/src/index.js","../types/Vector2Type":"types/Vector2Type.ts"}],"components/index.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__exportStar(require("./BallComponent"), exports);

__exportStar(require("./CanvasContextComponent"), exports);

__exportStar(require("./CollidableComponent"), exports);

__exportStar(require("./GameStateComponent"), exports);

__exportStar(require("./MovementComponent"), exports);

__exportStar(require("./PaddleComponent"), exports);

__exportStar(require("./PositionComponent"), exports);

__exportStar(require("./RadiusComponent"), exports);

__exportStar(require("./RenderComponent"), exports);

__exportStar(require("./SizeComponent"), exports);
},{"./BallComponent":"components/BallComponent.ts","./CanvasContextComponent":"components/CanvasContextComponent.ts","./CollidableComponent":"components/CollidableComponent.ts","./GameStateComponent":"components/GameStateComponent.ts","./MovementComponent":"components/MovementComponent.ts","./PaddleComponent":"components/PaddleComponent.ts","./PositionComponent":"components/PositionComponent.ts","./RadiusComponent":"components/RadiusComponent.ts","./RenderComponent":"components/RenderComponent.ts","./SizeComponent":"components/SizeComponent.ts"}],"prefabs/Ball.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBall = void 0;

var components_1 = require("../components");

var Vector2Type_1 = require("../types/Vector2Type");

function createBall(world, position, direction, radius, velocity) {
  return world.createEntity().addComponent(components_1.BallComponent).addComponent(components_1.RenderComponent, {
    primitive: "circle"
  }).addComponent(components_1.MovementComponent, {
    direction: direction,
    velocity: velocity
  }).addComponent(components_1.PositionComponent, {
    value: position
  }).addComponent(components_1.RadiusComponent, {
    value: radius
  }).addComponent(components_1.CollidableComponent, {
    box: new Vector2Type_1.Vector2(10, 10)
  });
}

exports.createBall = createBall;
},{"../components":"components/index.ts","../types/Vector2Type":"types/Vector2Type.ts"}],"prefabs/Paddle.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPaddle = void 0;

var components_1 = require("../components");

function createPaddle(world, playerIndex, position, direction, velocity, size) {
  return world.createEntity().addComponent(components_1.PaddleComponent, {
    playerIndex: playerIndex
  }).addComponent(components_1.RenderComponent, {
    primitive: "rect"
  }).addComponent(components_1.MovementComponent, {
    direction: direction,
    velocity: velocity
  }).addComponent(components_1.PositionComponent, {
    value: position
  }).addComponent(components_1.SizeComponent, {
    value: size
  }).addComponent(components_1.CollidableComponent, {
    box: size
  });
}

exports.createPaddle = createPaddle;
},{"../components":"components/index.ts"}],"prefabs/index.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__exportStar(require("./Ball"), exports);

__exportStar(require("./Paddle"), exports);
},{"./Ball":"prefabs/Ball.ts","./Paddle":"prefabs/Paddle.ts"}],"utils/BoxCollision.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoxCollision = void 0;

var BoxCollision =
/** @class */
function () {
  function BoxCollision() {}

  BoxCollision.isColliding = function (boxA, boxB) {
    return boxA.position.x < boxB.position.x + boxB.dimensions.x && boxA.position.x + boxA.dimensions.x > boxB.position.x && boxA.position.y < boxB.position.y + boxB.dimensions.y && boxA.position.y + boxA.dimensions.y > boxB.position.y;
  };

  return BoxCollision;
}();

exports.BoxCollision = BoxCollision;
},{}],"utils/Random.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Random = void 0;

var Vector2Type_1 = require("../types/Vector2Type");

var Random =
/** @class */
function () {
  function Random() {}

  Random.getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min;
  };

  Random.getMinusOrPlusOne = function () {
    return Random.getRandomArbitrary(0, 1) < 0.5 ? -1 : 1;
  };

  Random.getRandomDirection = function () {
    return new Vector2Type_1.Vector2(Random.getMinusOrPlusOne(), Random.getMinusOrPlusOne());
  };

  return Random;
}();

exports.Random = Random;
},{"../types/Vector2Type":"types/Vector2Type.ts"}],"utils/VectorMath.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VectorMath = void 0;

var Vector2Type_1 = require("../types/Vector2Type");

var VectorMath =
/** @class */
function () {
  function VectorMath() {}

  VectorMath.add = function (a, b) {
    return new Vector2Type_1.Vector2(a.x + b.x, a.y + b.y);
  };

  VectorMath.multiply = function (a, b) {
    if (b instanceof Vector2Type_1.Vector2) {
      return new Vector2Type_1.Vector2(a.x * b.x, a.y * b.y);
    } else {
      return new Vector2Type_1.Vector2(a.x * b, a.y * b);
    }
  };

  return VectorMath;
}();

exports.VectorMath = VectorMath;
},{"../types/Vector2Type":"types/Vector2Type.ts"}],"utils/index.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__exportStar(require("./BoxCollision"), exports);

__exportStar(require("./Random"), exports);

__exportStar(require("./VectorMath"), exports);
},{"./BoxCollision":"utils/BoxCollision.ts","./Random":"utils/Random.ts","./VectorMath":"utils/VectorMath.ts"}],"scenes/PongScene.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PongScene = void 0;

var prefabs_1 = require("../prefabs");

var Vector2Type_1 = require("../types/Vector2Type");

var utils_1 = require("../utils");

var PongScene =
/** @class */
function () {
  function PongScene() {}

  PongScene.prototype.load = function (world, canvas) {
    // Instantiate a circle entity on the middle of the canvas
    this.ball = prefabs_1.createBall(world, new Vector2Type_1.Vector2(canvas.width / 2, canvas.height / 2), utils_1.Random.getRandomDirection(), 10, 2); // Instantiate paddles

    var paddleSize = new Vector2Type_1.Vector2(20, 120);
    var paddleSpeed = 5;
    var paddleOffset = 10; // Player 1

    this.paddle1 = prefabs_1.createPaddle(world, 0, new Vector2Type_1.Vector2(paddleOffset, canvas.height / 2 - paddleSize.y / 2), new Vector2Type_1.Vector2(), paddleSpeed, paddleSize, paddleOffset); // Player 2

    this.paddle2 = prefabs_1.createPaddle(world, 1, new Vector2Type_1.Vector2(canvas.width - paddleSize.x - paddleOffset, canvas.height / 2 - paddleSize.y / 2), new Vector2Type_1.Vector2(), paddleSpeed, paddleSize, paddleOffset);
  };

  PongScene.prototype.unload = function () {
    this.ball.remove();
    this.paddle1.remove();
    this.paddle2.remove();
  };

  return PongScene;
}();

exports.PongScene = PongScene;
},{"../prefabs":"prefabs/index.ts","../types/Vector2Type":"types/Vector2Type.ts","../utils":"utils/index.ts"}],"scenes/index.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__exportStar(require("./PongScene"), exports);
},{"./PongScene":"scenes/PongScene.ts"}],"systems/BallSystem.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BallSystem = void 0;

var ecsy_1 = require("ecsy");

var components_1 = require("../components");

var BallSystem =
/** @class */
function (_super) {
  __extends(BallSystem, _super);

  function BallSystem() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  BallSystem.prototype.execute = function () {
    var balls = this.queries.balls.results;
    balls.forEach(function (entity) {
      // Get entity components
      var collision = entity.getComponent(components_1.CollidableComponent);
      var radius = entity.getComponent(components_1.RadiusComponent);
      var position = entity.getMutableComponent(components_1.PositionComponent);
      var movement = entity.getMutableComponent(components_1.MovementComponent);

      if (collision.wallCollision.y !== 0) {
        movement.direction.y = -movement.direction.y;
        movement.velocity += 0.1;
        position.value.y = position.value.y + radius.value / 2 * movement.direction.y;
      }

      if (collision.wallCollision.x !== 0) {
        movement.direction.x = -movement.direction.x;
        position.value.x = position.value.x + radius.value * movement.direction.x;
      }

      if (collision.collidingEntities.length) {
        movement.direction.x = -movement.direction.x;
        position.value.x + radius.value * movement.direction.x;
      }
    });
  };

  BallSystem.queries = {
    balls: {
      components: [components_1.BallComponent]
    }
  };
  return BallSystem;
}(ecsy_1.System);

exports.BallSystem = BallSystem;
},{"ecsy":"../node_modules/ecsy/src/index.js","../components":"components/index.ts"}],"systems/CollisionSystem.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollisionSystem = void 0;

var ecsy_1 = require("ecsy");

var components_1 = require("../components");

var utils_1 = require("../utils");

var CollisionSystem =
/** @class */
function (_super) {
  __extends(CollisionSystem, _super);

  function CollisionSystem() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  CollisionSystem.prototype.execute = function () {
    var canvasEntity = this.queries.canvas.results[0];
    var collidables = this.queries.collidables.results; // Get canvas dimensions

    var canvas = canvasEntity.getComponent(components_1.CanvasContextComponent);
    collidables.forEach(function (a) {
      // Get entity components
      var aCollision = a.getMutableComponent(components_1.CollidableComponent);
      var aPosition = a.getMutableComponent(components_1.PositionComponent); // Clear collisions from past frame

      aCollision.collidingEntities = []; // Check collision against stage Y

      if (aPosition.value.y > canvas.height - aCollision.box.y) {
        aCollision.wallCollision.y = 1;
      } else if (aPosition.value.y < 0) {
        aCollision.wallCollision.y = -1;
      } else {
        aCollision.wallCollision.y = 0;
      } // Check collision against stage X


      if (aPosition.value.x > canvas.width - aCollision.box.x) {
        aCollision.wallCollision.x = 1;
      } else if (aPosition.value.x < 0 + aCollision.box.x) {
        aCollision.wallCollision.x = -1;
      } else {
        aCollision.wallCollision.x = 0;
      } // Check collision between entities


      collidables.filter(function (b) {
        return b.id != a.id;
      }).forEach(function (b) {
        var bCollision = b.getComponent(components_1.CollidableComponent);
        var bPosition = b.getComponent(components_1.PositionComponent);

        if (utils_1.BoxCollision.isColliding({
          dimensions: aCollision.box,
          position: aPosition.value
        }, {
          dimensions: bCollision.box,
          position: bPosition.value
        })) {
          aCollision.collidingEntities.push(b);
        }
      });
    });
  };

  CollisionSystem.queries = {
    canvas: {
      components: [components_1.CanvasContextComponent]
    },
    collidables: {
      components: [components_1.CollidableComponent]
    }
  };
  return CollisionSystem;
}(ecsy_1.System);

exports.CollisionSystem = CollisionSystem;
},{"ecsy":"../node_modules/ecsy/src/index.js","../components":"components/index.ts","../utils":"utils/index.ts"}],"systems/MovementSystem.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MovementSystem = void 0;

var ecsy_1 = require("ecsy");

var components_1 = require("../components");

var utils_1 = require("../utils");

var MovementSystem =
/** @class */
function (_super) {
  __extends(MovementSystem, _super);

  function MovementSystem() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  MovementSystem.prototype.execute = function () {
    var movables = this.queries.movable.results;
    movables.forEach(function (entity) {
      // Get entity movement and position components
      var movement = entity.getMutableComponent(components_1.MovementComponent);
      var position = entity.getMutableComponent(components_1.PositionComponent); // If entity movement is not enabled, skip this

      if (!movement.isEnabled) return;
      var appliedMovement = utils_1.VectorMath.multiply(movement.direction, movement.velocity);
      position.value = utils_1.VectorMath.add(position.value, appliedMovement);
    });
  };

  MovementSystem.queries = {
    movable: {
      components: [components_1.MovementComponent, components_1.PositionComponent]
    }
  };
  return MovementSystem;
}(ecsy_1.System);

exports.MovementSystem = MovementSystem;
},{"ecsy":"../node_modules/ecsy/src/index.js","../components":"components/index.ts","../utils":"utils/index.ts"}],"systems/PaddleSystem.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaddleSystem = void 0;

var ecsy_1 = require("ecsy");

var components_1 = require("../components");

var PaddleSystem =
/** @class */
function (_super) {
  __extends(PaddleSystem, _super);

  function PaddleSystem() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.playersControlSchemes = {
      0: {
        up: 87,
        down: 83
      },
      1: {
        up: 38,
        down: 40
      }
    };
    return _this;
  }

  PaddleSystem.prototype.execute = function () {
    var _this = this;

    var paddles = this.queries.paddles.results;
    var gameStateEntity = this.queries.gameState.results[0];
    var gameState = gameStateEntity.getComponent(components_1.GameStateComponent);
    paddles.forEach(function (entity) {
      // Get entity components
      var paddle = entity.getComponent(components_1.PaddleComponent);
      var movement = entity.getMutableComponent(components_1.MovementComponent);
      var collision = entity.getComponent(components_1.CollidableComponent); // Get control scheme according to player index

      var paddleControlScheme = _this.playersControlSchemes[paddle.playerIndex]; // Reset movement to 0;

      movement.direction.y = 0; // Check for up/down movement

      if (gameState.pressedKeyCodes.includes(paddleControlScheme.up) && collision.wallCollision.y != -1) movement.direction.y -= 1;
      if (gameState.pressedKeyCodes.includes(paddleControlScheme.down) && collision.wallCollision.y != 1) movement.direction.y += 1;
    });
  };

  PaddleSystem.queries = {
    paddles: {
      components: [components_1.PaddleComponent]
    },
    gameState: {
      components: [components_1.GameStateComponent]
    }
  };
  return PaddleSystem;
}(ecsy_1.System);

exports.PaddleSystem = PaddleSystem;
},{"ecsy":"../node_modules/ecsy/src/index.js","../components":"components/index.ts"}],"systems/RendererSystem.ts":[function(require,module,exports) {
"use strict";

var __extends = this && this.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RendererSystem = void 0;

var ecsy_1 = require("ecsy");

var components_1 = require("../components");

var RendererSystem =
/** @class */
function (_super) {
  __extends(RendererSystem, _super);

  function RendererSystem() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  RendererSystem.prototype.execute = function () {
    var _this = this;

    var canvas = this.queries.canvas.results[0];

    var _a = canvas.getComponent(components_1.CanvasContextComponent),
        ctx = _a.ctx,
        canvasWidth = _a.width,
        canvasHeight = _a.height;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    this.queries.renderables.results.forEach(function (entity) {
      var _a = entity.getComponent(components_1.RenderComponent),
          primitive = _a.primitive,
          isEnabled = _a.isEnabled; // If not enabled, skip render


      if (!isEnabled) return;
      var renderFunctions = {
        rect: _this.renderRect,
        circle: _this.renderCircle
      };

      if (renderFunctions[primitive]) {
        renderFunctions[primitive](ctx, entity);
      } else {
        console.log(primitive + " primitive does not implement a render function");
      }
    });
  };

  RendererSystem.prototype.renderRect = function (ctx, entity) {
    var position = entity.getComponent(components_1.PositionComponent);
    var size = entity.getComponent(components_1.SizeComponent);
    ctx.beginPath();
    ctx.rect(position.value.x, position.value.y, size.value.x, size.value.y);
    ctx.fillStyle = "white";
    ctx.fill();
  };

  RendererSystem.prototype.renderCircle = function (ctx, entity) {
    var position = entity.getComponent(components_1.PositionComponent);
    var radius = entity.getComponent(components_1.RadiusComponent);
    ctx.beginPath();
    ctx.arc(position.value.x, position.value.y, radius.value, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
  };

  RendererSystem.queries = {
    canvas: {
      components: [components_1.CanvasContextComponent]
    },
    renderables: {
      components: [components_1.RenderComponent]
    }
  };
  return RendererSystem;
}(ecsy_1.System);

exports.RendererSystem = RendererSystem;
},{"ecsy":"../node_modules/ecsy/src/index.js","../components":"components/index.ts"}],"systems/index.ts":[function(require,module,exports) {
"use strict";

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function get() {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) {
    if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
  }
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

__exportStar(require("./BallSystem"), exports);

__exportStar(require("./CollisionSystem"), exports);

__exportStar(require("./MovementSystem"), exports);

__exportStar(require("./PaddleSystem"), exports);

__exportStar(require("./RendererSystem"), exports);
},{"./BallSystem":"systems/BallSystem.ts","./CollisionSystem":"systems/CollisionSystem.ts","./MovementSystem":"systems/MovementSystem.ts","./PaddleSystem":"systems/PaddleSystem.ts","./RendererSystem":"systems/RendererSystem.ts"}],"index.ts":[function(require,module,exports) {
"use strict";

var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
    s += arguments[i].length;
  }

  for (var r = Array(s), k = 0, i = 0; i < il; i++) {
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
      r[k] = a[j];
    }
  }

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.world = void 0;

var ecsy_1 = require("ecsy");

var components_1 = require("./components");

var scenes_1 = require("./scenes");

var systems_1 = require("./systems"); // Instantiate ECSY world


exports.world = new ecsy_1.World(); // Register ECSY components

exports.world.registerComponent(components_1.BallComponent).registerComponent(components_1.CanvasContextComponent).registerComponent(components_1.CollidableComponent).registerComponent(components_1.GameStateComponent).registerComponent(components_1.MovementComponent).registerComponent(components_1.PositionComponent).registerComponent(components_1.PaddleComponent).registerComponent(components_1.RadiusComponent).registerComponent(components_1.RenderComponent).registerComponent(components_1.SizeComponent).registerSystem(systems_1.CollisionSystem).registerSystem(systems_1.RendererSystem).registerSystem(systems_1.BallSystem).registerSystem(systems_1.PaddleSystem).registerSystem(systems_1.MovementSystem); // Initialize our GameState singleton

var gameStateEntity = exports.world.createEntity().addComponent(components_1.GameStateComponent);
var gameState = gameStateEntity.getMutableComponent(components_1.GameStateComponent); // Get a reference to our canvas HTML element

var canvas = document.getElementById("game"); // Create CanvasContext singleton entity and provide it the canvas context and dimensions

exports.world.createEntity().addComponent(components_1.CanvasContextComponent, {
  ctx: canvas.getContext("2d"),
  width: canvas.width,
  height: canvas.height
}); // Load our game scene into the world

var pongScene = new scenes_1.PongScene();
pongScene.load(exports.world, canvas); // Monitor for keyboard events

window.addEventListener("keydown", function (e) {
  gameState.pressedKeyCodes = __spreadArrays(gameState.pressedKeyCodes, [e.keyCode]);
}, false);
window.addEventListener("keyup", function (e) {
  gameState.pressedKeyCodes = gameState.pressedKeyCodes.filter(function (keyCode) {
    return keyCode !== e.keyCode;
  });
}, false); // Implement and execute game loop

function update() {
  exports.world.execute();
  requestAnimationFrame(update);
}

update();
},{"ecsy":"../node_modules/ecsy/src/index.js","./components":"components/index.ts","./scenes":"scenes/index.ts","./systems":"systems/index.ts"}],"../node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
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
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65025" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
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
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
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

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
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
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel/src/builtins/hmr-runtime.js","index.ts"], null)
//# sourceMappingURL=/src.77de5100.js.map