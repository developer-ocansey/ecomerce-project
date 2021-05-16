export const logout = () => {
    if (window.confirm("Are you sure you want to logout")) {
        localStorage.clear()
        window.location.href = '/'  
    }
}

export const getUser = () => {
    return localStorage.getItem('bcdNgAuth') || ''
}


export const unAuthenticated = () => {
    return getUser() === ''
}

export const isActive = (path: string) => {
    return window.location.pathname === path ? 'active' : ''
}

export const setPageTitle = (title: string) => {
    document.title = 'bcd.ng | '+title
}


export const formatCurrency = (val: number) => {
    if (val === 0) {
      return val;
    }
    return '₦ ' + val.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
  
export const UUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3||0x8);
        return v.toString(16);
    });
}

export const getToken = () => {
    return `Bearer ${JSON.parse(getUser()).token}`
}

export const _truncate = (input: string, idx: number) => {
    if (input.length > idx) {
      return input.substring(0, idx) + '...';
    }
   return input;
}

export const getRecentProducts = () => {
    return localStorage.getItem('bcdNgProducts') || ''
}

export const setRecentProducts = (data: any) => {
    if (!getRecentProducts()) {
        let d = [data]
        localStorage.setItem('bcdNgProducts', JSON.stringify(d));
    }else{
        let d = JSON.parse(getRecentProducts())
        const found = d.some((el: any) => el.id === data.id);
        if (!found) {
            d.push(data)
            localStorage.setItem('bcdNgProducts', JSON.stringify(d)); 
        }
    }
}

export const replaceJSX = (str: string, find: string, replace: JSX.Element) => {
    let parts = str.split(find);
    for (let i = 0, result = []; i < parts.length; i++) {
        result.push(parts[i]);
        if (i === 0) {
            result.push(replace);
        }
        if (i === parts.length -1) {
            return result
        } 
    }
}