// Defines properties that should be ignored when caching
const PROPS_TO_IGNORE = ['stack', 'capacity', 'cache', 'delete', 'size'];

function defineCacheProperties(capacity, init) {
  /**
   * Defines cache's properties.
   * @param {capacity} number
   * @param {init}     object
   */

  // Defines cache's 'capacity' property
  Reflect.defineProperty(init, 'capacity', {
    value: capacity,
    enumerable: false,
    writable: true
  });
  // Defines cache's 'size' property
  Reflect.defineProperty(init, 'size', {
    value: Object.keys(init).length,
    enumerable: false,
    writable: true
  });
  // Defines cache's 'stack' property for LRU tracking
  Reflect.defineProperty(init, 'stack', {
    value: [],
    enumerable: false
  })
  // Defines cache's 'cache' property, the function called
  // to further define a new property into the cache.
  Reflect.defineProperty(init, 'cache', {
    value: function(key, val) {
      Reflect.set(this, key, val);
      return this;
    },
    enumerable: false
  })
  Reflect.defineProperty(init, 'delete', {
    value: function(key) {
      return Reflect.deleteProperty(this, key);
    }, enumerable: false}
  )
}

function removeDoubles(target, prop) {
  /**
   * Prevents cache's stack to store doubles.
   * @param {target} object
   * @param {prop}   string
   */
  // Finds index of the prop to remove in stack.
  let idx = target.stack.indexOf(prop);
  // Removes item from stack if it's yet stored.
  if (idx !== -1) target.stack.splice(idx, 1);
}

function updateLRUStack(target, prop) {
  /**
   * Keeps track of least recently used prop.
   * @param {target} object
   * @param {prop}   string
   */
  // Removes doubles from stack then pushes used prop.
  if (target[prop]) removeDoubles(target, prop);
  target.stack.push(prop);
}

function getHandler(target, prop) {
  /**
   * Handles get queries.
   * @param {target} object
   * @param {prop}   string
   */
  if (!PROPS_TO_IGNORE.includes(prop)) {
    // Updates least recently used stack.
    updateLRUStack(target, prop)
  }
  return target[prop]
}

function setHandler(target, prop, val) {
  /**
   * Handles set queries.
   * @param {target} object
   * @param {prop}   string
   * @param {val}    integer
   */
  if (prop == 'capacity') {
    // When setting capacity, delete overflowing props
    // according to new cache's capacity.
    target[prop] = val;
    while (target.size >= target.capacity) {
      delete target[target.stack.shift()]
      target.size --;
    }

  } else if (!PROPS_TO_IGNORE.includes(prop)) {
    updateLRUStack(target, prop)
    // Unshift prop from stack and deletes prop if cache is full.
    if (target.size >= target.capacity && !target[prop]) {
      delete target[target.stack.shift()];
      target.size --;
    }
    // Increases cache's size and store the prop its value.
    if (!target[prop]) target.size++;
    target[prop] = val
  }
}

function deleteHandler(target, prop) {
  /**
   * Handles delete queries.
   * @param {target} object
   * @param {prop}   string
   */
  if (!PROPS_TO_IGNORE.includes(prop)) {
    // Removes prop from cache's stack.
    target.stack.splice(
      target.stack.indexOf(prop), 1
    );
    // Decreases cache's size and delete prop.
    if (Reflect.has(target, prop)) target.size --;
    return Reflect.deleteProperty(target, prop);
  }
}

function LRUCache(capacity, init) {
  /**
   * @param {capacity} number
   * @param {init}     object
   */
  defineCacheProperties(capacity, init);
  // Handles cache's intercation with a proxy.
  return new Proxy(init, {
    get: function(target, prop) { 
      return getHandler(target, prop) 
    },
    set: function(target, prop, val) { 
      return setHandler(target, prop, val) 
    },
    deleteProperty: function(target, prop) { 
      return deleteHandler(target, prop)
    }
  })
}
