import Loader from 'react-loader-spinner';
import React from 'react';

const BtnLoader = () => {
  return <Loader
            type="ThreeDots"
            color="#fff"
            height={10}
            width={70}
            timeout={0}
        />;
};

export default BtnLoader;