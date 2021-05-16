import ContentLoader from "react-content-loader"
import React from 'react';

const CartLoading = (props: any) => {
  return (
    <ContentLoader viewBox="0 0 100% 31" height={'100%'} width={'97%'} {...props}>
      <rect height="50.5" rx="1" ry="1" width="100%" x="31" y="5" />
    </ContentLoader>
  )
};

export default CartLoading;