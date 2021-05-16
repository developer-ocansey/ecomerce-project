import { Product, ProductInterface } from '../models/Product';
import { ProductImage, ProductImageInterface } from '../models/ProductImage';
import { Request, Response } from 'express';
import sequelize, { Op, Sequelize } from 'sequelize';

import { Category } from '../models/Category';
import { Merchant } from '../models/Merchant';
import { ProductImageController } from './ProductImageController';
import { SubCategory } from '../models/SubCategory';
import { lte } from 'sequelize/types/lib/operators';
import s3 from '../config/s3.config';

const utils = require('../utils');


export class ProductController {
  public all(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 10;

    Product.findAll<Product>({
      offset: Number(offset),
      limit: Number(limit),
      include: [
        { model: Category, as: 'categories' },
        { model: SubCategory, as: 'subCategories' },
        { model: Merchant, as: 'merchantInfo' },
        { model: ProductImage, as: 'productImage' },
      ],
      order: [
        Sequelize.fn( 'RAND' ),
      ],
    })
      .then((products: Product[]) => {
        res.json({ status: true, products });
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public allWithCount(req: Request, res: Response) {

    //const offset = req.query.offset ? req.query.offset : 0;
    //const limit = req.query.limit ? req.query.limit : 10;

    let perPage:any = req.query.per_page ? req.query.per_page : 10;
    let page:any = req.query.page ? req.query.page : 1;

    const offset:any = (page * perPage) - perPage;
    

    Product.findAndCountAll<Product>({
      offset: Number(offset),
      limit: Number(perPage),
      include: [
        { model: Category, as: 'categories' },
        { model: SubCategory, as: 'subCategories' },
        { model: Merchant, as: 'merchantInfo' },
        { model: ProductImage, as: 'productImage' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((products) => {
        res.json({ status: true, products });
      })
      .catch((err: Error) => {
        res.status(500).json(err);
        console.log('I am an error'  + err)
      });
  }

  public productsWithoutSubCat(req: Request, res: Response) {

    //const offset = req.query.offset ? req.query.offset : 0;
    //const limit = req.query.limit ? req.query.limit : 10;

    let perPage:any = req.query.per_page ? req.query.per_page : 10;
    let page:any = req.query.page ? req.query.page : 1;

    const offset:any = (page * perPage) - perPage;
    

    Product.findAndCountAll<Product>({
      offset: Number(offset),
      limit: Number(perPage),
      where: {subCategoryId: 0},
      include: [
        { model: Category, as: 'categories' },
        { model: SubCategory, as: 'subCategories' },
        { model: Merchant, as: 'merchantInfo' },
        { model: ProductImage, as: 'productImage' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((products) => {
        res.json({ status: true, products });
      })
      .catch((err: Error) => {
        res.status(500).json(err);
        console.log('I am an error'  + err)
      });
  }

  public approved(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 102;

    Product.findAll<Product>({
      offset: Number(offset),
      limit: Number(limit),
      where: { approved: 1 },
      include: [
        { model: Category, as: 'categories' },
        { model: SubCategory, as: 'subCategories' },
        { model: Merchant, as: 'merchantInfo' },
         { model: ProductImage, as: 'productImage' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((products: Product[]) => {
        res.json({ status: true, products });
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public disapproved(req: Request, res: Response) {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 102;

    Product.findAll<Product>({
      offset: Number(offset),
      limit: Number(limit),
      where: { approved: 0 },
      include: [
        { model: Category, as: 'categories' },
        { model: SubCategory, as: 'subCategories' },
        { model: Merchant, as: 'merchantInfo' },
        { model: ProductImage, as: 'productImage' },
      ],
      order: [['createdAt', 'DESC']],
    })
      .then((products: Product[]) => {
        res.json({ status: true, products });
      })
      .catch((err: Error) => {
        res.status(500).json(err);
      });
  }

  public async create(req: any, res: Response) {
    const params: ProductInterface = req.body;
    // Make Sure all fields are not empty
    if (
      !req.body.name ||
      !req.body.categoryId ||
      !req.body.subCategoryId ||
      !req.body.merchantId ||
      !req.body.specification ||
      !req.body.price ||
      !req.body.unit ||
      !req.body.mo ||
      !req.body.weight ||
      !req.body.description ||
      !req.body.goodsInStock ||
      req.body.visible === null ||
      req.body.approved === null
      ) {

      res.status(400).json({
        status: false,
        message: 'All Fields are required',
      });
    } else {
      // Check if Category Exist
      const catID = parseInt(req.body.categoryId);
      const subCatID = parseInt(req.body.subCategoryId);
      const catExist = await Category.findOne({ where: { id: catID } });
      const subCatExist = await SubCategory.findOne({ where: { id: subCatID } });


      if (catExist === null || subCatExist === null) {
        res.status(400).json({ status: false, message: 'Category or SubCategory does not exist' });
      } else {
        Product.create<Product>(params)
          .then((product: Product) => {
            res.status(201).json(product);
          })
          .catch((err: Error) => {console.log(err);res.status(500).json(err)});
      }
    }
  }

  public async findProduct(req: Request, res: Response) {
    const productId = req.params.id;

    if (!productId) {
      res.status(400).json({ status: false, message: 'Product Id has not been passed' });
    } else {
      const productIdExist = await Product.findByPk(productId);
      if (productIdExist !== null) {
        Product.findOne<Product>({
          where: { id: productId ,},
          include: [
            { model: Category, as: 'categories' },
            { model: SubCategory, as: 'subCategories' },
            { model: Merchant, as: 'merchantInfo' },
            { model: ProductImage, as: 'productImage' },
          ],
        })
        .then((product) => {
          res.json({ status: true, product });
        })
        .catch((err: Error) => {
          res.status(500).json(err);
        });
      } else {
        res.json({ status: false, message: 'Product ID does not Exist' });
      }
    }
  }
  // TODO return after every requests...

  public updateProduct(req: any, res: Response) {
    const productId = req.params.id;
    const data = req.body;
    Product.findByPk(productId)
      .then((product) => {
        // Check if product was found
        if (!product) {
          return res.json({ status: false, message: 'Product not found' });
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
        product
          .update(data)
          .then(() => {
            console.log(data);
            res.status(200).json({
              status: true,
              message: 'Product Updated successfully',
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

  public deleteProduct(req: any, res: Response) {
    const productId = req.params.id;
    try {
      const user = req.user.id;
      Product.findByPk(productId)
        .then((product) => {
          if (!product) {
            return res.json({ status: false, message: 'Product not found' });
          }

          Product.destroy({
            where: {
              id: productId,
            },
          })
            .then(() => {
              res.json({ status: true, message: 'Product deleted successfully' });
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

  public disapproveProduct(req: any, res: Response) {
    const productId = req.params.id;
    try {
      const user = req.user.id;
      Product.findByPk(productId)
        .then((product) => {
          if (!product) {
            return res.json({ status: false, message: 'Product not found' });
          }

          Product.update(
            { approved: 0, visible: 0 },
            {
              where: {
                id: productId,
              },
            },
          )
            .then(() => {
              res.json({ status: true, message: 'Product Disapproved successfully' });
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

  public approveProduct(req: any, res: Response) {
    const productId = req.params.id;
    try {
      const user = req.user.id;
      Product.findByPk(productId)
        .then((product) => {
          if (!product) {
            return res.json({ status: false, message: 'Product not found' });
          }

          Product.update(
            { approved: 1, visible: 1 },
            {
              where: {
                id: productId,
              },
            },
          )
            .then(() => {
              res.json({ status: true, message: 'Product Approved successfully' });
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

  public fetchByMarket(req: Request, res: Response) {
    const market = req.params.market;

    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 102;

    if (!market) {
      return res.json({ status: false, message: 'Market has not been passed as a param' });
    }

    Product.findAndCountAll({
      offset: Number(offset),
      limit: Number(limit),
      include: [
        { model: Merchant, as: 'merchantInfo', where: { market } },
        { model: Category, as: 'categories' },
        { model: SubCategory, as: 'subCategories' },
        { model: ProductImage, as: 'productImage' },
      ],
    })
      .then((products) => {
        return res.json({ status: true, products });
      })
      .catch((err) => {
        return res.json({ status: false, err });
      });
  }

  async fetchByCategory(req: Request, res: Response) {
    const catId = req.params.id;
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 102;
    if (!catId) {
      return res.json({ status: false, message: 'Market has not been passed as a param' });
    }

    const catExist = await Category.findOne({ where: { id: catId } });

    if (catExist === null) {
      res.status(400).json({ status: false, message: 'CategoryId not exist' });
    } else {
      Product.findAndCountAll({
        where: {
          categoryId: catId,
          visible: 1
        },
        offset: Number(offset),
        limit: Number(limit),
        include: [
          { model: Merchant, as: 'merchantInfo' },
          { model: Category, as: 'categories' },
          { model: SubCategory, as: 'subCategories' },
          { model: ProductImage, as: 'productImage' },
        ],
      })
        .then((products) => {
          return res.json({ status: true, products });
        })
        .catch((err) => {
          return res.json({ status: false, err });
        });
    }
  }

  async fetchBySubCategory(req: Request, res: Response) {
    const subCategoryId = req.params.id;
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 102;
    if (!subCategoryId) {
      return res.json({ status: false, message: 'Market has not been passed as a param' });
    }

    const catExist = await SubCategory.findOne({ where: { id: subCategoryId } });

    if (catExist === null) {
      res.status(400).json({ status: false, message: 'Sub CategoryId not exist' });
    } else {
      Product.findAndCountAll({
        where: {
          subCategoryId: subCategoryId,
          visible: 1
        },
        offset: Number(offset),
        limit: Number(limit),
        include: [
          { model: Merchant, as: 'merchantInfo' },
          { model: Category, as: 'categories' },
          { model: ProductImage, as: 'productImage' },
        ],
      })
        .then((products) => {
          return res.json({ status: true, products:products, SubCategory: catExist });
        })
        .catch((err) => {
          return res.json({ status: false, err });
        });
    }
  }

  public  search= async(req: Request, res: Response)=> {
    const searchQuery = req.params.search;
    let offset = req.query.offset ? req.query.offset : 0;
    let limit = req.query.limit ? req.query.limit : 102;

    // // Important for Pagination
    // let perPage:any = req.query.per_page ? req.query.per_page : null;
    // let page:any = req.query.page ? req.query.page : null;
    // let paginationOffset:any = (page * perPage) - perPage;

    // if (perPage !== null && page !== null)  {
    //   offset = paginationOffset;
    //   limit = perPage;
    // }

    if (!searchQuery) {
      return res.json({ status: false, message: 'Invalid search parameters' });
    }
    await Product.findAndCountAll({
      offset: Number(offset),
      limit: Number(limit),
      where: {
        [Op.or]: [
          { name: { [Op.like]: '%' + searchQuery + '%' } },
          { description: { [Op.like]: '%' + searchQuery + '%' } },
        ],
      },
      include: [
        { model: ProductImage, as: 'productImage' },
        { model: Merchant, as: 'merchantInfo'},
        { model: Category, as: 'categories' },
        { model: SubCategory, as: 'subCategories' }
      ],
    })
      .then((results) => {
        res.json({ status: true, data: results, message: 'Successfull' });
      })
      .catch((err) => {
        res.json({ status: false, err });
      });
  }

  public merchant = async (req: any, res: Response) => {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 102;

    try {
      const merchantId = req.params.merchantId;

      await Product.findAndCountAll({
        offset: Number(offset),
        limit: Number(limit),
        where: {
          merchantId: merchantId,
        },
        include: [
          { model: ProductImage, as: 'productImage' },
          { model: Merchant, as: 'merchantInfo'},
          { model: Category, as: 'categories' },
          { model: SubCategory, as: 'subCategories' }
        ],
      })
        .then((data) => {
          res.json({ status: true, message: data });
        })
        .catch((err) => {
          res.json({ status: false, message: err });
        });
    } catch (err) {
      res.json({ status: false, message: err });
    }
  }

  public myProducts = async (req: any, res: Response) => {
    const offset = req.query.offset ? req.query.offset : 0;
    const limit = req.query.limit ? req.query.limit : 102;

    try {
      const userId = req.user.id;

      await Product.findAndCountAll({
        offset: Number(offset),
        limit: Number(limit),
        where: {
          merchantId: userId,
        },
        include: [
          { model: ProductImage, as: 'productImage' },
          { model: Merchant, as: 'merchantInfo'},
          { model: Category, as: 'categories' },
          { model: SubCategory, as: 'subCategories' }
        ],
      })
        .then((data) => {
          res.json({ status: true, message: data });
        })
        .catch((err) => {
          res.json({ status: false, message: err });
        });
    } catch (err) {
      res.json({ status: false, message: err });
    }
  };
}


const uploadImage = async (req: any, res: Response) => {
  const ImgParams: ProductImageInterface = req.body;
  const productId = req.body.productId;

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
        ProductImage.create<ProductImage>(ImgParams)
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