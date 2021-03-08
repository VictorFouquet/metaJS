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
      this[key] = val;
      return this;
    },
    enumerable: false
  })
}

function LRUCache(capacity, init) {
  // Defines properties that should be ignored when caching
  const propsToIgnore = ['stack', 'capacity', 'cache', 'delete', 'size'];
  
  // Helper that prevents from having doubles inside the LRU stack.
  function removeDoubles(target, prop) { 
    let idx = target.stack.indexOf(prop);
    if (idx !== -1) target.stack.splice(idx, 1);
  }
  
  defineCacheProperties(capacity, init);
  
  Reflect.defineProperty(init, 'delete', {
    value: function(a) {
      if (
        Object.keys(this).includes(a) && 
        !propsToIgnore.filter(prop=>prop!='size').includes(a)
      ) {
        this.stack.splice(this.stack.indexOf(a), 1)
        delete this[a];
        this.size = this.size-1;
      }
      return !propsToIgnore.includes(a);
    }, enumerable: false}
  )
  
  return new Proxy(init, {
    get: function(target, prop) {
      if (!propsToIgnore.includes(prop) && target[prop]) {
        removeDoubles(target, prop);
        target.stack.push(prop);
      }
      return target[prop]
    },
    set: function(target, prop, val) {
      if (prop == 'capacity') {
        target.capacity = val;
        while (target.size > target.capacity) {
          delete target[target.stack.shift()];
          target.size --;
        }
      } else if (prop == 'size') {
        target.size = val;
      } else if (!propsToIgnore.includes(prop)) {
        removeDoubles(target, prop);
        target.stack.push(prop)
        if (target.size >= target.capacity && !target[prop]) {
          delete target[target.stack.shift()];
          target.size --;
        }
        if (!target[prop]) target.size++;
        target[prop] = val
      }
    }
  })
}

lru = new LRUCache(3, {a:0})
lru.b = 5
lru.c = 11
console.log(lru.capacity, lru.a, lru.b, lru.stack)
lru.d = 5
console.log(lru.stack)
console.log(lru.c)