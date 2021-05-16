import { Admin, AdminInterface } from '../models/Admin';
import { Customer, CustomerInterface } from '../models/Customer';
import { Merchant, MerchantInterface } from '../models/Merchant';
import { Order, OrderInterface } from '../models/Order';
import { Product, ProductInterface } from '../models/Product';
import { ProductImage, ProductImageInterface } from '../models/ProductImage';
import { Request, Response } from 'express';

import { Market } from '../models/Market';
import { PickupAddress } from '../models/PickupAddress';
import { PriceTable } from '../models/PriceTable';
import { Utils } from '../utils/index';
import s3 from '../config/s3.config.js';

const utils = new Utils();
export class PublicController {
  healthz(req: Request, res: Response) {
    res.json('We are live and all ok go bcd.ng');
  }

  async upload(req: any, res: Response) {
    try {
      const s3Client = s3.s3Client;
      const params = s3.uploadParams;

      params.Key = req.file.originalname;
      params.Body = req.file.buffer;
      params.ACL = 'public-read';
      s3Client.upload(params, (err: string, data: any) => {
        if (err) {
          res.status(500).json({ error: 'Error -> ' + err });
        }
        res.json({ data: data, message: 'File uploaded successfully! -> keyname = ' + req.file.originalname });
      });
    } catch (error) {
      console.error(error);
    }
  }

  async uploadMultiple(req: any, res: Response) {
    try {
      const s3Client = s3.s3Client;
      const params = s3.uploadParams;
      params.ACL = 'public-read';
      let result: string[] = [];
      const files = JSON.parse(JSON.stringify(req.files));
      files.map((f: any) => {
        params.Key = f.originalname;
        params.Body = f.buffer;
        s3Client.upload(params, (err: string, data: any) => {
          if (err) {
            res.status(500).json({ error: 'Error -> ' + err });
          }
          result.push(data.Location);
        });
      });
      res.json({ data: result, message: 'Uploaded multiple files ' });
    } catch (error) {
      console.error(error);
    }
  }

   getMarkets = async (req:Request, res: Response) => {
    try {
      const offset = req.query.offset ? req.query.offset : 0;
      const limit = req.query.limit ? req.query.limit : 15;
  
      const market = await Market.findAll<Market>({
        offset: Number(offset),
        limit: Number(limit),
        order: [['createdAt', 'ASC']],
      });
      
      if (market) {
        res.status(200).json({
          status: true,
          data: market
        });
        return
      }

      res.status(404).json('No market found')
    } catch (error) {
      console.error(error);
    }
   }
  
   getPrices = async (req:Request, res: Response) => {
    try {
      const partner = req.params.partner;
      const destination = req.params.destination;
      const weight = req.params.weight;
      const prices = await PriceTable.findAll<PriceTable>({
        where: {
          partnerSlug: partner,
          destination: destination,
          weight: weight,
        }
      });
      
      if (prices) {
        res.status(200).json({
          status: true,
          data: prices
        });
        return
      }

      res.status(404).json('No price found using this parameters found')
    } catch (error) {
      console.error(error);
    }
  }

  async overview(req: Request, res: Response) {
    try {
      const orderCount = await Order.count({});
      const productCount = await Product.count({});
      const merchantCount = await Merchant.count({});
      const customerCount = await Customer.count({});
      const adminCount = await Admin.count({});
      const usersCount = merchantCount + customerCount;
      const completedOrder = await Order.count({
        where: {
          orderStatusId: 3, // 3 represents completed
        },
      });

      res.json({
        status: true,
        data: {
          orderCount,
          productCount,
          merchantCount,
          customerCount,
          adminCount,
          usersCount,
          completedOrder,
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  getPickupDetails = async (req:Request, res: Response) => {
    try {  
      const pickupDetails = await PickupAddress.findByPk(1);
      if (pickupDetails) {
        res.status(200).json({
          status: true,
          data: pickupDetails
        });
        return
      }
      res.status(404).json('No delivery details')
    } catch (error) {
      console.error(error);
    }
  }

  async merchantImport(req: Request, res: Response) {
    var input:any = {};

  Object.keys(input).map((n:any, index:number)=>{
        const params: MerchantInterface = req.body
        params.firstName = input[n].firstName,
        params.lastName = input[n].lastName,
        params.email = input[n].emailAddress,
        params.password = '',
        params.phone =  input[n].phoneNumber,
        params.businessName = input[n].businessName,
        params.businessLogo = '',
        params.rcNumber = input[n].rcNumber,
        params.location = `${input[n].lat},${ input[n].lon}`,
        params.businessAddress = input[n].businessAddress,
        params.market = input[n].market,
        params.planId = 0,
        params.isVerified = 'true',
        params.approved = 1,
      Merchant.create<Merchant>(params)
        .then(() => {
          console.log('inserted')
        })
        .catch((err: Error) => res.status(500).json(err));
  })

  }


    async productImport(req: Request, res: Response) {
    var input:any = {}
      Object.keys(input).map((n:any, index:number)=>{
      //   let cat = 0
      //   if (input[n].productCategory === 'Door'){
      //     cat = 1
      //   }else if (input[n].productCategory === 'Tiles'){
      //     cat = 2
      //   }else if (input[n].productCategory === 'Sanitary Wares'){
      //     cat = 3
      //   }else if (input[n].productCategory === 'Electrical Materials'){
      //     cat = 4
      //   }else {
      //     cat = 1
      //   }
      //   const params: ProductInterface = req.body
      //       params.name = input[n].productName;
      //       params.categoryId = cat;
      //       params.subCategoryId = 0;
      //       params.merchantId = parseInt(input[n].merchantId);
      //       params.price = Number(input[n].productunitPrice.replace(/\,/g,''));
      //       params.specification = '';
      //       params.unit= input[n].productunit;
      //       params.mo = 15;
      //       params.description = input[n].productDescription;
      //       params.goodsInStock=  100;
      //       params.visible = true;
      //       params.approved = true;

      // Product.create<Product>(params)
      //   .then(() => {
      //       console.log('Inserted')
      //   })
      //   .catch((err: Error) => res.status(500).json(err));
    if(input[n].hasOwnProperty(`productImageUrl3`)){
        const params: ProductImageInterface = req.body
        params.productId = parseInt(input[n].pid)
        params.imageURL = input[n].productImageUrl3
        ProductImage.create<ProductImage>(params)
        .then(() => {
          console.log("hello world")
        })
        .catch((err: Error) => console.log(err));
    }
      })
    }
}


