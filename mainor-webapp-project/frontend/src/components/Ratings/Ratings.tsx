import React from 'react';

const Ratings = (rate: any) => {
    return (
        <div className='product-rating'>
            <div>
                {[...Array(5)].map((v, i) => {
                    return <span key={i} className={`fa fa-star ${i < rate.rate&& 'checked'}`}></span>
                })}
            </div>
        {/* <p>(Product rated 3 over 5)</p> */}
      </div>)
}
export default Ratings