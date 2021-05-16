"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const sequelize_1 = require("sequelize");
const Customer_1 = require("../models/Customer");
class CustomerController {
    index(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Customer_1.Customer.findAll({
            offset: Number(offset),
            limit: Number(limit),
            order: [['createdAt', 'DESC']],
        })
            .then((customers) => res.json({ status: true, customers }))
            .catch((err) => res.status(500).json({ status: false, err }));
    }
    approved(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Customer_1.Customer.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { approved: 1 },
            order: [['createdAt', 'DESC']],
        })
            .then((customers) => res.json({ status: true, customers }))
            .catch((err) => res.status(500).json({ status: false, err }));
    }
    disapproved(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Customer_1.Customer.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { approved: 0 },
            order: [['createdAt', 'DESC']],
        })
            .then((customers) => res.json({ status: true, customers }))
            .catch((err) => res.status(500).json({ status: false, err }));
    }
    disapproveCustomer(req, res) {
        const customerId = req.params.id;
        try {
            const user = req.user.id;
            Customer_1.Customer.findByPk(customerId)
                .then((customer) => {
                if (!customer) {
                    return res.json({ status: false, message: 'Customer not found' });
                }
                Customer_1.Customer.update({ approved: 0 }, {
                    where: {
                        id: customerId,
                    },
                })
                    .then(() => {
                    res.json({ status: true, message: 'Customer Disapproved successfully' });
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
    approveCustomer(req, res) {
        const customerId = req.params.id;
        try {
            const user = req.user.id;
            Customer_1.Customer.findByPk(customerId)
                .then((customer) => {
                if (!customer) {
                    return res.json({ status: false, message: 'Customer not found' });
                }
                Customer_1.Customer.update({ approved: 1 }, {
                    where: {
                        id: customerId,
                    },
                })
                    .then(() => {
                    res.json({ status: true, message: 'Customer Approved successfully' });
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
    searchCustomer(req, res) {
        const searchQuery = req.params.search;
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        if (!searchQuery) {
            return res.json({ status: false, message: 'Invalid search parameters' });
        }
        Customer_1.Customer.findAndCountAll({
            offset: Number(offset),
            limit: Number(limit),
            where: {
                [sequelize_1.Op.or]: [
                    { firstName: { [sequelize_1.Op.like]: '%' + searchQuery + '%' } },
                    { lastName: { [sequelize_1.Op.like]: '%' + searchQuery + '%' } },
                ],
            }
        }).then((customers) => {
            res.json({ status: true, customers });
        })
            .catch((err) => {
            res.status(500).json({ status: false, err });
        });
    }
    // Todo
    update() { }
    destroy() { }
}
exports.CustomerController = CustomerController;
