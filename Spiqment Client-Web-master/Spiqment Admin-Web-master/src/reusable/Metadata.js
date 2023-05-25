/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import { Helmet } from 'react-helmet-async'
const Metadata = ({ title }) => {
  return (
    <div>
      <Helmet>
        <title>{`${title} - Spiqment Admin`}</title>
      </Helmet>
    </div>
  )
}

export default Metadata
