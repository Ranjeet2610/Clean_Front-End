import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Users from '../Services/users';
import Footer from './footer'

export default class CloseUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHead:["S.No.","User_ID","Website","Credit_Limit","Credit_given","Hyper","Super_Master","Balance","Partnership","M.comm","S.comm",""],
      tableHeadArray:["A","S","PL","I","P-R","P","D-W"],
      data: [],
    };
    this.users =new Users();
    this.userDetails = JSON.parse(localStorage.getItem('data'))!==undefined?JSON.parse(localStorage.getItem('data')):'';
  }
  componentDidMount() {
    if(this.userDetails.superAdmin){
    this.users.getCloseUser('getBlockAdmins',data=>{    
      this.setState({
          data: data.data
        })
      })
    }
    else if(this.userDetails.Admin){
      const obj = {
        adminName:this.userDetails.userName
      }
      this.users.getclosemasterforAdmin(obj,data=>{
        this.setState({
          data: data.data
        }) 
      })
    }
    else{
      this.getclosusersforMaster(this.userDetails.userName)
    }
  }

  getclosusersforMaster = (mName) => {
    const obj = {
      masterName:mName
    }
    this.users.getclosusersforMaster(obj,data=>{
      this.setState({
        data: data.data
      }) 
    })
  }

  closeAdminuser = (e) => {
    this.removeActiveClass();
    e.target.parentElement.classList.add('active')
    this.users.getCloseUser('getBlockAdmins',data=>{    
      this.setState({
        data: data.data
      })
    }) 
  }

  closemaster = (e) => {
    this.removeActiveClass();
    e.target.parentElement.classList.add('active')
    this.users.getCloseUser('getBlockMasters',data=>{    
      this.setState({
        data: data.data
      })
    }) 
  }

  closeuser = (e) => {
    this.removeActiveClass();
    e.target.parentElement.classList.add('active')
    this.users.getCloseUser('getBlockUsers',data=>{    
      this.setState({
        data: data.data
      })
    }) 
  }

  removeActiveClass = () => {
    var activeclass = document.querySelectorAll('#betsalltab li');
    for (var i = 0; i < activeclass.length; i++) {
      activeclass[i].classList.remove('active');
    }
  }

  lock_unlock_user = (username) => {
    if (window.confirm("Would you like to open user account?")) {
      const obj = {
        userName:username
      }
      this.users.openUser(obj,data=>{    
        window.location.reload();
      })
    } else {
      //txt = "You pressed Cancel!";
    }
  }

  render(){
    let checkuser ;
    return (
      <div>
        <Navbar />
        <div className="forModal" />
        <div className="container body">
          <div className="main_container" id="sticky" style={{width:'100%'}}>
            <div className="ajax-call-hide">
              <style dangerouslySetInnerHTML={{__html: "\n.mod-header {background: #2a3f54;color: white;}\n.close_new {color: #fff;}\n#addUserMsg {text-align: center;}\n      .modal-content {background: #fff;}\n      .errmsg {text-align: center;color: red;}\n      .succmsg {text-align: center;color: green;}\n      .btn_new {padding: 0;display: inline-block;min-width: 40px;text-align: center;color: #000000;font-weight: bold;}\n      .green {background: #629632;color: #ffffff;padding: 0 3% !important;}\n      .red {background: #F08080;color: #ffffff;padding: 0 3% !important;}\n      .blue {background: #0198E1;}\n      .orange {background: red;}\n      .black {background: #323232;}\n      .last a:last-child span.btn_new {border-right: 1px solid #ddd;}\n      tr.red {background: #F08080 !important;color: #000000 !important;}\n      tr.redother {background: #e74c3c !important;}\n      .table-striped > tbody > tr > td {border-left: 1px solid #ddd;}\n      .lastdetail span.btn_new {padding: 5px 5px;margin: 1% 0;width: auto !important;}\n      .deskaction a span {display: inline-block;text-align: center;padding: 0;border-right: 1px solid #dddddd;width: 25px;}\n      .headings th.deskaction {padding-left: 0px;}\n      .headings th span {text-align: center;padding: 0;width: 26px;display: inline-block;}\n      .mobaction {display: none;}\n      .lastdetail {background: #ffffff;float: left;width: 100%;}\n      .table > thead > tr > th {vertical-align: bottom;border-bottom: 0px solid #ddd;}\n      span.width1 {width: 70px !important;display: inline-block !important;padding: 0px !important;}\n      span.detailinfo {padding: 10px;display: inline-block;}\n   " }} />
            </div>
            <div id="userModal" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                </div>
              </div>
            </div>
            <div className="right_col" role="main">
              <div className="col-md-12">
                <div className="title_new_at">Closed Users
                  <form className="usersech user-mobile" id="userListForm">
                    <input type="hidden" name="formSubmit" defaultValue={1} />
                    <input type="hidden" name="perpage" id="perpage" defaultValue />
                    <input type="text" name="mstruserid" id="mstruserid" placeholder="Search here" defaultValue />
                    <button className="fa fa-search" />
                  </form>
                </div>
              </div>
              <div className="clearfix" />
              <div className="row">
                <div className="popup_col_6">
                  <div className="tab_bets get-mchlist">
                    {
                      this.userDetails.superAdmin ?
                        <ul id="betsalltab" className="nav nav-pills">
                          <li className="active">
                            <Link to="#" onClick={(e)=>this.closeAdminuser(e)}>Super Master</Link>
                          </li>
                          <li>
                            <Link to="#" onClick={(e)=>this.closemaster(e)}>Master</Link>
                          </li>
                          <li className>
                            <Link to="#" onClick={(e)=>this.closeuser(e)}>Users</Link>
                          </li>
                        </ul>:
                      this.userDetails.Admin ?
                        <ul id="betsalltab" className="nav nav-pills"> 
                          <li className="active">
                            <Link to="#">Master</Link>
                          </li>
                        </ul>:
                      this.userDetails.Master ?
                          <ul id="betsalltab" className="nav nav-pills">
                            <li className="active">
                              <Link to="#">Users</Link>
                            </li>
                          </ul>:
                      null
                    }
                  </div>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="x_panel userwidth1">
                    <div className="row detailtop deskaction" style={{margin: '0px'}}>
                      <div className="lastdetail">
                        <span className="detailinfo"><b>Se</b> : Close settlement</span>
                        <span className="detailinfo"><b>S</b> : Statement</span>
                        <span className="detailinfo"><b>PL</b> : Profit Loss</span>
                        <span className="detailinfo"><b>I</b> : View Info</span>
                        <span className="detailinfo"><b>P-R</b> : Partnerhsip</span>
                        <span className="detailinfo"><b>P</b> : Change Password</span>
                        <span className="detailinfo"><b>D-W</b> : Free Chip In Out</span>
                        <span className="detailinfo"><b>C</b> : Close Account</span>
                      </div>
                    </div>
                    <div id="divLoading" />

{
  /////////////////////////// TABLE FOR CLOSED USER ///////////////////////////
}

                    <div className="x_content">
                      <div id="contentreplace">
                        <table className="table table-striped jambo_table bulk_action" id="datatabless">
                          <thead>
                            <tr className="headings">
                              {
                                this.state.tableHead.map((item,index)=><th key={index}>{item}</th>)
                              }
                              <th className="deskaction">
                                {
                                  this.state.tableHeadArray.map((item,index)=><span key={index} style={{border:'none'}}>{item}</span>)
                                }
                              </th>
                              <th className="mobaction">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.data.length > 0 ?
                                this.state.data.map((item,index)=>{
                                  if(item.Master){
                                    checkuser =<Link style ={{cursor:'pointer'}} onClick={()=>this.getclosusersforMaster(item.userName)}>{item.userName}</Link>
                                  }
                                  else{
                                    checkuser = item.userName
                                  }
                                  return (   
                                  <tr key={index} id="user_row_155245">
                                    <td>{index+1}<input type="checkbox" value="155245" className="select-users"/></td>
                                    <td><span className="m-bg">{checkuser}</span></td>
                                    <td>Betfun360</td>
                                    <td>aarav</td>
                                    <td>Bablu</td>
                                    <td>{item.master}</td>
                                    <td className=" ">0 </td>
                                    <td className=" ">0 </td>
                                    <td className=" ">
                                      <Link to="#" className="btn btn-success btn-xs">0.00</Link>
                                    </td>
                                    <td className=" ">0 </td>
                                    <td className=" ">0.00</td>
                                    <td><Link to="#" title="Open user Account" onClick={()=>this.lock_unlock_user(item.userName)}>Open </Link></td>
                                    <td className="last">
                                      <span className="deskaction">
                                        <span>
                                          <Link to="#" className="btn btn-success btn-xs">
                                            <span>S</span>
                                           </Link>
                                        </span>
                                        <span>
                                          <Link to="#" className="btn btn-primary btn-xs">
                                            <span> PL </span> 
                                          </Link>
                                        </span>
                                        <span>
                                          <Link to="#" className="btn btn-warning btn-xs" title="View Account Info">
                                            <span>I</span>
                                          </Link>
                                        </span>
                                        <span>
                                          <Link to="#" className="btn btn-danger btn-xs" title="Change Password">
                                            <span>P</span>
                                          </Link>
                                        </span>
                                        <span>
                                          <Link to="#" className="btn btn-warning btn-xs" title="Free Chip In Out">
                                            <span>D</span>
                                          </Link>
                                        </span>
                                        <span>
                                          <Link to="#" className="btn btn-warning btn-xs" title="Free Chip In Out">
                                            <span>W</span>
                                          </Link>
                                        </span>
                                      </span>
                                      <div className="topnav" id="myTopnav" style={{display:'none'}}>
                                        <Link to="#">
                                          <span>Statement</span>
                                        </Link>
                                        <Link to="#">
                                          <span> Profit Loss</span>
                                        </Link>
                                        <Link to="#">
                                          <span>View Info</span>
                                        </Link>
                                        <Link to="#">
                                          <span>Change Password</span>
                                        </Link>
                                        <Link to="#">
                                          <span>Free Chips in</span>
                                        </Link>
                                        <Link to="#">
                                          <span>Free Chips Out</span>
                                        </Link>
                                      </div>
                                      <span className="icon-mobile">☰</span>
                                    </td>
                                  </tr>
                                  )
                                }):
                              <tr><td colSpan={13} className="text-center">Empty...!</td></tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
}
