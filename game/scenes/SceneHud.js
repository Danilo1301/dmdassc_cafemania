class SceneHud {
  static resolution = {width: 1024, height: 768};
  static viewport;
  static gui;

  static setup()
  {
    this.viewport.container.zIndex = 1000;

    this.right_menu = this.viewport.createParentViewport(300, 768);
    this.right_menu.border.alpha = 0.0;
    this.right_menu.align = ALIGN.RIGHT;
    this.right_menu.keepAspect = true;

    this.buttons_menu = this.right_menu.createParentViewport(70, 300);
    this.buttons_menu.border.alpha = 0.0;
    this.buttons_menu.container.x = this.right_menu.width - 70 - 10;

    this.button_zoom_in = this.gui.createButton(50/2 + 10, 10 + 50/2, 0, 0, {texture: "button_zoom_in"});
    this.gui.addToViewport(this.button_zoom_in, this.buttons_menu);
    this.button_zoom_in.onclick = function() {
      SceneGameRender.gameView.zoom += 0.3;
    }

    this.button_zoom_out = this.gui.createButton(50/2+10, 70 + 50/2, 0, 0, {texture: "button_zoom_out"});
    this.gui.addToViewport(this.button_zoom_out, this.buttons_menu);
    this.button_zoom_out.onclick = function() {
      SceneGameRender.gameView.zoom -= 0.3;
    }
  }

  static tick(delta)
  {
  }

  static destroy()
  {
  }
}
