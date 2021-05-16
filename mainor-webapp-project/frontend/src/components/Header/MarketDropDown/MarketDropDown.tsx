import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';
import Request from '../../../api/requests';

type MarketDropDownProps = {
    id?: number,
    name?: string,
    slug?: string,
  }
  
  const MarketDropDown = (props:any): JSX.Element => {
  const [market, setMarket] = useState<MarketDropDownProps[]>([])
  
  useEffect(() => {
    Request(
      'GET',
      '/markets',
      null).then((response: any) => {
        if (response.status === 200) {
        setMarket(response.data.data) // NOTE: clean this up from API level we shouldn't have duplicate namespace
      }
    }).catch((e => {
      console.error(e)
    }))
  }, [])
  
  return (<>
          {market.slice(0, props.props.count).map((res, index) => { 
            return <Link key={index} className='dropdown-item' to={`/market/${res.name}`}>{res.name}</Link>
          })}
        </>)
  }
  
  MarketDropDown.defaultProps = {
    id: 0,
    name: '',
    slug:'',
  }
 
  export default MarketDropDown