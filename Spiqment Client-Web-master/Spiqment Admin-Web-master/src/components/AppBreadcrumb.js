import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute?.name || findRouteName(pathname)
  }

  const findRouteName = (url) => {
    if (routes[url]) {
      return routes[url]
    }

    const matchedWildcardRoute = Object.keys(routes).find((route) => {
      const routeSegments = route.split('/')
      const urlSegments = url.split('/')

      if (routeSegments.length !== urlSegments.length) {
        return false
      }

      routeSegments.map((seg, index) => {
        if (seg.startsWith(':')) {
          urlSegments[index] = seg
        }
      })

      return routes[urlSegments.join('/')] || false
    })

    return routes[matchedWildcardRoute]
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      breadcrumbs.push({
        pathname: currentPathname,
        name: getRouteName(currentPathname, routes),
        active: index + 1 === array.length ? true : false,
      })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2">
      {/* <CBreadcrumbItem href="/admin">Admin</CBreadcrumbItem> */}
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
