import React, { useEffect, useState }  from 'react';
import { _truncate, formatCurrency, getRecentProducts, getToken, getUser } from '../../utils/index';

import { Link } from 'react-router-dom';
import Request from '../../api/requests';
import ShopLoading from '../ShopLoading/ShopLoading';
import { toast } from 'react-toastify';

const RecentProduct = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([]) // define types

  useEffect(() => {
    setLoading(true)
    if (getRecentProducts()){
      const d = JSON.parse(getRecentProducts())
      setProducts(d)
    }
    setLoading(false)
}, [])

const saveItem = async (productId: any) => {
  await Request(
    'POST',
    'wishlist/add', {
    'productId': productId,
  }, { Authorization: getToken() }).then((response: any) => {
    console.log(response)
    if (response.status === 201) {
      toast.success('Product saved')
    } else {
      toast.error('Could not save product')
    }
  }).catch((e => {
      console.error(e)
  }))
}

  const Products = () => {
    return <>
        {loading ? <ShopLoading /> :
        <>
            {products.reverse().slice(0,4).map((product: any, index:number) => {
                if (product.merchantInfo == null) {
                    return
                }
                const image = product.productImage[0] ? product.productImage[0].imageURL : '/img/no-image.png'
                return (
                    <div className='product' key={index}>
                        <div className='product-img'>
                            <Link to={`/product/${product.id}`} className='flex-center'><img className='img-fluid' src={image} alt='fav' /></Link>
                            <div className='favorite-icon'>
                                <Link to='fav' className='top-right'><img src='/img/icons/favorite.svg' alt='favorite' /></Link>
                            </div>
                        </div>
                        <Link to={`/product/${product.id}`}>
                            <div className='product-info'>
                                <p className='product-name'>{_truncate(product.name, 40)}</p>
                                <h2 className='product-price'>{formatCurrency(product.price)}</h2>
                                {/* <h2 className='old-price'>&#8358;{product.price}</h2> <span className='discount'>-30%</span> TODO WORK ON DISCOUNT MODULE */}
                                <p title='Verified Seller' className='product-seller'><img className='mr-1' width='12' src="/img/icons/verified.svg" alt='product' />{_truncate(product.merchantInfo.businessName, 25)} </p>
                                <p className='product-origin'>{_truncate(product.merchantInfo.businessAddress, 35)}</p>
                                <div className='product-rating flex-apart' >
                                    {/* sort out ratings */}
                                    <div>
                                        <span className='fa fa-star checked'></span>
                                        <span className='fa fa-star checked'></span>
                                        <span className='fa fa-star checked'></span>
                                        <span className='fa fa-star checked'></span>
                                        <span className='fa fa-star checked'></span>
                                    </div>
                                    <div className='save-btn' onClick={()=>{saveItem(product.id)}}>
                                        <p>Save Product</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )
            })
    }</>
}</>
  }
    return (
      <>
      {products.length > 0 && <section id='shop'>
        <div className='container'>
          <div className='row mt-4'>
            <div className='col-lg-12'>
              <div className='shop-card'>
                <div className='card-head no-border'>
                  <h2>Recently Viewed Products</h2>
                </div>
                <div className='card-body'>
                  <div className='shop-product-wrap'>
                    <Products />
                    <div className='clearfix'></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>}
      </>
    )
}

export default RecentProduct;