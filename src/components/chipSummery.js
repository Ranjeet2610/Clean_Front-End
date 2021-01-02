import React, { Component } from "react";
import Navbar from "./Navbar";
import Account from "../Services/account";
import Users from "../Services/users";
import Footer from "./footer";
import {Link} from 'react-router-dom'

export default class ChipSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      suc_err:null,
      notifyMsg:'',
      validateMsg:'',
      bgColor:'',
      data: "",
      plusAccounts: "",
      minusAccounts: "",
      userInfo: "",
      displayPop: false,
      settleAmt: "",
      Value1: "",
    };
    this.account = new Account();
    this.users = new Users();
    this.userDetails = JSON.parse(localStorage.getItem("data")) != undefined ? JSON.parse(localStorage.getItem("data")) : "";
  }

  handleChange=(event)=>{
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  componentDidMount() {
    if(this.userDetails.superAdmin) {
      this.users.getAllAdmin((data) => {
        this.setState({
          plusAccounts: data.data.filter((item) => item.profitLossChips > 0),
          minusAccounts: data.data.filter((item) => item.profitLossChips <= 0),
          data: data,
        });
      });
    } 
    else if(this.userDetails.Admin) {
      this.users.getmasterforSupermaster(this.userDetails.userName, (data) => {
        this.setState({
          plusAccounts: data.data.filter((item) => item.profitLossChips > 0),
          minusAccounts: data.data.filter((item) => item.profitLossChips <= 0),
        });
      });
    } 
    else {
      this.users.getUsersforMaster(this.userDetails.userName, (data) => {
        this.setState({
          plusAccounts: data.data.filter((item) => item.profitLossChips > 0),
          minusAccounts: data.data.filter((item) => item.profitLossChips <= 0),
        });
      });
    }
  }

  submitClearChip(userData) {
    this.setState({
      displayPop: true,
      userInfo: userData,
    });
  }

  hasAlphabet = (string) => {
    // return /[a-z]/g.test(string)
    return /\d/.test(string);
  }

  saveSettelment() {
    let type = this.hasAlphabet(this.state.settleAmt);
    // console.log(!type)
    const obj = { 
      userid: this.state.userInfo.id, 
      PL_Chips: this.state.settleAmt 
    }
    if (this.userDetails.superAdmin) {
      this.account.fetchChipSummary("chipSettlementForAdmin",obj,(data) => {
        const obj1 = { 
          userName: this.userDetails.userName 
        } 
        this.users.getMyprofile(obj1,(udata) => {
          localStorage.setItem("data", JSON.stringify(udata.data));
          if(this.state.settleAmt && parseInt(this.state.settleAmt)) {
            this.setState({
              notifyMsg: "Chip Settled Successfully...!",
              bgColor:'green',
              suc_err:true
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } 
          else {
            this.setState({
              validateMsg:"*Incorrect number...Please Check it...!",
              bgColor:'red',
              suc_err:false
            });
          }
        });
      });
    } 
    else if (this.userDetails.Admin) {
      const obj = { 
        userid: this.state.userInfo.id, 
        PL_Chips: this.state.settleAmt 
      }
      this.account.fetchChipSummary("chipSettlementForMaster",obj,(data) => {
        const obj1 = { 
          userName: this.userDetails.userName 
        }
        this.users.getMyprofile(obj1,(udata) => {
          localStorage.setItem("data", JSON.stringify(udata.data));
          if (this.state.settleAmt && parseInt(this.state.settleAmt)) {
            this.setState({
              notifyMsg: "Chip Settled Successfully...!",
              bgColor:'green',
              suc_err:true
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } 
          else {
            this.setState({
              validateMsg: "*Incorrect number...Please Check it...!",
              bgColor:'green',
              suc_err:true
            });
          }
        });
      });
    } 
    else {
      const obj = { 
        userid: this.state.userInfo.id, 
        PL_Chips: this.state.settleAmt 
      }
      this.account.fetchChipSummary("chipSettlementForUser",obj,(data) => {
        const obj1 = { 
          userName: this.userDetails.userName 
        }
        this.users.getMyprofile(obj1,(udata) => {
          localStorage.setItem("data", JSON.stringify(udata.data));
          if (this.state.settleAmt && parseInt(this.state.settleAmt)) {
            this.setState({
              notifyMsg: "Chip Settled Successfully...!",
              bgColor:'green',
              suc_err:true
            });
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } 
          else {
            this.setState({
              validateMsg: "*Incorrect number...Please Check it!",
              bgColor:'red',
              suc_err:true
            });
          }
        });
      });
    }
  }

  closePopUp() {
    this.setState({
      displayPop: false,
    });
  }

  handleSearchFilter = () => {
    console.log(this.state.data);
  };

  render() {
    let totalPlus = 0;
    let totalMinus = 0;
    return (
      <div>
        <Navbar />
        <div className="container body">
          <div className="main_container" id="sticky" style={{ width: "100%" }}>
            <div className="right_col" role="main">
              <div className="col-md-12">
                <div style={{ color: "white", backgroundColor: "#6c1945", height: "30px", padding: "5px", paddingLeft: "15px" }} >
                  <span>Chip Summary</span>
                  <button onClick={() => { this.props.history.goBack()}} style={{ float: "right", paddingRight: "5px", paddingLeft: "5px", backgroundColor: "#95335c", border: "none", borderRadius: "3px", }}>
                    Back
                  </button>
                </div>
                <div className="clearfix data-background">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="popup_col_2">
                      <input type="hidden" name="userType" id="userType" value="2" />
                      <input type="hidden" name="userID" id="userID" value="145315" />
                    </div>
                    <div className="popup_col_2"></div>
                  </div>

                  <div id="divLoading"/>

{
  ////////////////////////////// PLUS ACCOUNT TABLE //////////////////////////////////////////
}

                  <div className="col-md-6 col-sm-6 green_table">
                    <div className="link">PLUS ACCOUNT</div>
                    <div className="main_gre-red">
                      <table className="table table-striped jambo_table bulk_action" id="" >
                        <thead>
                          <tr className="headings">
                            <th className="text-center">Name</th>
                            <th className="text-center">Account</th>
                            <th className="text-center">Chips</th>
                            <th className="text-center">History/Settlement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.plusAccounts.length > 0 && 
                            this.state.plusAccounts.map((item) => {
                              totalPlus = totalPlus + item.profitLossChips;
                              return (
                                <tr id="user_row_152052">
                                  <td className="text-center">{item.Name} </td>
                                  <td className="text-center acco"><Link>{item.userName}</Link></td>
                                  <td className="text-center">{item.profitLossChips}</td>
                                  <td className="text-center">
                                    <Link style={{ margin: "5px" }} className="btn btn-xs btn-primary" to={"cacstatement/" + item.userName}>
                                      <i aria-hidden="true">History</i>
                                    </Link>
                                    <Link style={{ margin: "5px" }} className="btn btn-xs btn-danger" title="Close Settlement" onClick={() => this.submitClearChip(item) } >
                                      <i aria-hidden="true">Settlement</i>
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                          }
                          <tr id="user_row_">
                            <td className="text-center"></td>
                            <td className="text-center acco ">Own comm</td>
                            <td className="text-center ">0</td>
                            <td className="text-center "></td>
                          </tr>
                          <tr id="user_row_">
                            <td className="text-center"></td>
                            <td className="text-center acco ">Cash</td>
                            <td className="text-center ">0</td>
                            <td className="text-center "></td>
                          </tr>
                          <tr>
                            <td className="text-center">Total</td><td></td>
                            <td className="text-center">{totalPlus}</td><td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

{
  ////////////////////////////// MINUS ACCOUNT TABLE //////////////////////////////////////////
}

                  <div className="col-md-6 col-sm-6 red_table">
                    <div className="link minus">MINUS ACCOUNT</div>
                    <div className="main_gre-red">
                      <table className="table table-striped jambo_table bulk_action" id="" >
                        <thead>
                          <tr className="headings">
                            <th className="text-center">Name</th>
                            <th className="text-center">Account</th>
                            <th className="text-center">Chips</th>
                            <th className="text-center">History/Settlement</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.minusAccounts.length > 0 &&
                            this.state.minusAccounts.map((item,index) => {
                              totalMinus = totalMinus + item.profitLossChips;
                              return (
                                <tr key={index} id="user_row_152052">
                                  <td className="text-center">{item.Name}</td>
                                  <td className="text-center acco"><Link to="#">{item.userName}</Link></td>
                                  <td className="text-center">{item.profitLossChips}</td>
                                  <td className="text-center">
                                    <Link style={{ margin: "5px" }} className="btn btn-xs btn-primary" to={"cacstatement/" + item.userName} >
                                      <i aria-hidden="true">History</i>
                                    </Link>
                                    <Link to="#" style={{ margin: "5px" }} className="btn btn-xs btn-danger" title="Close Settlement" onClick={() => this.submitClearChip(item)} >
                                      <i aria-hidden="true">Settlement</i>
                                    </Link>
                                  </td>
                                </tr>
                              );
                              })
                          }
                          <tr id="user_row_">
                            <td className="text-center"> </td>
                            <td className="text-center acco">Parent comm</td>
                            <td className="text-center">0</td>
                            <td className="text-center"></td>
                          </tr>
                          <tr id="user_row_">
                            <td className="text-center"> </td>
                            <td className="text-center acco">Parent A/C</td>
                            <td className="text-center">{this.userDetails.profitLossChips}</td>
                            <td className="text-center"></td>
                          </tr>
                          <tr id="user_row_">
                            <td className="text-center"> </td>
                            <td className="text-center acco">Own</td>
                            <td className="text-center">0.00</td>
                            <td className="text-center"></td>
                          </tr>
                          <tr>
                            <td className="text-center">Total</td><td></td>
                            <td className="text-center">{totalMinus}</td><td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

{
  /////////////////////////////// CHIP SETTLEMENT //////////////////////////////////////////////
}

            <div id="settlementpopup" className="modal fade in" role="dialog" style={this.state.displayPop ? {display: "block"} : {display: "none"}}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="popup_form">
                    <div className="title_popup">
                      <span id="tital_change">User Name {this.state.userInfo.userName} ||{this.state.userInfo.profitLossChips}</span>
                      <button type="button" className="close" data-dismiss="modal" onClick={() => this.closePopUp()} >
                        <div className="close_new">
                          <i className="fa fa-times-circle"></i>
                        </div>
                      </button>
                    </div>
                    <div className="text-center" style={{color:this.state.bgColor,fontSize:'20px'}}>{this.state.notifyMsg}</div>
                    <div className="content_popup">
                      <div className="popup_form_row">
                        <div className="popup_col_6">
                          <label htmlFor="email">Chips :</label>
                          <input type="text" name="settleAmt" onChange={(e) => this.handleChange(e)} defaultValue={this.state.userInfo.profitLossChips} className="form-control" id="Chips" />
                        <span id="Name1N" className="errmsg">{this.state.validateMsg}</span>
                        </div>
                        <div className="popup_col_6">
                          <label htmlFor="pwd">Remark:</label>
                          <input type="text" name="Value1" className="form-control" id="Narration" onChange={(e) => this.handleChange(e)} />
                          <span id="Value1N" className="errmsg"></span>
                        </div>
                        <div className="popup_col_12">
                          <button style={{ marginLeft: "15px" }} type="button" className="btn btn-success" id="saveSettelment" onClick={() => this.saveSettelment()} >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
