/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormControl,
  CFormLabel,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ADD_FEATURED_RESET } from 'src/constants/productConstants'
import Metadata from 'src/reusable/Metadata'
import { addFeatured, clearErrors } from 'src/actions/productActions'

const AddSlide = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { loading, error, isCreated, message } = useSelector((state) => state.newSlide)

  const [alert, setAlert] = useState(null)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')

  useEffect(() => {
    if (error) {
      if (error === "Cannot read property 'length' of undefined")
        setAlert({ type: 'danger', message: 'Please add an image' })
      else setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (isCreated) {
      setAlert({ type: 'success', message })
      dispatch({ type: ADD_FEATURED_RESET })
    }
  }, [dispatch, error, isCreated, message, history])

  const handleChange = (e) => {
    const file = e.target.files[0]
    setImage('')
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('title', title)
    formData.set('description', description)
    formData.set('link', link)
    formData.set('image', image)

    dispatch(addFeatured(formData))
  }

  return (
    <>
      <Metadata title="Add Slide" />
      <CCard className="mb-4">
        <CCardHeader>Add Slide</CCardHeader>
        <CCardBody>
          <CForm className="row g-3" onSubmit={handleSubmit}>
            <CCol md="12">
              <CFormLabel htmlFor="inputEmail4">Slide Title</CFormLabel>
              <CFormControl
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="slide-title"
              />
            </CCol>
            <CCol xs="12">
              <CFormLabel htmlFor="productDescription">Slide Description</CFormLabel>
              <CFormControl
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                component="textarea"
                id="slide-description"
                rows="5"
              ></CFormControl>
            </CCol>
            <CCol md="12">
              <CFormLabel htmlFor="inputEmail4">Slide Link (Must be relative)</CFormLabel>
              <CFormControl
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                id="slide-link"
              />
            </CCol>
            <CCol xs="12">
              <CFormLabel htmlFor="productImages">Image</CFormLabel>
              <CFormControl onChange={handleChange} type="file" id="product-image" />
            </CCol>
            <CCol xs="12">
              <center>
                {image !== '' && (
                  <img
                    style={{ objectFit: 'contain', width: '300px', height: '300px' }}
                    src={image}
                    alt=""
                  ></img>
                )}
              </center>
            </CCol>
            <CCol xs="12">
              <CButton disabled={loading} type="submit">
                {!loading ? (
                  'Add Slide'
                ) : (
                  <>
                    <CSpinner component="span" size="sm" aria-hidden="true" />
                    Adding Slide...
                  </>
                )}
              </CButton>
            </CCol>
            <CCol xs="12">{alert && <CAlert color={alert.type}>{alert.message}</CAlert>}</CCol>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default AddSlide
