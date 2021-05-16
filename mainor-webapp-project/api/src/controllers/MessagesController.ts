import { AdjustPrice, AdjustPriceInterface } from '../models/AdjustPrice';
import { Category, CategoryInterface } from '../models/Category';
import { MessageList, MessageListInterface } from '../models/MessageList';
import { Messages, MessagesInterface } from '../models/Messages';
import { Request, Response } from 'express';

import { Customer } from '../models/Customer'
import { Merchant } from '../models/Merchant';
import { Product } from '../models/Product';
import { ProductImage } from '../models/ProductImage';

export class MessagesController {
  public async createMessage(req: any, res: Response) {
    const params: MessageListInterface = req.body;
    const customerId = req.user.id;
    const productId = req.body.productId;
    const merchantId = req.body.merchantId;
    const title = req.body.title;

    if (!productId || !customerId || !merchantId || !title) {
      res.status(400).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      const checkMessage = await MessageList.findOne<MessageList>({
        where: {
          customerId: customerId,
          productId: productId,
          merchantId: merchantId,
          title: title
        },
      })

      if (checkMessage !== null) {
        res.status(200).json({
          status: true,
          message: checkMessage
        });
      } else {
        params.customerId = customerId;
        MessageList.create<MessageList>(params)
          .then((data: MessageList) => res.status(201).json(data))
          .catch((err: Error) => res.status(500).json(err)); 
      }
    }
  }

    public async getMessageList(req: any, res: Response) {
    const customerId = req.user.id;

    await MessageList.findAll({ //todo debug reaseon why this not working as expected...
      where: { customerId: customerId },
      include: [
        {model: Product, as: 'product', include: [{model: Merchant, as: 'merchantInfo'}] },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((result: any) => {
        res.status(200).json({ status: true, data: result, message: 'successful' });
      })
      .catch((err: Error) => {
          console.log(err);
          
        res.status(500).json(err);
      });
  }

  public async getMessages(req: any, res: Response) {
    const messageId = req.params.id;
    await Messages.findAll({ // TODO debug reason why this not working as expected...
      where: { messageListId: messageId },
    })
      .then((data: any) => {
        MessageList.findByPk(messageId,{
          include: [
          {model: Product, as: 'product',  include: [{model: Merchant, as: 'merchantInfo'},{model: ProductImage, as: 'productImage'}]}
        ]}).then((result: any) => {
          res.status(200).json({ status: true, data: data, message: 'successful', list: result });
        })
        .catch((err: Error) => {
            console.log(err);
          res.status(500).json(err);
        });
      })
      .catch((err: Error) => {
          console.log(err);
          
        res.status(500).json(err);
      });
  }


  public async getMessageList_M(req: any, res: Response) {
    const merchantId = req.user.id;

    await MessageList.findAll({
      where: { merchantId: merchantId },
      include: [
          {model: Customer, as: 'customerInfo'},
          {model: Product, as: 'product'}
        ] 
    })
      .then((result: any) => {
        res.status(200).json({ status: true, data: result, message: 'successful' });
      })
      .catch((err: Error) => {
          console.log(err);
          
        res.status(500).json(err);
      });
  }


    public async all(req: any, res: Response) {
    const customerId = req.user.id;

    await Messages.findAndCountAll({
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

  public async addMessage(req: any, res: Response) {
    const params: MessagesInterface = req.body;
    console.log(params)
    if (!req.body.messageListId || !req.body.message || !req.body.sentBy) {
      res.status(400).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
        Messages.create<Messages>(params)
        .then((data: Messages) => res.status(201).json(data))
        .catch((err: Error) => res.status(500).json(err)); 
  }
}

  public createAgreedPrice(req: any, res: Response) {
    AdjustPrice.update(req.body, { // use create or update
      fields: Object.keys(req.body),
      where: { id: req.params.id },
    })
      .then((affectedRows: [number, AdjustPriceInterface[]]) => {
        if (Number(affectedRows) === 0) {
          res.json({
            status: false,
            message: 'Adjust price does not exist',
          });
        } else {
          res.json({
            status: true,
            message: 'Adjust price Updated Successfully',
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

//     public updateAgreedPrice(req: any, res: Response) {
//     Category.update(req.body, {
//       fields: Object.keys(req.body),
//       where: { id: req.params.id },
//     })
//       .then((affectedRows: [number, CategoryInterface[]]) => {
//         if (Number(affectedRows) === 0) {
//           res.json({
//             status: false,
//             message: 'Category ID does not exist',
//           });
//         } else {
//           res.json({
//             status: true,
//             message: 'Category Updated Successfully',
//             affectedRows: Number(affectedRows),
//           });
//         }
//       })
//       .catch((err: any) => {
//         res.json({
//           err,
//           status: false,
//         });
//       });
//   }

//   public delete(req: Request, res: Response) {
//     const MessageId = req.body.id
//     Messages.destroy({
//       where: { id: MessageId },
//     })
//       .then(() => {
//         res.status(200).json({
//           status: true,
//           message: 'Product Deleted Successfully',
//         });
//       })
//       .catch((err: any) => {
//         res.status(500).json({
//           err,
//           status: false,
//         });
//       });
//   }
}
