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
exports.ProductController = void 0;
const Product_1 = require("../models/Product");
const ProductImage_1 = require("../models/ProductImage");
const sequelize_1 = require("sequelize");
const Category_1 = require("../models/Category");
const Merchant_1 = require("../models/Merchant");
const SubCategory_1 = require("../models/SubCategory");
const s3_config_1 = __importDefault(require("../config/s3.config"));
const utils = require('../utils');
class ProductController {
    constructor() {
        this.search = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const searchQuery = req.params.search;
            let offset = req.query.offset ? req.query.offset : 0;
            let limit = req.query.limit ? req.query.limit : 102;
            // // Important for Pagination
            // let perPage:any = req.query.per_page ? req.query.per_page : null;
            // let page:any = req.query.page ? req.query.page : null;
            // let paginationOffset:any = (page * perPage) - perPage;
            // if (perPage !== null && page !== null)  {
            //   offset = paginationOffset;
            //   limit = perPage;
            // }
            if (!searchQuery) {
                return res.json({ status: false, message: 'Invalid search parameters' });
            }
            yield Product_1.Product.findAndCountAll({
                offset: Number(offset),
                limit: Number(limit),
                where: {
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.like]: '%' + searchQuery + '%' } },
                        { description: { [sequelize_1.Op.like]: '%' + searchQuery + '%' } },
                    ],
                },
                include: [
                    { model: ProductImage_1.ProductImage, as: 'productImage' },
                    { model: Merchant_1.Merchant, as: 'merchantInfo' },
                    { model: Category_1.Category, as: 'categories' },
                    { model: SubCategory_1.SubCategory, as: 'subCategories' }
                ],
            })
                .then((results) => {
                res.json({ status: true, data: results, message: 'Successfull' });
            })
                .catch((err) => {
                res.json({ status: false, err });
            });
        });
        this.merchant = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const offset = req.query.offset ? req.query.offset : 0;
            const limit = req.query.limit ? req.query.limit : 102;
            try {
                const merchantId = req.params.merchantId;
                yield Product_1.Product.findAndCountAll({
                    offset: Number(offset),
                    limit: Number(limit),
                    where: {
                        merchantId: merchantId,
                    },
                    include: [
                        { model: ProductImage_1.ProductImage, as: 'productImage' },
                        { model: Merchant_1.Merchant, as: 'merchantInfo' },
                        { model: Category_1.Category, as: 'categories' },
                        { model: SubCategory_1.SubCategory, as: 'subCategories' }
                    ],
                })
                    .then((data) => {
                    res.json({ status: true, message: data });
                })
                    .catch((err) => {
                    res.json({ status: false, message: err });
                });
            }
            catch (err) {
                res.json({ status: false, message: err });
            }
        });
        this.myProducts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const offset = req.query.offset ? req.query.offset : 0;
            const limit = req.query.limit ? req.query.limit : 102;
            try {
                const userId = req.user.id;
                yield Product_1.Product.findAndCountAll({
                    offset: Number(offset),
                    limit: Number(limit),
                    where: {
                        merchantId: userId,
                    },
                    include: [
                        { model: ProductImage_1.ProductImage, as: 'productImage' },
                        { model: Merchant_1.Merchant, as: 'merchantInfo' },
                        { model: Category_1.Category, as: 'categories' },
                        { model: SubCategory_1.SubCategory, as: 'subCategories' }
                    ],
                })
                    .then((data) => {
                    res.json({ status: true, message: data });
                })
                    .catch((err) => {
                    res.json({ status: false, message: err });
                });
            }
            catch (err) {
                res.json({ status: false, message: err });
            }
        });
    }
    all(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 10;
        Product_1.Product.findAll({
            offset: Number(offset),
            limit: Number(limit),
            include: [
                { model: Category_1.Category, as: 'categories' },
                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                { model: ProductImage_1.ProductImage, as: 'productImage' },
            ],
            order: [
                sequelize_1.Sequelize.fn('RAND'),
            ],
        })
            .then((products) => {
            res.json({ status: true, products });
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    allWithCount(req, res) {
        //const offset = req.query.offset ? req.query.offset : 0;
        //const limit = req.query.limit ? req.query.limit : 10;
        let perPage = req.query.per_page ? req.query.per_page : 10;
        let page = req.query.page ? req.query.page : 1;
        const offset = (page * perPage) - perPage;
        Product_1.Product.findAndCountAll({
            offset: Number(offset),
            limit: Number(perPage),
            include: [
                { model: Category_1.Category, as: 'categories' },
                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                { model: ProductImage_1.ProductImage, as: 'productImage' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((products) => {
            res.json({ status: true, products });
        })
            .catch((err) => {
            res.status(500).json(err);
            console.log('I am an error' + err);
        });
    }
    productsWithoutSubCat(req, res) {
        //const offset = req.query.offset ? req.query.offset : 0;
        //const limit = req.query.limit ? req.query.limit : 10;
        let perPage = req.query.per_page ? req.query.per_page : 10;
        let page = req.query.page ? req.query.page : 1;
        const offset = (page * perPage) - perPage;
        Product_1.Product.findAndCountAll({
            offset: Number(offset),
            limit: Number(perPage),
            where: { subCategoryId: 0 },
            include: [
                { model: Category_1.Category, as: 'categories' },
                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                { model: ProductImage_1.ProductImage, as: 'productImage' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((products) => {
            res.json({ status: true, products });
        })
            .catch((err) => {
            res.status(500).json(err);
            console.log('I am an error' + err);
        });
    }
    approved(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 102;
        Product_1.Product.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { approved: 1 },
            include: [
                { model: Category_1.Category, as: 'categories' },
                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                { model: ProductImage_1.ProductImage, as: 'productImage' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((products) => {
            res.json({ status: true, products });
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    disapproved(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 102;
        Product_1.Product.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { approved: 0 },
            include: [
                { model: Category_1.Category, as: 'categories' },
                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                { model: Merchant_1.Merchant, as: 'merchantInfo' },
                { model: ProductImage_1.ProductImage, as: 'productImage' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((products) => {
            res.json({ status: true, products });
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            // Make Sure all fields are not empty
            if (!req.body.name ||
                !req.body.categoryId ||
                !req.body.subCategoryId ||
                !req.body.merchantId ||
                !req.body.specification ||
                !req.body.price ||
                !req.body.unit ||
                !req.body.mo ||
                !req.body.weight ||
                !req.body.description ||
                !req.body.goodsInStock ||
                req.body.visible === null ||
                req.body.approved === null) {
                res.status(400).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                // Check if Category Exist
                const catID = parseInt(req.body.categoryId);
                const subCatID = parseInt(req.body.subCategoryId);
                const catExist = yield Category_1.Category.findOne({ where: { id: catID } });
                const subCatExist = yield SubCategory_1.SubCategory.findOne({ where: { id: subCatID } });
                if (catExist === null || subCatExist === null) {
                    res.status(400).json({ status: false, message: 'Category or SubCategory does not exist' });
                }
                else {
                    Product_1.Product.create(params)
                        .then((product) => {
                        res.status(201).json(product);
                    })
                        .catch((err) => { console.log(err); res.status(500).json(err); });
                }
            }
        });
    }
    findProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id;
            if (!productId) {
                res.status(400).json({ status: false, message: 'Product Id has not been passed' });
            }
            else {
                const productIdExist = yield Product_1.Product.findByPk(productId);
                if (productIdExist !== null) {
                    Product_1.Product.findOne({
                        where: { id: productId, },
                        include: [
                            { model: Category_1.Category, as: 'categories' },
                            { model: SubCategory_1.SubCategory, as: 'subCategories' },
                            { model: Merchant_1.Merchant, as: 'merchantInfo' },
                            { model: ProductImage_1.ProductImage, as: 'productImage' },
                        ],
                    })
                        .then((product) => {
                        res.json({ status: true, product });
                    })
                        .catch((err) => {
                        res.status(500).json(err);
                    });
                }
                else {
                    res.json({ status: false, message: 'Product ID does not Exist' });
                }
            }
        });
    }
    // TODO return after every requests...
    updateProduct(req, res) {
        const productId = req.params.id;
        const data = req.body;
        Product_1.Product.findByPk(productId)
            .then((product) => {
            // Check if product was found
            if (!product) {
                return res.json({ status: false, message: 'Product not found' });
            }
            // Check if a data as passed
            if (!data) {
                return res.json({ status: false, message: 'Please provide some data' });
            }
            // Remove the Id Key from the data passed
            if (data.id) {
                delete data.id;
            }
            // Update the data to database
            product
                .update(data)
                .then(() => {
                console.log(data);
                res.status(200).json({
                    status: true,
                    message: 'Product Updated successfully',
                    info: data,
                });
            })
                .catch((err) => {
                res.json({ err });
            });
        })
            .catch((err) => {
            console.log(err);
            res.status(500).json({
                err,
            });
        });
    }
    deleteProduct(req, res) {
        const productId = req.params.id;
        try {
            const user = req.user.id;
            Product_1.Product.findByPk(productId)
                .then((product) => {
                if (!product) {
                    return res.json({ status: false, message: 'Product not found' });
                }
                Product_1.Product.destroy({
                    where: {
                        id: productId,
                    },
                })
                    .then(() => {
                    res.json({ status: true, message: 'Product deleted successfully' });
                })
                    .catch((err) => {
                    res.json({ err });
                });
            })
                .catch((err) => {
                return res.status(500).json({
                    err,
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    disapproveProduct(req, res) {
        const productId = req.params.id;
        try {
            const user = req.user.id;
            Product_1.Product.findByPk(productId)
                .then((product) => {
                if (!product) {
                    return res.json({ status: false, message: 'Product not found' });
                }
                Product_1.Product.update({ approved: 0, visible: 0 }, {
                    where: {
                        id: productId,
                    },
                })
                    .then(() => {
                    res.json({ status: true, message: 'Product Disapproved successfully' });
                })
                    .catch((err) => {
                    res.json({ err });
                });
            })
                .catch((err) => {
                return res.status(500).json({
                    err,
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    approveProduct(req, res) {
        const productId = req.params.id;
        try {
            const user = req.user.id;
            Product_1.Product.findByPk(productId)
                .then((product) => {
                if (!product) {
                    return res.json({ status: false, message: 'Product not found' });
                }
                Product_1.Product.update({ approved: 1, visible: 1 }, {
                    where: {
                        id: productId,
                    },
                })
                    .then(() => {
                    res.json({ status: true, message: 'Product Approved successfully' });
                })
                    .catch((err) => {
                    res.json({ err });
                });
            })
                .catch((err) => {
                return res.status(500).json({
                    err,
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    }
    fetchByMarket(req, res) {
        const market = req.params.market;
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 102;
        if (!market) {
            return res.json({ status: false, message: 'Market has not been passed as a param' });
        }
        Product_1.Product.findAndCountAll({
            offset: Number(offset),
            limit: Number(limit),
            include: [
                { model: Merchant_1.Merchant, as: 'merchantInfo', where: { market } },
                { model: Category_1.Category, as: 'categories' },
                { model: SubCategory_1.SubCategory, as: 'subCategories' },
                { model: ProductImage_1.ProductImage, as: 'productImage' },
            ],
        })
            .then((products) => {
            return res.json({ status: true, products });
        })
            .catch((err) => {
            return res.json({ status: false, err });
        });
    }
    fetchByCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const catId = req.params.id;
            const offset = req.query.offset ? req.query.offset : 0;
            const limit = req.query.limit ? req.query.limit : 102;
            if (!catId) {
                return res.json({ status: false, message: 'Market has not been passed as a param' });
            }
            const catExist = yield Category_1.Category.findOne({ where: { id: catId } });
            if (catExist === null) {
                res.status(400).json({ status: false, message: 'CategoryId not exist' });
            }
            else {
                Product_1.Product.findAndCountAll({
                    where: {
                        categoryId: catId,
                        visible: 1
                    },
                    offset: Number(offset),
                    limit: Number(limit),
                    include: [
                        { model: Merchant_1.Merchant, as: 'merchantInfo' },
                        { model: Category_1.Category, as: 'categories' },
                        { model: SubCategory_1.SubCategory, as: 'subCategories' },
                        { model: ProductImage_1.ProductImage, as: 'productImage' },
                    ],
                })
                    .then((products) => {
                    return res.json({ status: true, products });
                })
                    .catch((err) => {
                    return res.json({ status: false, err });
                });
            }
        });
    }
    fetchBySubCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const subCategoryId = req.params.id;
            const offset = req.query.offset ? req.query.offset : 0;
            const limit = req.query.limit ? req.query.limit : 102;
            if (!subCategoryId) {
                return res.json({ status: false, message: 'Market has not been passed as a param' });
            }
            const catExist = yield SubCategory_1.SubCategory.findOne({ where: { id: subCategoryId } });
            if (catExist === null) {
                res.status(400).json({ status: false, message: 'Sub CategoryId not exist' });
            }
            else {
                Product_1.Product.findAndCountAll({
                    where: {
                        subCategoryId: subCategoryId,
                        visible: 1
                    },
                    offset: Number(offset),
                    limit: Number(limit),
                    include: [
                        { model: Merchant_1.Merchant, as: 'merchantInfo' },
                        { model: Category_1.Category, as: 'categories' },
                        { model: ProductImage_1.ProductImage, as: 'productImage' },
                    ],
                })
                    .then((products) => {
                    return res.json({ status: true, products: products, SubCategory: catExist });
                })
                    .catch((err) => {
                    return res.json({ status: false, err });
                });
            }
        });
    }
}
exports.ProductController = ProductController;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ImgParams = req.body;
    const productId = req.body.productId;
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
        const s3Client = s3_config_1.default.s3Client;
        const params = s3_config_1.default.uploadParams;
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
                ProductImage_1.ProductImage.create(ImgParams)
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
