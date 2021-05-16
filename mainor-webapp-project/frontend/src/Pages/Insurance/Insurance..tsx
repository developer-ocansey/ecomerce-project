import React from 'react';

const Insurance = () => { 
    return <>
    <section id='site-info-wrap'>
    <div className='container'>
      <div className='row'>
        <div className='col'>
          <h2>Insurance cover</h2>
          <p>In order to ensure your order(s) receive maximum protection for your utmost satisfaction, BCD is working with reputable insurance companies to provide Goods in Transit insurance policy on all items of our customers’ orders.</p>

          <p>Goods in Transit policy covers losses following an accident, collision or over-turning of the conveying vehicle while the goods are being loaded or unloaded, as well as, while the goods are in transit or whilst temporarily housed within the general course of transit.</p>

          <p>This cover operates anywhere in Nigeria.</p>
          <p>For more information on our insurance partners’ respective policies, kindly click on any of the following links:</p>
        </div>
      </div>
      <div className='row mb-5'>
        <div className='col-lg-3'>
          <div className='service-wrap'>
            <img src='/img/partners/axa_mansard.svg' alt='...'/>
            <p><a target='_blank' rel="noopener noreferrer" href='https://bcd-ng.s3-eu-west-1.amazonaws.com/AXA_GIT_DUMMY_POLICY%5B1%5D.pdf'>Axa Mansard PDF</a></p>
          </div>
        </div>
        <div className='col-lg-3'>
          <div className='service-wrap'>
            <img src='/img/partners/custodian.png' alt='...'/>
           <p><a href='/insurance'>Custodian Insurance PDF</a></p>
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

export {Insurance}