export enum InteractMode {
  SingleTap = 'single-tap',
  DoubleTap = 'double-tap',
}

export enum Graphics {
  Theme2D = 'theme-2d',
  Theme3D = 'theme-3d',
}

export class AppOptions {
  // region Singleton
  private static _instance: AppOptions = new AppOptions();

  private constructor() {
    if (AppOptions._instance) {
      throw new Error("Error: Instantiation failed: Use AppOptions.getInstance() instead of new.");
    }
    AppOptions._instance = this;
  }

  static get instance(): AppOptions
  {
    return AppOptions._instance;
  }
  // endregion

  // region options
  private _interactMode: InteractMode;
  private _graphics: Graphics;

  get interactMode(): InteractMode {
    if (this._interactMode) {
      return this._interactMode;
    }
    const storage = localStorage.getItem('interact-mode') as InteractMode;
    return storage || InteractMode.SingleTap;
  }

  set interactMode(im: InteractMode) {
    this._interactMode = im;
    localStorage.setItem('interact-mode', im);
  }

  get graphics(): Graphics {
    if (this._graphics) {
      return this._graphics;
    }
    const storage = localStorage.getItem('graphics') as Graphics;
    return storage || Graphics.Theme2D;
  }

  set graphics(g: Graphics) {
    this._graphics = g;
    localStorage.setItem('graphics', g);
  }

  // endregion
}
