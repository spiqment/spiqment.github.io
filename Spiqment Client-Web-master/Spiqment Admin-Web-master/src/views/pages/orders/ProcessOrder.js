/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCol,
  CForm,
  CFormLabel,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, allOrders, getOrderDetails, processOrder } from 'src/actions/orderActions'
import CIcon from '@coreui/icons-react'
import { DELIVERED, IN_TRANSIT, PROCESSING, UPDATE_ORDER_RESET, CANCELLED } from 'src/constants/orderConstants'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'

const ProcessOrder = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const orderID = match.params.id

  const { error, order, loading } = useSelector((state) => state.orderDetails)
  const {
    error: updateError,
    isUpdated,
    loading: loadingOrder,
  } = useSelector((state) => state.order)

  const [rows, setRows] = useState(null)
  const [status, setStatus] = useState('')
  const [alert, setAlert] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('orderStatus', status)
    if(status === CANCELLED){
      formData.set('reason', "Cancelled By Admin")
    }
    dispatch(processOrder(order._id, formData))
  }

  useEffect(() => {
    if (!order) {
      dispatch(getOrderDetails(orderID))
    } else {
      setStatus(order.orderStatus)
    }
  }, [dispatch, orderID, order])

  useEffect(() => {
    if ((order && orderID !== order._id) || isUpdated) {
      dispatch(getOrderDetails(orderID))
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (updateError) {
      setAlert({ type: 'danger', message: updateError })
      dispatch(clearErrors())
    }
    if (isUpdated) {
      setAlert({ type: 'success', message: 'Order Updated successfully' })
      dispatch({ type: UPDATE_ORDER_RESET })
    }
  }, [order, isUpdated, dispatch, error, updateError, orderID])

  useEffect(() => {
    if (order) {
      setStatus(order?.orderStatus)
      setRows(
        order?.orderItems?.map((item) => ({
          productID: item.product?._id,
          name: item.product?.name,
          price: item.product?.price,
          image: (
            <img
              src={item.product?.images[0]?.url}
              alt=""
              width="100"
              height="100"
              style={{ objectFit: 'contain' }}
            ></img>
          ),
          quantity: item.quantity,
        })),
      )
    }
  }, [loading, order, history, dispatch])

  const columns = [
    {
      label: 'Image',
      field: 'image',
      width: 150,
      sort: 'disabled',
    },
    {
      label: 'Product ID',
      field: 'productID',
      width: 220,
    },
    {
      label: 'Product',
      field: 'name',
      width: 250,
    },
    {
      label: 'Unit Price ($)',
      field: 'price',
      width: 150,
    },
    {
      label: 'Quantity',
      field: 'quantity',
      width: 150,
    },
  ]

  return (
    <>
      {!loading && <Metadata title={`Order ${order._id}`} />}
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>{!loading && `Order ${order._id}`}</CCardHeader>
        {!loading ? (
          <CCardBody>
            <CRow>
              {order.orderStatus !== CANCELLED ? (
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-4 justify-content-center align-items-end">
                  <CCol xs="8">
                    <CFormLabel htmlFor="category">Status</CFormLabel>
                    <CFormSelect
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      id="category"
                    >
                      <option disabled={true} value={PROCESSING}>
                        Processing
                      </option>
                      <option disabled={order.orderStatus !== PROCESSING} value={IN_TRANSIT}>
                        In Transit
                      </option>
                      <option disabled={order.orderStatus !== IN_TRANSIT} value={DELIVERED}>
                        Delivered
                      </option>
                      <option disabled={order.orderStatus === DELIVERED} value={CANCELLED}>
                        Cancelled
                      </option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs="4">
                    <CButton disabled={loadingOrder || loading} type="submit">
                      {!loading && !loadingOrder ? (
                        'Save'
                      ) : (
                        <>
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                          Updating Status...
                        </>
                      )}
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
              ):(
                <>
                </>
              )}
            </CRow>
            <CRow>
            {order.orderStatus !== CANCELLED ? (
              <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-info border-top-3">
                  <CCardHeader>Order Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Order Status</strong>
                          </p>
                          <CBadge
                            color={
                              order.orderStatus === PROCESSING
                                ? 'info'
                                : order.orderStatus === IN_TRANSIT
                                ? 'warning'
                                : order.orderStatus === DELIVERED && 'success'
                            }
                          >
                            <h5>{order.orderStatus?.toUpperCase()}</h5>
                          </CBadge>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Payment Status</strong>
                          </p>
                          <CBadge
                            color={
                              order.paymentInfo?.status === 'succeeded' || !!order.paidAt
                                ? 'success'
                                : 'warning'
                            }
                          >
                            {order.paymentInfo?.status === 'succeeded' || !!order.paidAt ? (
                              <h5>PAID</h5>
                            ) : (
                              <h5>NOT PAID</h5>
                            )}
                          </CBadge>
                        </CListGroupItem>
                      </CListGroup>
                      {/* <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Stripe ID</strong>
                          </p>
                          <p>{order.paymentInfo?.id}</p>
                        </CListGroupItem>
                      </CListGroup> */}
                      <CListGroup>
                        {order.deliveredAt ? (
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Delivery Confirmed On</strong>
                            </p>
                            <CBadge color="success">
                              <h5>{order.deliveredOn?.toString().slice(0, 10)}</h5>
                            </CBadge>
                          </CListGroupItem>
                        ) : (
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Placed On</strong>
                            </p>
                            <p>{order.createdAt?.toString().slice(0, 10)}</p>
                          </CListGroupItem>
                        )}
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
                ) : (
                  <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-info border-top-3">
                  <CCardHeader>Order Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Order Status</strong>
                          </p>
                          <CBadge
                            color={
                              order.orderStatus === PROCESSING
                                ? 'info'
                                : order.orderStatus === IN_TRANSIT
                                ? 'warning'
                                :order.orderStatus === DELIVERED 
                                ? 'success'
                                : order.orderStatus === CANCELLED && 'danger'
                            }
                          >
                            <h5>{order.orderStatus?.toUpperCase()}</h5>
                          </CBadge>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Payment Status</strong>
                          </p>
                          <CBadge
                            color={
                              order.cancelOrder.cancelledOn
                                ? 'info'
                                : 'success'
                            }
                          >
                            {order.cancelOrder.cancelledOn? (
                              <h5>REFUND</h5>
                            ) : (
                              <h5>PAID</h5>
                            )}
                          </CBadge>
                        </CListGroupItem>
                      </CListGroup>
                      {/* <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Stripe ID</strong>
                          </p>
                          <p>{order.paymentInfo?.id}</p>
                        </CListGroupItem>
                      </CListGroup> */}
                      <CListGroup>
                        {order.deliveredAt ? (
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Delivery Confirmed On</strong>
                            </p>
                            <CBadge color="success">
                              <h5>{order.deliveredOn?.toString().slice(0, 10)}</h5>
                            </CBadge>
                          </CListGroupItem>
                        ) : (
                          <>
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Placed On</strong>
                            </p>
                            <p>{order.createdAt?.toString().slice(0, 10)}</p>
                          </CListGroupItem>
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Cancelled On</strong>
                            </p>
                            <p>{order.cancelOrder.cancelledOn?.toString().slice(0, 10)}</p>
                          </CListGroupItem>
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Reason</strong>
                            </p>
                            <p>{order.cancelOrder.reason?.toString()}</p>
                          </CListGroupItem>
                          </>
                        )
                          
                        }
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
                )}
              <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-success border-top-3">
                  <CCardHeader>Payment Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Base Price</strong>
                          </p>
                          <p>{`$${order.itemsPrice?.toFixed(2)}`}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Tax</strong>
                          </p>
                          <p>{`$${order.taxPrice?.toFixed(2)}`}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Shipping Charges</strong>
                          </p>
                          <p>{`$${order.shippingPrice?.toFixed(2)}`}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Total Price</strong>
                          </p>
                          <h3>{`$${order.totalPrice?.toFixed(2)}`}</h3>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-primary border-top-3">
                  <CCardHeader>Shipping Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Address</strong>
                          </p>
                          <p>
                            {`${order.shippingInfo?.address}, ${order.shippingInfo?.city}, ${order.shippingInfo?.province}, ${order.shippingInfo?.country}`}
                          </p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Postal Code</strong>
                          </p>
                          <p>{order.shippingInfo?.postalCode}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Phone</strong>
                          </p>
                          <p>{order.shippingInfo?.phoneNo}</p>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-danger border-top-3">
                  <CCardHeader>User Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>User ID</strong>
                          </p>
                          <p>{order.user?._id}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>User Name</strong>
                          </p>
                          <p>{order.user?.name}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>User Email</strong>
                          </p>
                          <p>{order.user?.email}</p>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12">
                <CCard textColor="dark" className={`mb-3 border-top-warning border-top-3`}>
                  <CCardHeader>Order Items</CCardHeader>
                  <CCardBody>
                    <Table rows={rows} columns={columns} scrollY nohover noSearch />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        ) : (
          <center>
            <CSpinner color="primary" size="xl" />
          </center>
        )}
      </CCard>
    </>
  )
}

export default ProcessOrder
