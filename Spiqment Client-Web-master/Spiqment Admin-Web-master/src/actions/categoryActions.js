/* eslint-disable prettier/prettier */
import axios from 'axios'
import {
  ALL_CATEGORIES_FAIL,
  ALL_CATEGORIES_REQUEST,
  ALL_CATEGORIES_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CREATE_CATEGORY_FAIL,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
} from 'src/constants/categoryConstants'

const API_URL = '/api/categories'

export const getCategories = (keyword, page, limit, orderBy, direction) => async (dispatch) => {
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

    dispatch({ type: ALL_CATEGORIES_REQUEST })
    const { data } = await axios.get(queryString)

    if (!data.success) {
      dispatch({
        type: ALL_CATEGORIES_FAIL,
        error: data.message,
      })
    } else {
      dispatch({
        type: ALL_CATEGORIES_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: ALL_CATEGORIES_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_CATEGORIES_REQUEST })
    const { data } = await axios.get(`${API_URL}/all-categories`)

    if (!data.success) {
      dispatch({
        type: ALL_CATEGORIES_FAIL,
        error: data.message,
      })
    } else {
      dispatch({
        type: ALL_CATEGORIES_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: ALL_CATEGORIES_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getCategory = (categoryID) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DETAILS_REQUEST })
    const { data } = await axios.get(`${API_URL}/${categoryID}`)

    if (!data.success) {
      dispatch({
        type: CATEGORY_DETAILS_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: CATEGORY_DETAILS_SUCCESS,
        payload: data.category,
      })
    }
  } catch (error) {
    dispatch({
      type: CATEGORY_DETAILS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const updateCategory = (categoryID, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.post(`${API_URL}/${categoryID}`, categoryData, config)

    if (!data.success) {
      dispatch({
        type: UPDATE_CATEGORY_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: UPDATE_CATEGORY_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const createCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CATEGORY_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.post(`${API_URL}`, categoryData, config)

    if (!data.success) {
      dispatch({
        type: CREATE_CATEGORY_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: CREATE_CATEGORY_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: CREATE_CATEGORY_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteCategory = (categoryID) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CATEGORY_REQUEST })
    const { data } = await axios.delete(`${API_URL}/${categoryID}`)

    dispatch({
      type: DELETE_CATEGORY_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAIL,
      payload: error.response.data.message,
    })
  }
}
