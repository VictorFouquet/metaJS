  //`````````````````````````````````//
 //    Playing with reflection !!   //
//_________________________________//

// Documentation found here :
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Reflect
// Base tutorial found here :
// https://www.youtube.com/watch?v=X7qXJRU6qyM


// Defines a user with several properties.
// The sayHello function returns the user object
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


// Defines a new property for a given object
// Last argument is an objectProperty, with assignable properties being:
// [value, enumerable, configurable, writable, get, set]
// For more details about these arguments, visit
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
Reflect.defineProperty(user, 'age', { value: 17, enumerable: false, writable: true })
console.log(
    "Now user has an age property with value",
    Reflect.get(user, 'age')
)

// Sets a property with a custom getter function.
// When property will be accessed, the value it returns will
// depend on the value of another property :
Reflect.defineProperty(user, 'is_adult', { 
    get: function() { 
        return Reflect.get(this, 'age') > 17 
    }
})

// Note that as this property has been defined as a getter, even though
// a function is called, the parenthesis shouldn't be applied,
// both 2 syntaxes around the OR gate will produce the same result.
console.log(
    "\nIs user adult ?",
    Reflect.get(user, 'is_adult') || user.is_adult
);

// Defines 2 properties holding a function (returning "this"
// allows to chain user-owned functions)
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
// User's age should have been updated.
console.log(
    "Is now user adult after having grown up ??", 
    Reflect.get(user, 'is_adult'),
    '\n\n'
)


// And.. for the fun of chaining functions..!
user.sayHello('no longer ').howOldAreYou().grow().howOldAreYou();
