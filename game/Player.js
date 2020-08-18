class AnimControl
{
  constructor()
  {
    this.currentAnim;
    this.frameIndex;
    this.animFrame;
    this.loop;
    this.elapsedTime;
    this.animations = {};
    this.stopAnimations();
  }

  update(delta)
  {
    this.elapsedTime += delta;
    if(this.currentAnim)
    {
      var animInfo = this.animations[this.currentAnim];
      if(this.elapsedTime > animInfo.speed) {
        this.elapsedTime = 0;
        this.frameIndex++;
      }
      if(this.frameIndex > animInfo.frames.length-1) {
        this.frameIndex = 0;
        if(!this.loop) {
          this.stopAnimations();
        }
      }
      this.animFrame = animInfo.frames[this.frameIndex];
    }
  }

  add(name, frames, speed)
  {
    this.animations[name] = {frames: frames, speed: speed}
  }

  stopAnimations()
  {
    this.currentAnim = null;
    this.frameIndex = 0;
    this.animFrame = 0;
    this.loop = false;
    this.elapsedTime = 0;
  }

  play(name, loop)
  {
    this.stopAnimations();
    this.currentAnim = name;
    this.loop = loop;
  }
}


class PlayerTask {
  constructor(fn, args) {
    this.started = false;
    this.fn = fn;
    this.args = args;
    this.completed = false;
  }

  start(player)
  {
    this.player = player;
    this.started = true;

    var args = this.args;

    this.fn.bind(this.player).apply(null, args).then(() => {
      this.completed = true;

    })


  }
}

class Player {
  constructor()
  {
    this.anims = new AnimControl();

    this.position = {x: 0, y: 0};
    this.tasks = [];
    this.onCurrentTile = null;

    this.skins = [];
    this.skins.push({part:"head", skin: "0.layer.skin:0.skin.default"});
    this.skins.push({part:"body", skin: "0.layer.skin:0.skin.default"});
    this.skins.push({part:"arms", skin: "0.layer.skin:0.skin.default"});
    this.skins.push({part:"legs", skin: "0.layer.skin:0.skin.default"});
    this.skins.push({part:"head", skin: "2.layer.mouth:0.skin.default"});
    this.skins.push({part:"head", skin: "1.layer.eyes:0.skin.default"});
    this.skins.push({part:"head", skin: "3.layer.eyebrow:0.skin.default"});
    this.skins.push({part:"head", skin: "4.layer.hair:0.skin.default"});
    this.skins.push({part:"body", skin: "1.layer.cloth:0.skin.default"});
    this.skins.push({part:"arms", skin: "1.layer.cloth:0.skin.default"});
    this.skins.push({part:"legs", skin: "1.layer.cloth:0.skin.default"});
    this.skins.push({part:"legs", skin: "2.layer.shoes:0.skin.default"});

    this.container = new PIXI.Container();
    this.container.scale.set(1.4);
    this.container.pivot.set(100/2, 125);

    var background = new PIXI.Graphics();
    background.beginFill(0xFF0000);
    background.drawRect(0, 0, 100, 150);
    background.endFill();
    background.alpha = 0.0;
    this.container.addChild(background);

    this.setupAnimations();
  }

  update(delta)
  {
    this.anims.update(delta);
    if(this.anims.currentAnim) {
      this.sprite.gotoAndStop(this.anims.animFrame);
    }

    if(this.tasks.length > 0)
    {
      if(!this.tasks[0].started) {
        this.tasks[0].start(this);
      }

      if(this.tasks[0].completed) {
        this.tasks.splice(0, 1);
      }
    }

    if(this.action) {

      if(this.action.id == "goto_tile") {

        var targetTile = TileMap.tiles[`${this.action.x}:${this.action.y}`];
        var diff = {x: targetTile.container.x - this.onCurrentTile.container.x, y: targetTile.container.y - this.onCurrentTile.container.y}

        var dx = targetTile.container.x - this.container.x;
        var dy = targetTile.container.y - this.container.y;

        var distance = Math.sqrt(dx*dx + dy*dy);

        if(!this.action.moving) {
          this.action.moving = {distance: {x: Math.abs(dx), y: Math.abs(dy)}, walked: {x: 0, y: 0}}
        }

        var move = {
          x: (diff.x * (diff.y != 0 ? 0.015 : 0.01)) * delta,
          y: (diff.y * 0.015) * delta
        }

        this.action.moving.walked.x += Math.abs(move.x);
        this.action.moving.walked.y += Math.abs(move.y);

        this.container.x += move.x;
        this.container.y += move.y;


        if(this.action.moving.walked.x >= this.action.moving.distance.x && this.action.moving.walked.y >= this.action.moving.distance.y)
        {
          this.warpToTile(this.action.x, this.action.y);
          this.action.completeAction();
          this.action = null;
        }
      }
    }
  }

  setupAnimations()
  {
    var totalFrames = 0;
    for (var anim in Game.data.animations) {
      var animData = Game.data.animations[anim];
      for (var view of animData.views) {
        var animFrames = [];
        for (var f of animData.frames) {
          animFrames.push(totalFrames + (f - animData.from));
        }
        this.anims.add(anim + "_" + view, animFrames, animData.speed);
        totalFrames += animData.to-animData.from+1;
      }
    }
  }

  generateSkin()
  {
    SceneRenderPlayer.addQueryPlayer(this);
  }

  createSprite(texture_base, textures)
  {
    this.texture_base = texture_base;

    this.sprite = new PIXI.AnimatedSprite(textures);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(100/2, 150/2);

    this.container.addChild(this.sprite);
  }

  taskWarpToTile(x, y)
  {
    var task = new PlayerTask(this.warpToTile, arguments);
    this.tasks.push(task);
  }

  taskGoToTile(x, y)
  {
    var task = new PlayerTask(this.goToTile, arguments);
    this.tasks.push(task);
  }

  taskPlayAnim(anim, loop, time)
  {
    var task = new PlayerTask(this.playAnim, arguments);
    this.tasks.push(task);
  }

  warpToTile(x, y)
  {
    return new Promise((function(completeAction) {
      this.onCurrentTile = TileMap.tiles[`${x}:${y}`];
      this.container.x = this.onCurrentTile.container.x;
      this.container.y = this.onCurrentTile.container.y;
      completeAction();
    }).bind(this))
  }

  goToTile(x, y)
  {
    return new Promise((function(completeAction) {
      this.action = {id: "goto_tile", x: x, y: y, completeAction: completeAction}
    }).bind(this))
  }

  playAnim(anim, loop, time)
  {
    return new Promise((function(completeAction) {
      this.anims.play(anim, true)
      completeAction();
    }).bind(this))
  }
}

class RandomPlayerAction {
  static allTiles;

  static startForPlayer(player)
  {
    if(!this.allTiles) {
      this.allTiles = [];

      for (var key in TileMap.tiles) {
        this.allTiles.push(key);
      }
    }

    if(this.allTiles.length == 0) { return; }

    player.warpToTile(0, 0);

    this.randomAction(player);
  }

  static randomAction(player)
  {
    if(player.tasks.length == 0 && TileMap.path_find_tiles != undefined) {


      var go_to = TileMap.tiles[this.allTiles[Math.getRandomInt(0, this.allTiles.length-1)]].mapPos;

      var currentOn = player.onCurrentTile.mapPos;

      var pathFind = new PathFind(currentOn.x, currentOn.y, go_to.x, go_to.y);

      pathFind.run((path) => {

        //GameLogic.addObjectToTile(TILE_ITEM.FLOOR_1, player.onCurrentTile.mapPos.x, player.onCurrentTile.mapPos.y)

        player.taskPlayAnim("Walk_iso_diagonal_front", true);


        for (var tile_key of path) {
          var tilepos = TileMap.tiles[tile_key].mapPos;


          if(TileMap.tiles[tile_key].walkable) {
            player.taskGoToTile(tilepos.x, tilepos.y);
          }


        }

        for (var k in player.onCurrentTile.tileItems) {
          var isWall = player.onCurrentTile.tileItems[k].type == TILE_ITEM_TYPE.WALL;

          if(!isWall)
          {
            player.onCurrentTile.tileItems[k].setRotation(Math.getRandomInt(0, 3));
          }

        }


        player.taskPlayAnim("Idle_iso_diagonal_front", true);



      });
    }


    setTimeout(() => {
      this.randomAction(player);
    }, Math.getRandomInt(2000, 5000))
  }
}
