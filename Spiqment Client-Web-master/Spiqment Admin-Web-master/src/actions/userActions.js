/* eslint-disable prettier/prettier */
import axios from 'axios'
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_USER_REQUEST,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  UPDATE_PASSWORD_REQUEST,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAIL,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  NEW_PASSWORD_REQUEST,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL,
  ALL_USERS_REQUEST,
  ALL_USERS_SUCCESS,
  ALL_USERS_FAIL,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
  CLEAR_ERRORS,
  CREATE_USER_REQUEST,
  CREATE_USER_FAIL,
  CREATE_USER_SUCCESS,
} from '../constants/userConstants'

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const { data } = await axios.post('/api/users/login', { email, password }, config)
    if (data.user.role === 'admin') {
      localStorage.setItem('refresh-token', data.refreshToken)

      dispatch({
        type: LOGIN_SUCCESS,
        payload: data.user,
      })
    } else {
      dispatch({
        type: LOGIN_FAIL,
        payload: 'Insufficient Privilege',
      })
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: REGISTER_USER_REQUEST })

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }

    const { data } = await axios.post('/api/v1/register', userData, config)

    dispatch({
      type: REGISTER_USER_SUCCESS,
      payload: data.user,
    })
  } catch (error) {
    dispatch({
      type: REGISTER_USER_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PROFILE_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    const { data } = await axios.put('/api/v1/me/update', userData, config)
    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: UPDATE_PROFILE_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_PASSWORD_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.put('/api/v1/password/update', passwords, config)
    dispatch({
      type: UPDATE_PASSWORD_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: UPDATE_PASSWORD_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: FORGOT_PASSWORD_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.post('/api/v1/password/reset', email, config)
    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: data.message,
    })
  } catch (error) {
    dispatch({
      type: FORGOT_PASSWORD_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: NEW_PASSWORD_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.put(`/api/v1/password/reset/${token}`, passwords, config)
    dispatch({
      type: NEW_PASSWORD_SUCCESS,
      payload: data.success,
    })
  } catch (error) {
    dispatch({
      type: NEW_PASSWORD_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: LOAD_USER_REQUEST })
    const { data } = await axios.get('/api/users/me')
    dispatch({
      type: LOAD_USER_SUCCESS,
      payload: data.user,
    })
  } catch (error) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const refreshToken = localStorage.getItem('refresh-token')

      if (refreshToken) {
        const { data } = await axios.post('/api/users/refresh-token', { refreshToken }, config)

        localStorage.setItem('refresh-token', data.refreshToken)
        dispatch({
          type: LOAD_USER_SUCCESS,
          payload: data.user,
        })
      } else {
        dispatch({
          type: LOAD_USER_FAIL,
          payload: error.response.data.message,
        })
      }
    } catch (err) {
      dispatch({
        type: LOAD_USER_FAIL,
        payload: error.response.data.message,
      })
    }
  }
}

export const logout = () => async (dispatch) => {
  try {
    await axios.delete('/api/users/logout')

    localStorage.removeItem('refresh-token')

    dispatch({
      type: LOGOUT_SUCCESS,
    })
  } catch (error) {
    dispatch({
      type: LOGOUT_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getUsers = (keyword, page, limit, orderBy, direction) => async (dispatch) => {
  try {
    let queryString = `/api/users?`

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

    dispatch({ type: ALL_USERS_REQUEST })
    console.log(queryString)
    const { data } = await axios.get(queryString)
    dispatch({
      type: ALL_USERS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: ALL_USERS_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const getUser = (userID) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER_REQUEST })
    const { data } = await axios.get(`/api/users/${userID}`)

    if (!data.success) {
      dispatch({
        type: GET_USER_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: GET_USER_SUCCESS,
        payload: data.user,
      })
    }
  } catch (error) {
    dispatch({
      type: GET_USER_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const updateUser = (userID, userData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.patch(`/api/users/${userID}`, userData, config)

    if (!data.success) {
      dispatch({
        type: UPDATE_USER_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: UPDATE_USER_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const createUser = (userData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_USER_REQUEST })
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
    const { data } = await axios.post(`/api/users`, userData, config)

    if (!data.success) {
      dispatch({
        type: CREATE_USER_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: CREATE_USER_SUCCESS,
        payload: data,
      })
    }
  } catch (error) {
    dispatch({
      type: CREATE_USER_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const deleteUser = (userID) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_USER_REQUEST })
    const { data } = await axios.delete(`/api/users/${userID}`)

    if (!data.success) {
      dispatch({
        type: DELETE_USER_FAIL,
        payload: data.message,
      })
    } else {
      dispatch({
        type: DELETE_USER_SUCCESS,
        payload: data.success,
      })
    }
  } catch (error) {
    dispatch({
      type: DELETE_USER_FAIL,
      payload: error.response.data.message,
    })
  }
}

export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  })
}
