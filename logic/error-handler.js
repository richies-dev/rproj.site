// Used to store and retrieve bugs and errors
class ErrorHandler {

  constructor() {
    this.msgs = [];
  }

  add(msg){
    this.msgs.push(msg);
  }

  isEmpty(){
    return this.msgs.length <= 0;
  }

  get messages(){
    return this.msgs;
  }
  

}

exports.ErrorHandler = ErrorHandler;