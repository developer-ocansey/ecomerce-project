import './Loading.scss'

import Loader from 'react-loader-spinner';
import React from 'react';

const Loading = () => {
  return <div className='loading-page'>
          <Loader
              type="RevolvingDot"
              color="#0070E0"
              height={100}
              width={100}
              timeout={0} //3 secs

            />
        </div>;
};

export { Loading };