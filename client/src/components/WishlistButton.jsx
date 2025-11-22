import React, { useState } from 'react';
const WishlistButton = ({ productId }) => {
  const [wish, setWish] = useState(false);
  return (
    <button
      className={`wishlist-btn${wish ? " wished" : ""}`}
      onClick={() => setWish(!wish)}
      title="Add to wishlist"
    >{wish ? "♥" : "♡"}</button>
  );
};
export default WishlistButton;
