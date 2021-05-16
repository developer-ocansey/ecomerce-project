import "./style.scss";

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import React, { FunctionComponent, useEffect, useState } from "react";
import {
  formatCurrency,
  getToken,
  getUser,
  setPageTitle,
  setRecentProducts,
  unAuthenticated,
} from "../../utils/index";
import { useHistory, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/BreadCrumbs/BreadCrumbs";
import BtnLoader from "../../components/BtnLoader/BtnLoader";
import { Link } from "react-router-dom";
import ProductLoading from "../../components/ProductLoading/ProductLoading";
import Ratings from "../../components/Ratings/Ratings";
import RecentProduct from "../../components/RecentProduct/RecentProduct";
import Request from "../../api/requests";
import { toast } from "react-toastify";

interface Identifiable {
  id: string;
}

type PagesProps = {
  globalState?: any;
};

const Product: FunctionComponent<PagesProps> = (params) => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const [activeImage, setActiveImage] = useState({
    id: 0,
    imageURL: "/img/no-image.png",
  });
  const [insure, setInsure] = useState(true);
  const [cartCount, setCartCount] = params.globalState("count");
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    unit: "",
    mo: 0,
    description: "",
    specification: "",
    merchantInfo: {
      id: 0,
      businessLogo: "",
      businessName: "",
      businessAddress: "",
    },
    productImage: [
      {
        id: 0,
        imageURL: "",
      },
    ],
  }); // define types
  const [loading, setLoading] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    setLoading(true);
    Request("GET", "/product/" + productId, null)
      .then((response: any) => {
        if (response.status === 200) {
          if (response.data.product.productImage.length > 0) {
            setActiveImage({
              id: response.data.product.productImage[0].id,
              imageURL: response.data.product.productImage[0].imageURL,
            });
          }
          setRecentProducts(response.data.product);
          setProduct(response.data.product); // NOTE: clean this up from API level we shouldn't have duplicate namespace
          setPageTitle(response.data.product.name);
          setQuantity(response.data.product.mo);
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
        console.error(e);
      });
  }, [productId]);

  const addToCart = async () => {
    if (unAuthenticated()) {
      toast.error("Please log in to add products to cart");
      return;
    }
    setLoadingCart(true);
    await Request(
      "POST",
      "cart/add",
      {
        productId: productId,
        quantity: quantity,
        insure: insure,
      },
      { Authorization: getToken() }
    )
      .then((response: any) => {
        if (response.status === 201) {
          setCartCount((v: number) => v + 1);
          toast.success("Product add to cart");
          setLoadingCart(false);
          getCart();
        } else if (response.status === 200 && response.data.status === false) {
          toast.error("Product already exist in cart");
          setLoadingCart(false);
        } else {
          toast.error("Could not add product to cart");
          setLoadingCart(false);
        }
      })
      .catch((e) => {
        setLoadingCart(false);
        console.error(e);
      });
  };

  const getCart = () => {
    Request("GET", "/cart/all", null, { Authorization: getToken() })
      .then((response: any) => {
        if (response.status === 200) {
          // setCartCount(response.data.data.rows.length)
        }
      })
      .catch((e: any) => {
        console.error(e);
      });
  };

  const buyNow = () => {
    if (unAuthenticated()) {
      toast.error("Please log in to add products to cart");
      return;
    }

    let redirect = new Promise((resolve) => {
      resolve(addToCart());
    });
    redirect.then(() => {
      history.push("/checkout");
    });
  };

  const messageSeller = async () => {
    if (getUser() === "") {
      toast.error(
        `Please login or create an account to start a conversation with ${product.merchantInfo.businessName}.`
      );
      return;
    }

    await Request(
      "POST",
      "customer/message/create",
      {
        productId: productId,
        merchantId: product.merchantInfo.id,
        title: product.name,
      },
      { Authorization: getToken() }
    )
      .then((response: any) => {
        if (response.status === 201) {
          toast.success(
            `Conversation opened with ${product.merchantInfo.businessName}`
          );
          history.push(`/home/message-center/${response.data.id}`);
        } else if (response.status === 200 && response.data.status === true) {
          history.push(`/home/message-center/${response.data.message.id}`);
        } else {
          toast.error("Could not contact merchant try again.");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };
  const logo =
    product.merchantInfo.businessLogo === "" ||
    product.merchantInfo.businessLogo === null
      ? "/img/empty.svg"
      : product.merchantInfo.businessLogo;
  const description = JSON.parse(product.description || "{}");
  const specification = JSON.parse(product.specification || "{}");
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", link: "/" },
          { name: "Shop", link: "/shop" },
          { name: "Electrical Materials", link: "/shop" },
        ]}
      />

      <section id="single-product">
        <div className="container">
          {loading ? (
            <ProductLoading />
          ) : (
            <>
              <div className="row">
                <div className="col-lg-8">
                  <div className="shop-card">
                    <div className="card-body">
                      <div className="single-product-view">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="s-product-lhs">
                              <div className="product-image flex-center">
                                <img
                                  className="img-fluid"
                                  src={activeImage.imageURL}
                                  alt="..."
                                />
                                <div className="zoom-icon">
                                  <span>
                                    <img src="/img/icons/zoom.svg" alt="..." />
                                  </span>
                                </div>
                              </div>
                              <div className="product-thumbnail">
                                {product.productImage
                                  .slice(0, 4)
                                  .map((image, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className={`${
                                          image.id === activeImage.id &&
                                          "active"
                                        }`}
                                        onClick={() => {
                                          setActiveImage({
                                            id: image.id,
                                            imageURL: image.imageURL,
                                          });
                                        }}
                                      >
                                        <img
                                          className="img-fluid"
                                          src={image.imageURL}
                                          alt="..."
                                        />
                                      </div>
                                    );
                                  })}
                              </div>
                              <div className="line"></div>
                              <div className="share-product">
                                {/* implement share */}
                                <h2>Share Product</h2>
                                <div className="share-icon flex-center">
                                  <span>
                                    <FacebookShareButton
                                      url={window.location.href}
                                    >
                                      <img src="/img/fb-dark.svg" alt="..." />
                                    </FacebookShareButton>
                                  </span>
                                </div>
                                <div className="share-icon flex-center">
                                  <span>
                                    <TwitterShareButton
                                      url={window.location.href}
                                    >
                                      <img src="/img/tw-dark.svg" alt="..." />
                                    </TwitterShareButton>
                                  </span>
                                </div>
                                <div className="share-icon flex-center">
                                  <span>
                                    <LinkedinShareButton
                                      url={window.location.href}
                                    >
                                      <img src="/img/li-dark.svg" alt="..." />
                                    </LinkedinShareButton>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="s-product-rhs">
                              <h2 className="product-name">{product.name}</h2>
                              <p className="product-brand">Brand:</p>
                              {/* todo fill product brands */}
                              <Ratings rate={5} />
                              <div className="line"></div>
                              {/* Fix minimum order  also work on minimum order, also cover insurance module, change quantity */}
                              <h3 className="product-price">
                                {formatCurrency(product.price)}
                                <span>
                                  / {product.unit} | {product.mo} {product.unit}
                                  (s) Min Order
                                </span>
                              </h3>
                              <div className="product-quantity">
                                <h6>Quantity :</h6>
                                <div className="input-group">
                                  <div className="button minus">
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-number"
                                      onClick={() => {
                                        setQuantity(
                                          quantity <= product.mo
                                            ? product.mo
                                            : quantity - 1
                                        );
                                      }}
                                    >
                                      <i className="ti-minus"></i>
                                    </button>
                                  </div>
                                  <input
                                    type="text"
                                    className="input-number"
                                    data-min={product.mo}
                                    data-max="1000"
                                    value={quantity}
                                    onChange={(e) => {
                                      setQuantity(Number(e.target.value));
                                    }}
                                  />
                                  <div className="button plus">
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-number"
                                      onClick={() => {
                                        setQuantity(quantity + 1);
                                      }}
                                    >
                                      <i className="ti-plus"></i>
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="add-to-cart">
                                {product.unit}(s)
                              </div>
                              <div className="user-cta">
                                <button
                                  className="btn btn-warning buy-btn"
                                  onClick={() => {
                                    buyNow();
                                  }}
                                >
                                  Buy now
                                </button>
                                <button
                                  className="btn btn-light add-to-cart-btn"
                                  onClick={() => {
                                    addToCart();
                                  }}
                                >
                                  {loadingCart ? <BtnLoader /> : "Add to cart"}
                                </button>
                              </div>
                              <div className="line"></div>
                              <div className="insurance-info">
                                <img
                                  src="/img/partners/axa_mansard.svg"
                                  alt="..."
                                />
                                {/* Remove for category relating to tiles and ceramics */}
                                <p>
                                  Insurance cover available at{" "}
                                  <span>
                                    {formatCurrency(0.004 * product.price)}
                                  </span>{" "}
                                  <span
                                    className={
                                      insure
                                        ? "insure-action-rm"
                                        : "insure-action"
                                    }
                                    onClick={() => setInsure(!insure)}
                                  >
                                    {insure
                                      ? "Remove Insurance"
                                      : "Buy Insurance"}
                                  </span>
                                </p>
                              </div>
                              <div className="line"></div>
                              <div className="delivery-info">
                                <h4>Delivery information</h4>
                                <p>
                                  Normally delivered between 2 to 3 days. Exact
                                  dates and delivery options will be displayed
                                  on the Checkout page.
                                </p>
                              </div>
                              <div className="return-info">
                                <h4>Return policy</h4>
                                <p>
                                  You can return this item for free within 7
                                  days of purchase.
                                </p>
                              </div>
                            </div>
                            {/* <div className="add-to-cart">{product.unit}(s)</div>
                            <div className="user-cta">
                              <button
                                className="btn btn-warning buy-btn"
                                onClick={() => {
                                  buyNow();
                                }}
                              >
                                Buy now
                              </button>
                              <button
                                className="btn btn-light add-to-cart-btn"
                                onClick={() => {
                                  addToCart();
                                }}
                              >
                                {loadingCart ? <BtnLoader /> : "Add to cart"}
                              </button>
                            </div>
                            <div className="line"></div>
                            <div className="insurance-info">
                              <img
                                src="/img/partners/axa_mansard.svg"
                                alt="..."
                              />
                              <p>
                                Insurance cover available at{" "}
                                <span>
                                  {formatCurrency(0.004 * product.price)}
                                </span>{" "}
                                <span
                                  className={
                                    insure
                                      ? "insure-action-rm"
                                      : "insure-action"
                                  }
                                  onClick={() => setInsure(!insure)}
                                >
                                  {insure
                                    ? "Remove Insurance"
                                    : "Buy Insurance"}
                                </span>
                              </p>
                            </div>
                            <div className="line"></div>
                            <div className="delivery-info">
                              <h4>Delivery information</h4>
                              <p>
                                Normally delivered between 1 to 5 business days,
                                depending on location. Exact dates and delivery
                                options will be displayed on the Checkout page.
                              </p>
                            </div>
                            <div className="return-info">
                              <h4>Return policy</h4>
                              <p>
                                Please see our returns policy for information on
                                how to return this product.
                              </p>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="shop-card">
                    <div className="card-head">
                      <h2>Sellers Information</h2>
                    </div>
                    <div className="card-body">
                      <div className="media">
                        <div className="media-body">
                          <h5 title="Verified Seller" className="mt-0 mb-1">
                            <img
                              className="mr-2"
                              width="14"
                              src="/img/icons/verified.svg"
                              alt="..."
                            />
                            <Link to={'/merchant/store/'+product.merchantInfo.id} className='txt'>{product.merchantInfo.businessName}</Link>
                          </h5>
                          <p>{product.merchantInfo.businessAddress}</p>
                        </div>
                        <div className="media-img">
                          <img src={logo} className="img-fluid" alt="... " />
                        </div>
                      </div>
                      <div className="contact-actions">
                        <h2 className="seller-score">100% Seller Score</h2>
                        <h2
                          className="contact-now"
                          onClick={() => {
                            messageSeller();
                          }}
                        >
                          <img
                            className="mr-2"
                            width="18"
                            src="/img/icons/msg2.svg"
                            alt="..."
                          />
                          Message Seller
                        </h2>
                      </div>
                      <div className="contact-card"></div>
                      <div className="bcd-disclaimer">
                        <h3>
                          <img src="/img/icons/information.svg" alt="..." />
                          Important information
                        </h3>
                        <p>
                          You're allowed to interact with the seller and
                          conclude on specific needs per transaction. Please
                          note that if you choose to deal with the Seller off
                          the platform, you do so at your own risk. bcd.ng will
                          not be liable to any damages.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-lg-8">
                  <div className="shop-card">
                    <div className="card-head">
                      <h2>Product Description</h2>
                    </div>
                    <div className="card-body">
                      <div className="product-info-wrap">
                        <div className="row">
                          <div className="col-lg-12">
                            {description.Description && (
                              <div className="info-block">
                                <h2>Product information</h2>
                                <p>{description.Description}</p>
                              </div>
                            )}
                            {description.Delivery && (
                              <div className="info-block">
                                <h2>Packaging and Delivery</h2>
                                <p>{description.Delivery}</p>
                              </div>
                            )}
                            {description.Others && (
                              <div className="info-block">
                                <h2>Additional Information</h2>
                                <p>
                                  {description.Others ||
                                    description.AdditionalInfo}
                                </p>
                              </div>
                            )}
                          </div>
                          {specification && (
                            <div className="col-lg-5">
                              <div className="spec-wrap">
                                <h2>Specification</h2>
                                <table className="table table-bordered">
                                  <tbody>
                                    {Object.keys(specification).map(
                                      (k: any, index: any) => {
                                        return (
                                          <tr key={index}>
                                            <td>{k}</td>
                                            <td>{specification[k]}</td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  {/* <div className="shop-card">
                    <div className="ad-square"></div>
                  </div> */}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <RecentProduct />
    </>
  );
};

export default Product;
