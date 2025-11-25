import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const [cart, setCart] = useState({});
    const [wishlist, setWishlist] = useState({});

    const addToCart = (product) => {
        setCart((prev) => {
            const newCart = { ...prev };
            if (newCart[product.id]) {
                newCart[product.id].quantity += 1;
            } else {
                newCart[product.id] = { ...product, quantity: 1 };
            }
            return newCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => {
            const newCart = { ...prev };
            delete newCart[productId];
            return newCart;
        });
    };

    const addToWishlist = (product) => {
        setWishlist((prev) => ({ ...prev, [product.id]: product }));
    };

    const removeFromWishlist = (productId) => {
        setWishlist((prev) => {
            const newWishlist = { ...prev };
            delete newWishlist[productId];
            return newWishlist;
        });
    };

    const toggleWishlist = (product) => {
        if (wishlist[product.id]) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    const getCartCount = () => {
        return Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
    };

    const getWishlistCount = () => {
        return Object.keys(wishlist).length;
    };

    return (
        <GlobalContext.Provider
            value={{
                cart,
                wishlist,
                addToCart,
                removeFromCart,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                getCartCount,
                getWishlistCount,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
