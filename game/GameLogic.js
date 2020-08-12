GameLogic = class {
  static userData = {};
  static gameData;

  static createNewGame()
  {
    this.userData.money = 3500;
    this.userData.floor = {};

    for (var x = 0; x < 5; x++) {
      for (var y = 0; y < 8; y++) {
        this.setFloor(x, y, Math.round(Math.random()));
      }
    }
  }

  static setFloor(x, y, id)
  {
    this.userData.floor[`${x}:${y}`] = {id: id, info: {}};

    var data = this.userData.floor[`${x}:${y}`];

    Events.trigger("UPDATE_TILE", {x: x, y: y, data: data} );
  }

  static setupGame()
  {
    for (var tile in this.userData.floor) {
      var x = parseInt(tile.split(":")[0]);
      var y = parseInt(tile.split(":")[1]);

      Events.trigger("UPDATE_TILE", {x: x, y: y, data: this.userData.floor[tile]} );
    }
  }
}
