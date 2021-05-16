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
exports.SubCategoryController = void 0;
const SubCategory_1 = require("../models/SubCategory");
const Category_1 = require("../models/Category");
class SubCategoryController {
    index(req, res) {
        SubCategory_1.SubCategory.findAll({
            order: [['createdAt', 'DESC']],
        })
            .then((subCategories) => {
            res.json(subCategories);
        })
            .catch((err) => {
            res.status(500).json(err);
        });
    }
    fetchByCategoryId(req, res) {
        const catId = req.params.id;
        Category_1.Category.findByPk(catId).then((category) => {
            SubCategory_1.SubCategory.findAndCountAll({
                where: { categoryId: catId },
                order: [['createdAt', 'DESC']],
            })
                .then((subCategories) => {
                res.json({ subCategory: subCategories, category: category });
            })
                .catch((err) => {
                res.status(500).json(err);
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.body.name || !req.body.alias || !req.body.categoryId) {
                res.status(500).json({
                    status: false,
                    message: 'All Fields are required',
                });
            }
            else {
                const catId = req.body.categoryId;
                const subCatName = req.body.name;
                const subCatExist = yield SubCategory_1.SubCategory.findOne({ where: { name: subCatName } });
                const catExist = yield Category_1.Category.findOne({ where: { id: catId } });
                if (subCatExist === null) {
                    if (catExist) {
                        // Upload SubCategory Image
                        SubCategory_1.SubCategory.create(req.body)
                            .then((subCategory) => {
                            res.json(subCategory);
                        })
                            .catch((err) => {
                            res.json(err);
                        });
                    }
                    else {
                        res.json({
                            status: false,
                            message: 'CategoryId does not exist',
                        });
                    }
                }
                else {
                    res.json({
                        status: false,
                        message: 'SubCategory already exists',
                    });
                }
            }
        });
    }
    update(req, res) {
        SubCategory_1.SubCategory.update(req.body, {
            fields: Object.keys(req.body),
            where: { id: req.params.id },
        })
            .then((affectedRows) => {
            if (Number(affectedRows) === 0) {
                res.json({
                    status: false,
                    message: 'SubCategory ID does not exist',
                });
            }
            else {
                res.json({
                    status: true,
                    message: 'SubCategory updated successfully',
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
        SubCategory_1.SubCategory.destroy({
            where: { id: req.params.id },
        })
            .then((removedRows) => {
            if (Number(removedRows) === 0) {
                res.json({
                    removedRows,
                    status: false,
                    message: 'Sub Category Id Does not exist',
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
    }
}
exports.SubCategoryController = SubCategoryController;
