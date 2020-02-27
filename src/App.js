import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


const App = (
  <div>
    <Header />
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/shop" component={ShopPage} />
      <Route exact path="/checkout" component={CheckoutPage} />
    </Switch>
  </div>
);


App.propTypes = {
  setCurrentUser: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({}).isRequired,
};

export default App;
