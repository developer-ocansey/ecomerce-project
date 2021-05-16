import { Cart, CartInterface } from '../models/Cart';
import { Category, CategoryInterface } from '../models/Category';
import { Request, Response } from 'express';

import { Merchant } from '../models/Merchant';
import { Product } from '../models/Product';
import { ProductImage } from '../models/ProductImage';

export class CartController {
  public async count(req: any, res: Response) {
    const customerId = req.user.id;

    await Cart.count({
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

    await Cart.findAndCountAll({ //todo debug reaseon why this not working as expected...
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
    const params: CartInterface = req.body;
    const customerId = req.user.id;
    const productId = req.body.productId;

    if (!req.body.productId || !req.body.quantity) {
      res.status(400).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      const checkCart = await Cart.findOne<Cart>({
        where: {
          customerId: customerId,
          productId: productId
        },
      })

      if (checkCart !== null) {
        res.status(200).json({
          status: false,
          message: 'Product already add to cart',
        });
      } else {
        params.customerId = customerId;
        Cart.create<Cart>(params)
          .then((data: Cart) => res.status(201).json(data))
          .catch((err: Error) => res.status(500).json(err)); 
      }
    }
  }

  public async merchantAddToCart(req: any, res: Response) {
    const params: CartInterface = req.body;
    const customerId = req.body.customerId;
    const productId = req.body.productId;
    if (!req.body.customerId || !req.body.productId || !req.body.quantity || !req.body.negotiatedPrice) {
      res.status(400).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      const checkCart = await Cart.findOne<Cart>({
        where: {
          customerId: customerId,
          productId: productId
        },
      })

      if (checkCart !== null) {
        Cart.update(req.body, {
          where: {
          customerId: customerId,
          productId: productId
        }})
        .then(((affectedRows: [number, CartInterface[]]) => res.status(201).json(affectedRows)))
        .catch((err: Error) => res.status(500).json(err)); 
        res.status(200).json({
          status: false,
          message: 'Price Updated',
        });
      } else {
        params.customerId = customerId;
        params.insure = true
        Cart.create<Cart>(params)
          .then((data: Cart) => res.status(201).json(data))
          .catch((err: Error) => res.status(500).json(err)); 
      }
    }
  }

  public update(req: any, res: Response) {
    Cart.update(req.body, {
      fields: Object.keys(req.body),
      where: { id: req.params.id },
    })
      .then((affectedRows: [number, CartInterface[]]) => {
        if (Number(affectedRows) === 0) {
          res.json({
            status: false,
            message: 'Cart ID does not exist',
          });
        } else {
          res.json({
            status: true,
            message: 'Cart Updated Successfully',
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
    const cartId = req.body.id
    Cart.destroy({
      where: { id: cartId },
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
