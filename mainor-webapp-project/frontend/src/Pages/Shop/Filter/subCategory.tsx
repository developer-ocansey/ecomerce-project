import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import Request from '../../../api/requests';
import { setPageTitle } from '../../../utils';

type SubCategoryDropDownProps = {
    id?: string,
    name?: string,
    alias?: string,
    categoryId?: number,
    count?:number
  }
  
  const SubCategory = (props:SubCategoryDropDownProps): JSX.Element => { // Refactor other props implementation
      const [subCategory, setSubCategory] = useState<SubCategoryDropDownProps[]>([])
    const [category, setCategory] = useState('')
    const [cateId, setCateId] = useState(0)

      useEffect(() => {
      Request(
        'GET',
        '/sub-categories/'+props.categoryId,
          null).then((response: any) => {
              if (response.status === 200) {
                  const cate = response.data.category
                setCategory(cate.name)
                setCateId(cate.id)
                setPageTitle(cate.name)
                setSubCategory(response.data.subCategory.rows) // NOTE: clean this up from API level we shouldn't have duplicate namespace
        }
      }).catch((e => {
        console.error(e)
      }))
    }, [props.categoryId])
      
    if (subCategory.length > 1) {
        return (<div>
                    <h3>{category}</h3>
                    <ul>
                        {subCategory.slice(0, props.count).map((res, index) => { // TODO refactor namespace
                            return <li key={index}>
                                <Link to={`/sub-category/${cateId}/${res.id}`}>
                                    {res.name}
                                </Link>
                            </li>
                        })}
                    </ul>
                </div>)
    }
      
    return <div/>
    }
  
    SubCategory.defaultProps = {
    id: 0,
    name: '',
    alias: '',
    categoryId: 0,
    count:0
  }

  export default SubCategory