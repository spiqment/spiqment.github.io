/* eslint-disable prettier/prettier */
import axios from 'axios'

import {
  ALL_PRODUCTS_REQUEST,
  ALL_PRODUCTS_SUCCESS,
  ALL_PRODUCTS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  NEW_PRODUCT_REQUEST,
  NEW_PRODUCT_SUCCESS,
  NEW_PRODUCT_FAIL,
  DELETE_PRODUCT_REQUEST,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
  UPDATE_PRODUCT_REQUEST,
  UPDATE_PRODUCT_SUCCESS,
  UPDATE_PRODUCT_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
  CLEAR_ERRORS,
  GET_FEATURED_REQUEST,
  GET_FEATURED_SUCCESS,
  GET_FEATURED_FAIL,
  ADD_FEATURED_REQUEST,
  ADD_FEATURED_SUCCESS,
  ADD_FEATURED_FAIL,
  DELETE_FEATURED_REQUEST,
  DELETE_FEATURED_SUCCESS,
  DELETE_FEATURED_FAIL,
} from '../constants/productConstants'

const API_URL = '/api/products'

export const getProducts = (keyword, page, limit, orderBy, direction) => async (dispatch) => {
  try {
    let queryString = `${API_URL}?`

    if (!!keyword) {
      queryString += `keyword=${keyword}&`
    }

    if (!!page) {
      queryString += `page=${page}&`
    }

    if (!!limit) {
      queryString += `limit=${limit}&`
    }

    if (!!orderBy) {
      queryString += `orderBy=${orderBy}&`
    }

    if (!!direction) {
      queryString += `direction=${direction}`
    }

    dispatch({ type: ALL_PRODUCTS_REQUEST })
    const { data } = await axios.get(queryString)

    if (!data.success) {
      dispatch({
        type: ALL_PRODUCTS_FAIL,
        error: data.message,
      })
    } else {
      dispatch({
        type: ALL_PRODUCTS_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: ALL_PRODUCTS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getProductDetails = (productID) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    const { data } = await axios.get(`${API_URL}/${productID}`)

    if (!data.success) {
      dispatch({
        type: PRODUCT_DETAILS_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: PRODUCT_DETAILS_SUCCESS,
        payload: data.product,
      })
    }
  } catch (error) {
    console.log(error)
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const newProduct = (productData) => async (dispatch) => {
  try {
    dispatch({
      type: NEW_PRODUCT_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post(API_URL, productData, config)

    if (!data.success) {
      dispatch({
        type: NEW_PRODUCT_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: NEW_PRODUCT_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: NEW_PRODUCT_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const updateProduct = (productID, productData) => async (dispatch) => {
  try {
    dispatch({
      type: UPDATE_PRODUCT_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.put(`${API_URL}/${productID}`, productData, config)

    if (!data.success) {
      dispatch({
        type: UPDATE_PRODUCT_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: UPDATE_PRODUCT_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: UPDATE_PRODUCT_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteProduct = (productID) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_PRODUCT_REQUEST,
    })

    const { data } = await axios.delete(`/api/products/${productID}`)

    if (!data.success) {
      dispatch({
        type: DELETE_PRODUCT_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: DELETE_PRODUCT_SUCCESS,
        payload: data.success,
      })
    }
  } catch (error) {
    dispatch({
      type: DELETE_PRODUCT_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteReview = (productID, reviewID) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_REVIEW_REQUEST,
    })

    const { data } = await axios.delete(
      `${API_URL}/reviews?productId=${productID}&reviewId=${reviewID}`,
    )

    if (!data.success) {
      dispatch({
        type: DELETE_REVIEW_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: DELETE_REVIEW_SUCCESS,
        payload: data.success,
      })
    }
  } catch (error) {
    dispatch({
      type: DELETE_REVIEW_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getFeatured = (keyword, page, limit, orderBy, direction) => async (dispatch) => {
  try {
    dispatch({ type: GET_FEATURED_REQUEST })

    let queryString = `/api/carousel?`

    if (!!keyword) {
      queryString += `keyword=${keyword}&`
    }

    if (!!page) {
      queryString += `page=${page}&`
    }

    if (!!limit) {
      queryString += `limit=${limit}&`
    }

    if (!!orderBy) {
      queryString += `orderBy=${orderBy}&`
    }

    if (!!direction) {
      queryString += `direction=${direction}`
    }

    const { data } = await axios.get(queryString)

    if (!data.success) {
      dispatch({
        type: GET_FEATURED_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: GET_FEATURED_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: GET_FEATURED_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const addFeatured = (slideData) => async (dispatch) => {
  try {
    dispatch({
      type: ADD_FEATURED_REQUEST,
    })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post('/api/carousel', slideData, config)
    if (!data.success) {
      dispatch({
        type: ADD_FEATURED_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: ADD_FEATURED_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: ADD_FEATURED_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteFeatured = (slideID) => async (dispatch) => {
  try {
    dispatch({
      type: DELETE_FEATURED_REQUEST,
    })

    const { data } = await axios.delete(`/api/carousel/${slideID}`)

    dispatch({
      type: DELETE_FEATURED_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: DELETE_FEATURED_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  })
}
