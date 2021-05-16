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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MerchantController = void 0;
const sequelize_1 = require("sequelize");
const Merchant_1 = require("../models/Merchant");
class MerchantController {
    all(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 200;
        Merchant_1.Merchant.findAll({
            offset: Number(offset),
            limit: Number(limit),
        })
            .then((merchants) => {
            res.json({ status: true, merchants });
        })
            .catch((err) => {
            res.status(500).json({ status: false, err });
        });
    }
    viewOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            Merchant_1.Merchant.findOne({
                where: {
                    id,
                },
            })
                .then((merchant) => {
                res.status(200).json({ status: true, merchant });
            })
                .catch((err) => {
                res.status(500).json({ err, status: false });
            });
        });
    }
    updateMerchant(req, res) {
        const productId = req.params.id;
        const data = req.body;
        Merchant_1.Merchant.findByPk(productId)
            .then((merchant) => {
            // Check if product was found
            if (!merchant) {
                return res.json({ status: false, message: 'Merchant not found' });
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
            merchant
                .update(data)
                .then(() => {
                console.log(data);
                res.status(200).json({
                    status: true,
                    message: 'Merchant data updated successfully',
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
    approved(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Merchant_1.Merchant.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { approved: 1 },
        })
            .then((merchants) => {
            res.json({ status: true, merchants });
        })
            .catch((err) => {
            res.status(500).json({ status: false, err });
        });
    }
    disapproved(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Merchant_1.Merchant.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { approved: 0 },
        })
            .then((merchants) => {
            res.json({ status: true, merchants });
        })
            .catch((err) => {
            res.status(500).json({ status: false, err });
        });
    }
    disapproveMerchant(req, res) {
        const merchantId = req.params.id;
        try {
            const user = req.user.id;
            Merchant_1.Merchant.findByPk(merchantId)
                .then((merchant) => {
                if (!merchant) {
                    return res.json({ status: false, message: 'Merchant not found' });
                }
                Merchant_1.Merchant.update({ approved: 0 }, {
                    where: {
                        id: merchantId,
                    },
                })
                    .then(() => {
                    res.json({ status: true, message: 'Merchant Disapproved successfully' });
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
    approveMerchant(req, res) {
        const merchantId = req.params.id;
        try {
            const user = req.user.id;
            Merchant_1.Merchant.findByPk(merchantId)
                .then((merchant) => {
                if (!merchant) {
                    return res.json({ status: false, message: 'Merchant not found' });
                }
                Merchant_1.Merchant.update({ approved: 1 }, {
                    where: {
                        id: merchantId,
                    },
                })
                    .then(() => {
                    res.json({ status: true, message: 'Merchant Approved successfully' });
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
    searchMerchant(req, res) {
        const searchQuery = req.params.search;
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        if (!searchQuery) {
            return res.json({ status: false, message: 'Invalid search parameters' });
        }
        Merchant_1.Merchant.findAndCountAll({
            offset: Number(offset),
            limit: Number(limit),
            where: {
                [sequelize_1.Op.or]: [
                    { firstName: { [sequelize_1.Op.like]: '%' + searchQuery + '%' } },
                    { lastName: { [sequelize_1.Op.like]: '%' + searchQuery + '%' } },
                    { businessName: { [sequelize_1.Op.like]: '%' + searchQuery + '%' } },
                ],
            },
        })
            .then((merchants) => {
            res.json({ status: true, merchants });
        })
            .catch((err) => {
            res.status(500).json({ status: false, err });
        });
    }
}
exports.MerchantController = MerchantController;
