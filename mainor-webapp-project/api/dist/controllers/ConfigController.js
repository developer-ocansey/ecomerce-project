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
exports.ConfigController = void 0;
const Config_1 = require("../models/Config");
const PriceTable_1 = require("../models/PriceTable");
class ConfigController {
    find(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = req.params.key;
            if (!key) {
                res.status(400).json({ status: false, message: 'config key was not been passed' });
            }
            else {
                const configExist = yield Config_1.Config.findOne({
                    where: { key: key },
                });
                if (configExist !== null) {
                    Config_1.Config.findOne({
                        where: { key: key },
                    })
                        .then((config) => {
                        res.json({ status: true, config });
                    })
                        .catch((err) => {
                        res.status(500).json(err);
                    });
                }
                else {
                    res.json({ status: false, message: 'Config ID does not Exist' });
                }
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const key = req.params.key;
            if (!key) {
                res.status(400).json({ status: false, message: 'config key was not been passed' });
            }
            else {
                const configExist = yield Config_1.Config.findOne({
                    where: { key: key },
                });
                if (configExist !== null) {
                    Config_1.Config.update(data, { where: { key: key } })
                        .then(() => {
                        console.log(data);
                        res.status(200).json({
                            status: true,
                            message: 'Config Updated successfully',
                            info: data,
                        });
                    })
                        .catch((err) => {
                        res.json({ err });
                    });
                }
                else {
                    res.json({ status: false, message: 'Config ID does not Exist' });
                }
            }
        });
    }
    logisticPartners(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            PriceTable_1.PriceTable.findAll({
                attributes: ['partnerSlug'],
                group: 'partnerSlug',
            })
                .then((partners) => {
                res.json({ status: true, partners });
            })
                .catch((err) => {
                res.json({ err });
            });
        });
    }
    fetchLogisticPartner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const partnerSlug = req.params.partner;
            PriceTable_1.PriceTable.findAll({
                where: {
                    partnerSlug,
                },
            })
                .then((data) => {
                res.json({ status: true, data });
            })
                .catch((err) => {
                res.json({ err });
            });
        });
    }
    fetchLogisticPartnerAndState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const partnerSlug = req.params.partner;
            const destination = req.params.destination;
            PriceTable_1.PriceTable.findAll({
                where: {
                    destination,
                    partnerSlug,
                },
            })
                .then((data) => {
                res.json({ status: true, data });
            })
                .catch((err) => {
                res.json({ err });
            });
        });
    }
    updatePriceTable(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const id = req.params.id;
            if (!id) {
                res.status(400).json({ status: false, message: 'Id not Passed' });
            }
            else {
                const idExist = yield PriceTable_1.PriceTable.findOne({
                    where: { id },
                });
                if (idExist !== null) {
                    PriceTable_1.PriceTable.update(data, { where: { id } })
                        .then(() => {
                        res.status(200).json({
                            status: true,
                            message: 'Data Updated successfully',
                            info: data,
                        });
                    })
                        .catch((err) => {
                        res.json({ err });
                    });
                }
                else {
                    res.json({ status: false, message: 'ID does not Exist' });
                }
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            if (!req.body.partnerSlug || !req.body.destination || !req.body.weight || !req.body.price) {
                res.status(500).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                PriceTable_1.PriceTable.create(params)
                    .then((partner) => res.status(201).json({ status: true, message: 'Data Added Successfully', partner }))
                    .catch((err) => {
                    console.log(err);
                    res.status(500).json({ status: false, err });
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            PriceTable_1.PriceTable.destroy({
                where: { id: req.params.id },
            })
                .then((removedRows) => {
                if (Number(removedRows) === 0) {
                    res.json({
                        removedRows,
                        status: false,
                        message: 'ID not found',
                    });
                }
                else {
                    res.json({
                        removedRows,
                        status: true,
                        message: 'Deleted Successfully',
                    });
                }
            })
                .catch((err) => {
                res.json({
                    err,
                    status: false,
                });
            });
        });
    }
}
exports.ConfigController = ConfigController;
