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
import { clearErrors, deleteUser, getUsers } from 'src/actions/userActions'
import { PAGE_RECORDS_LIMIT } from 'src/constants/generalConstants'
import { DELETE_USER_RESET } from 'src/constants/userConstants'
import Dropdown from 'src/reusable/Dropdown'
import Metadata from 'src/reusable/Metadata'
import Pagination from 'src/reusable/Pagination'
import Table from 'src/reusable/Table'

const AllUsers = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { error, users, users_count, loading } = useSelector((state) => state.users)
  const { loading: loadingUser, error: userError, isDeleted } = useSelector((state) => state.user)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [userName, setUserName] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [orderBy, setOrderBy] = useState(null)
  const [direction, setDirection] = useState(null)

  useEffect(() => {
    if ((!toDelete && !userName) || isDeleted) {
      dispatch(getUsers(keyword, page, PAGE_RECORDS_LIMIT, orderBy, direction))
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (userError) {
      setAlert({ type: 'danger', message: userError })
      dispatch(clearErrors())
    }
    if (isDeleted) {
      setAlert({ type: 'success', message: `${userName} (ID: ${toDelete}) successfully deleted` })
      dispatch({ type: DELETE_USER_RESET })
    }
  }, [dispatch, error, userError, isDeleted, userName, toDelete, keyword, page, orderBy, direction])

  useEffect(() => {
    const showDelete = (userID, name) => {
      setToDelete(userID)
      setUserName(name)
      setDeleteConfirm(true)
    }
    if (users) {
      setRows(
        users.map((user) => ({
          userID: user._id,
          role: user.role,
          name: user.name,
          createdAt: user.createdAt?.toString().slice(0, 10),
          email: user.email,
          avatar: (
            <CAvatar
              className="ms-2"
              shape="rounded-circle"
              color="secondary"
              textColor="white"
              src={user.avatar?.url !== 'no avatar' && user.avatar?.url}
            >
              {(user.avatar?.url === 'no avatar' || !user.avatar) &&
                user.name.slice(0, 1).toUpperCase()}
            </CAvatar>
          ),
          actions: (
            <>
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => history.push(`/admin/users/${user._id}`)}
              >
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                onClick={() => showDelete(user._id, user.name)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </>
          ),
        })),
      )
    }
  }, [users, history, dispatch])

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete User: {userName} ID: {toDelete}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loadingUser} color="danger" onClick={() => handleDeleteUser(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const columns = [
    {
      label: 'Avatar',
      field: 'avatar',
      width: 100,
      sort: 'disabled',
    },
    {
      label: 'Name',
      field: 'name',
      width: 150,
      sort: 'disabled',
    },
    {
      label: 'User ID',
      field: 'userID',
      width: 220,
      sort: 'disabled',
    },
    {
      label: 'Role',
      field: 'role',
      width: 100,
      sort: 'disabled',
    },
    {
      label: 'Email',
      field: 'email',
      width: 200,
      sort: 'disabled',
    },
    {
      label: 'Joined',
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
      name: 'User ID',
    },
    {
      value: 'name',
      name: 'Name',
    },
    {
      value: 'role',
      name: 'Role',
    },
    {
      value: 'email',
      name: 'Email',
    },
    {
      value: 'createdAt',
      name: 'Joined',
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
        <CCardHeader>All Users</CCardHeader>
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
          {!loading && users ? (
            <Table columns={columns} rows={rows} scrollY />
          ) : (
            <center>
              <CSpinner color="primary" size="xl" />
            </center>
          )}
        </CCardBody>
        <CCardFooter>
          {!loading && <Pagination setPage={setPage} page={page} count={users_count} />}
        </CCardFooter>
      </CCard>
    </>
  )
}

export default AllUsers
