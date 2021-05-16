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
exports.AddressBookController = void 0;
const AddressBook_1 = require("../models/AddressBook");
class AddressBookController {
    all(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        const customerId = req.user.id;
        AddressBook_1.AddressBook.findAll({
            offset: Number(offset),
            limit: Number(limit),
            where: { customerId: customerId },
            order: [['createdAt', 'DESC']],
        })
            .then((categories) => {
            res.status(200).json(categories);
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            const customerId = req.user.id;
            const firstName = req.body.firstName;
            const lastName = req.body.lastName;
            const phoneNumber = req.body.phoneNumber;
            const region = req.body.region;
            const state = req.body.state;
            const city = req.body.city;
            const address = req.body.address;
            if (!firstName || !lastName || !phoneNumber || !region || !city || !address) {
                res.status(400).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                const addressbk = yield AddressBook_1.AddressBook.findOne({
                    where: {
                        firstName: firstName,
                        lastName: lastName,
                        phoneNumber: phoneNumber,
                        region: region,
                        state: state,
                        city: city,
                        address: address,
                    },
                });
                console.log("gotcha ", addressbk);
                if (addressbk !== null) {
                    res.status(409).json({
                        status: false,
                        message: 'address already exist',
                    });
                }
                else {
                    params.customerId = customerId;
                    params.default = req.body.default || false;
                    AddressBook_1.AddressBook.create(params)
                        .then((data) => res.status(201).json(data))
                        .catch((err) => res.status(500).json(err));
                }
            }
        });
    }
    update(req, res) {
        AddressBook_1.AddressBook.update(req.body, {
            fields: Object.keys(req.body),
            where: { id: req.params.id },
        })
            .then((affectedRows) => {
            if (Number(affectedRows) === 0) {
                res.json({
                    status: false,
                    message: 'AddressBook ID does not exist',
                });
            }
            else {
                res.json({
                    status: true,
                    message: 'AddressBook Updated Successfully',
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
    delete(req, res) {
        AddressBook_1.AddressBook.destroy({
            where: { id: req.params.id },
        })
            .then((removedRows) => {
            if (Number(removedRows) === 0) {
                res.json({
                    removedRows,
                    status: false,
                    message: 'AddressBook ID not found',
                });
            }
            else {
                res.json({
                    removedRows,
                    status: true,
                    message: 'AddressBook Deleted Successfully',
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
exports.AddressBookController = AddressBookController;
