/* eslint-disable prettier/prettier */
import {
  ALL_CATEGORIES_FAIL,
  ALL_CATEGORIES_REQUEST,
  ALL_CATEGORIES_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CREATE_CATEGORY_FAIL,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_RESET,
  CREATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_RESET,
  DELETE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  UPDATE_CATEGORY_RESET,
  UPDATE_CATEGORY_SUCCESS,
} from 'src/constants/categoryConstants'
import { CLEAR_ERRORS } from 'src/constants/userConstants'

export const categoryReducer = (state = {}, action) => {
  switch (action.type) {
    case ALL_CATEGORIES_REQUEST:
      return {
        loading: true,
        categories: [],
      }
    case ALL_CATEGORIES_SUCCESS:
      return {
        loading: false,
        count: action.payload.count,
        categories: action.payload.categories,
      }
    case ALL_CATEGORIES_FAIL:
      return {
        loading: false,
        error: action.payload,
      }

    case CATEGORY_DETAILS_REQUEST:
      return {
        ...state,
        loading: true,
        category: null,
      }

    case CATEGORY_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        category: action.payload,
      }
    case CATEGORY_DETAILS_FAIL:
      return {
        ...state,
        loading: false,
        category: null,
        error: action.payload,
      }

    case CREATE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case DELETE_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
      }

    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isDeleted: action.payload,
      }

    case UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isUpdated: action.payload.success,
        message: action.payload.message,
      }

    case CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        isCreated: action.payload.success,
        message: action.payload.message,
      }

    case CREATE_CATEGORY_RESET:
      return {
        ...state,
        message: null,
        isCreated: false,
      }

    case UPDATE_CATEGORY_RESET:
      return {
        ...state,
        message: null,
        isUpdated: false,
      }

    case DELETE_CATEGORY_RESET:
      return {
        ...state,
        isDeleted: false,
      }

    case CREATE_CATEGORY_FAIL:
    case UPDATE_CATEGORY_FAIL:
    case DELETE_CATEGORY_FAIL:
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
