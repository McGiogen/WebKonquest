export enum InteractMode {
  SingleTap,
  DoubleTap,
}

export enum Graphics {
  Theme2D = 'theme-2d',
  Theme3D = 'theme-3d',
}

// TODO AppOptions dovrebbe tenere salvate le opzioni nel local storage
// e ogni volta provare a ricaricarle da lì
export class AppOptions {
  // region Singleton
  private static _instance: AppOptions = new AppOptions();

  private constructor() {
    if(AppOptions._instance){
      throw new Error("Error: Instantiation failed: Use AppOptions.getInstance() instead of new.");
    }
    AppOptions._instance = this;
  }

  static get instance(): AppOptions
  {
    return AppOptions._instance;
  }
  // endregion

  interactMode: InteractMode = InteractMode.SingleTap;
  graphics: Graphics = Graphics.Theme2D;
}
