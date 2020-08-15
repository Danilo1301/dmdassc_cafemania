class ObjectOrigin {
  static objects = [];

  static textStyle = new PIXI.TextStyle({
    fontFamily: 'segoe-ui-black',
    fontSize: 16,
    stroke: "#3c1905",
    lineJoin: "round",
    strokeThickness: 5,
    align: "left",
    fill: ['#ffffff']
  });

  static show(object, name)
  {
    var point = new PIXI.Graphics();
    point.beginFill(0x00FF00);
    point.drawRect(-5, -5, 10, 10);
    point.endFill();
    Game.app.stage.addChild(point);

    var text = new PIXI.Text(name, this.textStyle);
    text.x = 0;
    text.y = 0;
    point.addChild(text);

    this.objects.push({point: point, obj: object});
  }

  static update()
  {
    for (var o of this.objects) {
      var pos = o.obj.getGlobalPosition();

      o.point.x = pos.x;
      o.point.y = pos.y;
      //console.log(o)
    }
  }
}
