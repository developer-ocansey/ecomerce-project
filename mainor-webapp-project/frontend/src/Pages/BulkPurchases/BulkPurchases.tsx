import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import React from 'react';

const BulkPurchases = () => {
    return (<>
        <Breadcrumbs crumbs={[{'name': 'home', 'link': '/'},{'name': 'Bulk purchases', 'link': '/bulk-purchases'}]}/>
        <section id="about-wrap">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h2>Bulk Purchase (SOURCEPRO)</h2>
                        <p className="big-t">Corporate or individual body? We are all about providing you comfort wherever you are. If there’s a product you would like to get, let’s assist by sourcing for what you need in the market. Shopping online with us is very convenient, safe and secured. We have a team of professionals we call <span>SourcePro</span> dedicated to help yousource for your preferred products and ensure timely  delivery of your products.</p>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-lg-5">
                        <div className="service-wrap">
                            <img src="img/icons/quality.svg" alt='quality' />
                            <h4 className="info-service">Genuine Products</h4>
                            <p>Our strong affiliation with top brands provides us with access to thousands of products. This guarantees authenticity in products sourced and delivered by BCD.ng. We will meet your specification regarding your product choice. Our agents are well trained to source for the very best in the market.</p>
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="service-wrap">
                            <img src="img/icons/delivery.svg" alt='delivery' />
                            <h4 className="info-service">Shipping and Handling</h4>
                            <p>We’ve got that covered. Our partnership with top and efficient logistic companies ensures that your products will be delivered on time and in good condition. We’ve partnered with top and efficient logistics companies to ensure your products gets delivered to you on time and in good condition.</p>
                        </div>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col">
                        <div className="info-block">
                            <h1>Want to Know More?</h1>
                            <p>Get in touch with us via <a href="mailto:info@bcd.ng">Email</a> or <a href="+2347037138919">Phone</a> with the following information <span>Full name, Phone number and Email address</span>. A dedicated account manager will assist with your product of choice, enquiry and ensure availability and delivery.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section></>);
};

export { BulkPurchases };
