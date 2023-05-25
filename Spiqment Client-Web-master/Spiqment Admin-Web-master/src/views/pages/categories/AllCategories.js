/* eslint-disable prettier/prettier */
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CAvatar,
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
  CPagination,
  CPaginationItem,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { deleteCategory, getCategories } from 'src/actions/categoryActions'
import { clearErrors, getUsers } from 'src/actions/userActions'
import { DELETE_CATEGORY_RESET } from 'src/constants/categoryConstants'
import { PAGE_RECORDS_LIMIT } from 'src/constants/generalConstants'
import { CLEAR_ERRORS, DELETE_USER_RESET } from 'src/constants/userConstants'
import Dropdown from 'src/reusable/Dropdown'
import Metadata from 'src/reusable/Metadata'
import Pagination from 'src/reusable/Pagination'
import Table from 'src/reusable/Table'

const AllUsers = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { error, categories, count, isDeleted, loading } = useSelector((state) => state.categories)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [categoryName, setCategoryName] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [orderBy, setOrderBy] = useState(null)
  const [direction, setDirection] = useState(null)

  useEffect(() => {
    if ((!toDelete && !categoryName) || isDeleted) {
      dispatch(getCategories(keyword, page, PAGE_RECORDS_LIMIT, orderBy, direction))
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch({ type: CLEAR_ERRORS })
    }
    if (isDeleted) {
      setAlert({
        type: 'success',
        message: `${categoryName} (ID: ${toDelete}) successfully deleted`,
      })
      dispatch({ type: DELETE_CATEGORY_RESET })
    }
  }, [dispatch, error, isDeleted, categoryName, toDelete, keyword, page, orderBy, direction])

  useEffect(() => {
    const showDelete = (userID, name) => {
      setToDelete(userID)
      setCategoryName(name)
      setDeleteConfirm(true)
    }
    if (categories) {
      setRows(
        categories.map((category) => ({
          categoryID: category._id,
          name: category.name,
          createdAt: category.createdAt?.toString().slice(0, 10),
          actions: (
            <>
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => history.push(`/admin/categories/${category._id}`)}
              >
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                onClick={() => showDelete(category._id, category.name)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </>
          ),
        })),
      )
    }
  }, [categories, history, dispatch])

  const handleDeleteCategory = (id) => {
    dispatch(deleteCategory(id))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete User: {categoryName} ID: {toDelete}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loading} color="danger" onClick={() => handleDeleteCategory(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const columns = [
    {
      label: 'Category ID',
      field: 'categoryID',
      width: 220,
      sort: 'disabled',
    },
    {
      label: 'Name',
      field: 'name',
      width: 150,
      sort: 'disabled',
    },
    {
      label: 'Created On',
      field: 'createdAt',
      width: 100,
      sort: 'disabled',
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
      name: 'Category ID',
    },
    {
      value: 'name',
      name: 'Name',
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
      <Metadata title="All Users" />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>All Categories</CCardHeader>
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
          {!loading && categories ? (
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

export default AllUsers
