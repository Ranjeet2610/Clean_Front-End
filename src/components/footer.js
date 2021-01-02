import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import  Inplay from '../images/inplay.png';
import  editstake from '../images/edit-stake.png';
import  bethistory from '../images/history.png';
import  logout from '../images/logout.png';
import  home from '../images/home.png';
// import  mainLogo from '../betfun-logo.png';

export default class Footer extends Component {
  
  logout(){
		localStorage.clear();
		window.location.href ='/';
  }
  
  render() {
    return(  
      <footer>
        <ul className="menu-links">
          <li className="item">
            <Link to="/dashboard?inplay">
              <img src={Inplay}/>
              <span>Inplay</span>
            </Link>
          </li>
          <li className="item">
            <Link to="#" className="UserChipData" data-toggle="modal" data-target="#addUser" data-backdrop="static" data-keyboard="false">
              <img src={editstake} />
              <span>Edit stake</span>
            </Link>
          </li>
          <li className="item">
            <Link to="/dashboard" className="site_title endcooki active">
              <img src={home} />
            </Link>
          </li>
          <li className="item">
            <Link to="/bethistory">
              <img src={bethistory} />
              <span>Bet History</span>
            </Link>
          </li>
          <li className="item">
            <Link to="#" onClick={this.logout}>
              <img src={logout} />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </footer>
    );
  }
}