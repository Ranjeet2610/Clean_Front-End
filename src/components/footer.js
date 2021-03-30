import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import  Inplay from '../images/inplay.png';
import  editstake from '../images/edit-stake.png';
import  bethistory from '../images/history.png';
import  logout from '../images/logout.png';
import  home from '../images/home.png';
// import  mainLogo from '../betfun-logo.png';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chipName:["500","2000","5000","25000","50000","100000"],
      chipStake:["500","2000","5000","25000","50000"],
    }
  }
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
            <Link to="#" className="UserChipData" data-toggle="modal" data-target="#exampleModalForEditStake" data-backdrop="static" data-keyboard="false">
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

        <div className="modal fade" id="exampleModalForEditStake" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <form onSubmit={(e)=>this.handleSubmit(e)}>
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel" style={{fontSize:'20px'}}>Chip Setting</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div class="modal-body row">
                    <div class="col-md-6">
                      {
                        this.state.chipName.map((item,index)=>{
                          return(
                            <>
                              <label>Chips Name {`${index+1}:`}</label>
                              <input type="text" className="form-control" defaultValue={item} />
                            </>
                          )
                        })
                      }
                    </div>
                    <div class="col-md-6">
                    {
                        this.state.chipName.map((item,index)=>{
                          return(
                            <>
                              <label>Chips Value {`${index+1}:`}</label>
                              <input type="text" className="form-control" defaultValue={item} />
                            </>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary text-center">Update ChipSetting</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}