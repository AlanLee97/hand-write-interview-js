Function.prototype.myCall = function(context = window, ...args) {
    context.fn = this;
    let res = context.fn(...args);
    delete context;
    return res;
}

// demo
function logName(age, gender) {
    console.log({
        name: this.name, age, gender
    });
}

let Person = {
    name: 'Alan'
}
logName.myCall(Person, 25, 'male');

