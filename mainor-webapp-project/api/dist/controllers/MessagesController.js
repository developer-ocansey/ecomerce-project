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
exports.MessagesController = void 0;
const AdjustPrice_1 = require("../models/AdjustPrice");
const MessageList_1 = require("../models/MessageList");
const Messages_1 = require("../models/Messages");
const Customer_1 = require("../models/Customer");
const Merchant_1 = require("../models/Merchant");
const Product_1 = require("../models/Product");
const ProductImage_1 = require("../models/ProductImage");
class MessagesController {
    createMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            const customerId = req.user.id;
            const productId = req.body.productId;
            const merchantId = req.body.merchantId;
            const title = req.body.title;
            if (!productId || !customerId || !merchantId || !title) {
                res.status(400).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                const checkMessage = yield MessageList_1.MessageList.findOne({
                    where: {
                        customerId: customerId,
                        productId: productId,
                        merchantId: merchantId,
                        title: title
                    },
                });
                if (checkMessage !== null) {
                    res.status(200).json({
                        status: true,
                        message: checkMessage
                    });
                }
                else {
                    params.customerId = customerId;
                    MessageList_1.MessageList.create(params)
                        .then((data) => res.status(201).json(data))
                        .catch((err) => res.status(500).json(err));
                }
            }
        });
    }
    getMessageList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerId = req.user.id;
            yield MessageList_1.MessageList.findAll({
                where: { customerId: customerId },
                include: [
                    { model: Product_1.Product, as: 'product', include: [{ model: Merchant_1.Merchant, as: 'merchantInfo' }] },
                ],
                order: [['createdAt', 'DESC']],
            })
                .then((result) => {
                res.status(200).json({ status: true, data: result, message: 'successful' });
            })
                .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageId = req.params.id;
            yield Messages_1.Messages.findAll({
                where: { messageListId: messageId },
            })
                .then((data) => {
                MessageList_1.MessageList.findByPk(messageId, {
                    include: [
                        { model: Product_1.Product, as: 'product', include: [{ model: Merchant_1.Merchant, as: 'merchantInfo' }, { model: ProductImage_1.ProductImage, as: 'productImage' }] }
                    ]
                }).then((result) => {
                    res.status(200).json({ status: true, data: data, message: 'successful', list: result });
                })
                    .catch((err) => {
                    console.log(err);
                    res.status(500).json(err);
                });
            })
                .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
        });
    }
    getMessageList_M(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const merchantId = req.user.id;
            yield MessageList_1.MessageList.findAll({
                where: { merchantId: merchantId },
                include: [
                    { model: Customer_1.Customer, as: 'customerInfo' },
                    { model: Product_1.Product, as: 'product' }
                ]
            })
                .then((result) => {
                res.status(200).json({ status: true, data: result, message: 'successful' });
            })
                .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
        });
    }
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerId = req.user.id;
            yield Messages_1.Messages.findAndCountAll({
                where: { customerId: customerId },
                include: [
                    { model: Product_1.Product, as: 'product', include: [{ model: Merchant_1.Merchant, as: 'merchantInfo' }, { model: ProductImage_1.ProductImage, as: 'productImage' }] },
                ]
            })
                .then((result) => {
                res.status(200).json({ status: true, data: result, message: 'successful' });
            })
                .catch((err) => {
                res.status(500).json(err);
            });
        });
    }
    addMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            console.log(params);
            if (!req.body.messageListId || !req.body.message || !req.body.sentBy) {
                res.status(400).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                Messages_1.Messages.create(params)
                    .then((data) => res.status(201).json(data))
                    .catch((err) => res.status(500).json(err));
            }
        });
    }
    createAgreedPrice(req, res) {
        AdjustPrice_1.AdjustPrice.update(req.body, {
            fields: Object.keys(req.body),
            where: { id: req.params.id },
        })
            .then((affectedRows) => {
            if (Number(affectedRows) === 0) {
                res.json({
                    status: false,
                    message: 'Adjust price does not exist',
                });
            }
            else {
                res.json({
                    status: true,
                    message: 'Adjust price Updated Successfully',
                    affectedRows: Number(affectedRows),
                });
            }
        })
            .catch((err) => {
            res.json({
                err,
                status: false,
            });
        });
    }
}
exports.MessagesController = MessagesController;
