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
    for (var i = 0; i < 15; i++) {
      var player = new Player();

      player.warpToTile(0, 0);

      this.testPlayer(player);

      this.addObject(player);

      this.players.push(player);
    }


  }

  static testPlayer(player)
  {
    setInterval(() => {
      if(player.tasks.length == 0)
      {
        player.goToTile(Math.getRandomInt(0, TileMap.mapSize.max_x), Math.getRandomInt(0, TileMap.mapSize.max_y));

      }
    }, 1500)
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
