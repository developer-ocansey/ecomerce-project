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
exports.FAQController = void 0;
const FAQ_1 = require("../models/FAQ");
const FAQCategory_1 = require("../models/FAQCategory");
class FAQController {
    all(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        FAQCategory_1.FAQCategory.findAll({
            offset: Number(offset),
            limit: Number(limit),
            include: [{ association: FAQCategory_1.FAQCategory.FAQ, as: 'faq' }],
            order: [['createdAt', 'ASC']],
        })
            .then((faq) => {
            res.status(200).json(faq);
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    index(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        FAQCategory_1.FAQCategory.findAll({
            offset: Number(offset),
            limit: Number(limit),
            order: [['createdAt', 'DESC']],
        })
            .then((faq) => {
            res.json(faq);
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    findCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const faqId = req.params.id;
            if (!faqId) {
                res.status(400).json({ status: false, message: 'FAQ ID was not been passed' });
            }
            else {
                const faqExist = yield FAQCategory_1.FAQCategory.findByPk(faqId);
                if (faqExist !== null) {
                    FAQCategory_1.FAQCategory.findOne({
                        where: { id: faqId, },
                        include: [
                            { model: FAQ_1.FAQ, as: 'faq' },
                        ],
                    })
                        .then((faqCategory) => {
                        res.json({ status: true, faqCategory });
                    })
                        .catch((err) => {
                        res.status(500).json(err);
                    });
                }
                else {
                    res.json({ status: false, message: 'FAQCategory ID does not Exist' });
                }
            }
        });
    }
    findFAQ(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const faqId = req.params.id;
            if (!faqId) {
                res.status(400).json({ status: false, message: 'FAQ ID was not been passed' });
            }
            else {
                const faqExist = yield FAQ_1.FAQ.findByPk(faqId);
                if (faqExist !== null) {
                    FAQ_1.FAQ.findOne({
                        where: { id: faqId, },
                    })
                        .then((faq) => {
                        res.json({ status: true, faq });
                    })
                        .catch((err) => {
                        res.status(500).json(err);
                    });
                }
                else {
                    res.json({ status: false, message: 'FAQ ID does not Exist' });
                }
            }
        });
    }
}
exports.FAQController = FAQController;
