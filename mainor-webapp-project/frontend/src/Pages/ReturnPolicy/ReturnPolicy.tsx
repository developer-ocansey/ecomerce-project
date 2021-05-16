import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import React from 'react';

const ReturnPolicy = () => {
    return <> 
            <Breadcrumbs crumbs={[{'name': 'home', 'link': '/'},{'name': 'Return Policy', 'link': '/return-policy'}]}/>
            <section id="site-info-wrap">
                <div className="container">
                <div className="row">
                    <div className="col">
                    <h2>Return Policy</h2>
                    <p>At bcd.ng, we guarantee our customers 100% satisfaction on delivery of products. We have a comprehensive system to ensure that our promise to you is always fulfilled. Our merchants and their products are properly verified to ensure that you receive only the best items.<br/><br/>
                    Please see our logistics and insurance policies for more information.<br/><br/>
                    However, we have you covered should you for any reason wish to return any delivered item(s). Our policy on returns is guided by the conditions that the item(s) received is:<br/><br/>
                    • different from what is seen on bcd.ng<br/><br/>
                    • damaged in any way in the course of delivery<br/><br/>
                    If you have any of the above and would like to make a return, kindly visit the <a href="contact-us.html">Contact Page</a> and provide the relevant information within 24 hours after delivery.
                    </p>
                    </div>
                </div>
                
                <div id="report" className="row mb-5 pt-5">
                    <div className="col">
                    <h2>Report a product</h2>
                    <p>At BCD.NG, we believe Nigerians should be able to shop and sell online with unhindered peace of mind. Your convenience is our topmost priority. In order to achieve that, we do not allow the sale of inauthentic/counterfeit items, and sellers found to violate this may be banned from our platform.<br/><br/>
                    We do not encourage the sale of inauthentic merchandise, including any product that may have been manufactured, reproduced, or replicated without authorization.<br/><br/>
                    Our dedicated team proactively review product listings, taking down substandard and infringing products.<br/><br/>
                    If you would like to report a product, kindly visit the <a href="contact-us.html">Contact Page</a> and provide the relevant information.
                    </p>

                    </div>
                </div>
                <div className="row">
                    <div className="col">
                    <div className="info-block">
                        <h2>Need more information</h2>
                        <p>Send us an <a href="mailto:info@bcd.ng">Email</a>, give us a <a href="+2347037138919">Call</a> or make use of the live chat service on the bottom right corner of your screen and one of our customer representative will be happy to assist you.</p>
                    </div>
                    </div>
                </div>
                </div>
            </section>
        </>
}
export { ReturnPolicy } 
