  //`````````````````````````````````//
 //    Playing with reflection !!   //
//_________________________________//

// Documentation found here :
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Reflect
// Base tutorial found here :
// https://www.youtube.com/watch?v=X7qXJRU6qyM


// Defines a user with several properties.
// The sayHello function returns the user
// so that functions can further be chained.
let user = {
    name: 'Jon',
    id: 1,
    sayHello: function (str='') {
        console.log(
            `Hello my name is ${this.name}. I'm ${str}a new user !`
        )
        return this;
    }
}

// Here a some basic methods that can be called
// to interact with an object's properties :

// Gives all the properties owned my object user
console.log(
    "User properties :",
    Reflect.ownKeys(user)
)

// Gets the value of a property owned by an object
console.log(
    "User id :",
    Reflect.get(user, 'id')
)

// Sets the value of a property owned by an object
console.log(
    "User id has been updated ?",
    Reflect.set(user, 'id', 2)
)

// Gets the value of a property owned by an object
console.log(
    "Updated user id :",
    Reflect.get(user, 'id')
)

// Checks if an object owns a given property
console.log(
    "Has user a name ?",
    Reflect.has(user, 'name')
)

// Calls a function owned as property by a given object
// and fed with an argument
console.log("User, please introduce yourself !")
Reflect.apply(user.sayHello, user, ['definitely ']);

// Defines a new property for a given object
// Last argument is an objectProperty, with assignable properties
// [value, enumerable, configurable, writable, get, set]
// For more details about these arguments, visit
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
Reflect.defineProperty(user, 'age', { value: 17, enumerable: false, writable: true })
console.log(
    "Now user has an age property with value",
    Reflect.get(user, 'age')
)



  //-----------------------------//
 //    Here comes the fun !!    //
//-----------------------------//



// Let's set a property with a custom getter function.
// When property will be accessed, the value it returns will
// depend on the value of another property :
Reflect.defineProperty(user, 'is_adult', { 
    get: function() { 
        return Reflect.get(this, 'age') > 17 
    }
})
// Note that as this property has been defined as a getter, even though
// a function is called, the parenthesis aren't needed, both 2
// syntaxes around the OR gate will produce the same result.
console.log(
    "\nIs user adult ?",
    Reflect.get(user, 'is_adult') || user.is_adult
);

// Defines properties property holding functions (returning "this"
// allows to chain function owned by user)
Reflect.defineProperty(user, 'grow', { 
    value: function() {
        console.log("I'm getting older!");
        this.age++;
        return this 
    } 
});

Reflect.defineProperty(user, 'howOldAreYou', { 
    value: function() { 
        console.log(`I'm ${this.age} years old!`);
        return this
    }
})

// Calls the function that will make user grow by one year.
Reflect.apply(user.grow, user, []);

console.log(
    "Is now user adult after having grown ??", 
    Reflect.get(user, 'is_adult'),
    '\n\n'
)


// And for the fun of chaining functions..!
user.sayHello('no longer ').howOldAreYou().grow().howOldAreYou();
