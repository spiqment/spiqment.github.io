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
import { clearErrors, createUser, getUser, updateUser } from 'src/actions/userActions'
import { CREATE_USER_RESET, UPDATE_USER_RESET } from 'src/constants/userConstants'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'
import UserAvatar from 'src/reusable/UserAvatar'

const CreateUser = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const userID = match.params.id

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState()
  const [role, setRole] = useState('')
  const { error, isCreated, message, loading } = useSelector((state) => state.user)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (isCreated) {
      setAlert({ type: 'success', message })
      dispatch({ type: CREATE_USER_RESET })
    }
  }, [dispatch, error, userID, isCreated, message])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('name', name)
    formData.set('email', email)
    formData.set('password', password)
    formData.set('age' , age)
    formData.set('role', role)
    dispatch(createUser(formData))
  }

  return (
    <>
      <Metadata title="Create user" />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>Create user</CCardHeader>
        <CCardBody>
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
              <CFormLabel htmlFor="userPassword" className="col-sm-2 col-form-label">
                Password
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  autoComplete="current-password"
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
                  onChange={(e) => setRole(e.target.value)}
                />
                <CFormCheck
                  type="radio"
                  name="gridRadios"
                  id="gridRadios2"
                  value="admin"
                  label="Admin"
                  onChange={(e) => setRole(e.target.value)}
                />
              </CCol>
            </fieldset>
            <CButton disabled={loading} type="submit">
              {!loading ? (
                'Save'
              ) : (
                <>
                  <CSpinner component="span" size="sm" aria-hidden="true" />
                  Creating User...
                </>
              )}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CreateUser
