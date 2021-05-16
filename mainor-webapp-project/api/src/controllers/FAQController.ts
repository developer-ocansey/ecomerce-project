import { FAQ, FAQInterface } from '../models/FAQ';
import { Request, Response } from 'express';

import { FAQCategory } from '../models/FAQCategory';

export class FAQController {
  public all(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;

    FAQCategory.findAll<FAQCategory>({
      offset: Number(offset),
      limit: Number(limit),
      include: [{ association: FAQCategory.FAQ, as: 'faq' }],
      order: [['createdAt', 'ASC']],
    })
      .then((faq: FAQCategory[]) => {
        res.status(200).json(faq);
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public index(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 15;
    FAQCategory.findAll<FAQCategory>({
      offset: Number(offset),
      limit: Number(limit),
      order: [['createdAt', 'DESC']],
    })
      .then((faq: FAQCategory[]) => {
        res.json(faq);
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public async findCategory(req: Request, res: Response) {
    const faqId = req.params.id;
    if (!faqId) {
      res.status(400).json({ status: false, message: 'FAQ ID was not been passed' });
    } else {
      const faqExist = await FAQCategory.findByPk(faqId);
      if (faqExist !== null) {
        FAQCategory.findOne<FAQCategory>({
          where: { id: faqId ,},
          include: [
            { model: FAQ, as: 'faq' },
          ],
        })
        .then((faqCategory) => {
          res.json({ status: true, faqCategory });
        })
        .catch((err: Error) => {
          res.status(500).json(err);
        });
      } else {
        res.json({ status: false, message: 'FAQCategory ID does not Exist' });
      }
    }
  }

  public async findFAQ(req: Request, res: Response) {
    const faqId = req.params.id;
    if (!faqId) {
      res.status(400).json({ status: false, message: 'FAQ ID was not been passed' });
    } else {
      const faqExist = await FAQ.findByPk(faqId);
      if (faqExist !== null) {
        FAQ.findOne<FAQ>({
          where: { id: faqId ,},
        })
        .then((faq) => {
          res.json({ status: true, faq });
        })
        .catch((err: Error) => {
          res.status(500).json(err);
        });
      } else {
        res.json({ status: false, message: 'FAQ ID does not Exist' });
      }
    }
  }

}
