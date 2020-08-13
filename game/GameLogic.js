

GameLogic = class {
  static userData = {};
  static gameData;

  static createNewGame()
  {
    this.userData.money = 2500;
    this.userData.tiles = {};
    this.userData.inventory = [];
    this.userData.objects = 0;

    for (var x = 0; x < 8; x++) {
      for (var y = 0; y < 8; y++) {
        this.createTile(x, y);
        this.addObjectToTile(TILE_ITEM.FLOOR_0, x, y);

        if(Math.random() > 0.7) {
          this.addObjectToTile(TILE_ITEM.COOKER_0, x, y);
        }

      }
    }
  }

  static addObjectToTile(id, x, y)
  {
    var object = GameLogic.gameData.tileObjects[id];

    var tile = this.userData.tiles[`${x}:${y}`];


    if(object.type == TILE_ITEM_TYPE.FLOOR) {
      tile.floor = id;
    } else {
      var data = {rotation: 0, cooking: Math.round(Math.random()*60), startedAt: Date.now()};

      tile.objects.push({id: id, data: data, uniqueid: this.userData.objects});
    }

    Events.trigger("UPDATE_TILE", {x: x, y: y});

    this.userData.objects++;
  }

  static createTile( x, y)
  {
    if(!this.userData.tiles[`${x}:${y}`]) {
      this.userData.tiles[`${x}:${y}`] = {
        floor: null,
        objects: []
      };
    }
  }

  static setupGame()
  {
    return

    for (var tile in this.userData.tiles) {
      var x = parseInt(tile.split(":")[0]);
      var y = parseInt(tile.split(":")[1]);

      Events.trigger("UPDATE_TILE", {x: x, y: y, data: this.userData.tiles[tile]} );
    }
  }


}
