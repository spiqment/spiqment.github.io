import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useMediaQuery,
} from "@material-ui/core";
import {
  addItemToCart,
  removeItemFromCart,
  clearCart
} from "../../../actions/cartActions";
import Checkout from "../Checkout/Checkout";
import { AppContext } from "../../../context/AppContext";
import { Link } from "react-router-dom";
import "./styles/Cart2.css";

const Cart2 = ({ history }) => {
  const dispatch = useDispatch();
  const sm = useMediaQuery("(max-width:600px)");
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [openCheckout, setOpenCheckout] = useState(false);
  const { alertState } = useContext(AppContext);
  const [, setAlert] = alertState;

  const addOne = (id, quantity, stock, color, selectedSize) => {
    if (quantity < stock) {
      const newQuantity = quantity + 1;
      dispatch(addItemToCart(id, newQuantity, color, selectedSize));
    }
  };

  const removeOne = (id, quantity, stock, color, selectedSize) => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      dispatch(addItemToCart(id, newQuantity, color, selectedSize));
    }
  };

  const removeItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const signIntoCheckout = () => {  
      history.push("/signin/?redirect=cart");
      setAlert({ type: "info", message: "Sign in to perform this action" });
  };

  const proceedToCheckout = () => {
    if (isAuthenticated) {
        setOpenCheckout(true);
      } 
  }

  return (
    <div className="cart-container">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is currently empty</p>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>Start Shopping</span>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Quantity</h3>
            <h3 className="color">Color</h3>
            <h3 className="Size">Size</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items">
            {cartItems &&
              cartItems.map((cartItem) => (
                <div className="cart-item" key={cartItem._id}>
                  <div className="cart-product">
                    <img src={cartItem.image} alt={cartItem.name} />
                    <div>
                      <h3>{cartItem.name}</h3>
                      <p>{cartItem.desc}</p>
                      <button onClick={() => removeItem(cartItem.productID)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="cart-product-price">${cartItem.price}</div>
                  <div className="cart-product-quantity" style={{"marginLeft":"-20px"}}>
                    <button onClick={() =>
                                      removeOne(
                                        cartItem.productID,
                                        cartItem.quantity,
                                        cartItem.stock,
                                        cartItem.color,
                                        cartItem.selectedSize,
                                      )
                                    }>
                      -
                    </button>
                    <div className="count">{cartItem.quantity}</div>
                    <button onClick={() =>
                                      addOne(
                                        cartItem.productID,
                                        cartItem.quantity,
                                        cartItem.stock,
                                        cartItem.color,
                                        cartItem.selectedSize,
                                      )
                                    }>+</button>
                  </div>
                  {cartItem.color != "" ? (<div className="cart-product-color">{cartItem.color}</div>):(<div className="cart-product-color">null</div>)}
                  {cartItem.selectedSize != "" ? (<div className="cart-product-color">{cartItem.selectedSize}</div>):(<div className="cart-product-color">null</div>)}
                  <div className="cart-product-total-price">
                    ${cartItem.price * cartItem.quantity.toFixed(2)}
                  </div>
                </div>
              ))}
          </div>
          <div className="cart-summary">
            <button className="clear-btn" onClick={() => handleClearCart()}>
              Clear Cart
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="amount">
                    $
                    {cartItems
                        .reduce(
                                (acc, item) => acc + item.quantity * item.price,
                                0
                              )
                              .toFixed(2)}</span>
              </div>
              <p>Taxes and shipping calculated at checkout</p>
              {isAuthenticated? (
              <button  onClick={proceedToCheckout}>Proceed to Checkout</button>
              ):(
              <button  onClick={signIntoCheckout}>Login to Check out</button>
              )}

              <Checkout openState={[openCheckout, setOpenCheckout]} />

              <div className="continue-shopping">
                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart2;