/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './productSize.css';

const ProductSize = ({ handleSelectedSizes }) => {
  const [selectedSizes, setSelectedSizes] = useState([]);

  const handleSizeToggle = (size) => {
    setSelectedSizes((prevSizes) => {
      let updatedSizes;
      if (prevSizes.includes(size)) {
        updatedSizes = prevSizes.filter((selectedSize) => selectedSize !== size);
      } else {
        updatedSizes = [...prevSizes, size];
      }
      // Custom sort function to order the sizes
      updatedSizes.sort((a, b) => availableSizes.indexOf(a) - availableSizes.indexOf(b));
      return updatedSizes.length > 0 ? updatedSizes : [];
    });
  };
  

  useEffect(() => {
    handleSelectedSizes(selectedSizes);
  }, [selectedSizes, handleSelectedSizes]);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="size-selector-admin">
      <div className="size-checkboxes">
        {availableSizes.map((size) => (
          <label key={size} className={`size-checkbox ${selectedSizes.includes(size) ? 'selected' : ''}`}>
            {size}
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={() => handleSizeToggle(size)}
            />
            <span className="checkmark"></span>
          </label>
        ))}
      </div>
    </div>
  );
};

ProductSize.propTypes = {
  handleSelectedSizes: PropTypes.func.isRequired,
};

export default ProductSize;
