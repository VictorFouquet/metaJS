  //`````````````````````````````````//
 //     Playing with proxies !!     //
//_________________________________//


/* 

Goal --> Implement strong typing when instantiating an object
         or setting its properties, and dynamic behaviour 
         when performing get actions on it.

Documentation found here :
https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy
Inspiration tutorial found here :
https://www.youtube.com/watch?v=gZ4MCb2nlfQ&t=384s

*/


function handleArgvErrors(constructorName, argv, length, typeArg, callback) {
  /**
   * Verifies that an argument list does corresponds to what a function expects.
   * @param {constructorName} string
   * @param {argv}            array
   * @param {length}          number
   * @param {typeArg}         string
   * @param {callback}        function
   */
  
  // Ensures enough arguments where given
  if (argv.length < length) {
    
    throw new Error(
      `${constructorName} object needs at least ${length} coordinates`
    )

  // Ensures all arguments have the right typing.
  } else if (
    Object.values(argv)
    .map(callback).includes(false)
  ) {

    throw new Error(
      `${constructorName}'s coordinates should only be of type ${typeArg}` 
    )

  }
}


let isPoint = function(point) {
  /**
   * Ensures an object is a Point object.
   * @param {point} PointObject
   */
  return Reflect.get(point.constructor, 'name') == 'Point'
}


let Point = function(x, y) {
  /**
   * Creates a 2d Point object.
   * @param {x} number
   * @param {y} number 
   */
  // Callback checks if an argument actually is a number
  let argvTypeCheckingCallback = arg => typeof arg == 'number';

  // Handles arguments errors
  try {
    handleArgvErrors(
      'Point', arguments, 2, 'number', argvTypeCheckingCallback
    )
  } catch (error) {
    console.log(error.message);
    return undefined;
  }

  // Defines point's coordinates.
  Reflect.defineProperty(this, "x", { value:x, writable:true, enumerable:true });
  Reflect.defineProperty(this, "y", { value:y, writable:true, enumerable:true });
  
  // Defines function to calculate euclidean distance to another point.
  Reflect.defineProperty(
    this,
    'getDistance',
    {
      value: function(otherPoint) {
        if (!isPoint(otherPoint)) {
          throw new Error('distance can only be calculated between 2 points.')
        }
        return Math.sqrt(
          (this.x - otherPoint.x)**2 + (this.y - otherPoint.y)**2
        )
      }
    }
  )

  // Returns a proxy to ensure a coordinate type cannot be changed.
  return new Proxy (this, {
    set: function(target, prop, value) {
      if (typeof value !== 'number') {
        throw new Error('coordinate must be of type "number"');
      }
      target[prop] = value;
    }
  })
}


let Line = function(pointA, pointB) {
  /**
   * Creates a Line object.
   * @param {pointA} PointObject
   * @param {pointB} PointObject 
   */

  // Callback that checks if an argument actually is a point
  let argvTypeCheckingCallback = arg => isPoint(arg)

  // Handles arguments errors
  try {
    handleArgvErrors(
      'Line', arguments, 2, 'Point', argvTypeCheckingCallback
    );
  } catch (error) {
    console.log(error)
    console.log(error.message);
    return undefined;
  }

  // Defines line's start and end points.
  Reflect.defineProperty(
    this,
    'pointA',
    { value: pointA, writable: true }
  )
  Reflect.defineProperty(
    this,
    'pointB',
    { value: pointB, writable: true }
  )
  
 
  return new Proxy(this, {
    get: function(target, prop) {
      // Length is dynamically computed.
      if (prop == 'length') {
        return target.pointA.getDistance(target.pointB);
      } else if (['pointA','pointB'].includes(prop)) {
          return target[prop];
      }
      return undefined;
    },
    set: function(target, prop, value) {
      if (
        ['pointA','pointB'].includes(prop) &&
        Reflect.get(value.constructor, 'name') == 'Point'
      ) {
        target[prop] = value
      }      
    }
  })
}
