import React, { useState } from 'react';

const SearchWidget = (props: any) => {
    const [searchParam, setSearchParam] = useState('')
    const search = (e: any) => {
        e.preventDefault()
        if (searchParam.length > 2) {
            window.location.href = '/search/'+ searchParam
        }
    }
  return (
    <div className='search-form-wrapper'>
        <div className='container'>
            <form className='search-form' onSubmit={(e)=>search(e) }>
                <div className='input-group'>
                      <input
                          type='text'
                          name='search'
                          className='search form-control'
                          onChange={(e) =>  setSearchParam(e.target.value)}
                          placeholder='Enter product name and press enter key to search'
                      />
                    <div className='input-group-append'>
                    <span className='input-group-text' id='basic-addon2'>
                        <img src='/img/icons/search.svg' alt='search'/>
                    </span>
                        <span
                            className='input-group-text search-close'
                            onClick={
                            ()=>props.show()
                        }>
                        <img src='/img/icons/close.svg' alt='close'/>
                    </span>
                    </div>
                </div>
            </form>
        </div>
    </div>)
}
export default SearchWidget

// send search and param to shop page