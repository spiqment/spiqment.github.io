/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, allOrders, deleteOrder } from 'src/actions/orderActions'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'
import { CANCELLED, DELETE_ORDER_RESET, DELIVERED, IN_TRANSIT, PROCESSING } from 'src/constants/orderConstants'
import Table from 'src/reusable/Table'
import Dropdown from 'src/reusable/Dropdown'
import Pagination from 'src/reusable/Pagination'
import { PAGE_RECORDS_LIMIT } from 'src/constants/generalConstants'

// eslint-disable-next-line react/prop-types
// const Table = ({columns, rows}) => {
//       return <MDBDataTableV5 searchTop searchBottom={false} scrollX hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4}
//       data={{
//           columns: columns,
//           rows: rows
//       }} />;
// }

const AllOrders = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const {
    error: orderError,
    orders,
    orders_count,
    loading: loadingOrders,
  } = useSelector((state) => state.orders)
  const { loading, error, isDeleted } = useSelector((state) => state.order)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [orderBy, setOrderBy] = useState(null)
  const [direction, setDirection] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!toDelete || isDeleted) {
      dispatch(allOrders(keyword, page, PAGE_RECORDS_LIMIT, orderBy, direction))
    }
    if (orderError) {
      setAlert({ type: 'danger', message: orderError })
      dispatch(clearErrors())
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (isDeleted) {
      setAlert({ type: 'success', message: `Order ${toDelete} successfully deleted` })
      dispatch({ type: DELETE_ORDER_RESET })
    }
  }, [dispatch, orderError, error, isDeleted, toDelete, keyword, page, orderBy, direction])

  useEffect(() => {
    const showDelete = (orderID) => {
      setToDelete(orderID)
      setDeleteConfirm(true)
    }
    if (orders) {
      setRows(
        orders.map((order) => ({
          orderID: order._id,
          date: order.createdAt?.toString().slice(0, 10),
          cost: Number(order.totalPrice).toFixed(2),
          status:
            order.orderStatus === PROCESSING ? (
              <CBadge color="info">Processing</CBadge>
            ) : order.orderStatus === IN_TRANSIT ? (
              <CBadge color="warning">In Transit</CBadge>
            ) : order.orderStatus === DELIVERED ? (
              <CBadge color="success">Delivered</CBadge>
            ) :
            (
              order.orderStatus === CANCELLED && <CBadge color="danger">Cancelled</CBadge>
            ),
          items: Number(order.orderItems.reduce((acc, item) => acc + Number(item.quantity), 0)),
          actions: (
            <>
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => history.push(`/admin/orders/${order._id}`)}
              >
                <CIcon name="cil-settings" />
              </CButton>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                onClick={() => showDelete(order._id)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </>
          ),
        })),
      )
    }
    console.log("Count >>>>>>> " + orders_count);
  }, [orders, history, dispatch])

  const handleDeleteOrder = (orderID) => {
    dispatch(deleteOrder(orderID))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete Order</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete Order {toDelete}?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loading} color="danger" onClick={() => handleDeleteOrder(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const columns = [
    {
      label: 'Order ID',
      field: 'orderID',
      sort: 'disabled',
      width: 250,
    },
    {
      label: 'Placed On',
      field: 'date',
      sort: 'disabled',
      width: 100,
    },
    {
      label: 'Total Cost ($)',
      field: 'cost',
      sort: 'disabled',
      width: 100,
    },
    {
      label: 'Total Items',
      field: 'items',
      sort: 'disabled',
      width: 100,
    },
    {
      label: 'Status',
      field: 'status',
      sort: 'disabled',
      width: 100,
    },
    {
      label: 'Actions',
      field: 'actions',
      sort: 'disabled',
      width: 100,
    },
  ]

  const sortByColumns = [
    {
      value: '_id',
      name: 'Order ID',
    },
    {
      value: 'name',
      name: 'Name',
    },
    {
      value: 'totalPrice',
      name: 'Cost',
    },
    {
      value: 'orderStatus',
      name: 'Status',
    },
    {
      value: 'createdAt',
      name: 'Date',
    },
  ]

  const orderDirection = [
    {
      value: 'desc',
      name: 'Descending',
    },
    {
      value: 'asc',
      name: 'Ascending',
    },
  ]

  return (
    <>
      <Metadata title="All Orders" />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>All Orders</CCardHeader>
        <CCardBody>
          <CInputGroup className="mb-3">
            <CInputGroupText id="inputGroup-sizing-default">Search</CInputGroupText>
            <CFormControl
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              type="input"
              id="keyword"
            />
            <Dropdown
              title="Sort by"
              options={sortByColumns}
              value={orderBy}
              setValue={setOrderBy}
            />
            <Dropdown
              title="Order"
              options={orderDirection}
              value={direction}
              setValue={setDirection}
            />
          </CInputGroup>
          <ConfirmDelete />
          {!loadingOrders && orders ? (
            <Table columns={columns} rows={rows} scrollX scrollY />
          ) : (
            <center>
              <CSpinner color="primary" size="xl" />
            </center>
          )}
        </CCardBody>
        <CCardFooter>
          {!loading && <Pagination setPage={setPage} page={page} count={orders_count} />}
        </CCardFooter>
      </CCard>
    </>
  )
}

export default AllOrders
