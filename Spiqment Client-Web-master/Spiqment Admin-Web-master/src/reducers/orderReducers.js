/* eslint-disable prettier/prettier */
import {
    ALL_ORDERS_REQUEST,
    ALL_ORDERS_SUCCESS,
    ALL_ORDERS_FAIL,
    GET_ALL_ORDERS_REQUEST,
    GET_ALL_ORDERS_SUCCESS,
    GET_ALL_ORDERS_FAIL,
    UPDATE_ORDER_REQUEST,
    UPDATE_ORDER_SUCCESS,
    UPDATE_ORDER_RESET,
    UPDATE_ORDER_FAIL,
    DELETE_ORDER_REQUEST,
    DELETE_ORDER_SUCCESS,
    DELETE_ORDER_RESET,
    DELETE_ORDER_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_DETAILS_FAIL,
    CLEAR_ERRORS
} from '../constants/orderConstants';

export const ordersReducer = (
    state = {
        orders: []
    },
    action) => {
        switch(action.type) {
            case ALL_ORDERS_REQUEST:
                return {
                    loading: true
                }

            case ALL_ORDERS_SUCCESS:
                return {
                    loading: false,
                    orders_count: action.payload.count,
                    orders: action.payload.orders,
                    totalAmount: action.payload.totalAmount
                }

            case ALL_ORDERS_FAIL:
                return {
                    loading: false,
                    error: action.payload
                }

            case CLEAR_ERRORS:
                return {
                    ...state,
                    error: null
                }
                
            default:
                return state;
        }
    }

    export const orderDetailsReducer = (
        state = {
            order: {}
        },
        action) => {
            switch(action.type) {
                case ORDER_DETAILS_REQUEST:
                    return {
                        loading: true
                    }
    
                case ORDER_DETAILS_SUCCESS:
                    return {
                        loading: false,
                        order: action.payload
                    }
    
                case ORDER_DETAILS_FAIL:
                    return {
                        loading: false,
                        error: action.payload
                    }
    
                case CLEAR_ERRORS:
                    return {
                        ...state,
                        error: null
                    }
                    
                default:
                    return state;
            }
        }

        export const orderReducer = (
            state = {}, 
            action) => {
                switch(action.type) {
                    case DELETE_ORDER_REQUEST:
                    case UPDATE_ORDER_REQUEST:
                        return {
                            ...state,
                            loading: true
                        }
                    case DELETE_ORDER_SUCCESS:
                        return {
                            ...state,
                            loading: false,
                            isDeleted: action.payload
                        }

                    case UPDATE_ORDER_SUCCESS:
                        return {
                            ...state,
                            loading: false,
                            isUpdated: action.payload
                        }
                    case DELETE_ORDER_FAIL:
                    case UPDATE_ORDER_FAIL:
                        return {
                            ...state,
                            loading: false,
                            error: action.payload
                        }
                    case DELETE_ORDER_RESET:
                        return {
                            ...state,
                            isDeleted: false
                        }

                    case UPDATE_ORDER_RESET:
                        return {
                            ...state,
                            isUpdated: false
                        }
                    case CLEAR_ERRORS:
                        return {
                            ...state,
                            error: null
                        }
                    default:
                        return state;
                }    
            }

            export const getAllMyOrdersReducer = (
                state = {
                    getallOrders: []
                },
                action) => {
                    switch(action.type) {
                        case GET_ALL_ORDERS_REQUEST:
                            return {
                                loading: true
                            }
            
                        case GET_ALL_ORDERS_SUCCESS:
                            return {
                                loading: false,
                                getallOrders: action.payload.orders,
                            }
            
                        case GET_ALL_ORDERS_FAIL:
                            return {
                                loading: false,
                                error: action.payload
                            }
            
                        case CLEAR_ERRORS:
                            return {
                                ...state,
                                error: null
                            }
                            
                        default:
                            return state;
                    }
                }