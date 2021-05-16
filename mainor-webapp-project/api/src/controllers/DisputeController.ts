import { Request, Response, response } from 'express';
import { Dispute, DisputeInterface } from '../models/Dispute';
import { Utils } from '../utils/index';
import { Customer } from '../models/Customer';
import { Merchant } from '../models/Merchant';
import { Order } from '../models/Order';

const utils = new Utils();

export class DisputeController {
  public index(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Dispute.findAll<Dispute>({
      offset: Number(offset),
      limit: Number(limit),
      include: [
        { model: Order, as: 'order' },
        { model: Customer, as: 'customer' },
        { model: Merchant, as: 'merchant' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((disputes: Dispute[]) => res.json({ status: true, disputes }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public pendingDisputes(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Dispute.findAll<Dispute>({
      offset: Number(offset),
      limit: Number(limit),
      where: {disputeStatus: null},
      include: [
        { model: Order, as: 'order' },
        { model: Customer, as: 'customer' },
        { model: Merchant, as: 'merchant' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((disputes: Dispute[]) => res.json({ status: true, disputes }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public resolvedDisputes(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Dispute.findAll<Dispute>({
      offset: Number(offset),
      limit: Number(limit),
      where: {disputeStatus: "Resolved"},
      include: [
        { model: Order, as: 'order' },
        { model: Customer, as: 'customer' },
        { model: Merchant, as: 'merchant' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((disputes: Dispute[]) => res.json({ status: true, disputes }))
      .catch((err: Error) => res.status(500).json(err));
  }

  async create(req: any, res: Response) {
    try {
      const id = req.user.id;

      let user = await utils.getUserData('customer', id);
      if (!user) {
        return res.status(401).json({
          message: 'User does not exist',
        });
      }

      const merchantExist = await Merchant.findOne({ where: { id: req.body.merchantId } });
      const orderIdExist = await Order.findOne({ where: { id: req.body.orderId } });

      if (merchantExist === null) {
        return res.status(401).json({
          message: 'Merchant does not exist',
        });
      }

      if (orderIdExist === null) {
        return res.status(401).json({
          message: 'Order does not exist',
        });
      }

      if (!req.body.merchantId || !req.body.orderId || !req.body.complaint || !req.body.category) {
        res.status(400).json({ status: false, message: 'All fields are required' });
      } else {
        req.body.customerId = user.id;
        const params: DisputeInterface = req.body;
        Dispute.create(params)
          .then((dispute: Dispute) => {
            res.status(201).json({ dispute });
          })
          .catch((err) => {
            res.status(500).json({ err });
          });
      }
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }

  public updateDispute(req: any, res: Response) {
    const disputeId = req.params.id;
    const data = req.body;
    Dispute.findByPk(disputeId)
      .then((dispute) => {
        // Check if product was found
        if (!dispute) {
          return res.json({ status: false, message: 'Dispute does not exist' });
        }

        // Check if a data as passed
        if (!data) {
          return res.json({ status: false, message: 'Please provide some data' });
        }

        // Remove the Id Key from the data passed
        if (data.id) {
          delete data.id;
        }

        // Update the data to database
        dispute
          .update(data)
          .then(() => {
            console.log(data);
            res.status(200).json({
              status: true,
              message: 'Dispute Updated successfully',
              info: data,
            });
          })
          .catch((err) => {
            res.json({ err });
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          err,
        });
      });
  }
}
