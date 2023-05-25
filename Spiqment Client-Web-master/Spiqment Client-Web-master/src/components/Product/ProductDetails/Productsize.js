import React, { useState } from 'react';
import './styles/Productsize.css';

const ProductSize = ({ sizes, onSelectSize }) => {
  const [selectedSize, setSelectedSize] = useState('');

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    onSelectSize(size); // Call the callback function with the selected size
  };

  return (
    <div className="size-selector">
      <h2>Select Size:</h2>
      <div className="size-buttons">
        {sizes.map((size) => (
          <button
            key={size}
            className={`size-button ${selectedSize === size ? 'selected' : ''}`}
            onClick={() => handleSizeSelect(size)}
          >
            {size}
          </button>
        ))}
      </div>
      {selectedSize && (
        <p>Selected Size: <strong>{selectedSize}</strong></p>
      )}
    </div>
  );
};

export default ProductSize;
