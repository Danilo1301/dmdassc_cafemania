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
  COOKER_1: 3,
  FLOOR_OBJECT_0: 4,
  FLOOR_OBJECT_1: 5,
  WALL_OBJECT_0: 6,
  WALL_OBJECT_1: 7,
}

class TileItem {
  constructor(id)
  {
    this.width = 158;
    this.height = 79;

    this.id = id;

    this.container = new PIXI.Container();

    this.background = new PIXI.Graphics();
    this.background.beginFill(0xFFFFFF);
    this.background.drawRect(-5, -5, 10, 10);
    this.background.endFill();
    this.background.alpha = 0;
    this.container.addChild(this.background);

    this.data = {}

    this.onTile;

    this.size = [1,1];
    this.hitbox = {
      height: 0,
      x: 0,
      y: 0
    }
  }


  setup(tile)
  {
    this.onTile = tile;

    var objData = Game.data.tileObjects[this.id];

    if(objData.size)
    {
      this.size[0] = objData.size[0];
      this.size[1] = objData.size[1];
    }

    if(objData.hitbox)
    {
      for (var k in objData.hitbox) {
        this.hitbox[k] = objData.hitbox[k];
      }
    }

    this.setSprite("gameobject:"+this.id+":0");
    this.createHitbox(this.hitbox.height, this.hitbox.x, this.hitbox.y);

  }

  createHitbox(height, offset_x, offset_y)
  {
    var w = this.width/2;
    var h = this.height/2;
    var hp = Math.sqrt(w*w + h*h);

    var tileSize = this.size;

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

    var point0 = [79, 0];
    var point1 = [157, 39]
    var point2 = [79, 78]
    var point3 = [0, 39]

    var extra_x = (tileSize[0]-1)*hp;
    var extra_y = (tileSize[1]-1)*hp;

    addx(point1, extra_x);
    addx(point2, extra_x);

    addy(point2, extra_y);
    addy(point3, extra_y);

    //--

    addx(point0, -offset_x/2);
    addx(point1, offset_x/2);
    addx(point2, offset_x/2);
    addx(point3, -offset_x/2);

    addy(point0, -offset_y/2);
    addy(point1, -offset_y/2);
    addy(point2, offset_y/2);
    addy(point3, offset_y/2);


    var pts = [
      point0[0], point0[1]-height,
      point1[0], point1[1]-height,
      point1[0], point1[1],
      point2[0], point2[1],
      point3[0], point3[1],
      point3[0], point3[1]-height,
    ];



    this.hitbox = new PIXI.Graphics();
    this.hitbox.beginFill(0xffffff);
    this.hitbox.drawPolygon(pts);
    this.hitbox.endFill();
    this.hitbox.alpha = 0.4;
    this.hitbox.zIndex = 1000;
    this.hitbox.tint = 0xFF0000;

    this.hitbox.pivot.set(this.onTile.width/2, this.onTile.height/2);

    this.hitbox.interactive = true;
    this.hitbox.buttonMode = true;
    this.hitbox.on('mouseover', this.onMouseOver.bind(this));
    this.hitbox.on('mouseout', this.onMouseOut.bind(this));

    this.container.addChild(this.hitbox);
  }

  setSprite(texture_name)
  {
    this.sprite = new PIXI.Sprite(Game.resources[texture_name].texture);

    var extra_x = this.onTile.width/2*(this.size[1]-1);
    var extra_y = -this.onTile.height/2*(this.size[1]-1);

    this.sprite.pivot.set(this.onTile.width/2 + extra_x, this.sprite.texture.height - this.onTile.height/2*this.size[0] + extra_y);
    this.sprite.alpha = 1;
    this.container.addChild(this.sprite);
  }

  onMouseOver(event)
  {
    this.container.alpha = 0.5;
    this.onTile.topFloor.container.alpha = 0.5;
  }

  onMouseOut(event)
  {
    this.container.alpha = 1;
    this.onTile.topFloor.container.alpha = 1;
  }

  sort()
  {
    this.container.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
  }
}

class TileItemFloor extends TileItem {
  constructor(id, tile)
  {
    super(id);
    this.type = TILE_ITEM_TYPE.FLOOR;

    this.sort();
  }

  setup(tile)
  {
    super.setup(tile);

    this.sort();

    this.hitbox.alpha = 0;
  }
}

class TileItemCooker extends TileItem {
  constructor(id)
  {
    super(id);
    this.type = TILE_ITEM_TYPE.COOKER;

  }

  setup(tile)
  {
    super.setup(tile);

    this.text = new PIXI.Text('?', SceneTileMap.tileFontStyle);
    this.text.position.set(0, 0);
    this.text.anchor.set(0.5);
    this.container.addChild(this.text)

    this.sort();

  }

  onMouseOver(event)
  {
    super.onMouseOver(event);
    console.log("cooker mouse over")
  }

  onMouseOut(event)
  {
    super.onMouseOut(event);
    console.log("cooker mouse out")
  }

  updateVisual()
  {
    this.text.text = this.data.cooking;
  }
}



class TileItemFloorObject extends TileItem {
  constructor(id)
  {
    super(id);
    this.type = TILE_ITEM_TYPE.FLOOR_OBJECT;
  }

  setup(tile)
  {
    super.setup(tile);

    this.sort();
  }

  onMouseOver(event)
  {
    super.onMouseOver(event);
    console.log("floorobject mouse over")
  }

  onMouseOut(event)
  {
    super.onMouseOut(event);
    console.log("floorobject mouse out")
  }

  updateVisual()
  {
    //this.text.text = this.data.floorobjectData;
  }
}
