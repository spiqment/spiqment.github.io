/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import {
  CAlert,
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
import { clearErrors, deleteProduct, getProducts } from 'src/actions/productActions'
import CIcon from '@coreui/icons-react'
import { DELETE_PRODUCT_RESET } from 'src/constants/productConstants'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'
import { CLEAR_ERRORS } from 'src/constants/userConstants'
import Pagination from 'src/reusable/Pagination'
import Dropdown from 'src/reusable/Dropdown'
import { PAGE_RECORDS_LIMIT } from 'src/constants/generalConstants'

// eslint-disable-next-line react/prop-types
// const Table = ({columns, rows}) => {
//       return <MDBDataTableV5 searchTop searchBottom={false} scrollX hover entriesOptions={[5, 20, 25]} entries={5} pagesAmount={4}
//       data={{
//           columns: columns,
//           rows: rows
//       }} />;
// }

const AllProducts = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const screen = window.location.pathname.split('/')[3]
  let firstWord = screen.split('-')[0]
  let secondWord = screen.split('-')[1]
  firstWord = firstWord.charAt(0).toUpperCase() + firstWord.toLowerCase().slice(1)
  secondWord = secondWord.charAt(0).toUpperCase() + secondWord.toLowerCase().slice(1)
  const title = `${firstWord} ${secondWord}`

  const {
    error: productsError,
    products,
    count,
    loading: loadingProducts,
  } = useSelector((state) => state.products)
  const { error, isDeleted, loading } = useSelector((state) => state.product)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [productName, setProductName] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [orderBy, setOrderBy] = useState(null)
  const [direction, setDirection] = useState(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    // dispatch(getProducts(keyword, page, PAGE_RECORDS_LIMIT, orderBy, direction))
    if ((!toDelete && !productName) || isDeleted) {
      dispatch(getProducts(keyword, page, PAGE_RECORDS_LIMIT, orderBy, direction))
    }
    if (productsError) {
      console.log(productsError)
      setAlert({ type: 'danger', message: productsError })
      dispatch(clearErrors())
    }
    if (error) {
      console.log(error)
      setAlert({ type: 'danger', message: error })
      dispatch({ type: CLEAR_ERRORS })
    }
    if (isDeleted) {
      setAlert({ type: 'success', message: `${productName} deleted successfully` })
      dispatch({ type: DELETE_PRODUCT_RESET })
    }
  }, [
    dispatch,
    error,
    productsError,
    isDeleted,
    toDelete,
    productName,
    keyword,
    page,
    orderBy,
    direction,
  ])

  useEffect(() => {
    const showDelete = (productID, productName) => {
      setToDelete(productID)
      setProductName(productName)
      setDeleteConfirm(true)
    }
    if (products) {
      setRows(
        products.map((product) => ({
          productID: product._id,
          name: product.name,
          ratings: product.ratings,
          stock: product.stock,
          color: product.color,
          price: product.price,
          createdAt: product.createdAt?.toString().slice(0, 10),
          category: product.category?.name,
          actions:
            title === 'All Products' ? (
              <>
                <CButton
                  color="info"
                  variant="ghost"
                  size="sm"
                  onClick={() => history.push(`/admin/products/${product._id}`)}
                >
                  <CIcon name="cil-pencil" />
                </CButton>
                <CButton
                  color="danger"
                  variant="ghost"
                  size="sm"
                  onClick={() => showDelete(product._id, product.name)}
                >
                  <CIcon name="cil-trash" />
                </CButton>
              </>
            ) : (
              title === 'Product Reviews' && (
                <CButton
                  color="info"
                  variant="ghost"
                  size="sm"
                  onClick={() => history.push(`/admin/products/product-reviews/${product._id}`)}
                >
                  <i className="far fa-eye"></i>
                </CButton>
              )
            ),
        })),
      )
    }
  }, [products, title, history, dispatch])

  const handleDeleteProduct = (productID) => {
    dispatch(deleteProduct(productID))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete Product</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete {productName}?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loading} color="danger" onClick={() => handleDeleteProduct(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const columns = [
    {
      label: 'Product ID',
      field: 'productID',
      sort: 'disabled',
      width: 220,
    },
    {
      label: 'Name',
      field: 'name',
      sort: 'disabled',
      width: 200,
    },
    {
      label: title === 'All Products' ? 'Stock' : title === 'Product Reviews' && 'Ratings',
      field: title === 'All Products' ? 'stock' : title === 'Product Reviews' && 'ratings',
      width: 100,
      sort: 'disabled',
    },
    {
      label: 'Price',
      field: 'price',
      width: 100,
      sort: 'disabled',
    },
    {
      label: 'Created On',
      field: 'createdAt',
      width: 140,
      sort: 'disabled',
    },
    {
      label: 'Category',
      field: 'category',
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
      name: 'User ID',
    },
    {
      value: 'name',
      name: 'Name',
    },
    {
      value: 'price',
      name: 'Price',
    },
    {
      value: 'stock',
      name: 'Stock',
    },
    {
      value: 'createdAt',
      name: 'Created On',
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
      <Metadata title={title} />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>{title}</CCardHeader>
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
          {!loading && !loadingProducts && products ? (
            <Table columns={columns} rows={rows} scrollY />
          ) : (
            <center>
              <CSpinner color="primary" size="xl" />
            </center>
          )}
        </CCardBody>
        <CCardFooter>
          {!loading && <Pagination setPage={setPage} page={page} count={count} />}
        </CCardFooter>
      </CCard>
    </>
  )
}

export default AllProducts
