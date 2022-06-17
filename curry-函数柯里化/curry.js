// js函数柯里化
function curry(func) {
    return function curried(...args) {
      if(args.length >= func.length) {
        return func.apply(this, args);
      }else {
        return function(...args2) {
          // 递归调用，拼接参数
          return curried.apply(this, [...args, ...args2]);
        }
      }
    }
  }
  
  function sum(a, b, c) {
    return a + b + c;
  }
  
  let curriedSum = curry(sum);
  
  const {log} = console;
  log(curriedSum(1, 2, 3)); // 6，仍然可以被正常调用
  log(curriedSum(1)(2, 3)); // 6，对第一个参数的柯里化
  log(curriedSum(1)(2)(3)); // 6，全柯里化
  