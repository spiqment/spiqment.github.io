/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, deleteReview, getProductDetails } from 'src/actions/productActions'
import CIcon from '@coreui/icons-react'
import { DELETE_REVIEW_RESET } from 'src/constants/productConstants'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'

const ProductReviews = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const productID = match.params.id

  const { error, product, loading } = useSelector((state) => state.productDetails)
  const {
    error: reviewError,
    isDeleted,
    loading: reviewLoading,
  } = useSelector((state) => state.review)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if ((product && productID !== product._id) || isDeleted) {
      dispatch(getProductDetails(productID))
    }
    if (reviewError) {
      console.log(reviewError)
      setAlert({ type: 'danger', message: reviewError })
      dispatch(clearErrors())
    }
    if (error) {
      console.log(error)
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (isDeleted) {
      setAlert({ type: 'success', message: `Review ${toDelete} deleted successfully` })
      dispatch({ type: DELETE_REVIEW_RESET })
    }
  }, [dispatch, error, reviewError, product, productID, isDeleted, toDelete])

  useEffect(() => {
    const showDelete = (reviewID) => {
      setToDelete(reviewID)
      setDeleteConfirm(true)
    }
    if (!!product && !!product.reviews) {
      setRows(
        product.reviews.map((review) => ({
          reviewID: review._id,
          user: review.user?._id,
          name: review.user?.name,
          comment: review.comment,
          rating: review.rating,
          actions: (
            <>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                onClick={() => showDelete(review._id)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </>
          ),
        })),
      )
    }
  }, [product, history, dispatch])

  const handleDeleteReview = (reviewID) => {
    dispatch(deleteReview(product._id, reviewID))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete Review</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete Review {toDelete}?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton
            disabled={loading || reviewLoading}
            color="danger"
            onClick={() => handleDeleteReview(toDelete)}
          >
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const columns = [
    {
      label: 'Review ID',
      field: 'reviewID',
      width: 220,
    },
    {
      label: 'User ID',
      field: 'user',
      width: 220,
    },
    {
      label: 'User Name',
      field: 'name',
      width: 150,
    },
    {
      label: 'Comment',
      field: 'comment',
      width: 270,
      attributes: {
        'aria-controls': 'DataTable',
        'aria-label': 'Comment',
      },
    },
    {
      label: 'Rating',
      field: 'rating',
      width: 100,
    },
    {
      label: 'Actions',
      field: 'actions',
      sort: 'disabled',
      width: 150,
    },
  ]

  return (
    <>
      {!loading && <Metadata title={`Reviews for ${product.name}`} />}
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>{!loading && !!product && `Reviews for ${product.name}`}</CCardHeader>
        <CCardBody>
          <ConfirmDelete />
          {!loading && !!product ? (
            <Table columns={columns} rows={rows} />
          ) : (
            <center>
              <CSpinner color="primary" size="xl" />
            </center>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default ProductReviews
