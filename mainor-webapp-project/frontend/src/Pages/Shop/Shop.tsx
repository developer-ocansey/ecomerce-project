import './Shop.scss'

import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import React, { useEffect, useState }  from 'react'
import { _truncate, formatCurrency, getToken, unAuthenticated } from '../../utils/index';

import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import Request from '../../api/requests';
import ShopLoading from '../../components/ShopLoading/ShopLoading';
import SubCategory from './Filter/subCategory';
import { toast } from 'react-toastify';

interface Identifiable { id: string; searchParam: string, subCategoryId: string , market: string}

const Shop_ = ({ match }: RouteComponentProps<Identifiable>) => {
    const catId = Number(match.params.id)
    const subCategoryId = Number(match.params.subCategoryId)
    const searchParam = match.params.searchParam
    const market = match.params.market

    const [category, setCategory] = useState('')
    useEffect(() => {
        if (catId) {
            Request(
                'GET',
                '/sub-categories/'+catId,
                  null).then((response: any) => {
                    if (response.status === 200) {
                        setCategory(response.data.category.name)
                }
              }).catch((e => {
                console.error(e)
              }))   
        }
    }, [catId])
    
    const GetProductsByCategory = (props: any) => {
        const [loading, setLoading] = useState(false)
        const [products, setProducts] = useState([]) // define types
        useEffect(() => {
            if (subCategoryId) {
                setLoading(true)
                Request(
                  'GET',
                  '/products/sub-category/'+subCategoryId,
                    null).then((response: any) => {
                        if (response.status === 200) {
                            setLoading(false)
                            setCategory(response.data.SubCategory.name)
                            if (response.data.products.rows.length > 0) {
                            setProducts(response.data.products.rows) // NOTE: clean this up from API level we shouldn't have duplicate namespace
                        }
                        }
                    }).catch((e => {
                        setLoading(false)
                  console.error(e)
                }))   
            }
        }, [])

        useEffect(() => {
            if (props.categoryId && !subCategoryId) {
                setLoading(true)
                Request(
                  'GET',
                  '/products/category/'+props.categoryId,
                    null).then((response: any) => {
                        if (response.status === 200) {
                            setLoading(false)
                            console.log(response)
                            if(response.data.products.rows.length >0){
                                setProducts(response.data.products.rows) // NOTE: clean this up from API level we shouldn't have duplicate namespace
                            }
                        }
                    }).catch((e => {
                        setLoading(false)
                  console.error(e)
                }))   
            }
        }, [props.categoryId])

        useEffect(() => {
            if (searchParam) {
                setLoading(true)
                Request(
                  'GET',
                  '/products/search/'+searchParam,
                    null).then((response: any) => {
                        if (response.status === 200) {
                            setLoading(false)
                            if (response.data.data.rows.length > 0) {
                            setProducts(response.data.data.rows) // NOTE: clean this up from API level we shouldn't have duplicate namespace
                        }
                        }
                    }).catch((e => {
                        setLoading(false)
                  console.error(e)
                }))   
            }
        }, [])
        
        useEffect(() => {
            if (market) {
                setLoading(true)
                Request(
                  'GET',
                  '/products/market/'+market,
                    null).then((response: any) => {
                        if (response.status === 200) {
                            setLoading(false)
                            if (response.data.products.rows.length > 0) {
                            setProducts(response.data.products.rows) // NOTE: clean this up from API level we shouldn't have duplicate namespace
                        }
                        }
                    }).catch((e => {
                        setLoading(false)
                  console.error(e)
                }))   
            }
        }, [])
        

        const saveItem = async (productId: any, e:any) => {
            e.preventDefault();
            if (unAuthenticated()){
                toast.error('Please log in to save products')
                return
              }
            await Request(
              'POST',
              'wishlist/add', {
              'productId': productId,
            }, { Authorization: getToken() }).then((response: any) => {
              if (response.status === 201) {
                toast.success('Product saved')
              } else {
                toast.error('Could not save product')
              }
            }).catch((e => {
                console.error(e)
            }))
        }
        
        return <>
            {loading ? <ShopLoading /> :
            <>
                {products.map((product: any, index:number) => {
                    if (product.merchantInfo !== null) {
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
                                            <div className='save-btn' onClick={(e)=>{saveItem(product.id, e)}}>
                                                <p>Save product</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    }
                    return <div/>
                })
        }</>
    }</>
        
    }
    return (
        <>
            <Breadcrumbs crumbs={[{'name': 'Home', 'link': '/'},{'name': 'Shop', 'link': '/shop'},{'name': category, 'link': '/shop'}]}/>
            <section id='shop'>
                <div className='container'>
                <div className='row'>
                    <div className='col-lg-3'>
                    <div className='shop-card'>
                        <div className='card-head'>
                        <h2>Filter Products</h2>
                        </div>
                        <div className='card-body'>
                        <div className='filter-wrap'>
                            <h2>Category</h2>
                            <SubCategory categoryId={catId} count={5} />
                        </div>
                        </div>
                    </div>
                    </div>
                    <div className='col-lg-9'>
                    <div className='shop-card'>
                        <div className='card-head no-border'>
                        <div className='row'>
                            <div className='col'>
                            <h2>{searchParam || category}</h2>
                            </div>
                            <div className='col flex-end'>
                            <div className='dropdown'>
                                <Link to='#' role='button' id='dropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><span>Sort by:</span> Popularity <img src='/img/icons/chevron-down.svg' alt='drop-down' /></Link>
                                <div className='dropdown-menu' aria-labelledby='dropdownMenuLink'>
                                <Link className='dropdown-item' to='#'>Popularity</Link>
                                <Link className='dropdown-item' to='#'>New Arrivals</Link>
                                <Link className='dropdown-item' to='#'>Price: Low to High</Link>
                                <Link className='dropdown-item' to='#'>Price: High to Low</Link>
                                <Link className='dropdown-item' to='#'>Product Rating</Link>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                        <div className='card-body'>
                        <div className='shop-product-wrap'>
                                        <GetProductsByCategory categoryId={catId || searchParam}/>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                </div>
            </section>
        </>
    )
}

const Shop = withRouter(Shop_ as any)
export default Shop