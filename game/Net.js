class Net {
  static socket;
  static server_address = "http://localhost:3000";

  static connect(callback)
  {
    this.socket = io(this.server_address);
    this.socket.on("connect", function() {
      callback();
    })
  }

  static emit(id, data, callback)
  {
    this.socket.emit("data", {id: id, data: data}, callback);
  }
}
