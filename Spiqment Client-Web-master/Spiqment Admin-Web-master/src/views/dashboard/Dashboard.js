/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { lazy, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from 'src/actions/productActions.js'
import { allOrders, getMyAllOrders } from 'src/actions/orderActions.js'
import Metadata from 'src/reusable/Metadata.js'
import { getUsers } from 'src/actions/userActions.js'
import { PROCESSING, CANCELLED } from 'src/constants/orderConstants.js'

const WidgetsDropdown = lazy(() => import('../components/widgets/WidgetsDropdown.js'))

const Dashboard = () => {
  const dispatch = useDispatch()
  const { products, loading, count } = useSelector((state) => state.products)
  const { orders, orders_count, totalAmount } = useSelector((state) => state.orders)
  const { getallOrders } = useSelector((state) => state.getallOrders)
  const { users, users_count } = useSelector((state) => state.users)
  const [outOfStock, setOutOfStock] = useState(0)
  const [ordersPending, setOrdersPending] = useState(0)
  const [ordersCancelled, setOrdersCancelled] = useState(0)

  useEffect(() => {
    dispatch(getProducts())
    dispatch(allOrders())
    dispatch(getUsers())
    dispatch(getMyAllOrders())
  }, [dispatch])

  useEffect(() => {
    setOutOfStock(0)
    setOrdersPending(0)
    setOrdersCancelled(0)
    if (products || orders) {
      products.forEach((product) => {
        if (product.stock === 0) setOutOfStock((prev) => prev + 1)
      })
    }
    if (getallOrders) {
      getallOrders.forEach((order) => {
        if (order.orderStatus === PROCESSING) setOrdersPending((prev) => prev + 1)
        if (order.orderStatus === CANCELLED) setOrdersCancelled((prev) => prev + 1)
      })
    }

  }, [products, getallOrders])

  return (
    <>
      {!loading && products && users && (
        <>
          <Metadata title="Dashboard" />
          <WidgetsDropdown
            productCount={count}
            outOfStock={outOfStock}
            ordersPending={ordersPending}
            totalAmount={totalAmount || 0}
            totalUsers={users_count}
            getallOrders={orders_count}
            cancelledOrders= {ordersCancelled}
          />
        </>
      )}
    </>
  )
}

export default Dashboard
