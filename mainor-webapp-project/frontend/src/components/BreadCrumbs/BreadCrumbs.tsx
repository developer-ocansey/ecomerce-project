import { Link } from 'react-router-dom';
import React from 'react';

type Crumb = {
    name: string,
    link: string
}

const Breadcrumbs = (crumbs: any) => {
    const listCrumbs = () => {
        return crumbs.crumbs.map((data: Crumb, index: number) => {
            return <li key={index} className={`breadcrumb-item ${index === crumbs.length-1 && 'active'}`}><Link to={data.link}>{data.name}</Link></li>
           })
    }
    return (
        <nav aria-label='breadcrumb'>
            <div className='container'>
                <ol className='breadcrumb'>
                    {listCrumbs()}
                </ol>
            </div>
        </nav>
    )
}

export default Breadcrumbs