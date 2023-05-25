/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import { CAvatar } from '@coreui/react'
import React from 'react'

const UserAvatar = ({ src, alt }) => {
  return (
    <CAvatar
      className="ms-2"
      shape="rounded-circle"
      color="secondary"
      textColor="white"
      src={src !== 'no avatar' && !!src && src}
    >
      {(src === 'no avatar' || !src) && !!alt && alt.slice(0, 1).toUpperCase()}
    </CAvatar>
  )
}

export default UserAvatar
