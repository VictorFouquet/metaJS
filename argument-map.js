function createArgumentMap(f) {
    // creates an argument map and return it
    let fToS = f.toString();
    let [i, j] = [fToS.indexOf('(') + 1, fToS.indexOf(')')]
    let fArgs = fToS.slice(i, j).split(',').filter(arg=>arg);

    return fArgs.reduce((acc, val, i) => { acc[val] = arguments[i+1]; return acc }, {})
}

var ft1= createArgumentMap(function(){});
console.log(Object.keys(ft1).length == 0)
var ft2 = createArgumentMap(function(a1){},'a1 argvalue');
console.log(ft2['a1'] === 'a1 argvalue')