import { Config, ConfigInterface } from '../models/Config';
import { PriceTable, PriceTableInterface } from '../models/PriceTable';
import { Request, Response } from 'express';

export class ConfigController {
  public async find(req: Request, res: Response) {
    const key = req.params.key;
    if (!key) {
      res.status(400).json({ status: false, message: 'config key was not been passed' });
    } else {
      const configExist = await Config.findOne({
        where: { key: key },
      });
      if (configExist !== null) {
        Config.findOne<Config>({
          where: { key: key },
        })
          .then((config) => {
            res.json({ status: true, config });
          })
          .catch((err: Error) => {
            res.status(500).json(err);
          });
      } else {
        res.json({ status: false, message: 'Config ID does not Exist' });
      }
    }
  }

  public async update(req: Request, res: Response) {
    const data = req.body;
    const key = req.params.key;
    if (!key) {
      res.status(400).json({ status: false, message: 'config key was not been passed' });
    } else {
      const configExist = await Config.findOne({
        where: { key: key },
      });

      if (configExist !== null) {
        Config.update(data, { where: { key: key } })
          .then(() => {
            console.log(data);
            res.status(200).json({
              status: true,
              message: 'Config Updated successfully',
              info: data,
            });
          })
          .catch((err) => {
            res.json({ err });
          });
      } else {
        res.json({ status: false, message: 'Config ID does not Exist' });
      }
    }
  }

  public async logisticPartners(req: Request, res: Response) {
    PriceTable.findAll({
      attributes: ['partnerSlug'],
      group: 'partnerSlug',
    })
      .then((partners) => {
        res.json({ status: true, partners });
      })
      .catch((err) => {
        res.json({ err });
      });
  }

  public async fetchLogisticPartner(req: Request, res: Response) {
    const partnerSlug = req.params.partner;

    PriceTable.findAll({
      where: {
        partnerSlug,
      },
    })
      .then((data) => {
        res.json({ status: true, data });
      })
      .catch((err) => {
        res.json({ err });
      });
  }

  public async fetchLogisticPartnerAndState(req: Request, res: Response) {
    const partnerSlug = req.params.partner;
    const destination = req.params.destination;

    PriceTable.findAll({
      where: {
        destination,
        partnerSlug,
      },
    })
      .then((data) => {
        res.json({ status: true, data });
      })
      .catch((err) => {
        res.json({ err });
      });
  }

  public async updatePriceTable(req: Request, res: Response) {
    const data = req.body;
    const id = req.params.id;

    if (!id) {
      res.status(400).json({ status: false, message: 'Id not Passed' });
    } else {
      const idExist = await PriceTable.findOne({
        where: { id },
      });

      if (idExist !== null) {
        PriceTable.update(data, { where: { id } })
          .then(() => {
            res.status(200).json({
              status: true,
              message: 'Data Updated successfully',
              info: data,
            });
          })
          .catch((err) => {
            res.json({ err });
          });
      } else {
        res.json({ status: false, message: 'ID does not Exist' });
      }
    }
  }

  public async create(req: Request, res: Response) {
    const params: PriceTableInterface = req.body;

    if (!req.body.partnerSlug || !req.body.destination || !req.body.weight || !req.body.price) {
      res.status(500).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      PriceTable.create<PriceTable>(params)
        .then((partner: PriceTable) =>
          res.status(201).json({ status: true, message: 'Data Added Successfully', partner }),
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json({ status: false, err });
        });
    }
  }

  public async delete(req: Request, res: Response) {
    PriceTable.destroy({
      where: { id: req.params.id },
    })
      .then((removedRows: number) => {
        if (Number(removedRows) === 0) {
          res.json({
            removedRows,
            status: false,
            message: 'ID not found',
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
