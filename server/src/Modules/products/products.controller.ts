import App from "app";
import Controller from "./../../core/controller";
import { NextFunction, Request, Response } from "express";
import { ProductsService } from "./products.service";
import * as multer from "multer";
import { unlinkSync } from 'fs'

export default class ProductsController extends Controller {
    public path = '/product';
    private productService: ProductsService;
    upload = multer({ storage: this.storage, preservePath: true })

    constructor(app: App) {
        super();
        this.intializeRoutes();
        this.productService = new ProductsService(app);
    }

    public intializeRoutes() {
        this.router.get(this.path.concat('/list'), this.getProducts.bind(this));
        this.router.get(this.path.concat('/byProductId/:productId?'), this.getProductById.bind(this));
        this.router.post(this.path.concat('/add'), this.upload.single("image"), this.addProduct.bind(this));
        this.router.post(this.path.concat('/update'), this.upload.single("image"), this.updateProduct.bind(this));
        this.router.put(this.path.concat('/delete/:productId?'), this.deleteProduct.bind(this));
    }

    async getProducts(req: Request, res: Response, next: NextFunction) {
        return await this.productService.getProducts().then((data) => {
            res.json({ products: data, count: data.length });
        })
        .catch((error: Error) => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' })
        });
    }

    async getProductById(req: Request, res: Response, next: NextFunction) {
        if(!req.params?.productId) {
            return res.status(400).json({ error: 'Product id is required' })
        }
        if(isNaN(Number(req.params.productId))) {
            return res.status(400).json({ error: 'Product id should be number' })
        }

        return this.productService.getProductById(Number(req.params.productId)).then((data) => {
            if(!data) {
                res.json({ error: 'Product not found' })
            } else {
                res.json(data);
            }
        })
        .catch((error: Error) => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' })
        });
    }

    async addProduct(req: Request, res: Response, next: NextFunction) {
        const errors = this.productService.validateProduct(req.body)
        if(errors.length) {
            return res.status(400).json({ error: errors })
        }
        return this.productService.addProduct({
            product: req.body.product,
            quality: req.body.quality,
            design: req.body.design,
            color: req.body.color,
            scale: req.body.scale,
            materials: req.body.materials,
            image: req.file?.path
        }).then((data) => {
            res.json(data);
        })
        .catch((error: Error) => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' })
        });
    }

    async updateProduct(req: Request, res: Response, next: NextFunction) {
        const errors = []
        if(!req.params?.productId) {
            errors.push('Product id is required')
        }
        if(isNaN(Number(req.params.productId))) {
            errors.push('Product id should be number')
        }
        errors.push(...this.productService.validateProduct(req.body))
        if(errors.length) {
            return res.status(400).json({ error: errors })
        }

        const product = await this.productService.getProductById(Number(req.body.productId))
        if(!product) {
            return res.status(400).json({ error: 'Product not found' })
        }

        return this.productService.updateProduct(
            Number(req.body.productId),
            {
                product: req.body.product,
                quality: req.body.quality,
                design: req.body.design,
                color: req.body.color,
                scale: req.body.scale,
                materials: req.body.materials
            }
        ).then((data) => {
            res.json(data);
        })
        .catch((error: Error) => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' })
        });
    }

    async deleteProduct(req: Request, res: Response, next: NextFunction) {
        if(!req.params?.productId) {
            return res.status(400).json({ message: 'Product id is required' })
        }
        if(isNaN(Number(req.params.productId))) {
            return res.status(400).json({ message: 'Product id should be number' })
        }

        const product = await this.productService.getProductById(Number(req.params.productId))
        if(!product) {
            return res.status(400).json({ error: 'Product not found' })
        }
        
        return this.productService.deleteProduct(Number(req.params.productId)).then((data) => {
            unlinkSync(String(data.image))
            res.json({ message: 'Product has been deleted'});
        })
        .catch((error: Error) => {
            console.error(error);
            res.status(500).json({ error: 'Something went wrong' })
        });
    }

}