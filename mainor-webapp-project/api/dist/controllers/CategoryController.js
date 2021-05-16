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
exports.CategoryController = void 0;
const Category_1 = require("../models/Category");
class CategoryController {
    all(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Category_1.Category.findAll({
            offset: Number(offset),
            limit: Number(limit),
            include: [{ association: Category_1.Category.SubCategory, as: 'subCategories' }],
            order: [['createdAt', 'DESC']],
        })
            .then((categories) => {
            res.status(200).json(categories);
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    index(req, res) {
        const offset = req.query.offset ? req.query.offset : 0;
        const limit = req.query.limit ? req.query.limit : 15;
        Category_1.Category.findAll({
            offset: Number(offset),
            limit: Number(limit),
            order: [['createdAt', 'DESC']],
        })
            .then((categories) => {
            res.json(categories);
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            if (!req.body.name || !req.body.alias) {
                res.status(500).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                const catName = req.body.name;
                const catExist = yield Category_1.Category.findOne({
                    where: { name: catName },
                });
                if (catExist === null) {
                    // Upload Category Image
                    Category_1.Category.create(params)
                        .then((category) => res.status(201).json(category))
                        .catch((err) => res.status(500).json(err));
                }
                else {
                    res.json({
                        status: false,
                        message: 'Category already exists',
                    });
                }
            }
        });
    }
    update(req, res) {
        Category_1.Category.update(req.body, {
            fields: Object.keys(req.body),
            where: { id: req.params.id },
        })
            .then((affectedRows) => {
            if (Number(affectedRows) === 0) {
                res.json({
                    status: false,
                    message: 'Category ID does not exist',
                });
            }
            else {
                res.json({
                    status: true,
                    message: 'Category Updated Successfully',
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
        Category_1.Category.destroy({
            where: { id: req.params.id },
        })
            .then((removedRows) => {
            if (Number(removedRows) === 0) {
                res.json({
                    removedRows,
                    status: false,
                    message: 'Category ID not found',
                });
            }
            else {
                res.json({
                    removedRows,
                    status: true,
                    message: 'Category Deleted Successfully',
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
    viewOne(req, res) {
        const categoryId = req.params.id;
        Category_1.Category.findAll({
            where: { id: categoryId, },
            include: [{ association: Category_1.Category.SubCategory, as: 'subCategories' }],
            order: [['createdAt', 'DESC']],
        })
            .then((categories) => {
            res.status(200).json(categories);
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
}
exports.CategoryController = CategoryController;
