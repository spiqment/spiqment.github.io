/* eslint-disable prettier/prettier */
import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_RESET,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_RESET,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_RESET,
  UPDATE_PRODUCT_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_RESET,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  GET_FEATURED_REQUEST,
  GET_FEATURED_SUCCESS,
  GET_FEATURED_FAIL,
  ADD_FEATURED_REQUEST,
  ADD_FEATURED_SUCCESS,
  ADD_FEATURED_FAIL,
  ADD_FEATURED_RESET,
  DELETE_FEATURED_REQUEST,
  DELETE_FEATURED_SUCCESS,
  DELETE_FEATURED_FAIL,
  DELETE_FEATURED_RESET,
} from '../constants/productConstants'

export const productsReducer = (
  state = {
    products: [],
  },
  action,
) => {
  switch (action.type) {
    case ALL_PRODUCTS_REQUEST:
      return {
        loading: true,
        products: [],
        count: 0,
      }
    case ALL_PRODUCTS_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        count: action.payload.count,
      }
    case ALL_PRODUCTS_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload,
      }

    case PRODUCT_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export const newProductReducer = (
  state = {
    product: {},
  },
  action,
) => {
  switch (action.type) {
    case NEW_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case NEW_PRODUCT_SUCCESS:
      return {
        loading: false,
        success: action.payload.success,
        message: action.payload.message,
      }
    case NEW_PRODUCT_FAIL:
      return {
        loading: false,
        error: action.payload,
      }
    case NEW_PRODUCT_RESET:
      return {
        ...state,
        success: false,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const productReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_PRODUCT_REQUEST:
    case UPDATE_PRODUCT_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      }

    case UPDATE_PRODUCT_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
      }
    case DELETE_PRODUCT_FAIL:
    case UPDATE_PRODUCT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case DELETE_PRODUCT_RESET:
      return {
        ...state,
        isDeleted: false,
      }

    case UPDATE_PRODUCT_RESET:
      return {
        ...state,
        isUpdated: false,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const reviewReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_REVIEW_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case DELETE_REVIEW_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      }
    case DELETE_REVIEW_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case DELETE_REVIEW_RESET:
      return {
        ...state,
        isDeleted: false,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export const bannerReducer = (state = { featured: [] }, action) => {
  switch (action.type) {
    case GET_FEATURED_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case GET_FEATURED_SUCCESS:
      return {
        ...state,
        loading: false,
        count: action.payload.count,
        slides: action.payload.slides,
      }

    case GET_FEATURED_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export const newSlideReducer = (state = { slide: null }, action) => {
  switch (action.type) {
    case ADD_FEATURED_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case ADD_FEATURED_SUCCESS:
      return {
        loading: false,
        isCreated: action.payload.success,
        message: action.payload.message,
      }

    case ADD_FEATURED_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }

    case ADD_FEATURED_RESET:
      return {
        ...state,
        success: false,
      }

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

export const slideReducer = (state = {}, action) => {
  switch (action.type) {
    case DELETE_FEATURED_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case DELETE_FEATURED_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      }
    case DELETE_FEATURED_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case DELETE_FEATURED_RESET:
      return {
        ...state,
        isDeleted: false,
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}
