import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Merchant, MerchantInterface } from '../models/Merchant';

export class MerchantController {
  public all(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 200;

    Merchant.findAll<Merchant>({
      offset: Number(offset),
      limit: Number(limit),
    })
      .then((merchants: Merchant[]) => {
        res.json({ status: true, merchants });
      })
      .catch((err: Error) => {
        res.status(500).json({ status: false, err });
      });
  }

  public async viewOne(req: Request, res: Response) {
    const id = req.params.id;
    Merchant.findOne({
      where: {
        id,
      },
    })
      .then((merchant) => {
        res.status(200).json({ status: true, merchant });
      })
      .catch((err) => {
        res.status(500).json({ err, status: false });
      });
  }

  public updateMerchant(req: any, res: Response) {
    const productId = req.params.id;
    const data = req.body;
    Merchant.findByPk(productId)
      .then((merchant) => {
        // Check if product was found
        if (!merchant) {
          return res.json({ status: false, message: 'Merchant not found' });
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
        merchant
          .update(data)
          .then(() => {
            console.log(data);
            res.status(200).json({
              status: true,
              message: 'Merchant data updated successfully',
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

  public approved(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Merchant.findAll<Merchant>({
      offset: Number(offset),
      limit: Number(limit),
      where: { approved: 1 },
    })
      .then((merchants: Merchant[]) => {
        res.json({ status: true, merchants });
      })
      .catch((err: Error) => {
        res.status(500).json({ status: false, err });
      });
  }

  public disapproved(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    Merchant.findAll<Merchant>({
      offset: Number(offset),
      limit: Number(limit),
      where: { approved: 0 },
    })
      .then((merchants: Merchant[]) => {
        res.json({ status: true, merchants });
      })
      .catch((err: Error) => {
        res.status(500).json({ status: false, err });
      });
  }

  public disapproveMerchant(req: any, res: Response) {
    const merchantId = req.params.id;
    try {
      const user = req.user.id;
      Merchant.findByPk(merchantId)
        .then((merchant) => {
          if (!merchant) {
            return res.json({ status: false, message: 'Merchant not found' });
          }

          Merchant.update(
            { approved: 0 },
            {
              where: {
                id: merchantId,
              },
            },
          )
            .then(() => {
              res.json({ status: true, message: 'Merchant Disapproved successfully' });
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

  public approveMerchant(req: any, res: Response) {
    const merchantId = req.params.id;
    try {
      const user = req.user.id;
      Merchant.findByPk(merchantId)
        .then((merchant) => {
          if (!merchant) {
            return res.json({ status: false, message: 'Merchant not found' });
          }

          Merchant.update(
            { approved: 1 },
            {
              where: {
                id: merchantId,
              },
            },
          )
            .then(() => {
              res.json({ status: true, message: 'Merchant Approved successfully' });
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

  public searchMerchant(req: any, res: Response) {
    const searchQuery = req.params.search;
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    if (!searchQuery) {
      return res.json({ status: false, message: 'Invalid search parameters' });
    }

    Merchant.findAndCountAll({
      offset: Number(offset),
      limit: Number(limit),
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: '%' + searchQuery + '%' } },
          { lastName: { [Op.like]: '%' + searchQuery + '%' } },
          { businessName: { [Op.like]: '%' + searchQuery + '%' } },
        ],
      },
    })
      .then((merchants) => {
        res.json({ status: true, merchants });
      })
      .catch((err: Error) => {
        res.status(500).json({ status: false, err });
      });
  }
}
