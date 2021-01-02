import React, { Fragment } from 'react';
import './App.css';
import './css/custom.css'
import './css/menu.css'
import {BrowserRouter as Router, Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Master from './components/Master';
import SuperMaster from './components/supermaster';
import Login from './components/Login';
import User from './components/User';
import CloseUser from './components/CloserUser';
import BlockMarket from './components/BlockMarket';
import MyMarket from './components/MyMarket';
import Acinfo from './components/Acinfo';
import Bethistory from './components/Bethistory';
import Clientpl from './components/Clientpl';
import Cacstatement from './components/Cacstatement';
import Liveevents from './components/Liveevents';
import Marketpl from './components/Marketpl';
import Sportspl from './components/Sportspl';
import Userpl from './components/Userpl';
import ProfitLoss from './components/ProfitLoss';
import Livegame from './components/Livegame';
import Fancystack from './components/Fancystack';
import SideBet from './components/SideBet';
import MatchOdds from './components/MatchOdds';
import EventMatchOdds from './components/EventMatchOdds';
import ManageFancyOdds from './components/ManageFancyOdds';
import ChipSummary from './components/chipSummery';
import ManageFancyRunners from './components/ManageFancyRunners';
import  './config/axiosConfig'
const App = () => {
  return (
     <Router>
       
           <Fragment>
        <Route exact path='/' component={Login} />
       <section>
       <Switch>
          <Route exact path='/master' component={Master} />
          <Route exact path='/master/:username' component={Master} />
          <Route exact path='/supermaster' component={SuperMaster} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/user" component={User} />
          <Route exact path="/user/:username" component={User} />
          <Route exact path="/closeuser" component={CloseUser} />
          <Route exact path="/blockmarket" component={BlockMarket} />
          <Route exact path="/mymarket" component={MyMarket} />
          <Route exact path="/bethistory" component={Bethistory} />
          <Route exact path="/acinfo" component={Acinfo} />
          <Route exact path="/clientpl/:username" component={Clientpl} />
          <Route exact path="/clientpl" component={Clientpl} />
          <Route exact path="/cacstatement" component={Cacstatement} />
          <Route exact path="/cacstatement/:username" component={Cacstatement} />
          <Route exact path="/marketpl" component={Marketpl} />
          <Route exact path="/sportspl" component={Sportspl} />
          <Route exact path="/userpl" component={Userpl} />
          <Route exact path="/userpl/:username" component={Userpl} />
          <Route exact path="/profitloss/:username" component={ProfitLoss} />
          <Route exact path="/profitloss" component={ProfitLoss} />
          <Route exact path="/livegame" component={Livegame} />
          <Route exact path="/fancystack" component={Fancystack} />
          <Route exact path="/sidebet" component={SideBet} />
          <Route exact path="/matchodds/:id" component={MatchOdds} />
          <Route exact path="/liveevents" component={Liveevents} />
          <Route exact path="/chipsummary" component={ChipSummary} />
          <Route exact path="/eventmatchodds/:id" component={EventMatchOdds} />
           <Route exact path="/eventfancyodds/:id" component={ManageFancyOdds} /> 
           <Route exact path="/managefrunners/:id" component={ManageFancyRunners} /> 
           </Switch> 
       </section>
         
         </Fragment>
      </Router>   
  

  );
}   

export default App;
