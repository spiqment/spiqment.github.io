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
import { createCategory, getCategory, updateCategory } from 'src/actions/categoryActions'
import { CREATE_CATEGORY_RESET, UPDATE_CATEGORY_RESET } from 'src/constants/categoryConstants'
import { CLEAR_ERRORS } from 'src/constants/userConstants'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'

const AddCategory = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const categoryID = match.params.id

  const [name, setName] = useState('')
  const { error, category, isUpdated, isCreated, message, loading } = useSelector(
    (state) => state.categories,
  )
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (!category || (category && categoryID !== category._id) || isUpdated) {
      dispatch(getCategory(categoryID))
    } else {
      setName(category.name)
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch({ type: CLEAR_ERRORS })
    }
    if (isUpdated) {
      setAlert({ type: 'success', message })
      dispatch({ type: UPDATE_CATEGORY_RESET })
    }
  }, [category, categoryID, isUpdated, dispatch, error, message])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('name', name)
    dispatch(updateCategory(categoryID, formData))
  }

  return (
    <>
      {!loading && category && <Metadata title={`Edit ${category.name}`} />}
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
                'Save'
              ) : (
                <>
                  <CSpinner component="span" size="sm" aria-hidden="true" />
                  Updating category...
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
