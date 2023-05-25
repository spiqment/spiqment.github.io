import React from 'react';
import Header from "./components/Layout/Header/Header";
import "./App.css";
import Footer from "./components/Layout/Footer/Footer";
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";
import Home from "./components/Home/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProductDetails from "./components/Product/ProductDetails/ProductDetails";
import { AppContext } from "./context/AppContext";
import { useEffect, useState } from "react";
import { loadUser, clearErrors } from "./actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import store from "./store";
import PageAlert from "./components/Misc/PageAlert/PageAlert";
import Login from "./components/User/Login/Login";
import Signup from "./components/User/Signup/Signup";
import Profile from "./components/User/Profile/Profile";
import ProtectedRoute from "./components/Misc/ProtectedRoute/ProtectedRoute";
import Cart2 from "./components/ShoppingCart/Cart/Cart2";
import { amber } from "@material-ui/core/colors";
import axios from "axios";
import OrderDetails from "./components/Order/OrderDetails/OrderDetails";
import Dashboard from "./components/Dashboard/Dashboard";
import NotFound404 from "./components/Misc/NotFound404/NotFound404";
import './SupportStyle.css';

let theme = createTheme({
  typography: {
    fontFamily: ["Noto Sans JP", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#003049",
    },
    secondary: {
      main: "#D62828",
    },
    amber: {
      main: amber[500],
    },
  },
});

theme = responsiveFontSizes(theme);
export const AppTheme = theme;

function App() {
  const [alert, setAlert] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState([0, 0]);
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const states = {
    alertState: [alert, setAlert],
    searchQueryState: [searchQuery, setSearchQuery],
    keywordState: [keyword, setKeyword],
    categoryState: [category, setCategory],
    priceState: [price, setPrice],
    ratingState: [rating, setRating],
  };

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContext.Provider value={states}>
          <Header />
          <div className="App">
            <PageAlert />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/search" exact component={Home} />
              <ProtectedRoute
                path="/myprofile/orders"
                exact
                component={Profile}
              />
              <ProtectedRoute path="/myprofile" exact component={Profile} />
              <ProtectedRoute path="/dashboard" exact component={Dashboard} />
              <Route path="/signin" exact component={Login} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/product/:id" exact component={ProductDetails} />
              <Route path="/cart" exact component={Cart2} />
              <Route path="/order/:id" exact component={OrderDetails} />
              <Route path="*" component={NotFound404} />
            </Switch>
          </div>
          {!loading && <Footer />}
        </AppContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
