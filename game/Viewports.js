let ALIGN = {
  NONE: 0,
  LEFT: 1,
  RIGHT: 2,
  CENTER: 3,
  BOTTOM: 4,
  TOP: 5
}

class Viewports {
  static viewports = [];

  static tick(delta)
  {
    for (var viewport of this.viewports) {
      viewport.tick(delta);
    }
  }

  static createViewport(width, height, options)
  {
    var viewport = new Viewport(width, height, options || {});
    this.viewports.push(viewport);
    if(!Game.viewport) {
      Game.app.stage.addChild(viewport.container);
    }
    return viewport;
  }
}

class Viewport {
  constructor(width, height, options)
  {
    this.width = width;
    this.height = height;
    this.position = {x: 0, y: 0}


    this.align = ALIGN.LEFT;
    this.center = false;
    this.keepAspect = false;

    //this.align = ALIGN.NONE; //

    this.container = new PIXI.Container();
    this.container.ofViewport = this;

    this.mask = new PIXI.Graphics();
		this.mask.beginFill(0xFFFFFF);
		this.mask.drawRect(0, 0, width, height);
		this.mask.endFill();

    this.border = new PIXI.Graphics();

    this.border.lineStyle(2, 0xff0000, 1);
    this.border.beginFill(0xC4C4C4);
    this.border.drawRect(0, 0, this.width, this.height);
    this.border.endFill();
    this.border.alpha = 0.3

    this.container.addChild(this.border);

    //this.container.addChild(this.mask);
    //this.container.mask = this.mask;
  }

  destroy()
  {
    this.container.destroy();
    this.mask.destroy();
    this.border.destroy();
    Viewports.viewports.splice(Viewports.viewports.indexOf(this), 1);
  }

  sort()
  {
    this.container.children.sort((itemA, itemB) => itemA.zIndex - itemB.zIndex);
  }

  createParentViewport(width, height, options)
  {
    var viewport = Viewports.createViewport(width, height, options);
    viewport.parentOf = this;
    this.container.addChild(viewport.container);
    return viewport;
  }

  tick()
  {
    this.sort();

    this.container.x = this.position.x;
    this.container.y = this.position.y;

    var scale = this.keepAspect ? Game.strechScale : 1;

    this.container.scale.x = scale;

    if(this.align == ALIGN.LEFT)
    {
      if(this.center)
      {
        this.container.y = this.parentOf.height/2 + this.position.y - this.height/2;
      }
    }

    if(this.align == ALIGN.RIGHT)
    {
      this.container.x = this.parentOf.width - this.position.x - this.width*scale;

      if(this.center)
      {
        this.container.y = this.parentOf.height/2 + this.position.y - this.height/2;
      }
    }

    if(this.align == ALIGN.TOP)
    {
      if(this.center)
      {
        this.container.x = this.parentOf.width/2 + this.position.x - this.width/2*scale;
      }
    }

    if(this.align == ALIGN.BOTTOM)
    {
      this.container.y = this.parentOf.height - this.position.y - this.height;

      if(this.center)
      {
        this.container.x = this.parentOf.width/2 + this.position.x - this.width/2*scale;
      }
    }

    if(this.align == ALIGN.CENTER)
    {
      this.container.x = this.parentOf.width/2 + this.position.x - this.width/2*scale;
      this.container.y = this.parentOf.height/2 + this.position.y - this.height/2;
    }

  }
}
