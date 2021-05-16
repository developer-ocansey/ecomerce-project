import './style.scss'

import React, { FunctionComponent } from 'react';

const NotFound: FunctionComponent<any> = () => {
  return <div id="main">
          <div className="notFound">
            <h1>404</h1>
            <p>Page Not found</p>
          </div>
        </div>
}

NotFound.defaultProps = {
}
 
export default NotFound