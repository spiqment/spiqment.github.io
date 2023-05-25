import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
  CCreateNavItem,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const { unfoldable, sidebarShow } = useSelector((state) => state.sidebar)

  return (
    <CSidebar
      position="fixed"
      selfHiding="md"
      unfoldable={unfoldable}
      show={sidebarShow}
      onShow={() => console.log('show')}
      onHide={() => {
        dispatch({ type: 'SHOW_SIDEBAR_FALSE' })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/* <CIcon className="sidebar-brand-full" name="logo-negative" height={35} />
        <CIcon className="sidebar-brand-narrow" name="sygnet" height={35} /> */}
        <h3>SPIQMENT</h3>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <CCreateNavItem items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: `UNFOLDABLE_${(!unfoldable).toString().toUpperCase()}` })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
