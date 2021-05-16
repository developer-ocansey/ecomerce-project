import React from 'react';

const BannerArea = (props: any) => {
    return (
        <section id='cpage-banner'>
            <div className='container'>
                <div className='row align-items-center banner-height'>
                    <div className='col'>
                        <p>{props.props.title}</p>
                        <h2>{props.props.header}</h2>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { BannerArea };