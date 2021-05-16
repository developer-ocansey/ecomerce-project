import { Category, CategoryInterface } from '../models/Category';
import { Request, Response } from 'express';
import { Wishlist, WishlistInterface } from '../models/Wishlist';

import { Merchant } from '../models/Merchant';
import { Product } from '../models/Product';
import { ProductImage } from '../models/ProductImage';

export class WishController {
  public async count(req: any, res: Response) {
    const customerId = req.user.id;

    await Wishlist.count({
      where: { customerId: customerId },
    })
      .then((count: number) => {
        res.status(200).json({ status: true, data: count });
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public async all(req: any, res: Response) {
    const customerId = req.user.id;

    await Wishlist.findAndCountAll({ //todo debug reaseon why this not working as expected...
      where: { customerId: customerId },
      include: [
        {model: Product, as: 'product', include: [{model: Merchant, as: 'merchantInfo'},{model: ProductImage, as: 'productImage'}] },
      ]

    })
      .then((result: any) => {
        res.status(200).json({ status: true, data: result, message: 'successful' });
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public async create(req: any, res: Response) {
    const params: WishlistInterface = req.body;
    const customerId = req.user.id;
    const productId = req.body.productId;

    if (!req.body.productId) {
      res.status(400).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      const checkWish = await Wishlist.findOne<Wishlist>({
        where: {
          customerId: customerId,
          productId: productId
        },
      })

      if (checkWish !== null) {
        res.status(409).json({
          status: false,
          message: 'Product already add to Wish',
        });
      } else {
        params.customerId = customerId;
        Wishlist.create<Wishlist>(params)
          .then((data: Wishlist) => res.status(201).json(data))
          .catch((err: Error) => res.status(500).json(err)); 
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
    const WishId = req.body.id
    Wishlist.destroy({
      where: { id: WishId },
    })
      .then(() => {
        res.status(200).json({
          status: true,
          message: 'Product Deleted Successfully',
        });
      })
      .catch((err: any) => {
        res.status(500).json({
          err,
          status: false,
        });
      });
  }
}
