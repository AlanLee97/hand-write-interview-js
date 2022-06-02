Function.prototype.myBind = function(context = window, args = []) {
    context.fn = this;
    let res = context.fn(...args);
    delete context.fn;
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
logName.myBind(Person, [25, 'male']);