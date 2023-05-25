import React from 'react'

// examples

const AllProducts = React.lazy(() => import('./views/pages/products/AllProducts'))
const AddProduct = React.lazy(() => import('./views/pages/products/AddProduct'))
const UpdateProduct = React.lazy(() => import('./views/pages/products/UpdateProduct'))
const AllOrders = React.lazy(() => import('./views/pages/orders/AllOrders'))
const ProcessOrder = React.lazy(() => import('./views/pages/orders/ProcessOrder'))
const AllUsers = React.lazy(() => import('./views/pages/users/AllUsers'))
const UpdateUser = React.lazy(() => import('./views/pages/users/UpdateUser'))
const CreateUser = React.lazy(() => import('./views/pages/users/CreateUser'))
const ProductReviews = React.lazy(() => import('./views/pages/products/ProductReviews'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AllSlides = React.lazy(() => import('./views/pages/banner/AllSlides'))
const AddSlide = React.lazy(() => import('./views/pages/banner/AddSlide'))
const AllCategories = React.lazy(() => import('./views/pages/categories/AllCategories'))
const AddCategory = React.lazy(() => import('./views/pages/categories/AddCategory'))
const UpdateCategory = React.lazy(() => import('./views/pages/categories/UpdateCategory'))
const AdminSupport = React.lazy(() => import('./views/pages/support/AdminSupport'))

const routes = [
  { path: '/', exact: true, name: 'Admin' },
  { path: '/admin/dashboard', name: 'Dashboard', component: Dashboard, exact: true },
  { path: '/admin/products', name: 'Products', exact: true },
  {
    path: '/admin/products/update/:id',
    name: 'Update Product',
    component: UpdateProduct,
    exact: true,
  },
  {
    path: '/admin/products/all-products',
    name: 'All Products',
    component: AllProducts,
    exact: true,
  },
  { path: '/admin/products/add-product', name: 'Add Product', component: AddProduct, exact: true },
  {
    path: '/admin/products/product-reviews',
    name: 'Product Reviews',
    component: AllProducts,
    exact: true,
  },
  {
    path: '/admin/products/product-reviews/:id',
    name: 'Product Reviews',
    component: ProductReviews,
  },
  {
    path: '/admin/support',
    name: 'Admin Support',
    component: AdminSupport,
  },
  { path: '/admin/products/:id', name: 'Update Product', component: UpdateProduct },
  { path: '/admin/orders', name: 'All Orders', component: AllOrders, exact: true },
  { path: '/admin/orders/:id', name: 'Process Order', component: ProcessOrder },
  { path: '/admin/users', name: 'All Users', component: AllUsers, exact: true },
  { path: '/admin/users/create-user', name: 'Create User', component: CreateUser },
  { path: '/admin/users/:id', name: 'Update User', component: UpdateUser },
  { path: '/admin/banner/allslides', name: 'All Slides', component: AllSlides },
  { path: '/admin/banner/addslide', name: 'Add Slide', component: AddSlide },
  { path: '/admin/categories/all-categories', name: 'Add Category', component: AllCategories },
  { path: '/admin/categories/add-category', name: 'Add Category', component: AddCategory },
  { path: '/admin/categories/:id', name: 'Update Category', component: UpdateCategory },
]

export default routes
