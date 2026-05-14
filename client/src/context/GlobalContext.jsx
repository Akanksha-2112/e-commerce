import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

import { API_BASE } from '../config';

const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState({});
    const [wishlist, setWishlist] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Convert the backend cart payload into our local product-keyed map.
    // We MUST keep the cart subdocument `_id` (as `cartItemId`) because the
    // backend DELETE /api/cart/:itemId endpoint expects it — not the product id.
    const mapCart = (cartData) => {
        const cartMap = {};
        (cartData?.items || []).forEach(item => {
            if (item.product && item.product._id) {
                cartMap[item.product._id] = {
                    id: item.product._id,
                    cartItemId: item._id,
                    name: item.product.name,
                    price: item.price,
                    image: item.product.images?.[0]?.url || '',
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color
                };
            }
        });
        return cartMap;
    };

    // Initial Fetch when User logs in
    useEffect(() => {
        const fetchRemoteData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };

                // Fetch Cart
                const { data: cartData } = await axios.get(`${API_BASE}/api/cart`, config);
                setCart(mapCart(cartData));

                // Fetch Wishlist
                const { data: wishlistData } = await axios.get(`${API_BASE}/api/auth/wishlist`, config);
                const wishlistMap = {};
                wishlistData.forEach(product => {
                    wishlistMap[product._id] = {
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.images?.[0]?.url || ''
                    };
                });
                setWishlist(wishlistMap);

            } catch (error) {
                console.error("Error fetching remote data:", error);
            }
        };

        if (user && user.token) {
            fetchRemoteData();
        } else {
            // Check local storage for guest (optional, sticking to session for now or just clearing)
            // For now, let's keep guest cart empty or basic
        }
    }, [user]);

    const toggleSidebar = (isOpen) => {
        setIsSidebarOpen(isOpen);
    };

    const toggleCart = (isOpen) => {
        setIsCartOpen(isOpen);
    };

    const addToCart = async (product, quantity = 1) => {
        const qty = Math.max(1, parseInt(quantity, 10) || 1);

        // Optimistic Update
        setCart((prev) => {
            const newCart = { ...prev };
            if (newCart[product.id]) {
                newCart[product.id].quantity += qty;
            } else {
                newCart[product.id] = { ...product, quantity: qty };
            }
            return newCart;
        });

        if (user && user.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                // The backend returns the full populated cart — use it so we
                // capture the cartItemId needed for future remove/update calls.
                const { data: cartData } = await axios.post(`${API_BASE}/api/cart`, {
                    productId: product.id,
                    quantity: qty,
                    size: product.size || 'M', // Default size if not specified
                    color: product.color || 'Black'
                }, config);
                setCart(mapCart(cartData));
            } catch (error) {
                console.error("Sync to cart failed", error);
                // Revert the optimistic add so UI doesn't drift from the server
                setCart((prev) => {
                    const reverted = { ...prev };
                    if (reverted[product.id]) {
                        if (reverted[product.id].quantity > qty) {
                            reverted[product.id].quantity -= qty;
                        } else {
                            delete reverted[product.id];
                        }
                    }
                    return reverted;
                });
            }
        }
    };

    const removeFromCart = async (productId) => {
        // Capture cartItemId BEFORE we mutate local state
        const cartItemId = cart[productId]?.cartItemId;

        // Optimistic Update
        setCart((prev) => {
            const newCart = { ...prev };
            delete newCart[productId];
            return newCart;
        });

        // Guest user — nothing to sync
        if (!user || !user.token) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            if (cartItemId) {
                // Preferred path: we know the cart subdocument _id
                const { data: cartData } = await axios.delete(
                    `${API_BASE}/api/cart/${cartItemId}`,
                    config
                );
                setCart(mapCart(cartData));
            } else {
                // Fallback: cartItemId unknown locally (e.g. stale state). Resolve
                // by fetching the live cart and deleting the matching subdocument.
                const { data: latest } = await axios.get(`${API_BASE}/api/cart`, config);
                const match = (latest?.items || []).find(
                    (i) => i.product?._id === productId || i.product === productId
                );
                if (match) {
                    const { data: cartData } = await axios.delete(
                        `${API_BASE}/api/cart/${match._id}`,
                        config
                    );
                    setCart(mapCart(cartData));
                } else {
                    // Already gone server-side — just keep local state in sync
                    setCart(mapCart(latest));
                }
            }
        } catch (error) {
            console.error("Remove sync failed", error);
            // Best-effort recovery: re-pull the authoritative cart
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data: latest } = await axios.get(`${API_BASE}/api/cart`, config);
                setCart(mapCart(latest));
            } catch (_) {
                // Swallow — surface only the original failure in console
            }
        }
    };

    const addToWishlist = async (product) => {
        setWishlist((prev) => ({ ...prev, [product.id]: product }));

        if (user && user.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.post(`${API_BASE}/api/auth/wishlist`, { productId: product.id }, config);
            } catch (error) {
                console.error("Wishlist sync failed", error);
            }
        }
    };

    const removeFromWishlist = async (productId) => {
        setWishlist((prev) => {
            const newWishlist = { ...prev };
            delete newWishlist[productId];
            return newWishlist;
        });

        if (user && user.token) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_BASE}/api/auth/wishlist/${productId}`, config);
            } catch (error) {
                console.error("Wishlist remove failed", error);
            }
        }
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
                isSidebarOpen,
                toggleSidebar,
                isCartOpen,
                toggleCart,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
