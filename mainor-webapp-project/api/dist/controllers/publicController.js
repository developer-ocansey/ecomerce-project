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
exports.PublicController = void 0;
const Admin_1 = require("../models/Admin");
const Customer_1 = require("../models/Customer");
const Merchant_1 = require("../models/Merchant");
const Order_1 = require("../models/Order");
const Product_1 = require("../models/Product");
const ProductImage_1 = require("../models/ProductImage");
const Market_1 = require("../models/Market");
const PickupAddress_1 = require("../models/PickupAddress");
const PriceTable_1 = require("../models/PriceTable");
const index_1 = require("../utils/index");
const s3_config_js_1 = __importDefault(require("../config/s3.config.js"));
const utils = new index_1.Utils();
class PublicController {
    constructor() {
        this.getMarkets = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = req.query.offset ? req.query.offset : 0;
                const limit = req.query.limit ? req.query.limit : 15;
                const market = yield Market_1.Market.findAll({
                    offset: Number(offset),
                    limit: Number(limit),
                    order: [['createdAt', 'ASC']],
                });
                if (market) {
                    res.status(200).json({
                        status: true,
                        data: market
                    });
                    return;
                }
                res.status(404).json('No market found');
            }
            catch (error) {
                console.error(error);
            }
        });
        this.getPrices = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const partner = req.params.partner;
                const destination = req.params.destination;
                const weight = req.params.weight;
                const prices = yield PriceTable_1.PriceTable.findAll({
                    where: {
                        partnerSlug: partner,
                        destination: destination,
                        weight: weight,
                    }
                });
                if (prices) {
                    res.status(200).json({
                        status: true,
                        data: prices
                    });
                    return;
                }
                res.status(404).json('No price found using this parameters found');
            }
            catch (error) {
                console.error(error);
            }
        });
        this.getPickupDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const pickupDetails = yield PickupAddress_1.PickupAddress.findByPk(1);
                if (pickupDetails) {
                    res.status(200).json({
                        status: true,
                        data: pickupDetails
                    });
                    return;
                }
                res.status(404).json('No delivery details');
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    healthz(req, res) {
        res.json('We are live and all ok go bcd.ng');
    }
    upload(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3Client = s3_config_js_1.default.s3Client;
                const params = s3_config_js_1.default.uploadParams;
                params.Key = req.file.originalname;
                params.Body = req.file.buffer;
                params.ACL = 'public-read';
                s3Client.upload(params, (err, data) => {
                    if (err) {
                        res.status(500).json({ error: 'Error -> ' + err });
                    }
                    res.json({ data: data, message: 'File uploaded successfully! -> keyname = ' + req.file.originalname });
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    uploadMultiple(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const s3Client = s3_config_js_1.default.s3Client;
                const params = s3_config_js_1.default.uploadParams;
                params.ACL = 'public-read';
                let result = [];
                const files = JSON.parse(JSON.stringify(req.files));
                files.map((f) => {
                    params.Key = f.originalname;
                    params.Body = f.buffer;
                    s3Client.upload(params, (err, data) => {
                        if (err) {
                            res.status(500).json({ error: 'Error -> ' + err });
                        }
                        result.push(data.Location);
                    });
                });
                res.json({ data: result, message: 'Uploaded multiple files ' });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    overview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderCount = yield Order_1.Order.count({});
                const productCount = yield Product_1.Product.count({});
                const merchantCount = yield Merchant_1.Merchant.count({});
                const customerCount = yield Customer_1.Customer.count({});
                const adminCount = yield Admin_1.Admin.count({});
                const usersCount = merchantCount + customerCount;
                const completedOrder = yield Order_1.Order.count({
                    where: {
                        orderStatusId: 3,
                    },
                });
                res.json({
                    status: true,
                    data: {
                        orderCount,
                        productCount,
                        merchantCount,
                        customerCount,
                        adminCount,
                        usersCount,
                        completedOrder,
                    },
                });
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    merchantImport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var input = {};
            Object.keys(input).map((n, index) => {
                const params = req.body;
                params.firstName = input[n].firstName,
                    params.lastName = input[n].lastName,
                    params.email = input[n].emailAddress,
                    params.password = '',
                    params.phone = input[n].phoneNumber,
                    params.businessName = input[n].businessName,
                    params.businessLogo = '',
                    params.rcNumber = input[n].rcNumber,
                    params.location = `${input[n].lat},${input[n].lon}`,
                    params.businessAddress = input[n].businessAddress,
                    params.market = input[n].market,
                    params.planId = 0,
                    params.isVerified = 'true',
                    params.approved = 1,
                    Merchant_1.Merchant.create(params)
                        .then(() => {
                        console.log('inserted');
                    })
                        .catch((err) => res.status(500).json(err));
            });
        });
    }
    productImport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var input = {};
            Object.keys(input).map((n, index) => {
                //   let cat = 0
                //   if (input[n].productCategory === 'Door'){
                //     cat = 1
                //   }else if (input[n].productCategory === 'Tiles'){
                //     cat = 2
                //   }else if (input[n].productCategory === 'Sanitary Wares'){
                //     cat = 3
                //   }else if (input[n].productCategory === 'Electrical Materials'){
                //     cat = 4
                //   }else {
                //     cat = 1
                //   }
                //   const params: ProductInterface = req.body
                //       params.name = input[n].productName;
                //       params.categoryId = cat;
                //       params.subCategoryId = 0;
                //       params.merchantId = parseInt(input[n].merchantId);
                //       params.price = Number(input[n].productunitPrice.replace(/\,/g,''));
                //       params.specification = '';
                //       params.unit= input[n].productunit;
                //       params.mo = 15;
                //       params.description = input[n].productDescription;
                //       params.goodsInStock=  100;
                //       params.visible = true;
                //       params.approved = true;
                // Product.create<Product>(params)
                //   .then(() => {
                //       console.log('Inserted')
                //   })
                //   .catch((err: Error) => res.status(500).json(err));
                if (input[n].hasOwnProperty(`productImageUrl3`)) {
                    const params = req.body;
                    params.productId = parseInt(input[n].pid);
                    params.imageURL = input[n].productImageUrl3;
                    ProductImage_1.ProductImage.create(params)
                        .then(() => {
                        console.log("hello world");
                    })
                        .catch((err) => console.log(err));
                }
            });
        });
    }
}
exports.PublicController = PublicController;
