/* eslint-disable prettier/prettier */
import CIcon from '@coreui/icons-react'
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
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getFeatured, clearErrors, deleteFeatured } from 'src/actions/productActions'
import { PAGE_RECORDS_LIMIT } from 'src/constants/generalConstants'
import { DELETE_FEATURED_RESET } from 'src/constants/productConstants'
import Dropdown from 'src/reusable/Dropdown'
import Metadata from 'src/reusable/Metadata'
import Pagination from 'src/reusable/Pagination'
import Table from 'src/reusable/Table'

const AllSlides = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { error, slides, count, loading } = useSelector((state) => state.banner)
  const {
    error: slideError,
    isDeleted,
    loading: slideLoading,
  } = useSelector((state) => state.slide)

  const [rows, setRows] = useState(null)
  const [alert, setAlert] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [orderBy, setOrderBy] = useState(null)
  const [direction, setDirection] = useState(null)
  const [page, setPage] = useState(1)
  const [toDelete, setToDelete] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    dispatch(getFeatured(keyword, page, PAGE_RECORDS_LIMIT, orderBy, direction))
  }, [dispatch, keyword, page, orderBy, direction])

  useEffect(() => {
    if (isDeleted) {
      dispatch(getFeatured(keyword, page, PAGE_RECORDS_LIMIT, orderBy, direction))
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (slideError) {
      setAlert({ type: 'danger', message: slideError })
      dispatch(clearErrors())
    }
    if (isDeleted) {
      setAlert({ type: 'success', message: 'Slide deleted from banner successfully' })
      dispatch({ type: DELETE_FEATURED_RESET })
    }
  }, [dispatch, error, slideError, isDeleted, keyword, page, orderBy, direction])

  useEffect(() => {
    const showDelete = (slideID) => {
      setToDelete(slideID)
      setDeleteConfirm(true)
    }
    if (!!slides) {
      setRows(
        slides.map((slide) => ({
          slideID: slide._id,
          title: slide.title,
          description: slide.description,
          image: <img alt="" src={slide.image.url} style={{ height: '100px' }} />,
          link: slide.link,
          actions: (
            <>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                disabled={slideLoading || loading}
                onClick={() => dispatch(showDelete(slide._id))}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </>
          ),
        })),
      )
    }
  }, [history, slides, slideLoading, loading, dispatch])

  const columns = [
    {
      label: 'Image',
      field: 'image',
      sort: 'disabled',
      width: 200,
    },
    {
      label: 'Title',
      field: 'title',
      width: 100,
    },
    {
      label: 'Description',
      field: 'description',
      width: 150,
    },
    {
      label: 'Link',
      field: 'link',
      width: 400,
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
      name: 'Slide ID',
    },
    {
      value: 'title',
      name: 'Title',
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

  const handleDeleteSlide = (slideID) => {
    dispatch(deleteFeatured(slideID))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete Product</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete this slide?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loading} color="danger" onClick={() => handleDeleteSlide(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  return (
    <>
      <Metadata title="All Slides" />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>All Slides</CCardHeader>
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
          {!loading && !slideLoading && !!slides ? (
            <Table nohover columns={columns} rows={rows} scrollX />
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

export default AllSlides
