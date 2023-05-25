/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react';

import { ChatEngine } from 'react-chat-engine'
const AdminSupport = () => {
    const REACT_APP_CE_PROJECT_ID="d7564858-eb18-48af-8564-7239c738b855"
  return (
    <ChatEngine 
      projectID={REACT_APP_CE_PROJECT_ID}
      userName='Spiqment'
      userSecret='Insane001'
      height='calc(100vh - 20px)'
    />
  )
}

export default AdminSupport;