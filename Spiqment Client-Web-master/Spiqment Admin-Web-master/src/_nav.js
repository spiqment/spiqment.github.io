import React from 'react'
import CIcon from '@coreui/icons-react'
import { NavLink } from 'react-router-dom'

const _nav = [
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon name="cil-speedometer" customClassName="nav-icon" />,
  },
  {
    _component: 'CNavTitle',
    anchor: 'Controls',
  },
  {
    _component: 'CNavGroup',
    as: NavLink,
    anchor: 'Products',
    to: '/to',
    icon: <CIcon name="cib-product-hunt" customClassName="nav-icon" />,
    items: [
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Add Product',
        to: '/admin/products/add-product',
        icon: <CIcon name="cib-addthis" customClassName="nav-icon" />,
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'All Products',
        to: '/admin/products/all-products',
        icon: <CIcon name="cil-list" customClassName="nav-icon" />,
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Product Reviews',
        to: '/admin/products/product-reviews',
        icon: <CIcon name="cil-star" customClassName="nav-icon" />,
      },
    ],
  },
  {
    _component: 'CNavGroup',
    as: NavLink,
    anchor: 'Categories',
    to: '/to',
    icon: <CIcon name="cil-list" customClassName="nav-icon" />,
    items: [
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Add Category',
        to: '/admin/categories/add-category',
        icon: <CIcon name="cib-addthis" customClassName="nav-icon" />,
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'All Categories',
        to: '/admin/categories/all-categories',
        icon: <CIcon name="cil-list" customClassName="nav-icon" />,
      },
    ],
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Orders',
    to: '/admin/orders',
    icon: <CIcon name="cil-truck" customClassName="nav-icon" />,
  },
  {
    _component: 'CNavGroup',
    as: NavLink,
    anchor: 'Users',
    to: '/to',
    icon: <CIcon name="cil-user" customClassName="nav-icon" />,
    items: [
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'All users',
        to: '/admin/users',
        icon: <CIcon name="cil-list" customClassName="nav-icon" />,
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Create user',
        to: '/admin/users/create-user',
        icon: <CIcon name="cib-addthis" customClassName="nav-icon" />,
      },
    ],
  },
  {
    _component: 'CNavGroup',
    as: NavLink,
    anchor: 'Carousel',
    to: '/to',
    icon: <CIcon name="cil-flag-alt" customClassName="nav-icon" />,
    items: [
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'All Slides',
        to: '/admin/banner/allslides',
        icon: <CIcon name="cib-slides" customClassName="nav-icon" />,
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Add Slide',
        to: '/admin/banner/addslide',
        icon: <CIcon name="cib-addthis" customClassName="nav-icon" />,
      },
    ],
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'CustomerSupport',
    to: '/admin/support',
    icon: <CIcon name="cil-user" customClassName="nav-icon" />,
  },
]
export default _nav
