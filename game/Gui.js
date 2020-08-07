class Gui {
  constructor(viewport)
  {
    this.viewport = viewport;
    this.items = [];
  }

  createButton(x, y, width, height, options)
  {
    var button = new Button(x, y, width, height, options);
    this.items.push(button);
    return button;
  }

  createLoadbar(x, y, width, height, options)
  {
    var loadbar = new Loadbar(x, y, width, height, options);
    this.items.push(loadbar);
    return loadbar;
  }

  addToViewport(object, viewport)
  {
    viewport.container.addChild(object.container);
  }

  destroy()
  {

  }

  update(delta)
  {
    for (var item of this.items) {
      item.update(delta);
    }
  }
}
