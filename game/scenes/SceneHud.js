class SceneHud {
  static resolution = {width: 300, height: 200};
  static viewport;
  static gui;

  static setup()
  {
    this.loadbar = this.gui.createLoadbar(150, 80, 250, 30, {texture: "loadbar2"});
    this.gui.addToViewport(this.loadbar, this.viewport);
    this.loadbar.setProgress(1);
  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
