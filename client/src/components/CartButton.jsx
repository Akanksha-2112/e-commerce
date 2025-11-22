import React, { useState } from 'react';
const CartButton = ({ productId }) => {
  const [carted, setCarted] = useState(false);
  return (
    <button
      className={`cart-btn${carted ? " carted" : ""}`}
      onClick={() => setCarted(!carted)}
      title="Add to cart"
    >🛒</button>
  );
};
export default CartButton;
