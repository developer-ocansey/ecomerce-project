import React from 'react';

const Logistics = () => {
    return <>
    <section id='site-info-wrap'>
    <div className='container'>
      <div id='delivery' className='row pt-5'>
        <div className='col'>
          <h2>Logistics/Delivery Timelines</h2>
          <p>BCD assures its customers of quality deliveries nationwide, with strong partnerships in the areas of logistics services.
          We are 100% confident that our logistics partners possess the instruments and expertise to deliver your order(s) on time and without any problems arising.</p>

          <p>Deliveries within Lagos State are completed between <span>1-3 business days</span>.</p>

          <p>Deliveries to other States across Nigeria are completed between <span>3-5 business days.</span></p>

          <h4>Our Logistics Partners</h4>

        </div>
      </div>
      <div className='row mb-5'>
        <div className='col-lg-2 flex-center'>
          <div className='service-wrap-logis'>
            <img src='/img/partners/speedaf-col.jpg' alt='...'/>
          </div>
        </div>
        <div className='col-lg-2 flex-center'>
          <div className='service-wrap-logis'>
            <img src='/img/partners/courierplus-col.png' alt='...'/>
          </div>
        </div>
        <div className='col-lg-2 flex-center'>
          <div className='service-wrap-logis'>
            <img src='/img/partners/tranex.svg' alt='...'/>
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='col'>
          <div className='info-block'>
            <h2>Need more information</h2>
            <p>Send us an <a href='mailto:info@bcd.ng'>Email</a>, give us a <a href='+2347037138919'>Call</a> or make use of the live chat service on the bottom right corner of your screen and one of our customer representative will be happy to assist you.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  </>
}
export { Logistics } 
