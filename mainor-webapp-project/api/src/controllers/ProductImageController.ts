import { ProductImage, ProductImageInterface } from '../models/ProductImage';
import { Request, Response } from 'express';

import { Product } from '../models/Product';
import s3 from '../config/s3.config.js';

export class ProductImageController {
  public async create(req: any, res: Response) {
    const ImgParams:ProductImageInterface = req.body;
    const productId = req.params.productId;
    console.log(req.files);
    if (!(productId || req.files)) {
      res.status(400).json({
        status: false,
        message: 'All Fields are required',
      });
      return;
    }

    // TODO (emmanuel) create a utility function for field validation and type checking....
    const productExist = await Product.findOne({ where: { id: productId } });
    if (!productExist) {
      return res
        .status(404)
        .json({ status: false, message: `Could not find a product associated with this ID: ${productId}` });
    }
    try {
      const s3Client = s3.s3Client;
      const params = s3.uploadParams;
      let result: string[] = [];
      let status = 0;
      req.files.map((f: any, i: number) => {
        status++;
        params.Key = f.originalname;
        params.Body = f.buffer;
        params.ACL = 'public-read';
        s3Client.upload(params, (err: string, data: any) => {
          if (err) {
            return res.status(500).json({ error: 'Error -> ' + err });
          }
          ImgParams.imageURL = data.Location;

          
          result.push(data.Location);
          ProductImage.create<ProductImage>({imageURL:ImgParams.imageURL,productId})
            .then((productImage: ProductImage) => {
              if (status == req.files.length) {
                return res.status(201).json({ data: result, message: 'Uploaded multiple files ' });
              }
            })
            .catch((err: Error) => {
              return res.status(500).json(err);
            });
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
}

//TODO improve so users can upload same image twice by using the hash of each files....