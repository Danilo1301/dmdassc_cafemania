class TileObjectFloor extends TileObject {
  constructor(id)
  {
    super();

    this.id = id;

    this.container = new PIXI.Container();

    this.sprite = new PIXI.Sprite(Game.resources["floor:"+id].texture);
    this.container.addChild(this.sprite);

    this.sprite.x = 0;

    console.log(`floor id ${id}`)
  }
}
