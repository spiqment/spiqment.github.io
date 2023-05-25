/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetDropdown,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'

const Widget = ({ value, title, color, fullWidth }) => {
  return (
    <CCol sm={fullWidth ? '12' : '6'} lg={fullWidth ? '12' : '3'}>
      <CWidgetDropdown
        className="mb-4"
        color={color}
        value={value}
        title={title}
        action={
          <CDropdown alignment="end">
            <CDropdownToggle color="transparent" caret={false} className="p-0">
              <CIcon name="cil-options" className="text-high-emphasis-inverse" />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem>Details</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        }
        chart={<div className={'text-center'} style={{ height: '100px' }}></div>}
      />
    </CCol>
  )
}

const WidgetsDropdown = ({ productCount, outOfStock, ordersPending, totalAmount, totalUsers, getallOrders, cancelledOrders }) => {
  return (
    <CRow>
      <Widget title="Products" value={productCount || '0'} color="primary" />
      <Widget title="Out Of Stock" value={outOfStock || '0'} color="danger" />
      <Widget title="Orders Pending" value={ordersPending || '0'} color="warning" />
      <Widget title="Users" value={totalUsers || '0'} color="info" />
      <Widget
        title="Total Amount"
        value={`$${totalAmount.toFixed(2)}`}
        color="success"
        fullWidth={true}
      />
      <Widget title="Total Orders" value={getallOrders || '0'} color="primary" />
      <Widget title="Cancelled Orders" value={cancelledOrders || '0'} color="danger" />
    </CRow>
  )
}

export default WidgetsDropdown
