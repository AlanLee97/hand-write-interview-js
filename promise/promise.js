const PENDING = 'pending';
const FULLFILLED = 'fullfilled';
const REJECTED = 'rejected';

function MyPromise(executor) {
    let that = this;
    that.status = PENDING;
    that.state = undefined;
    that.callbackQueue = [];

    function resolve(value) {
        if(that.status !== PENDING) return;
        that.status = FULLFILLED;
        that.state = value;

        if(that.callbackQueue.length > 0) {
            that.callbackQueue.forEach(item => {
                setTimeout(() => {
                    item.onResolved(value);
                })
            })
        }
    }

    function reject(value) {
        if(that.status !== PENDING) return;
        that.status = REJECTED;
        that.state = value;

        if(that.callbackQueue.length > 0) {
            that.callbackQueue.forEach(item => {
                item.onRejected(value);
            })
        }
    }

    try {
        executor(resolve, reject)
    } catch(err) {
        reject(err)
    }
}

MyPromise.prototype.then = function(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : value => value;

    let that = this;

    return new MyPromise((resolve, reject) => {

        function handler(callback) {
            try {
                const result = callback(that.state)
                if(result instanceof MyPromise) {
                    result.then(res => resolve(res), reason => reject(reason))
                }else {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        }
        if(that.status === PENDING) {
            that.callbackQueue.push({
                onResolved(value) {
                    handler(onResolved)
                },
                onRejected(reason) {
                    handler(onRejected)
                }
            })
        }else if(that.status === FULLFILLED) {
            setTimeout(() => {
                handler(onResolved);
            });
        }else {
            setTimeout(() => {
                handler(onRejected);
            });
        }
    })
}

MyPromise.prototype.catch = function(onRejected) {
    return this.then(undefined, onRejected);
}

let promise = new MyPromise((resolve, reject) => {
    console.log('new MyPromise');
    reject(123);
})

promise.then(res => {
    console.log('promise then', res);
}).catch(err => {
    console.log('promise catch', err);
})