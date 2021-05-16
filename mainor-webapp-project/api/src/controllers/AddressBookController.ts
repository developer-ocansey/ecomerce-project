import { AddressBook, AddressBookInterface } from '../models/AddressBook';
import { Request, Response } from 'express';

export class AddressBookController {
  public all(req: any, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;
    const customerId = req.user.id;

    AddressBook.findAll<AddressBook>({
      offset: Number(offset),
      limit: Number(limit),
      where:{customerId: customerId},
      order: [['createdAt', 'DESC']],
    })
      .then((categories: AddressBook[]) => {
        res.status(200).json(categories);
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public async create(req: any, res: Response) {
    const params: AddressBookInterface = req.body;
    const customerId = req.user.id;

    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const phoneNumber = req.body.phoneNumber
    const region = req.body.region
    const state = req.body.state
    const city = req.body.city
    const address = req.body.address

    if (!firstName || !lastName || !phoneNumber || !region || !city || !address) {
      res.status(400).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      const addressbk = await AddressBook.findOne<AddressBook>({
        where: {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          region: region,
          state: state,
          city: city,
          address: address,
        },
      })
      console.log("gotcha ",addressbk)
      if (addressbk !== null) {
        res.status(409).json({
          status: false,
          message: 'address already exist',
        });
      } else {
        params.customerId = customerId;
        params.default = req.body.default || false
        AddressBook.create<AddressBook>(params)
          .then((data: AddressBook) => res.status(201).json(data))
          .catch((err: Error) => res.status(500).json(err)); 
      }
    }
  }

  public update(req: any, res: Response) { // work on...
    AddressBook.update(req.body, {
      fields: Object.keys(req.body),
      where: { id: req.params.id },
    })
      .then((affectedRows: [number, AddressBookInterface[]]) => {
        if (Number(affectedRows) === 0) {
          res.json({
            status: false,
            message: 'AddressBook ID does not exist',
          });
        } else {
          res.json({
            status: true,
            message: 'AddressBook Updated Successfully',
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
    AddressBook.destroy({
      where: { id: req.params.id },
    })
      .then((removedRows: number) => {
        if (Number(removedRows) === 0) {
          res.json({
            removedRows,
            status: false,
            message: 'AddressBook ID not found',
          });
        } else {
          res.json({
            removedRows,
            status: true,
            message: 'AddressBook Deleted Successfully',
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
