import { Request, Response } from 'express';
import { SubCategory, SubCategoryInterface } from '../models/SubCategory';

import { Category } from '../models/Category';

export class SubCategoryController {
  public index(req: Request, res: Response) {
    SubCategory.findAll<SubCategory>({
      order: [['createdAt', 'DESC']],
    })
      .then((subCategories: SubCategory[]) => {
        res.json(subCategories);
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public fetchByCategoryId(req: Request, res: Response) {
    const catId = req.params.id;
    Category.findByPk(catId).then((category) => {
      SubCategory.findAndCountAll<SubCategory>({
        where: { categoryId: catId },
        order: [['createdAt', 'DESC']],
      })
        .then((subCategories:any) => {
          res.json({subCategory: subCategories, category: category});
        })
        .catch((err: Error) => {
          res.status(500).json(err);
        });
    })
  }

  public async create(req: any, res: Response) {
    if (!req.body.name || !req.body.alias || !req.body.categoryId) {
      res.status(500).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      const catId = req.body.categoryId;
      const subCatName = req.body.name;

      const subCatExist = await SubCategory.findOne({ where: { name: subCatName } });
      const catExist = await Category.findOne({ where: { id: catId } });

      if (subCatExist === null) {
        if (catExist) {
          // Upload SubCategory Image
          SubCategory.create(req.body)
            .then((subCategory: SubCategoryInterface) => {
              res.json(subCategory);
            })
            .catch((err: any) => {
              res.json(err);
            });
        } else {
          res.json({
            status: false,
            message: 'CategoryId does not exist',
          });
        }
      } else {
        res.json({
          status: false,
          message: 'SubCategory already exists',
        });
      }
    }
  }

  update(req: any, res: Response) {
    SubCategory.update(req.body, {
      fields: Object.keys(req.body),
      where: { id: req.params.id },
    })
      .then((affectedRows: [number, SubCategoryInterface[]]) => {
        if (Number(affectedRows) === 0) {
          res.json({
            status: false,
            message: 'SubCategory ID does not exist',
          });
        } else {
          res.json({
            status: true,
            message: 'SubCategory updated successfully',
            affectedRows: Number(affectedRows),
          });
        }
      })
      .catch((err: any) => {
        res.json({
          err,
          status: false,
        });
      });
  }

  delete(req: Request, res: Response) {
    SubCategory.destroy({
      where: { id: req.params.id },
    })
      .then((removedRows: number) => {
        if (Number(removedRows) === 0) {
          res.json({
            removedRows,
            status: false,
            message: 'Sub Category Id Does not exist',
          });
        } else {
          res.json({
            removedRows,
            status: true,
            message: 'Deleted Successfully',
          });
        }
      })
      .catch((err: any) => {
        res.json({
          err,
          status: false,
        });
      });
  }
}
