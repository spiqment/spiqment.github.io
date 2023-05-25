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
import { createCategory } from 'src/actions/categoryActions'
import { CREATE_CATEGORY_RESET } from 'src/constants/categoryConstants'
import { CLEAR_ERRORS } from 'src/constants/userConstants'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'

const AddCategory = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [name, setName] = useState('')
  const { error, isCreated, message, loading } = useSelector((state) => state.categories)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch({ type: CLEAR_ERRORS })
    }
    if (isCreated) {
      setAlert({ type: 'success', message })
      dispatch({ type: CREATE_CATEGORY_RESET })
    }
  }, [dispatch, error, isCreated, message])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('name', name)
    dispatch(createCategory(formData))
  }

  return (
    <>
      <Metadata title="Add category" />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>Add category</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CFormLabel htmlFor="categoryName" className="col-sm-2 col-form-label">
                Category Name
              </CFormLabel>
              <CCol sm="10">
                <CFormControl
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="input"
                  id="categoryName"
                />
              </CCol>
            </CRow>

            <CButton disabled={loading} type="submit">
              {!loading ? (
                'Add Category'
              ) : (
                <>
                  <CSpinner component="span" size="sm" aria-hidden="true" />
                  Creating category...
                </>
              )}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default AddCategory
