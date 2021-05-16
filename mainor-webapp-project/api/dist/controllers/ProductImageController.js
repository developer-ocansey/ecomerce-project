"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageController = void 0;
const ProductImage_1 = require("../models/ProductImage");
const Product_1 = require("../models/Product");
const s3_config_js_1 = __importDefault(require("../config/s3.config.js"));
class ProductImageController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ImgParams = req.body;
            const productId = req.params.productId;
            console.log(req.files);
            if (!(productId || req.files)) {
                res.status(400).json({
                    status: false,
                    message: 'All Fields are required',
                });
                return;
            }
            // TODO (emmanuel) create a utility function for field validation and type checking....
            const productExist = yield Product_1.Product.findOne({ where: { id: productId } });
            if (!productExist) {
                return res
                    .status(404)
                    .json({ status: false, message: `Could not find a product associated with this ID: ${productId}` });
            }
            try {
                const s3Client = s3_config_js_1.default.s3Client;
                const params = s3_config_js_1.default.uploadParams;
                let result = [];
                let status = 0;
                req.files.map((f, i) => {
                    status++;
                    params.Key = f.originalname;
                    params.Body = f.buffer;
                    params.ACL = 'public-read';
                    s3Client.upload(params, (err, data) => {
                        if (err) {
                            return res.status(500).json({ error: 'Error -> ' + err });
                        }
                        ImgParams.imageURL = data.Location;
                        result.push(data.Location);
                        ProductImage_1.ProductImage.create({ imageURL: ImgParams.imageURL, productId })
                            .then((productImage) => {
                            if (status == req.files.length) {
                                return res.status(201).json({ data: result, message: 'Uploaded multiple files ' });
                            }
                        })
                            .catch((err) => {
                            return res.status(500).json(err);
                        });
                    });
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.ProductImageController = ProductImageController;
//TODO improve so users can upload same image twice by using the hash of each files....
