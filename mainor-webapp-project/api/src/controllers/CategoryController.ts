import { Category, CategoryInterface } from '../models/Category';
import { Request, Response } from 'express';

export class CategoryController {
  public all(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Category.findAll<Category>({
      offset: Number(offset),
      limit: Number(limit),
      include: [{ association: Category.SubCategory, as: 'subCategories' }],
      order: [['createdAt', 'DESC']],
    })
      .then((categories: Category[]) => {
        res.status(200).json(categories);
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public index(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;
    Category.findAll<Category>({
      offset: Number(offset),
      limit: Number(limit),
      order: [['createdAt', 'DESC']],
    })
      .then((categories: Category[]) => {
        res.json(categories);
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public async create(req: any, res: Response) {
    const params: CategoryInterface = req.body;

    if (!req.body.name || !req.body.alias) {
      res.status(500).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      const catName = req.body.name;
      const catExist = await Category.findOne({
        where: { name: catName },
      });

      if (catExist === null) {
        // Upload Category Image
        Category.create<Category>(params)
          .then((category: Category) => res.status(201).json(category))
          .catch((err: Error) => res.status(500).json(err));
      } else {
        res.json({
          status: false,
          message: 'Category already exists',
        });
      }
    }
  }

  public update(req: any, res: Response) {
    Category.update(req.body, {
      fields: Object.keys(req.body),
      where: { id: req.params.id },
    })
      .then((affectedRows: [number, CategoryInterface[]]) => {
        if (Number(affectedRows) === 0) {
          res.json({
            status: false,
            message: 'Category ID does not exist',
          });
        } else {
          res.json({
            status: true,
            message: 'Category Updated Successfully',
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

  public delete(req: Request, res: Response) {
    Category.destroy({
      where: { id: req.params.id },
    })
      .then((removedRows: number) => {
        if (Number(removedRows) === 0) {
          res.json({
            removedRows,
            status: false,
            message: 'Category ID not found',
          });
        } else {
          res.json({
            removedRows,
            status: true,
            message: 'Category Deleted Successfully',
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

  public viewOne(req: Request, res: Response) {
    const categoryId = req.params.id;
    
    Category.findAll<Category>({
      where: { id: categoryId ,},
      include: [{ association: Category.SubCategory, as: 'subCategories' }],
      order: [['createdAt', 'DESC']],
    })
      .then((categories: Category[]) => {
        res.status(200).json(categories);
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }
}
