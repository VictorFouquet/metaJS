/*
            +----------------------------------------+
            |                                        |
            |      JAVASCRIPT   STRONG   TYPING      |
            |                                        |
            +----------------------------------------+


    Goal -> Implement a strong typing in JS.

        Prototype, Proxys, and Reflects objects will be used
        to secure the instantiations and set operations
        on custom objects.

    Documentation:

        Prototype:
            https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/Object_prototypes
        
        Proxy:
            https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        
        Reflect:
            https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Reflect
        
*/


const hasUnexpectedType = function(argument, expected) {
    /**
     * Verifies if an argument type corresponds to the expected one.
     * @param {argument} any
     * @param {expected} String
     */
    
    // Retrieves argument's constructor name. 
    const argumentType = Reflect.get(
        argument.constructor, 'name'
    );
    
    // As 'typeFunction' will by default be a custom 
    // typed function's constructor name, ensures that
    // the checking is performed on the actual function name.
    return (
        argumentType != expected && 
        Reflect.has(argument, 'funcName') &&
        Reflect.get(argument, 'funcName') != expected
    )
}


const typeHandler = function() {
    /** Implements strong typing for a function's props. */

    // Ensures a set operation will not change the type
    // of a function's prop
    return {
        set: function(target, prop, value) {
            const thisPropType = Reflect.get(target[prop].constructor, 'name');
            if (hasUnexpectedType(value, thisPropType)) {
                throw new Error(
                    `Type Error : trying to change a  [ ${thisPropType} ]`+
                    `to a [ ${valueType} ]`
                )
            }
            target[prop] = value
        }
    }
}


const typeFunction = function() {
    /** Makes function a typed function. */

    // Sets custom typed function's name.
    Reflect.defineProperty(this, 'functionName', 
        { value: arguments[0] }
    )
    delete arguments[0];

    // Ensures function gets correctly instantiated.
    Object.values(arguments).forEach((arg, idx) => {
        // For debugging purposes, stores the given argument's type.
        const constructorName = Reflect.get(
            arg.val.constructor, 'name'
        );

        // Ensures enough arguments where given.
        if (arg.val == undefined) throw new Error('Missing arguments')

        // Ensures each argument has the expected type.
        if ( hasUnexpectedType(arg.val, arg.type) ) {
            throw new Error(`Wrong type for argv[${idx}] : `+
            `Expected ${arg.type}, got ${constructorName}`)
        }

        // Makes functions properties undeletable.
        Reflect.defineProperty(this, arg.name, {
            value: arg.val, writable: true, enumerable: true
        });
    })

    // Returns a proxy that handles set operations.
    return new Proxy(this, typeHandler())
}


const secureFunction = function(func, name, ...props) {
    /**
     * Wrapper that secures a function instantiation and set operations.
     * @param {func}  Function
     * @param {name}  String
     * @param {props} Objects
     */
    try {
        Reflect.setPrototypeOf(func, new typeFunction(
            name, ...props
        ))
    } catch(error) {
        throw error
    }
}


const Point = function(x, y) {
    /**
     * Creates a strongly typed Point object.
     * @param {x} Number
     * @param {y} Number
     */

    secureFunction(this, 'Point',
        {type:'Number', val:x, name:'x'},
        {type:'Number', val:y, name:'y'}
    )

    Reflect.defineProperty(this, 'distanceTo', {
        // Computes euclidean distance between this instance
        // and another Point instance.
        value: function(otherPoint) {
            return Math.sqrt(
                (this.x - otherPoint.x)**2 + (this.y - otherPoint.y)**2
            )
        }
    })
}


const Line = function(pointA, pointB) {
    /**
     * Creates a strongly typed Line object.
     * @param {pointA} Point
     * @param {pointB} Point
     */

    secureFunction(this, 'Line',
        {type:'Point', val:pointA, name:'pointA'},
        {type:'Point', val:pointB, name:'pointB'}
    )

    Reflect.defineProperty(this, 'length', {
        // Uses a setter to dynamically compute the 
        // instance's length between its starting and end points.
        get: function() {
            return this.pointA.distanceTo(pointB)
        }
    })
}


let pointA = new Point(0,0);
let pointB = new Point(1,1);
console.log(pointA.distanceTo(pointB))

pointB.x = 2;
pointB.y = 2;
console.log(pointA.distanceTo(pointB))

let line = new Line(pointA, pointB)
line.pointA = new Point(1, 1)
console.log(line.length)