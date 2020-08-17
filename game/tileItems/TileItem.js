TILE_ITEM_TYPE = {
  FLOOR: 0,
  COOKER: 1,
  TABLE: 2,
  CHAIR: 3,
  WALL: 4,
  WALL_OBJECT: 5,
  DOOR: 6,
  FLOOR_OBJECT: 7
}

TILE_ITEM = {
  FLOOR_0: 0,
  FLOOR_1: 1,
  COOKER_0: 2,
  WALL_0: 3
}

//front   [+extra images]
//
//
//

//front
//
//back
//

//front
//back
//front_flipped
//back_flipped

//~~ index
//front 0 = 0
//front 1 = 1
//back 0 = 2
//back 1 = 3
//front_flipped 0 = 4
//front_flipped 1 = 5


class TileItem {
  constructor(data)
  {

    this.id = data.id;
    this.uniqueid = data.uniqueid;
    this.data = data.data;
    this.type = Game.data.tileItems[this.id].type;
    this.parts = [];
  }

  update(delta)
  {

  }

  createHitbox(height, offset_x, offset_y)
  {
    var usingRotation = GameLogic.getRotationData(this.data.rotation);

    var wallType = this.type == TILE_ITEM_TYPE.WALL;

    if(this.hitbox) { this.hitbox.destroy(); }

    var w = TileMap.tileSize.width/2;
    var h = TileMap.tileSize.height/2;
    var hp = Math.sqrt(w*w + h*h);

    var size = Game.data.tileItems[this.id].size;

    var tileSize = [
      size[0],
      size[1]
    ];


    var addx = function(point, amount)
    {
      var to_add_x = amount*w/hp;
      var to_add_y = amount*h/hp;

      point[0] += to_add_x
      point[1] += to_add_y
    }

    var addy = function(point, amount)
    {
      var to_add_x = amount*w/hp;
      var to_add_y = amount*h/hp;

      point[0] += -to_add_x
      point[1] += to_add_y
    }



    var extra_x = (tileSize[0]-1)*hp;
    var extra_y = (tileSize[1]-1)*hp;

    var pts = [];

    if(wallType)
    {
      var point0 = [TileMap.tileSize.width/2, 0];
      var point1 = [TileMap.tileSize.width/2, -TileMap.tileSize.height*2]
      var point2 = [0, -TileMap.tileSize.height*2 +TileMap.tileSize.height/2]
      var point3 = [0, TileMap.tileSize.height/2]

      //addx(point2, extra_y);
      addy(point2, extra_y);
      addy(point3, extra_y);
      //addx(point3, extra_y);

      addx(point0, -offset_y);
      addy(point0, -offset_y);

      addx(point1, offset_y);
      addy(point1, offset_y);

      addx(point2, offset_y);
      addy(point2, offset_y);

      addx(point3, -offset_y);
      addy(point3, -offset_y);

      //--



      addy(point1, offset_x);
      addy(point0, offset_x);

      addy(point2, -offset_x);
      addy(point3, -offset_x);




      pts = [
        point0[0], point0[1]-height,
        point1[0], point1[1]-height,
        point2[0], point2[1]-height,
        point3[0], point3[1]-height,
      ];

    } else {
      var point0 = [TileMap.tileSize.width/2, 0];
      var point1 = [TileMap.tileSize.width, TileMap.tileSize.height/2]
      var point2 = [TileMap.tileSize.width/2, TileMap.tileSize.height]
      var point3 = [0, TileMap.tileSize.height/2]

      addx(point1, extra_x);
      addx(point2, extra_x);

      addy(point2, extra_y);
      addy(point3, extra_y);

      addx(point0, offset_x);
      addx(point1, -offset_x);
      addx(point2, -offset_x);
      addx(point3, offset_x);

      addy(point0, offset_y);
      addy(point1, offset_y);
      addy(point2, -offset_y);
      addy(point3, -offset_y);

      pts = [
        point0[0], point0[1]-height,
        point1[0], point1[1]-height,
        point1[0], point1[1],
        point2[0], point2[1],
        point3[0], point3[1],
        point3[0], point3[1]-height,
      ];
    }


    this.hitbox = new PIXI.Graphics();
    this.hitbox.beginFill(0xffffff);
    this.hitbox.drawPolygon(pts);
    this.hitbox.endFill();
    this.hitbox.alpha = 0;
    this.hitbox.zIndex = 1000;
    this.hitbox.tint = 0xFF0000;

    var px = TileMap.tileSize.width/2;
    var py = TileMap.tileSize.height/2;

    if(usingRotation.inverty || usingRotation.invertx)
    {
      px += tileSize[0]-1*TileMap.tileSize.width/2;
      py -= tileSize[1]-1*TileMap.tileSize.height/2;
    }

    this.hitbox.pivot.set(px, py);

    var ocuppedTiles = GameLogic.getTilesItemOcuppes(this.id, this.data.rotation);

    this.hitbox.scale.x = usingRotation.flipcoords ? -1 : 1;

    this.hitbox.interactive = true;
    this.hitbox.buttonMode = true;
    this.hitbox.on('mouseover', this.onMouseOver.bind(this));
    this.hitbox.on('mouseout', this.onMouseOut.bind(this));


    //SceneGameObjects.viewport.container.addChild(this.hitbox);
  }

  onMouseOver(event)
  {
    this.hitbox.alpha = 0.5;
  }

  onMouseOut(event)
  {
    this.hitbox.alpha = 0;
  }

  destroySprites()
  {
    for (var part of this.parts) { part.sprite.destroy(); }
    this.parts = [];

    //this.moveSprite.destroy();
  }

  setRotation(rotation)
  {
    this.data.rotation = rotation;

    this.destroySprites();
    this.createSprites();
    this.createMoveSprite();

    if(this.placedAtTile)
    {
      this.placedAtTile.placeItem(this);
    }
  }

  createSprites()
  {
    var tileItemData = Game.data.tileItems[this.id];
    var ocuppedTiles = GameLogic.getTilesItemOcuppes(this.id, this.data.rotation);
    var renderTile = SceneRenderTileItem.tiles[this.id];
    var usingRotation = GameLogic.getRotationData(this.data.rotation);

    for (var t of ocuppedTiles) {
      var textures = [];

      for (var i = 0; i < tileItemData.images; i++) {
        var name = `${usingRotation.k}_${i}_${t[2]}:${t[3]}`;
        var index = renderTile.textures_index[name];

        textures.push(renderTile.textures[index]);
      }


      var spriteContainer = new PIXI.Container();

      var sprite = new PIXI.AnimatedSprite(textures);
      sprite.gotoAndPlay(0);
      sprite.animationSpeed = 0.05;
      sprite.pivot.set(TileMap.tileSize.width/2, sprite.height-TileMap.tileSize.height/2);

      spriteContainer.scale.x = usingRotation.flipcoords ? -1 : 1;


      if(this.type == TILE_ITEM_TYPE.WALL)
      {
        var back = new PIXI.Sprite(Game.resources["wallback"].texture);
        back.pivot.set((back.width-sprite.width) + TileMap.tileSize.width/2, back.height-TileMap.tileSize.height/2);
        spriteContainer.addChild(back);
      }


      spriteContainer.addChild(sprite);




      this.parts.push({
        t: t,
        sprite: spriteContainer,
        wallsprite: sprite
      });
    }


    this.createHitbox(tileItemData.hitbox.z, tileItemData.hitbox.x, tileItemData.hitbox.y);
  }

  createMoveSprite()
  {
    return

    var moveContainer = new PIXI.Container();

    for (var part of this.parts) {
      var sprite = part.sprite;

      var pos = TileMap.getTilePosition(part.t[0], part.t[1]);

      sprite.x = pos.x;
      sprite.y = pos.y;

      moveContainer.addChild(part.sprite);
    }

    var tex = Game.app.renderer.generateTexture(moveContainer); // container with all your sprites as children
    this.moveSprite = new PIXI.Sprite(tex);

    for (var part of this.parts) {
      moveContainer.removeChild(part.sprite);
      part.sprite.position.set(0, 0);
    }
    moveContainer.destroy();

    SceneTileMap.viewport.container.addChild(this.moveSprite);

    this.moveSprite.alpha = 0.5;
  }

  destroy()
  {
    for (var part of this.parts) {
      part.tile.topFloor.container.removeChild(part.sprite);
      for (var c of part.sprite.children) {
        part.sprite.removeChild(c);
        c.destroy();
      }
      part.sprite.destroy()
    }
    //this.moveSprite.destroy();
  }
}

class TileItemCooker extends TileItem {
  constructor(data)
  {
    super(data);
  }
}

class TileItemFloor extends TileItem {
  constructor(data)
  {
    super(data);
  }
}

class TileItemWall extends TileItem {
  constructor(data)
  {
    super(data);

    this.targetDoorRotation = -0.46;
    this.isDoorOpen = false;
    this.hasDoor = false;
    this.doorDirection = 0;
    this.doors = [];
  }

  createDoor()
  {
    this.hasDoor = true;

    this.doors = [];

    for (var part of this.parts) {

      var sprite = part.wallsprite;

      var mask = new PIXI.Sprite(Game.resources["wallmask"].texture);
      mask.pivot.set((mask.width-sprite.width) + TileMap.tileSize.width/2, mask.height-TileMap.tileSize.height/2);

      part.sprite.addChild(mask);
      sprite.mask = mask;

      var door = new PIXI.projection.Sprite2d(PIXI.Texture.from('/assets/images/door.png'));
      door.anchor.set(1, 1);
      door.position.set(0, -TileMap.tileSize.height/2);
      door.proj.affine = PIXI.projection.AFFINE.AXIS_X;
      door.rotation = -0.46

      part.sprite.addChild(door);

      this.doors.push(door);
    }
  }

  openDoor()
  {
    for (var door of this.doors) {
      this.targetDoorRotation = this.doorDirection == 0 ? -2.8 : 0.6
    }
    this.isDoorOpen = true;
  }

  closeDoor()
  {
    for (var door of this.doors) {
      this.targetDoorRotation = -0.46
    }
    this.isDoorOpen = false;
  }


  createSprites()
  {
    super.createSprites();
  }

  setRotation(rotation)
  {
    super.setRotation(rotation);

    if(this.hasDoor)
    {
      this.createDoor();
    }
  }

  flipDoorSide()
  {
    for (var door of this.doors) {
      door.scale.x = -1
      door.position.x = -TileMap.tileSize.width/2;
      door.position.y = 0;
      this.doorDirection = 1;
    }
  }

  update(delta)
  {
    super.update(delta);

    for (var door of this.doors) {
      door.rotation = Math.lerp(door.rotation, this.targetDoorRotation, 0.1);
    }
  }
}
