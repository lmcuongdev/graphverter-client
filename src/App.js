import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "react-toastify/dist/ReactToastify.css";

import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import ProjectDetail from "pages/ProjectDetail";
import { GlobalStyles } from "styles/globalStyles";
import { darkTheme, lightTheme } from "styles/theme";
import { getAuthUser } from "app/slices/authSlice";

const Unauthenticated = () => {
  return (
    <Switch>
      <Route exact path="/auth/login" component={Login} />
      <Route exact path="/auth/register" component={Register} />
      <Redirect from="/" to="/auth/login" />
    </Switch>
  );
};

const Authenticated = () => {
  return (
    <Switch>
      <Route exact path="/projects/:id" component={ProjectDetail} />
      <Route exact path="/projects" component={Home} />
      <Redirect from="/" to="/projects" />
    </Switch>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.ui);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getAuthUser());
    }
  }, [isLoggedIn, dispatch]);
  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Helmet>
        <title>Graphverter</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          rel="stylesheet"
        />
      </Helmet>
      <>
        {/* <Layout> */}
        {isLoggedIn ? <Authenticated /> : <Unauthenticated />}
        {/* </Layout> */}
      </>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
};

export default App;
