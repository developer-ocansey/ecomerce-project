import React, { createContext, useState } from 'react';

export const CartContext = createContext({});

export const Provider = (props:any) => {
  const [cartCount, setCartCount] = useState(0);

  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
      {props.children}
    </CartContext.Provider>
  )
}

