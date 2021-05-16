import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Customer } from '../models/Customer';

export class CustomerController {
  public index(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Customer.findAll<Customer>({
      offset: Number(offset),
      limit: Number(limit),
      order: [['createdAt', 'DESC']],
    })
      .then((customers: Customer[]) => res.json({ status: true, customers }))
      .catch((err: Error) => res.status(500).json({ status: false, err }));
  }

  public approved(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Customer.findAll<Customer>({
      offset: Number(offset),
      limit: Number(limit),
      where: { approved: 1 },
      order: [['createdAt', 'DESC']],
    })
      .then((customers: Customer[]) => res.json({ status: true, customers }))
      .catch((err: Error) => res.status(500).json({ status: false, err }));
  }

  public disapproved(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Customer.findAll<Customer>({
      offset: Number(offset),
      limit: Number(limit),
      where: { approved: 0 },
      order: [['createdAt', 'DESC']],
    })
      .then((customers: Customer[]) => res.json({ status: true, customers }))
      .catch((err: Error) => res.status(500).json({ status: false, err }));
  }

  public disapproveCustomer(req: any, res: Response) {
    const customerId = req.params.id;
    try {
      const user = req.user.id;
      Customer.findByPk(customerId)
        .then((customer) => {
          if (!customer) {
            return res.json({ status: false, message: 'Customer not found' });
          }

          Customer.update(
            { approved: 0 },
            {
              where: {
                id: customerId,
              },
            },
          )
            .then(() => {
              res.json({ status: true, message: 'Customer Disapproved successfully' });
            })
            .catch((err) => {
              res.json({ err });
            });
        })
        .catch((err) => {
          return res.status(500).json({
            err,
          });
        });
    } catch (err) {
      console.log(err);
    }
  }

  public approveCustomer(req: any, res: Response) {
    const customerId = req.params.id;
    try {
      const user = req.user.id;
      Customer.findByPk(customerId)
        .then((customer) => {
          if (!customer) {
            return res.json({ status: false, message: 'Customer not found' });
          }

          Customer.update(
            { approved: 1 },
            {
              where: {
                id: customerId,
              },
            },
          )
            .then(() => {
              res.json({ status: true, message: 'Customer Approved successfully' });
            })
            .catch((err) => {
              res.json({ err });
            });
        })
        .catch((err) => {
          return res.status(500).json({
            err,
          });
        });
    } catch (err) {
      console.log(err);
    }
  }

  public searchCustomer(req: any, res: Response) {

    const searchQuery = req.params.search;
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    if (!searchQuery) {
      return res.json({ status: false, message: 'Invalid search parameters' });
    }

    Customer.findAndCountAll({
      offset: Number(offset),
      limit: Number(limit),
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: '%' + searchQuery + '%' } },
          { lastName: { [Op.like]: '%' + searchQuery + '%' } },
        ],
      }
    }).then((customers) => {
      res.json({ status: true, customers });
    })
    .catch((err: Error) => {
      res.status(500).json({ status: false, err });
    });
  }

  // Todo
  public update() {}
  public destroy() {}
}
