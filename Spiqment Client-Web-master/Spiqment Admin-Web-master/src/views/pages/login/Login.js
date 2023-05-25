import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormControl,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, login } from 'src/actions/userActions'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState(null)
  const dispatch = useDispatch()
  const history = useHistory()
  const { isAuthenticated, error, user, loading } = useSelector((state) => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  useEffect(() => {
    if (!loading && isAuthenticated && user.role === 'admin') {
      history.push('/admin')
    }
    if (error) {
      setAlert(error)
      dispatch(clearErrors())
    }
  }, [dispatch, history, loading, user, setAlert, isAuthenticated, error])
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {!loading && (
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Sign In to your account</p>
                      {alert && <CAlert color="danger">{alert}</CAlert>}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                        <CFormControl
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email"
                          autoComplete="username"
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                        <CFormControl
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs="6">
                          <CButton onClick={handleSubmit} color="primary" className="px-4">
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Spiqment Admin</h2>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      )}
    </div>
  )
}

export default Login
