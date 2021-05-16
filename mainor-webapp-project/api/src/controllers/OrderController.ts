import { Config, ConfigInterface } from '../models/Config';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import { Order, OrderInterface } from '../models/Order';
import { OrderStatus, OrderStatusInterface } from '../models/OrderStatus';
import { Request, Response } from 'express';

import { Cart } from '../models/Cart';
import { Category } from '../models/Category';
import { Customer } from '../models/Customer';
import { Merchant } from '../models/Merchant';
import { Product } from '../models/Product';
import { ProductImage } from '../models/ProductImage';
import { SubCategory } from '../models/SubCategory';
import { Utils } from '../utils/index';
import { database } from '../config/database';

const utils = new Utils();

export class OrderController {
  public all(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 100;

    Order.findAll<Order>({
      offset: Number(offset),
      limit: Number(limit),
      group: ['orderId'],
      attributes: {
        include: [[Sequelize.fn('SUM', Sequelize.literal(`agreedPrice * quantity`)), 'totalPrice']],
        //[Sequelize.fn('SUM', Sequelize.col('deliveryPrice')), 'delivery'],
      },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            { model: Category, as: 'categories' },
            { model: SubCategory, as: 'subCategories' },
            { model: Merchant, as: 'merchantInfo' },
            { model: ProductImage, as: 'productImage' },
          ],
        },
        { model: Customer, as: 'customer' },
        { model: OrderStatus, as: 'orderStatus' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((orders: Order[]) => {
        res.status(200).json({ status: true, orders });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ err: err.toString() });
      });
  }

  public filterByYear(req: Request, res: Response) {
    const year = req.params.year;

    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Order.findAll<Order>({
      offset: Number(offset),
      limit: Number(limit),
      where: {
        // createdAt: { [Op.like]: '%' + year + '%' },
        createdAt: {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lt]: new Date(`${year}-12-31`),
        },
      },
    })
      .then((orders: Order[]) => {
        res.status(200).json({ status: true, orders });
      })
      .catch((err) => {
        return res.status(500).json({ err });
      });
  }

  public allPending(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Order.findAll<Order>({
      offset: Number(offset),
      limit: Number(limit),
      where: {
        orderStatusId: 1,
      },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            { model: Category, as: 'categories' },
            { model: SubCategory, as: 'subCategories' },
            { model: Merchant, as: 'merchantInfo' },
          ],
        },
        { model: Customer, as: 'customer' },
        { model: OrderStatus, as: 'orderStatus' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((orders: Order[]) => {
        res.status(200).json({ status: true, orders });
      })
      .catch((err) => {
        return res.status(500).json({ err });
      });
  }

  public allCustomOrder(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Order.findAll<Order>({
      offset: Number(offset),
      limit: Number(limit),
      where: {
        orderType: 'Custom',
      },
      include: [
        {
          model: Product,
          as: 'product',
          include: [
            { model: Category, as: 'categories' },
            { model: SubCategory, as: 'subCategories' },
            { model: Merchant, as: 'merchantInfo' },
          ],
        },
        { model: Customer, as: 'customer' },
        { model: OrderStatus, as: 'orderStatus' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((orders: Order[]) => {
        res.status(200).json({ status: true, orders });
      })
      .catch((err) => {
        return res.status(500).json({ err });
      });
  }

  public async viewOrder(req: Request, res: Response) {
    const orderId = req.params.orderId;

    if (!orderId) {
      res.status(400).json({ status: false, message: 'OrderId not passed' });
    } else {
      Order.findOne({
        where: {
          id: orderId,
        },
        include: [
          {
            model: Product,
            as: 'product',
            include: [
              { model: Category, as: 'categories' },
              { model: SubCategory, as: 'subCategories' },
              { model: Merchant, as: 'merchantInfo' },
              { model: ProductImage, as: 'productImage' },
            ],
          },
          { model: Customer, as: 'customer' },
          { model: OrderStatus, as: 'orderStatus' },
        ],
      })
        .then((order) => {
          res.status(200).json({ status: true, order });
        })
        .catch((err) => {
          res.status(500).json({ err, status: false });
        });
    }
  }

  public async viewOrderUUID(req: Request, res: Response) {
    const orderId = req.params.orderUUID;

    if (!orderId) {
      res.status(400).json({ status: false, message: 'OrderId not passed' });
    } else {
      Order.findAll({
        where: {
          orderId: orderId,
        },
        include: [
          {
            model: Product,
            as: 'product',
            include: [
              { model: Category, as: 'categories' },
              { model: SubCategory, as: 'subCategories' },
              { model: Merchant, as: 'merchantInfo' },
              { model: ProductImage, as: 'productImage' },
            ],
          },
          { model: Customer, as: 'customer' },
          { model: OrderStatus, as: 'orderStatus' },
        ],
      })
        .then((order) => {
          res.status(200).json({ status: true, order });
        })
        .catch((err) => {
          res.status(500).json({ err, status: false });
        });
    }
  }

  public async createOrder(req: any, res: Response) {
    const params: OrderInterface = req.body;

    // Check that all fields are filled
    if (
      !req.body.orderId ||
      !req.body.productId ||
      !req.body.merchantId ||
      !req.body.agreedPrice ||
      !req.body.quantity ||
      !req.body.deliveryInformation ||
      !req.body.deliveryPartnerId ||
      !req.body.deliveryPrice ||
      !req.body.paymentStatus ||
      !req.body.paymentMethod ||
      !req.body.orderType ||
      !req.body.orderStatusId
    ) {
      // console.log("parameter still dy miss")
      return res.status(400).json({
        status: false,
        message: 'All fields are required',
      });
    } else {
      const productId = req.body.productId;
      const merchantId = req.body.merchantId;
      const customerId = req.body.customerId ? req.body.customerId : req.user.id;
      const orderStatusId = req.body.orderStatusId;

      // Make sure that ProductId, CustomerId, OrderStatusId are valid
      const productIdExist: any = await Product.findOne({ where: { id: productId } });
      const customerIdExist: any = await Customer.findOne({ where: { id: customerId } });
      const merchantIdExist: any = await Merchant.findOne({ where: { id: merchantId } });
      const orderStatusIdExist: any = await OrderStatus.findOne({ where: { id: orderStatusId } });
      // console.log("order code got here")
      let notExist = '';
      if (productIdExist === null) {
        notExist += 'productID, ';
      }
      if (customerIdExist === null) {
        notExist += 'customerId, ';
      }
      if (orderStatusIdExist === null) {
        notExist += 'orderStatusId, ';
      }
      if (merchantIdExist === null) {
        notExist += 'merchantId, ';
      }
      if (
        productIdExist === null ||
        customerIdExist === null ||
        merchantIdExist === null ||
        orderStatusIdExist === null
      ) {
        console.log(`${notExist}does not exist`);
        return res.status(400).json({
          status: false,
          message: `${notExist}does not exist`,
        });
      } else {
        // Get the available goods in stock and check if it meets order quantity
        const availableGIS = productIdExist.goodsInStock;
        if (availableGIS === 0) {
          return res.json({ status: false, message: 'No Goods In Stock for this product' });
        } else if (req.body.quantity > availableGIS) {
          return res.json({
            status: false,
            message: 'Not enough Goods In Stock for this product',
            quantityDemanded: req.body.quantity,
            goodsInStock: availableGIS,
          });
        } else {
          const newGIS = availableGIS - req.body.quantity;
          await Product.update(
            { goodsInStock: newGIS },
            {
              where: {
                id: req.body.productId,
              },
            },
          );

          // Create Order
          params.customerId = customerId;
          Order.create<Order>(params)
            .then((order: Order) => {
              //both the merchant and customer receives an email when an order is created
              const Maildata = {};

              Maildata['subject'] = 'Bcd.ng: New Order';
              Maildata['to'] = merchantIdExist.email;
              Maildata['customeremail'] = customerIdExist.email;
              Maildata['from'] = process.env.FROM_EMAIL;
              Maildata['MerchantfirstName'] = merchantIdExist.firstName;
              Maildata['CustomerfirstName'] = customerIdExist.firstName;
              Maildata['productName'] = productIdExist.name;
              Maildata['templatehtml'] = 'customerMerchantOrder.html';
              utils.sendEmail(Maildata);

              const Maildata1 = {};

              Maildata1['subject'] = 'Bcd.ng: New Order';
              // Maildata1['merchantemail'] = merchantIdExist.email;
              Maildata1['to'] = customerIdExist.email;
              Maildata1['from'] = process.env.FROM_EMAIL;
              Maildata1['CustomerfirstName'] = customerIdExist.firstName;
              Maildata1['orderId'] = req.body.orderId;
              Maildata1['templatehtml'] = 'customerOrder.html';
              utils.sendEmail(Maildata1);

              // console.log("cartID",req.body.cartId)
              if (req.body.cartId !== 0 || req.body.cartId !== '0') {
                Cart.destroy({
                  where: { customerId: customerId },
                })
                  .then(() => {
                    return res.status(201).json(order);
                  })
                  .catch((err: any) => {
                    return res.status(500).json({
                      err,
                      status: false,
                    });
                  });
              }
            })
            .catch((err) => {
              return res.status(500).json({ err });
            });
        }
      }
    }
  }

  public async orderStats(req: Request, res: Response) {
    let profitPercentage: any = 0.05;

    const insurance: any = await Config.findOne({ where: { id: 2 } });
    const stats = await Order.findAll({
      attributes: [[Sequelize.fn('sum', Sequelize.col('agreedPrice')), 'totalTransactions']],
    })
      .then((data: any) => {
        res.status(200).json({
          status: true,
          data: data[0],
          insurance: insurance.value,
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  public async changeProductOrderStatus(req: any, res: Response) {
    const orderId = req.params.orderId;
    const orderStatusId = req.body.orderStatusId;
    const customerId = req.body.customerId;
    const merchantId = req.body.merchantId;

    if (!orderId || !orderStatusId) {
      res.json({ status: false, message: 'Make sure OrderId and OrderStausId is passed' });
    } else {
      const orderIdExist = await Order.findOne({ where: { orderId: orderId } });
      const orderStatusIdExist = await OrderStatus.findOne({ where: { id: orderStatusId } });
      const customerIdExist: any = await Customer.findOne({ where: { id: customerId } });
      const merchantIdExist: any = await Merchant.findOne({ where: { id: merchantId } });

      let notExist = '';
      if (orderIdExist === null) {
        notExist += 'OrderId, ';
      }
      if (orderStatusIdExist === null) {
        notExist += 'OrderStatusId, ';
      }
      if (customerIdExist === null || merchantIdExist === null) {
        res.status(400).json({ status: false, message: `$customer or merchant does not exist` });
      }
      if (orderIdExist === null || orderStatusIdExist === null) {
        res.status(400).json({ status: false, message: `${notExist}does not exist` });
      } else {
        Order.update(
          { orderStatusId },
          {
            where: {
              orderId: orderId,
            },
          },
        )
          .then(async (order: any) => {
            let status;
            switch (orderStatusId) {
              case '1':
                status = 'pending';
                break;
              case '4':
                status = 'processing';
                //only customer receives an mail indicating order is being shipped
                const Maildata2 = {};

                Maildata2['subject'] = `Bcd.ng: Update on your Order ${orderIdExist.orderId}`;
                // Maildata1['merchantemail'] = merchantIdExist.email;
                Maildata2['to'] = customerIdExist.email;
                Maildata2['from'] = process.env.FROM_EMAIL;
                Maildata2['CustomerfirstName'] = customerIdExist.firstName;
                Maildata2['orderId'] = orderIdExist.orderId;
                Maildata2['newOrderStatus'] = status;
                Maildata2['templatehtml'] = 'CustomerChangeOrderProcess.html';

                utils.sendEmail(Maildata2);

                break;
              case '3':
                status = 'completed';

                //merchant and customer receives mail when order is completed
                const Maildata1 = {};

                Maildata1['subject'] = `Bcd.ng: Update on your Order ${orderIdExist.orderId}`;
                // Maildata1['merchantemail'] = merchantIdExist.email;
                Maildata1['to'] = merchantIdExist.email;
                Maildata1['from'] = process.env.FROM_EMAIL;
                Maildata1['MerchantfirstName'] = merchantIdExist.firstName;
                Maildata1['orderId'] = orderIdExist.orderId;
                Maildata1['newOrderStatus'] = status;
                Maildata1['templatehtml'] = 'ChangeOrderMerchantDeliver.html';

                utils.sendEmail(Maildata1);

                const Maildata3 = {};

                Maildata3['subject'] = `Bcd.ng: Update on Order ${orderIdExist.orderId}`;
                // Maildata1['merchantemail'] = merchantIdExist.email;
                Maildata3['to'] = customerIdExist.email;
                Maildata3['from'] = process.env.FROM_EMAIL;
                Maildata3['CustomerfirstName'] = customerIdExist.firstName;
                Maildata3['orderId'] = orderIdExist.orderId;
                Maildata3['newOrderStatus'] = status;
                Maildata3['templatehtml'] = 'ChangeOrderDeliver.html';

                utils.sendEmail(Maildata3);

                break;

              case '2':
                status = 'canceled';
                break;
              default:
                status = 'Unknown';
                break;
            }

            res.json({
              status: true,
              message: `Order status changed successfully to ${status}`,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ status: false, error: err.toString() });
          });
      }
    }
  }

  public async createOrderStatus(req: any, res: Response) {
    const params: OrderStatusInterface = req.body;

    if (!req.body.status || !req.body.description) {
      res.status(400).json({ status: false, message: 'All fields are required' });
    } else {
      const statusExist = await OrderStatus.findOne({ where: { status: req.body.status } });

      if (statusExist === null) {
        OrderStatus.create(params)
          .then((orderStatus: OrderStatus) => {
            res.status(201).json({ orderStatus });
          })
          .catch((err) => {
            res.status(500).json({ err: err.toString() });
          });
      }
    }
  }

  public allOrderStatus(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    OrderStatus.findAll<OrderStatus>({
      offset: Number(offset),
      limit: Number(limit),
      order: [['createdAt', 'DESC']],
    })
      .then((orderStatuses: OrderStatus[]) => {
        res.status(200).json({ status: true, orderStatuses });
      })
      .catch((err) => {
        res.json({ err });
      });
  }

  // Al Mercant Orders
  public myOrders = async (req: any, res: Response) => {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;
    //
    try {
      const userId = req.user.id;

      await Order.findAndCountAll({
        where: {
          merchantId: userId,
        },
        offset: Number(offset),
        limit: Number(limit),
        include: [
          {
            model: Product,
            as: 'product',
            include: [
              { model: Category, as: 'categories' },
              { model: SubCategory, as: 'subCategories' },
              { model: Merchant, as: 'merchantInfo' },
              { model: ProductImage, as: 'productImage' },
            ],
          },
          { model: Customer, as: 'customer' },
          { model: OrderStatus, as: 'orderStatus' },
        ],
      })
        .then((data) => {
          res.json({ status: true, message: data });
        })
        .catch((err) => {
          res.json({ status: false, message: err });
        });
    } catch (err) {
      console.log(err);
      res.json({ status: false, message: err });
    }
  };

  public customerOrders = async (req: any, res: Response) => {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;
    try {
      const userId = req.user.id;
      await Order.findAndCountAll({
        where: {
          customerId: userId,
        },
        offset: Number(offset),
        limit: Number(limit),
        attributes: [
          'orderId',
          [Sequelize.fn('SUM', Sequelize.col('agreedPrice')), 'totalPrice'],
          'deliveryPrice',
          'meta',
          'createdAt'
        ],
        group: ['orderId'],
        include: [
          {
            model: Product,
            as: 'product',
            include: [
              { model: Category, as: 'categories' },
              { model: SubCategory, as: 'subCategories' },
              { model: Merchant, as: 'merchantInfo' },
              { model: ProductImage, as: 'productImage' },
            ],
          },
          { model: Customer, as: 'customer' },
          { model: OrderStatus, as: 'orderStatus' },
        ],
      })
        .then((data) => {
          res.json({ status: true, data: data });
        })
        .catch((err) => {
          res.json({ status: false, message: err });
        });
    } catch (err) {
      console.log(err);
      res.json({ status: false, message: err });
    }
  };

  async allCompleted(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;
    //
    try {
      await Order.findAndCountAll({
        where: {
          orderStatusId: 3,
        },
        offset: Number(offset),
        limit: Number(limit),

        include: [
          {
            model: Product,
            as: 'product',
            include: [
              { model: Category, as: 'categories' },
              { model: SubCategory, as: 'subCategories' },
              { model: Merchant, as: 'merchantInfo' },
            ],
          },
          { model: Customer, as: 'customer' },
          { model: OrderStatus, as: 'orderStatus' },
        ],
      })
        .then((data) => {
          res.json({ status: true, data: data });
        })
        .catch((err) => {
          res.json({ status: false, message: err });
        });
    } catch (err) {
      console.log(err);
      res.json({ status: false, message: err });
    }
  }

  async search(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    const searchQuery = req.params.search;
    if (!searchQuery) {
      return res.json({ status: false, message: 'Invalid search parameters' });
    }

    await Order.findAll({
      where: {
        [Op.or]: [
          {
            '$customer.firstName$': {
              [Op.like]: `%${searchQuery}%`,
            },
          },
          {
            '$customer.lastName$': {
              [Op.like]: `%${searchQuery}%`,
            },
          },
          {
            orderId: {
              [Op.like]: `%${searchQuery}%`,
            },
          },
        ],
      },
      group: ['Order.id'],
      include: [
        { model: Customer, as: 'customer' },
        { model: OrderStatus, as: 'orderStatus' },
        {
          model: Product,
          as: 'product',
          include: [
            { model: Category, as: 'categories' },
            { model: SubCategory, as: 'subCategories' },
            { model: Merchant, as: 'merchantInfo' },
            { model: ProductImage, as: 'productImage' },
          ],
        },
      ],
    })
      .then((results) => {
        res.json({ status: true, data: results, message: 'Successfull' });
      })
      .catch((err) => {
        console.log(err);
        res.json({ status: false, err });
      });
  }
}
