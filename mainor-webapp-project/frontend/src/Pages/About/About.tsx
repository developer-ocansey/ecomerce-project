import React from 'react';

const About = () => {
    return <>
      <div id="about-wrap">
        <div className="container">
            <div className="row">
                <div className="col">
                <h2>About Us</h2>
                <p className="big-t">BCD.ng is an online marketplace for construction and finishing products Our services will promote the online sales of construction finishing products, including tiles, sanitary wares, doors, light fittings and electrical materials, directly from major markets in Lagos State: Alaba International Market, Odunade/Coker Market, Amu Market Mushin.</p>

                <h3>We aim to provide seamless marketplace experience from purchase to delivery by building strategic partnerships to enable world-className logistics, insurance, financing, and easy payments.</h3>
                </div>
            </div>
            <div className="row mb-5">
                <div className="col-lg-4">
                <div className="service-wrap">
                    <h4>Marketplace</h4>
                    <p>Buyers and sellers can negotiate all terms before an order is placed. We do not regulate pricing on products.</p>
                    <a href="/">Learn more</a>
                </div>
                </div>
                <div className="col-lg-4">
                <div className="service-wrap">
                    <h4>Partnerships</h4>
                    <p>We have partnered with the best logistics, insurance and payment service providers for a seamless customer experience.</p>
                    <a href="/">Learn more</a>
                </div>
                </div>
                <div className="col-lg-4">
                <div className="service-wrap">
                    <h4>Quality Assurance</h4>
                    <p>Allow our <span>SourcePro</span> agents help to source, supervise, monitor and ensure a smooth transaction.</p>
                    <a href="/bulk-purchases">Learn more</a>
                </div>
                </div>
                <div className="col-lg-4">
                <div className="service-wrap">
                    <h4>Trade Financing</h4>
                    <p>Get access to funds to fulfil confirmed  bulk orders with acceptable payment terms.</p>
                    <a href="/trade-finance">Learn more</a>
                </div>
                </div>
            </div>
        </div>
    </div>
    </>
}
export { About } 
