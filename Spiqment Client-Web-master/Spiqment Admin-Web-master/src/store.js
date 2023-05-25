/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
  allUsersReducer,
  authReducer,
  userDetailsReducer,
  userReducer,
} from './reducers/userReducers'
import {
  bannerReducer,
  newProductReducer,
  newSlideReducer,
  productDetailsReducer,
  productReducer,
  productsReducer,
  reviewReducer,
  slideReducer,
} from './reducers/productReducer'
import { sidebarReducer } from './reducers/sidebarReducer'
import { orderDetailsReducer, getAllMyOrdersReducer, orderReducer, ordersReducer } from './reducers/orderReducers'
import { categoryReducer } from './reducers/categoryReducer'

const reducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  productDetails: productDetailsReducer,
  review: reviewReducer,
  getallOrders: getAllMyOrdersReducer,
  orders: ordersReducer,
  order: orderReducer,
  orderDetails: orderDetailsReducer,
  users: allUsersReducer,
  user: userReducer,
  userDetails: userDetailsReducer,
  sidebar: sidebarReducer,
  banner: bannerReducer,
  newSlide: newSlideReducer,
  slide: slideReducer,
  categories: categoryReducer,
})

const middleware = [thunk]

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middleware)))
export default store
