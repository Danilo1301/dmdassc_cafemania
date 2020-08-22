class PlayerAnimation {
  constructor(player)
  {
    this.player = player;
    this.animations = {};

    this.currentPlaying = null;

    this.elapsedTime = 0;
    this.frameIndex = 0;

    this.currentView = null;

    this.setupAnimations();

    this.directions = {
      "0:1": ["iso_diagonal_front", true],
      "0:-1": ["iso_diagonal_back", false],
      "1:0": ["iso_diagonal_front", false],
      "-1:0": ["iso_diagonal_back", true],
      "1:1": ["iso_front", false],
      "-1:-1": ["iso_back", false],
      "-1:1": ["iso_side", true],
      "1:-1": ["iso_side", false]
    }

  }

  play(anim, loop)
  {
    Game.app.ticker.speed = 1;

    this.currentPlaying = this.animations[anim];
  }


  update(delta)
  {
    this.elapsedTime += delta;

    if(this.elapsedTime > this.currentPlaying.speed) {
      this.elapsedTime = 0;
      this.frameIndex++;

      if(this.frameIndex > Game.data.animations[this.currentPlaying.name].frames.length -1)
      {
        this.frameIndex = 0
      }
    }

    var view = this.directions[`${this.player.direction.x}:${this.player.direction.y}`];
    if(view) { this.currentView = view; }

    if(this.currentView)
    {
      var viewInfo = this.currentPlaying.views[this.currentView[0]];



      if(viewInfo)
      {
        var frame = viewInfo[this.frameIndex];

        this.player.sprite.scale.x = this.currentView[1] ? -1 : 1;

        this.player.sprite.gotoAndStop(frame);
      }


    }


    SceneFPSCounter.moneyText.text = `${this.currentPlaying.name}\n${this.elapsedTime}\n${this.frameIndex}\n${view}`;

  }


  setupAnimations()
  {

    var totalFrames = 0;
    for (var anim in Game.data.animations) {

      var animData = Game.data.animations[anim];

      this.animations[anim] = {
        name: anim,
        speed: animData.speed,
        views: {}
      };

      for (var view of animData.views) {
        var animFrames = [];
        for (var f of animData.frames) {
          animFrames.push(totalFrames + (f - animData.from));
        }
        this.animations[anim].views[view] = animFrames;

        totalFrames += animData.to-animData.from+1;
      }
    }

  }
}

class Player {
  constructor()
  {
    this.position = {x: 0, y: 0};

    this.skin = new PlayerSkin();
    this.animation = new PlayerAnimation(this);

    this.container = new PIXI.Container();
    this.container.scale.set(1.7);
    this.container.pivot.set(100/2, 125);

    this.direction = {x: 0, y: 0}

    this.sprite;

    this.tasks = [];

    this.generateSkin();

    this.animation.play("Walk");
  }

  addTask(type, args, index) {
    var task;

    var callback = function() {
      this.tasks.splice(0, 1);

      for (var i = 0; i < task.queuedTasks.length; i++) {
        var inf = task.queuedTasks[i];
        this.addTask(inf[0], inf[1], i);
      }
    }

    task = new type(this, callback.bind(this));
    var taskInfo = {task: task, args: args};

    if(index == undefined)
    {
      this.tasks.push(taskInfo);
    } else {
      this.tasks.splice(index, 0, taskInfo);
    }

  }


  update(delta)
  {
    this.container.position.x = this.position.x;
    this.container.position.y = this.position.y;

    this.animation.update(delta);

    if(this.tasks.length > 0)
    {
      var taskInfo = this.tasks[0];

      if(!taskInfo.task.started)
      {
        taskInfo.task.started = true;
        taskInfo.task.execute.apply(taskInfo.task, taskInfo.args);
      }

      if(taskInfo.task.finished)
      {
        //console.log("dont need")
      } else {
        taskInfo.task.update(delta);
      }

      //console.log(this.tasks[0])
    }
  }

  goToTile(x, y)
  {
    this.addTask(PlayerTaskWalkToTile, [x, y]);
  }

  warpToTile(x, y)
  {
    this.onTile = TileMap.getTile(x, y);
    this.position.x = this.onTile.container.x;
    this.position.y = this.onTile.container.y;
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
    SceneRenderPlayer.addQueryPlayer(this, ((texture_base, textures) => {
      //this.skin.texture_base = texture_base;

      if(this.sprite) { this.sprite.destry() }

      this.sprite = new PIXI.AnimatedSprite(textures);
      this.sprite.anchor.set(0.5);
      this.sprite.position.set(100/2, 150/2);

      this.sprite.gotoAndPlay(0)
      this.sprite.animationSpeed = 0.05

      this.container.addChild(this.sprite);
    }).bind(this));
  }
}

class PlayerTask {
  constructor(player, callback)
  {
    this.player = player;
    this.callback = callback;
    this.finished = false;
    this.queuedTasks = [];
  }

  update(delta) {}

  finishTask()
  {
    this.finished = true;
    this.callback();
  }

  queueTask(task, args)
  {
    this.queuedTasks.push([task, args]);
  }
}

class PlayerTaskWalkToTile extends PlayerTask {
  constructor(player, callback) { super(player, callback); }

  execute(x, y)
  {
    //console.log("PlayerTaskWalkToTile", x, y)
    //console.log(this.player.tasks)


    //console.warn(this.player.onTile.mapPos.x, this.player.onTile.mapPos.y);

    var pathFind = new PathFind(this.player.onTile.mapPos.x, this.player.onTile.mapPos.y, x, y);

    pathFind.run((path) => {

      for (var tile of path) {
        tile = TileMap.tiles[tile];

        this.queueTask(PlayerTaskMoveToTile, [tile.mapPos.x, tile.mapPos.y]);
      }



      this.finishTask();
    });


  }

  update(delta)
  {

  }
}

class PlayerTaskMoveToTile extends PlayerTask {
  constructor(player, callback) { super(player, callback); }

  getDirectionToTile(atTile, targetTile)
  {
    return {
      x: targetTile.mapPos.x - atTile.mapPos.x,
      y: targetTile.mapPos.y - atTile.mapPos.y
    }
  }

  getDistanceBetweenPoints(ax, ay, bx, by)
  {
    var dx = bx - ax;
    var dy = by - ay;
    return Math.sqrt(dx*dx + dy*dy);
  }

  execute(x, y)
  {
    //console.log("PlayerTaskMoveToTile", x, y)

    this.targetTile = TileMap.getTile(x, y);

    this.direction = this.getDirectionToTile(this.player.onTile, this.targetTile);

    this.player.isMoving = true;
    this.player.direction = this.direction;

    this.goalDistance = this.getDistanceBetweenPoints(
      this.player.onTile.container.x,
      this.player.onTile.container.y,
      this.targetTile.container.x,
      this.targetTile.container.y
    );
  }

  update(delta)
  {
    var player = this.player;

    var movement = {
      x: -this.direction.x*2 + this.direction.y*2,
      y: this.direction.y + this.direction.x
    }

    player.position.x -= (movement.y == 0 ? movement.x/1.3 : movement.x) * delta;
    player.position.y += (movement.x == 0 ? movement.y/1.3 : movement.y) * delta;

    var distance = this.getDistanceBetweenPoints(player.position.x, player.position.y, player.onTile.container.x, player.onTile.container.y);

    if(distance >= this.goalDistance)
    {
      player.warpToTile(this.targetTile.mapPos.x, this.targetTile.mapPos.y);
      player.isMoving = false;
      return this.finishTask();
    }

  }
}

//--

class PlayerSkins
{
  static parts = {};
  static sheets = [];

  static setupSkins(info)
  {
    for (var part_name in info) {
      var part = this.addPart(part_name);

      part.bodyParts = info[part_name].parts;

      for (var layer_name in info[part_name].layers) {
        var layer = part.addLayer(layer_name);

        for (var skin_name of info[part_name].layers[layer_name]) {

          var skin = layer.addSkin(skin_name);

          for (var bodyPart of part.bodyParts) {
            for (var anim in Game.data.animations) {

              var sheet = {
                name: `player_sheet.${part_name}:${layer_name}:${skin_name}:${anim}:${bodyPart}`,
                src: `${part_name}/${layer_name}/${skin_name}/${anim}_${bodyPart}.png`,
                skin: skin,
                bodyPart: bodyPart,
                anim: anim
              };

              this.sheets.push(sheet);

              skin.sheets[anim] = sheet;

            }
          }
        }
      }
    }
  }

  static addPart(part_name)
  {
    var part = this.parts[part_name] = {
      bodyParts: [],
      layers: []
    };

    part.addLayer = function(name)
    {
      var layer = {
        name: name,
        skins: []
      };

      layer.addSkin = function(name)
      {
        var skin = {
          name: name,
          sheets: {}

        };


        this.skins.push(skin);
        skin.index = this.skins.indexOf(skin);

        return skin;
      }


      this.layers.push(layer);
      layer.index = this.layers.indexOf(layer);

      return layer;
    }

    return part;
  }

  static addLayer(part, layer_name)
  {
    this.parts[part_name]
  }

  static getLayers(part)
  {
  }
}

class PlayerSkin {
  constructor()
  {
    this.skins = [];

    this.setSkin("head", 0, 0);
    this.setSkin("body", 0, 0);
    this.setSkin("arms", 0, 0);
    this.setSkin("legs", 0, 0);

    this.setSkin("head", 1, Math.getRandomInt(0, 1));
    this.setSkin("head", 2, 0);
    this.setSkin("head", 3, 0);
    this.setSkin("head", 4, 0);

    if(Math.random() > 0.5)
    {
      this.setSkin("body", 1, 0);
      this.setSkin("arms", 1, 0);
    }





    this.setSkin("legs", 1, 0);

    if(Math.random() > 0.5)
    {
      this.setSkin("legs", 2, 0);
    }


    //console.log(this.skins)
  }

  getSkin(part, layer)
  {
    for (var s of this.skins) {
      if(s.part == part && s.layer == layer) { return s }
    }
    return
  }

  setSkin(part, layer, skin)
  {
    var playerSkin = this.getSkin(part, layer);

    if(!playerSkin)
    {
      playerSkin = {};
      playerSkin.part = part;
      playerSkin.layer = layer;

      this.skins.push(playerSkin);
    }

    playerSkin.skin = skin;
  }
}
