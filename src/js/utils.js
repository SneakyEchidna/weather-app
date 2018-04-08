function debounce(func, ms) {
  let state = 0;
  let funcArguments;
  let funcThis;
  function wrapper() {
    if (state) {
      funcArguments = arguments;
      funcThis = this;
      return;
    }
    func.apply(this, arguments);
    state = 1;
    setTimeout(function() {
      state = 0;
      if (funcThis) {
        wrapper.apply(funcThis, funcArguments);
        funcArguments = funcThis = null;
      }
    }, ms);
  }
  return wrapper;
}

export { debounce };
