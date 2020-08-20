class SceneGameObjects {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static objects = [];
  static players = [];

  static setup()
  {
  }

  static createPlayers()
  {
    if(false)
    {
      var spawnY = 0;
      do {
        spawnY += 1;
      } while (TileMap.tiles[`-1:${spawnY+1}`]);

      var player = new Player();
      player.generateSkin();
      this.addObject(player);
      this.players.push(player);

      player.taskWarpToTile(-1, spawnY);

      player.taskWalkToTile(-1, 1);

      player.taskGoToTile(0, 0);

      return
    }


    var player = new Player();
    player.generateSkin();
    this.addObject(player);
    this.players.push(player);

    player.taskWarpToTile(4, 4);
    player.taskPlayAnim("Eat_iso_diagonal_back", true);

    for (var i = 0; i < 15; i++) {
      var player = new Player();
      player.generateSkin();
      player.container.position.set(-500, 0);

      this.addObject(player);

      this.players.push(player);

      RandomPlayerAction.startForPlayer(player);
    }
  }

  static addObject(object)
  {
    this.objects.push(object);
    this.viewport.container.addChild(object.container);
  }

  static removeObject(object)
  {
    this.objects.splice(this.objects.indexOf(object), 1);
    this.viewport.container.removeChild(object.container);
  }

  static tick(delta)
  {

    this.viewport.container.children.sort((itemA, itemB) => {
      return (itemA.displayY ? itemA.displayY : itemA.position.y) - (itemB.displayY ? itemB.displayY : itemB.position.y);
    });

    for (var object of this.objects) {
      if(object.update) {
        object.update(delta);
      }

    }
  }

  static destroy()
  {
  }
}
