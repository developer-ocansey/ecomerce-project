import Breadcrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import React from 'react';
import SearchWidget  from '../../components/SearchWidget/SearchWidget'

const TradeFinancing = () => {
    console.log('Hello rom the other side')
  return (
      <>
        <Breadcrumbs crumbs={[{'name': 'home', 'link': '/'},{'name': 'Trade Financing', 'link': '/trade-financing'}]}/>
          <section id='about-wrap'>
            <div className='container'>
            <div className='row mb-5'>
                <div className='col'>
                <h2>Trade Finance (ATI)</h2>
                <p>
                    At BCD.NG we understand that sometimes, getting to funds to buy goods might not be at hand. Being cash strapped can happen at any time, and that is why we have incorporated the services of <a target='_blank' rel="noopener noreferrer" href='https://www.africantradeinvest.com/'>African Trade Invest - ATI</a> for sellers on our platform.<br/><br/>
                Verified merchants on the BCD.ng platform have access to funds in order for them to get their products. 
                For prompt response and disbursement of cash, merchant has to provide full details of the transaction.
                </p>

                <h4>How it works</h4>
                <p>To get access to funds, the seller will provide contracts well detailed on the analysis and payment terms in respect of funds needed. After the contracts are submitted, ATIDOTCOM will carry out its due diligence on all parties (Buyer. Seller, Supplier).<br/><br/>


                Where there is an agreement, MOU will be given to the seller to sign. Payment will be made by ATIDOTCOM directly to the suppliers account either during loading (if it must) or at delivery. ATIDOTCOM will deduct transacts costs and cost of funds from the profit of the transaction if work is carried out by seller. If it is carried out by BCD.NG, ATIDOTCOM will deduct its cost of funds, transaction costs and profit only.</p>
                </div>
            </div>
            <div className='row mb-5'>
                <div className='col'>
                <div className='info-block'>
                    <h1>Interested in Funding?</h1>
                    <p>Send us an <a href='mailto:info@bcd.ng'>Email</a>, give us a <a href='+2347037138919'>Call</a> or send us a message on from our <a href='contact-us.html'>Contact Form</a> to get started. One of our customer service representative will be happy to assist you.</p>
                    {/* pop up chat widget */}
                </div>
                </div>
            </div>
            </div>
        </section>
      </>
  );
};

export { TradeFinancing };
