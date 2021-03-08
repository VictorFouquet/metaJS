function LRUCache(capacity, init) {
  
    const propsToIgnore = ['uses', 'capacity', 'cache', 'delete', 'size'];
    
    function removeDoubles(target, prop) { 
      let idx = target.uses.indexOf(prop);
      if (idx !== -1) target.uses.splice(idx, 1);
    }
    
    let f = {...init,}
    
    Reflect.defineProperty(f, 'capacity', {value: capacity, enumerable: false, writable: true})
    Reflect.defineProperty(f, 'size', {value: Object.keys(init).length, enumerable: false, writable: true})
    Reflect.defineProperty(f, 'uses', {value: [], enumerable: false})
    Reflect.defineProperty(f, 'cache', {
      value: function(a,b) {
        this[a] = b;
        return this;
      }, enumerable: false}
    )
    Reflect.defineProperty(f, 'delete', {
      value: function(a) {
        if (
          Object.keys(this).includes(a) && 
          !propsToIgnore.filter(prop=>prop!='size').includes(a)
        ) {
          this.uses.splice(this.uses.indexOf(a), 1)
          delete this[a];
          this.size = this.size-1;
        }
        return !propsToIgnore.includes(a);
      }, enumerable: false}
    )
    
    return new Proxy(f, {
      get: function(target, prop) {
        if (!propsToIgnore.includes(prop) && target[prop]) {
          removeDoubles(target, prop);
          target.uses.push(prop);
        }
        return target[prop]
      },
      set: function(target, prop, val) {
        if (prop == 'capacity') {
          target.capacity = val;
          while (target.size > target.capacity) {
            delete target[target.uses.shift()];
            target.size --;
          }
        } else if (prop == 'size') {
          target.size = val;
        } else if (!propsToIgnore.includes(prop)) {
          removeDoubles(target, prop);
          target.uses.push(prop)
          if (target.size >= target.capacity && !target[prop]) {
            delete target[target.uses.shift()];
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
console.log(lru.capacity, lru.a, lru.b, lru.uses)
lru.d = 5
console.log(lru.uses)
console.log(lru.c)