import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Request from '../../../api/requests';

type CategoryDropDownProps = {
    id?: string,
    name?: string,
    alias?: string,
  }
  
  const CategoryDropDown = (props:any): JSX.Element => {
    const [category, setCategory] = useState<CategoryDropDownProps[]>([])
  
    useEffect(() => {
      Request(
        'GET',
        '/categories',
        null).then((response: any) => {
          if (response.status === 200) {
          setCategory(response.data) // NOTE: clean this up from API level we shouldn't have duplicate namespace
        }
      }).catch((e => {
        console.error(e)
      }))
    }, [])
    if (category.length > 1) {
      return (<>
        {category.slice(0, props.props.count).map((res, index) => { // TODO refactor namespace
          return <Link key={index} className='dropdown-item'  to={`/category/${res.id}`}>{res.name}</Link>
        })}
      </>) 
    }
    return <div/>
    }
  
  CategoryDropDown.defaultProps = {
    id: 0,
    name: '',
    alias: '',
  }

  export default CategoryDropDown