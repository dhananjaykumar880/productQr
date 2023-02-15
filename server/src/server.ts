import ProductsController from './Modules/products/products.controller';
import App from './app';
import RootController from './Modules/root/root.controller';

export default class Server {
  private static app: App;

  public static getApp(): App {
    return this.app;
  }


  public static async close() {
    await this.getApp().getDataSource().$disconnect().then(async () => {
      await this.app.close()
    });
  }

  public static async init() {
    if (!this.app) {
      this.app = new App(
        (app: App) => {
          return [
            new RootController(app),
            new ProductsController(app),
          ]
        },
        3000,
      );
    }

    await this.app.init();
    return this.app
  }
}
