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
exports.DisputeController = void 0;
const Dispute_1 = require("../models/Dispute");
const index_1 = require("../utils/index");
const Customer_1 = require("../models/Customer");
const Merchant_1 = require("../models/Merchant");
const Order_1 = require("../models/Order");
const utils = new index_1.Utils();
class DisputeController {
    index(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Dispute_1.Dispute.findAll({
            offset: Number(offset),
            limit: Number(limit),
            include: [
                { model: Order_1.Order, as: 'order' },
                { model: Customer_1.Customer, as: 'customer' },
                { model: Merchant_1.Merchant, as: 'merchant' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((disputes) => res.json({ status: true, disputes }))
            .catch((err) => res.status(500).json(err));
    }
    pendingDisputes(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Dispute_1.Dispute.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { disputeStatus: null },
            include: [
                { model: Order_1.Order, as: 'order' },
                { model: Customer_1.Customer, as: 'customer' },
                { model: Merchant_1.Merchant, as: 'merchant' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((disputes) => res.json({ status: true, disputes }))
            .catch((err) => res.status(500).json(err));
    }
    resolvedDisputes(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Dispute_1.Dispute.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { disputeStatus: "Resolved" },
            include: [
                { model: Order_1.Order, as: 'order' },
                { model: Customer_1.Customer, as: 'customer' },
                { model: Merchant_1.Merchant, as: 'merchant' },
            ],
            order: [['createdAt', 'DESC']],
        })
            .then((disputes) => res.json({ status: true, disputes }))
            .catch((err) => res.status(500).json(err));
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.user.id;
                let user = yield utils.getUserData('customer', id);
                if (!user) {
                    return res.status(401).json({
                        message: 'User does not exist',
                    });
                }
                const merchantExist = yield Merchant_1.Merchant.findOne({ where: { id: req.body.merchantId } });
                const orderIdExist = yield Order_1.Order.findOne({ where: { id: req.body.orderId } });
                if (merchantExist === null) {
                    return res.status(401).json({
                        message: 'Merchant does not exist',
                    });
                }
                if (orderIdExist === null) {
                    return res.status(401).json({
                        message: 'Order does not exist',
                    });
                }
                if (!req.body.merchantId || !req.body.orderId || !req.body.complaint || !req.body.category) {
                    res.status(400).json({ status: false, message: 'All fields are required' });
                }
                else {
                    req.body.customerId = user.id;
                    const params = req.body;
                    Dispute_1.Dispute.create(params)
                        .then((dispute) => {
                        res.status(201).json({ dispute });
                    })
                        .catch((err) => {
                        res.status(500).json({ err });
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    message: error.message,
                });
            }
        });
    }
    updateDispute(req, res) {
        const disputeId = req.params.id;
        const data = req.body;
        Dispute_1.Dispute.findByPk(disputeId)
            .then((dispute) => {
            // Check if product was found
            if (!dispute) {
                return res.json({ status: false, message: 'Dispute does not exist' });
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
            dispute
                .update(data)
                .then(() => {
                console.log(data);
                res.status(200).json({
                    status: true,
                    message: 'Dispute Updated successfully',
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
}
exports.DisputeController = DisputeController;
