/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CAvatar,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormControl,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { clearErrors, getUser, updateUser } from 'src/actions/userActions'
import { UPDATE_USER_RESET } from 'src/constants/userConstants'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'
import UserAvatar from 'src/reusable/UserAvatar'

const UpdateUser = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const userID = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState()
  const [role, setRole] = useState('')
  const { error, user, loading } = useSelector((state) => state.userDetails)
  const {
    error: userError,
    isUpdated,
    message,
    loading: loadingUser,
  } = useSelector((state) => state.user)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if ((user && userID !== user._id) || isUpdated) {
      dispatch(getUser(userID))
    } else {
      setName(user.name)
      setEmail(user.email)
      setRole(user.role)
    }
    if (userError) {
      setAlert({ type: 'danger', message: userError })
      dispatch(clearErrors())
    }
    if (isUpdated) {
      setAlert({ type: 'success', message })
      dispatch({ type: UPDATE_USER_RESET })
    }
  }, [dispatch, user, userError, userID, isUpdated, message])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('name', name)
    formData.set('email', email)
    formData.set('age', age)
    formData.set('role', role)
    dispatch(updateUser(user._id, formData))
  }

  return (
    <>
      {!loading && user && <Metadata title={`${user.name}'s Profile`} />}
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      {!loading && user && (
        <CCard className="mb-4">
          <CCardHeader>
            <CRow className="my-2 align-items-center justify-items-space-between">
              <CCol xs="12" className="d-flex align-items-center mt-2">
                <UserAvatar src={user.avatar?.url} alt={user.name} />
                <h4 className="mx-2">{user.name}</h4>
                <CBadge className="mx-2" color={user.role === 'admin' ? 'warning' : 'info'}>
                  <h4>{user.role?.toUpperCase()}</h4>
                </CBadge>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-3">
              <CFormLabel htmlFor="userName" className="col-sm-2 col-form-label">
                User ID
              </CFormLabel>
              <CCol sm="10">
                <CFormControl readOnly value={user._id} type="input" id="userID" />
              </CCol>
            </CRow>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CFormLabel htmlFor="userName" className="col-sm-2 col-form-label">
                  Name
                </CFormLabel>
                <CCol sm="10">
                  <CFormControl
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="input"
                    id="userName"
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="userEmail" className="col-sm-2 col-form-label">
                  Email
                </CFormLabel>
                <CCol sm="10">
                  <CFormControl
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    id="userEmail"
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
              <CFormLabel htmlFor="userAge" className="col-sm-2 col-form-label">
                Age
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  type="number"
                  id="userAge"
                />
              </CCol>
            </CRow>
              <fieldset className="row mb-3">
                <legend className="col-form-label col-sm-2 pt-0">Role</legend>
                <CCol sm="10">
                  <CFormCheck
                    type="radio"
                    name="gridRadios"
                    id="gridRadios1"
                    value="user"
                    label="User"
                    defaultChecked={user.role === 'user'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <CFormCheck
                    type="radio"
                    name="gridRadios"
                    id="gridRadios2"
                    value="admin"
                    label="Admin"
                    defaultChecked={user.role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </CCol>
              </fieldset>
              <CButton disabled={loadingUser || loading} type="submit">
                {!loading && !loadingUser ? (
                  'Save'
                ) : (
                  <>
                    <CSpinner component="span" size="sm" aria-hidden="true" />
                    Updating User...
                  </>
                )}
              </CButton>
            </CForm>
          </CCardBody>
        </CCard>
      )}
    </>
  )
}

export default UpdateUser
