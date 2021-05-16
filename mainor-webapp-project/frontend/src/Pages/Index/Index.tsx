import "./style.scss";

import React, { useEffect, useState } from "react";
import {
  _truncate,
  formatCurrency,
  getToken,
  getUser,
  unAuthenticated,
} from "../../utils/index";

import { Link } from "react-router-dom";
import Ratings from "../../components/Ratings/Ratings";
import RecentProduct from "../../components/RecentProduct/RecentProduct";
import Request from "../../api/requests";
import ShopLoading from "../../components/ShopLoading/ShopLoading";
import { setPageTitle } from "../../utils";
import { toast } from "react-toastify";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); // define types

  useEffect(() => {
    setPageTitle("Electrical construction materials");
    Request("GET", "/products/all/", null)
      .then((response: any) => {
        if (response.status === 200) {
          setLoading(false);
          if (response.data.products.length > 0) {
            setProducts(response.data.products); // NOTE: clean this up from API level we shouldn't have duplicate namespace
          }
        }
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
      });
  }, []);

  const saveItem = async (productId: any, e: any) => {
    e.preventDefault();
    if (unAuthenticated()) {
      toast.error("Please log in to save products");
      return;
    }
    await Request(
      "POST",
      "wishlist/add",
      {
        productId: productId,
      },
      { Authorization: getToken() }
    )
      .then((response: any) => {
        console.log(response);
        if (response.status === 201) {
          toast.success("Product saved");
        } else {
          toast.error("Could not save product");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const Products = () => {
    return (
      <>
        {loading ? (
          <ShopLoading />
        ) : (
          <>
            {products.slice(0, 8).map((product: any, index: number) => {
              if (product.merchantInfo == null) {
                return null;
              }
              const image = product.productImage[0]
                ? product.productImage[0].imageURL
                : "/img/no-image.png";
              return (
                <div className="product" key={index}>
                  <div className="product-img">
                    <Link to={`/product/${product.id}`} className="flex-center">
                      <img className="img-fluid" src={image} alt="fav" />
                    </Link>
                    <div className="favorite-icon">
                      <Link to="fav" className="top-right">
                        <img src="/img/icons/favorite.svg" alt="favorite" />
                      </Link>
                    </div>
                  </div>
                  <Link to={`/product/${product.id}`}>
                    <div className="product-info">
                      <p className="product-name">
                        {_truncate(product.name, 40)}
                      </p>
                      <h2 className="product-price">
                        {formatCurrency(product.price)}
                      </h2>
                      {/* <h2 className='old-price'>&#8358;{product.price}</h2> <span className='discount'>-30%</span> TODO WORK ON DISCOUNT MODULE */}
                      <p title="Verified Seller" className="product-seller">
                        <img
                          className="mr-1"
                          width="12"
                          src="/img/icons/verified.svg"
                          alt="product"
                        />
                        {_truncate(product.merchantInfo.businessName, 25)}{" "}
                      </p>
                      <p className="product-origin">
                        {_truncate(product.merchantInfo.businessAddress, 35)}
                      </p>
                      <div className="product-rating flex-apart">
                        {/* sort out ratings */}
                        <div>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                          <span className="fa fa-star checked"></span>
                        </div>
                        <div
                          className="save-btn"
                          onClick={(e) => {
                            saveItem(product.id, e);
                          }}
                        >
                          <p>Save Product</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <div id="home-banner" className="carousel slide" data-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/img/banners/03.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="/img/banners/01.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
          <div className="carousel-item">
            <img
              src="/img/banners/02.jpg"
              className="d-block w-100"
              alt="..."
            />
          </div>
        </div>
        <a
          className="carousel-control-prev"
          href="#home-banner"
          role="button"
          data-slide="prev"
        >
          <img width="12" src="/img/icons/chevron-left-white.svg" alt="..." />
        </a>
        <a
          className="carousel-control-next"
          href="#home-banner"
          role="button"
          data-slide="next"
        >
          <img width="12" src="/img/icons/chevron-right-white.svg" alt="..." />
        </a>
      </div>

      {/* <!-- Features --> */}
      <section id="home-features">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="feature-box">
                <img src="img/icons/negotiation.svg" alt="src" />
                <h3>Negotiations</h3>
                <p>
                  Buyers and sellers can negotiate all terms before trading.
                </p>
                <div className="clearfix"></div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="feature-box">
                <img src="img/icons/fast-delivery.svg" alt="src" />
                <h3>Fast Deliveries</h3>
                <p>
                  BCD assures its customers of quality deliveries nationwide.
                </p>
                <div className="clearfix"></div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="feature-box">
                <img src="img/icons/insurance.svg" alt="src" />
                <h3>Insurance Cover</h3>
                <p>We ensure your orders receive maximum protection.</p>
                <div className="clearfix"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Categories Product --> */}
      <section id="shop" className="cat-section">
        <div className="container">
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="shop-card">
                <div className="card-head no-border">
                  <h2 className="home-title">
                    Popular Products in Each Category
                  </h2>
                </div>
                <div className="card-body">
                  <div className="shop-product-wrap">
                    <div className="product2">
                      <div className="product-img flex-center">
                        <Link to={`/category/5`}>
                          <img
                            className="img-fluid"
                            src="img/product/bulb.jpg"
                            alt="src"
                          />
                        </Link>
                      </div>
                      <Link to={`/category/5`}>
                        <div className="product-info">
                          <p className="product-name">Electric bulbs</p>
                        </div>
                      </Link>
                    </div>

                    <div className="product2">
                      <div className="product-img flex-center">
                        <Link to={`/category/4`}>
                          <img
                            className="img-fluid"
                            src="img/product/socket.jpg"
                            alt="src"
                          />
                        </Link>
                      </div>
                      <Link to={`/category/5`}>
                        <div className="product-info">
                          <p className="product-name">Wall Sockets</p>
                        </div>
                      </Link>
                    </div>

                    <div className="product2">
                      <div className="product-img flex-center">
                        <Link to={`/category/2`}>
                          <img
                            className="img-fluid"
                            src="img/product/tiles.jpg"
                            alt="src"
                          />
                        </Link>
                      </div>
                      <Link to={`/category/2`}>
                        <div className="product-info">
                          <p className="product-name">
                            Tiles, Marbles and Granite
                          </p>
                        </div>
                      </Link>
                    </div>

                    <div className="product2">
                      <div className="product-img flex-center">
                        <Link to={`/category/3`}>
                          <img
                            className="img-fluid"
                            src="img/product/wc.jpg"
                            alt="src"
                          />
                        </Link>
                      </div>
                      <Link to={`/category/3`}>
                        <div className="product-info">
                          <p className="product-name">Water Closet</p>
                        </div>
                      </Link>
                    </div>

                    <div className="product2">
                      <div className="product-img flex-center">
                        <Link to={`/category/3`}>
                          <img
                            className="img-fluid"
                            src="img/product/shower.jpg"
                            alt="src"
                          />
                        </Link>
                      </div>
                      <Link to={`/category/3`}>
                        <div className="product-info">
                          <p className="product-name">Showers</p>
                        </div>
                      </Link>
                    </div>

                    <div className="product2">
                      <div className="product-img flex-center">
                        <Link to={`/category/5`}>
                          <img
                            className="img-fluid"
                            src="img/product/chandelier.jpg"
                            alt="src"
                          />
                        </Link>
                      </div>
                      <Link to={`/category/5`}>
                        <div className="product-info">
                          <p className="product-name">Chandeliers</p>
                        </div>
                      </Link>
                    </div>

                    <div className="product2">
                      <div className="product-img flex-center">
                        <Link to={`/category/3`}>
                          <img
                            className="img-fluid"
                            src="img/product/wash.jpg"
                            alt="src"
                          />
                        </Link>
                      </div>
                      <Link to={`/category/3`}>
                        <div className="product-info">
                          <p className="product-name">Wash Hand Basins</p>
                        </div>
                      </Link>
                    </div>

                    <div className="product2">
                      <div className="product-img flex-center">
                        <Link to={`/category/4`}>
                          <img
                            className="img-fluid"
                            src="img/product/lamp.jpg"
                            alt="src"
                          />
                        </Link>
                      </div>
                      <Link to={`/category/4`}>
                        <div className="product-info">
                          <p className="product-name">Lamps</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="home-shop">
        <div className="container">
          <div className="row mt-4">
            <div className="col-lg-12">
              <div className="shop-card">
                <div className="card-head no-border">
                  <h2 className="home-title">
                    Featured Products from Verified Sellers
                  </h2>
                </div>
                <div className="card-body">
                  <div className="shop-product-wrap">
                    <Products />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="seller-ad">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="seller-ad-wrap">
                <h2>Become a seller</h2>
                <p>
                  Signup today for free and{" "}
                  <a href="https://merchant.bcd.ng/">Start selling</a>, its as
                  easy as a bcd.
                </p>
                {/* <!-- <button class="btn btn-warning">Get Started</button> --> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <RecentProduct />

      <section id="bcd-services">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2>Take advantage of our Trade Services </h2>
              <p>
                We provide various services to ensure a seamless transaction,
                see below for details
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="service-wrap-container">
                <a
                  href="https://tradersofafrica.com/source-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="service-wrap">
                    <img src="img/services/sourcepro.jpg" alt="ser" />
                    <h3>SourcePro (Bulk Purchase)</h3>
                    <p>
                      Let our sourcing professionals handle your more specific
                      needs for products and logistics.
                    </p>
                    {/* <!-- <a href="bulk-purchases.html">Learn more</a> --> */}
                  </div>
                </a>

                <Link to="/trade-financing">
                  <div className="service-wrap">
                    <img src="img/services/financing.jpg" alt="ser" />
                    <h3>Trade Financing</h3>
                    <p>
                      Take advantage of our funding platform to facilitate your
                      sales transactions with minimal risk.
                    </p>
                    {/* <!-- <a href="trade-finance.html">Learn more</a> --> */}
                  </div>
                </Link>

                <Link to="/insurance">
                  <div className="service-wrap">
                    <img src="img/services/insurance.jpg" alt="ser" />
                    <h3>Insurance</h3>
                    <p>
                      With Goods In Transit (GIT) insurance cover, your products
                      are protected.
                    </p>
                    {/* <!-- <a href="logistics.html">Learn more</a> --> */}
                  </div>
                </Link>

                <Link to="/become-a-partner/logistics">
                  <div className="service-wrap">
                    <img src="img/services/logistics.jpg" alt="ser" />
                    <h3>Logistics</h3>
                    <p>
                      Our logistics partners will deliver your items to you at
                      the quickest possible time.
                    </p>
                    {/* <!-- <a href="logistics.html#delivery">Learn more</a> --> */}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
