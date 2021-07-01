import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import { CookiesProvider, useCookies } from 'react-cookie';
// Styles
import 'styles/index.css';

// Theme
import CustomTheme from 'theme/customTheme';

// Pages
import LoginPage from 'pages/loginPage';
import SignupPage from 'pages/signupPage';
import DashboardPage from 'pages/dashboardPage';
import postRecipePage from 'pages/postRecipePage';
import ProfilePage from 'pages/profilePage';
import UserGallery from 'pages/userGallery';
import RecipePage from 'pages/recipePage';
import UpdateRecipePage from 'pages/updateRecipePage';

ReactDOM.render(
  <CookiesProvider>
    <React.StrictMode>
      <ThemeProvider theme={CustomTheme}>
        <Router>
          <Switch>
            <Route exact path="/updaterecipe/:recipeId" component={UpdateRecipePage} />
            <Route exact path="/recipe/:recipeId" component={RecipePage} />
            <Route exact path="/postrecipe" component={postRecipePage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/user/:userId" component={UserGallery} />
            <PrivateRoute path="/dashboard" component={DashboardPage} />
            <Route path="/signup" component={SignupPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/" component={LoginPage} />   
          </Switch>
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  </CookiesProvider>,
  document.getElementById('root')
);

// Route function to only allow logged-in user
function PrivateRoute ({ component: Component, ...rest }) {
  const [cookies] = useCookies(['token']);
  const isAuthenticated = () => {
    const token = cookies.token;
    if (token !== undefined) {
      return true;
    }
    return false;
  }
 
  return (
    // Show the component only when the user is logged is logged in
    // Otherwise, redirect the user to login page
    <Route {...rest} render={props => (
      isAuthenticated() ? <Component {...props} /> : <Redirect to='/login' />
    )}/>
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired
}