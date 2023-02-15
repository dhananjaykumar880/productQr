import App from "app";
import Controller from "../../core/controller";
import { NextFunction, Request, Response } from "express";

export default class RootController extends Controller {
    public path = '/';

    constructor(app: App) {
        super();
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path.concat('/'), this.isAlive.bind(this));
    }

    isAlive(req: Request, res: Response, next: NextFunction) {
        res.json('Apis are working')
    }
}