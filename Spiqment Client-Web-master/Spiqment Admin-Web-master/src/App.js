import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { loadUser } from './actions/userActions'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUser())
  }, [dispatch])

  return (
    <HelmetProvider>
      <Router>
        <React.Suspense fallback={loading}>
          <Switch>
            <Route
              exact
              path="/admin/signin"
              name="Login Page"
              render={(props) => <Login {...props} />}
            />
            <ProtectedRoute path="/admin" component={DefaultLayout} />
            {/* <Route path={'/admin'} component={DefaultLayout} /> */}
            <Route exact path="*" name="Page 404" render={(props) => <Page404 {...props} />} />
            {/* <Route exact path="/500" name="Page 500" render={(props) => <Page500 {...props} />} /> */}
            {/* <Route path="/" name="Home" render={(props) => <DefaultLayout {...props} />} /> */}
          </Switch>
        </React.Suspense>
      </Router>
    </HelmetProvider>
  )
}

export default App
