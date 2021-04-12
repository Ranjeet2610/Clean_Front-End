import React, { Component } from "react";
import Pagination from './Pagination'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Loader from 'react-loader-spinner'
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Utilities from "./utilities";
import Users from "../Services/users";
import { Link } from "react-router-dom";
import Footer from "./footer";

export default class SuperMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage:1,
      postsPerPage:10,
      load:false,
      tableHead: ["S.No.", "UserID", "Website", "Credit_Limit", "Credit_Given", "Balance", "Partnership", "Partnership_Cacino", "Partnership_TeenPatti", "M.comm", "S.comm", "View More"],
      Cpwd: '',
      Npwd: '',
      notEqualMsg: "",
      eqlOrNot: '',
      confirm_password: '',
      newPassword: '',
      data: [],
      name: "",
      userName: "",
      password: "",
      partner: 0,
      master: "",
      walletBalance: 0,
      masterUName: "",
      redirectToReferrer: false,
      changpassPopup: "none",
      username: "",
      mName: "",
      userdetails: "",
      useraction: "",
      newParentChip: "",
      newCurrChip: "",
      isDeposit: false,
      Chips: "",
      userInfo: "",
      Name: "",
      max_stake: "",
      min_stake: "",
      max_profit: "",
      max_loss: "",
      PIP: "",
      PIS: "",
      min_odds: "",
      max_odds: "",
      searchFilter: [],
      totalBalance: 0,
      notifyMsg: "",
      naam: "",
      userNaam: "",
      pwd: "",
      reqID: "",
      reqMsg: "",
      reqPwd: "",
    };
    this.currentDate = Utilities.formatDate(new Date());
    this.users = new Users();
  }

  addUser = (name) => {
    this.setState({
      userName:"",
      name: "",
      password: "",
      partner: "",
      masterUName: name,
      reqPwd: '',
      reqID: '',
      reqMsg: '',
    });
  }

  componentDidMount() {
    let infoDetails = JSON.parse(localStorage.getItem('data'));
    if(infoDetails.superAdmin === false){
      this.props.history.push('/dashboard')
    }
    else{
      this.setState({
        load:true
      })
      this.getAllAdmin();
    }
  }

  getAllAdmin = () => {
    this.users.getAllAdmin((data) => {
      let sortdata = data.data.sort((a,b)=>{
        const aDate = new Date(a.createdAt)
        const bDate = new Date(b.createdAt)
        return bDate.getTime() - aDate.getTime()
      })
      this.setState({
        data: sortdata,
        searchFilter: sortdata,
        walletBalance: JSON.parse(localStorage.getItem("data")).walletBalance,
        load:false
      });
      let totalBalance = 0;
      this.state.data.map((ele) => {
        totalBalance += ele.walletBalance;
      });
      this.setState({ totalBalance });
    });
  }

  update_free_chips = () => {
    if (this.state.isDeposit) {
      const obj = {
        userid: this.state.userdetails.id,
        fillAmount: this.state.Chips
      }
      if(this.state.Chips!==""){
      this.users.creditbyUser(obj, "creditAmountBySuperAdmin", (pdata) => {
        const obj1 = {
          userName: JSON.parse(localStorage.getItem("data")).userName
        }
        this.users.getMyprofile(obj1, (data) => {
          localStorage.setItem("data", JSON.stringify(data.data));
        });
        this.getAllAdmin();
        switch ('success') {
          case 'success':
            NotificationManager.success(pdata.data.message,"Success");
          break;
      }
      });
      this.closechipDepositpopup();
    }
    }
    else {
      const obj = {
        userid: this.state.userdetails.id,
        fillAmount: this.state.Chips
      }
      if(this.state.Chips!==""){
      this.users.debitbyUser(obj, "debitAmountBySuperAdmin", (pdata) => {
        const obj = {
          userName: JSON.parse(localStorage.getItem("data")).userName
        }
        this.users.getMyprofile(obj, (data) => {
          localStorage.setItem("data", JSON.stringify(data.data));
          this.getAllAdmin();
          switch ('success') {
            case 'success':
              NotificationManager.success(pdata.data.message,"Success");
            break;
          }
        });
      });
      this.closechipWithdrawalpopup();
    }
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    if (this.state.isDeposit) {
      this.setState({
        newParentChip: JSON.parse(localStorage.getItem("data")).walletBalance - parseInt(event.target.value),
        newCurrChip: this.state.userdetails.walletBalance + parseInt(event.target.value),
      });
    }
    else {
      this.setState({
        newParentChip: JSON.parse(localStorage.getItem("data")).walletBalance + parseInt(event.target.value),
        newCurrChip: this.state.userdetails.walletBalance - parseInt(event.target.value),
      });
    }
  }

  view_change_passs = (userdetails) => {
    this.setState({
      username: userdetails.userName,
      userdetails: userdetails,
    });
    document.getElementById("masterpasswordpopup").classList.add("in");
    document.getElementById("masterpasswordpopup").style.display = "block";
  }

  submit_info = () => {
    const obj = {
      id: this.state.userdetails.id,
      cricketmaxStacks: this.state.max_stake,
      cricketminStacks: this.state.min_stake,
      cricketmaxProfit: this.state.max_profit,
      cricketmaxLoss: this.state.max_loss,
      cricketPreInplayProfit: this.state.PIP,
      cricketPreInplayStack: this.state.PIS,
      cricketmaxOdds: this.state.max_odds,
      cricketminOdds: this.state.min_odds,
    }
    this.users.updateUserSportsInfo(obj, (data) => {
      // alert("updated");
      switch ('success') {
        case 'success':
          NotificationManager.success("updated","Success");
        break;
      }
      this.closeviewinfo();
    });
  }

  submit_userInfo = () => {
    const obj = {
      userName: this.state.userdetails.userName,
      Name: this.state.Name
    }
    this.users.updateMyprofile(obj, (data) => {
      // alert("updated");
      switch ('success') {
        case 'success':
          NotificationManager.success("updated","Success");
        break;
    }
    this.closeviewinfo();
    });
  }

  openChipDeposit = (userdetails) => {
    this.setState({
      username: userdetails.userName,
      userdetails: userdetails,
      isDeposit: true,
    });
    document.getElementById("chipdeposit").classList.add("in");
    document.getElementById("chipdeposit").style.display = "block";
  }

  openChipWithdrawal = (userdetails) => {
    this.setState({
      username: userdetails.userName,
      userdetails: userdetails,
      isDeposit: false,
    });
    document.getElementById("chipwithdrawal").classList.add("in");
    document.getElementById("chipwithdrawal").style.display = "block";
  }

  closePasswordpopup = () => {
    this.setState({
      reqNewPwd: '',
      reqConfirmPwd: '',
      notEqualMsg: ''
    });
    document.getElementById("masterpasswordpopup").style.display = "none";
    document.getElementById("masterpasswordpopup").classList.remove("in");
  }

  closechipDepositpopup = () => {
    document.getElementById("chipdeposit").style.display = "none";
    document.getElementById("chipdeposit").classList.remove("in");
    this.setState({
      Chips:'',
      newParentChip: "",
      newCurrChip: "",
    })
  }

  closechipWithdrawalpopup = () => {
    document.getElementById("chipwithdrawal").style.display = "none";
    document.getElementById("chipwithdrawal").classList.remove("in");
    this.setState({
      Chips:'',
      newParentChip: "",
      newCurrChip: "",
    })
  }

  hasNumber = (num) => {
    return /\d/.test(num);
  };

  lowerCaseLetters = (char) => {
    var lowerCaseLetters = /[a-z]/g;
    if (char.match(lowerCaseLetters)) {
      return false;
    }
    else {
      return true;
    }
  };

  upperCaseLetters = (char) => {
    let upperCaseLetters = /[A-Z]/g;
    if (char.match(upperCaseLetters)) {
      return false;
    }
    else {
      return true;
    }
  };

  validateAddUser = async () => {

    ////////////////////// Validation for name ////////////////////////////////

    if (this.state.name === "") {
      await this.setState({
        reqMsg: "This is field is required !",
        naam: false,
      });
    } else {
      await this.setState({
        reqMsg: "",
        naam: true,
      });
    }

    ////////////////////// Validation for userName //////////////////////////////////

    let num = this.hasNumber(this.state.userName);
    if (this.state.userName !== "") {
      if (this.state.userName.length >= 4 && num) {
        // let char = this.state.userName[0];
        // let chL = this.lowerCaseLetters(char);
        // let chU = this.upperCaseLetters(char);
        // if (chU && chL) {
        //   await this.setState({
        //     reqID: "Userid must have 1st letter alphabet",
        //     userNaam: false,
        //   });
        // } else {
        //   await this.setState({
        //     reqID: "",
        //     userNaam: true,
        //   });
        // }
        await this.setState({
          reqID: "",
          userNaam: true,
        });
      } else {
        await this.setState({
          reqID: "Userid must have 4 characters & alpha-numeric",
          userNaam: false,
        });
      }
    } else {
      await this.setState({
        reqID: "This fields is required !",
        userNaam: false,
      });
    }

    /////////////////////// Validation for password ////////////////////////////

    if (this.state.password !== "") {
      if (this.state.password.length >= 4) {
        // let char = this.state.password[0];
        // let chU = this.upperCaseLetters(char);
        // if (chU) {
        //   await this.setState({
        //     reqPwd: "1st letter capital & length must be 8",
        //     pwd: false,
        //   });
        // } else {
        //   await this.setState({
        //     pwd: true,
        //     reqPwd: "",
        //   });
        // }
        await this.setState({
          pwd: true,
          reqPwd: "",
        });
      } else {
        await this.setState({
          reqPwd: "Password must have at least 4 character !",
          pwd: false,
        });
      }
    } else {
      await this.setState({
        reqPwd: "This fields is required !",
        pwd: false,
      });
    }

    if (this.state.naam && this.state.userNaam && this.state.pwd) {
      return true;
    } else {
      return false;
    }
  };

  save = async (userType) => {
    let data;
    let message;
    let path;
    let permit = await this.validateAddUser();
    if (permit === true) {
      if (this.state.masterUName) {
        data = {
          userName: this.state.userName,
          Name: this.state.name,
          password: this.state.password,
          admin: this.state.masterUName,
          Master: true,
          Commission: this.state.partner===""?0:this.state.partner,
        };
        message = "Master Added Successfully";
        path = "/master/" + this.state.masterUName;
      } 
      else {
        data = {
          userName: this.state.userName,
          Name: this.state.name,
          password: this.state.password,
          superadmin: JSON.parse(localStorage.getItem("data")).userName,
          Admin: true,
          Commission: this.state.partner===""?0:this.state.partner,
        };
        message = "Super Master Added Successfully";
        path = "supermaster";
      }

      this.users.createUser(data, (data) => {
        switch ('success') {
          case 'success':
            NotificationManager.success(message,"Success");
          break;
      }
    });
    this.getAllAdmin();
    if(userType==="superAddMaster"){
      document.getElementById('superAddUser').click();
    }
    else{
      window.location.href = path
      document.getElementById("addMaster").click();
    }
    }
  }

  setAction = () => {
    if (this.state.useraction == "mstrlock-0") {
      const obj = {
        userName: this.state.mName
      }
      this.users.lockunlock(obj, (data) => {
        switch ('success') {
          case 'success':
            NotificationManager.success("Supermaster Locked !","Success");
          break;
        }
        this.getAllAdmin();
      });
      this.setState({
        notifyMsg: ''
      });
    }
    else if (this.state.useraction == "mstrlock-1") {
      const obj1 = {
        userName: this.state.mName
      }
      this.users.lockunlock(obj1, (data) => {
        switch ('success') {
          case 'success':
              NotificationManager.success("Supermaster Unlocked !","Success");
              break;
      }
        this.getAllAdmin();
      });
      this.setState({
        notifyMsg: ''
      });
    }
    else if (this.state.useraction == "lgnusrlckbtng-0") {
      const obj2 = {
        userName: this.state.mName
      }
      this.users.lockingUnlockingBetting(obj2, (data) => {
        switch ('success') {
          case 'success':
              NotificationManager.success("Betting locked !","Success");
              break;
      }
        this.getAllAdmin();
        });
        this.setState({
          notifyMsg: ''
        });
    }
    else if (this.state.useraction == "lgnusrlckbtng-1") {
      const obj2 = {
        userName: this.state.mName
      }
      this.users.lockingUnlockingBetting(obj2, (data) => {
        switch ('success') {
          case 'success':
              NotificationManager.success("Betting Unlocked !","Success");
              break;
      }
        this.getAllAdmin();
        });
        this.setState({
          notifyMsg: ''
        });
    }
    else{
      const obj2 = {
        userName: this.state.mName
      }
      this.users.closeuser(obj2, (data) => {
        switch ('success') {
          case 'success':
              NotificationManager.success("User Account Close !","Success");
              break;
      }
        this.getAllAdmin();
        });
        this.setState({
          notifyMsg: ''
        });
    }
  }

  validateChangePassword = async () => {

    ///////////////////////////// validation for newPassword ///////////////////////////////

    if (this.state.newPassword !== "") {
      if (this.state.newPassword.length >= 4) {
        // let char = this.state.newPassword[0];
        // let chU = this.upperCaseLetters(char);
        // if (chU) {
        //   await this.setState({
        //     reqNewPwd: "1st letter capital & length must be 8",
        //     Npwd: false,
        //   });
        // } else {
        //   await this.setState({
        //     Npwd: true,
        //     reqNewPwd: "",
        //   });
        // }
        await this.setState({
          Npwd: true,
          reqNewPwd: "",
        });
      } else {
        await this.setState({
          reqNewPwd: "Password must have at least 4 character !",
          Npwd: false,
        });
      }
    } else {
      await this.setState({
        reqNewPwd: "This fields is required !",
        Npwd: false,
      });
    }

    /////////////////////////// validation for confirm_password ///////////////////////////////

    if (this.state.confirm_password !== "") {
      if (this.state.confirm_password.length >= 4) {
        // let char = this.state.confirm_password[0];
        // let chU = this.upperCaseLetters(char);
        // if (chU) {
        //   await this.setState({
        //     reqConfirmPwd: "1st letter capital & length must be 8",
        //     Cpwd: false,
        //   });
        // } else {
        //   await this.setState({
        //     Cpwd: true,
        //     reqConfirmPwd: "",
        //   });
        // }
        await this.setState({
          Cpwd: true,
          reqConfirmPwd: "",
        });
      } else {
        await this.setState({
          reqConfirmPwd: "Password must have at least 4 character !",
          Cpwd: false,
        });
      }
    } else {
      await this.setState({
        reqConfirmPwd: "This fields is required !",
        Cpwd: false,
      });
    }

    if (this.state.newPassword !== this.state.confirm_password) {
      this.setState({
        notEqualMsg: "new password not equal to confirm password",
        eqlOrNot: false
      })
    } else {
      this.setState({
        notEqualMsg: "",
        eqlOrNot: true
      })
    }

    if (this.state.Npwd && this.state.Cpwd && this.state.eqlOrNot) {
      return true
    }
    else {
      return false
    }
  }

  updatePass = async () => {
    let permitGranted = await this.validateChangePassword();
    if (permitGranted === true) {
      if (this.state.username && this.state.confirm_password) {
        const obj = {
          userName: this.state.username,
          password: this.state.confirm_password,
        }
        this.users.changePassword(obj, (data) => {
          document.getElementById("newPassword").value = "";
          document.getElementById("confirm_password").value = "";
          switch ('success') {
            case 'success':
                NotificationManager.success(data.data.message,"Success");
                break;
        }
        this.closePasswordpopup();
          });
          this.setState({
            notifyMsg: ''
          });
        };
      }
    }

  view_account = async (user) => {
    await this.setState({
      userdetails: user,
    });
    // document.getElementById("viewinfo").classList.add("in");
    // document.getElementById("viewinfo").style.display = "block";
    document.getElementById("viewinfo").classList.add("in");
    document.getElementById("viewinfo").style.display = "block";
    const obj = {
      id: this.state.userdetails.id
    }
    this.users.userSportsInfo(obj, (data) => {
      this.setState({
        userInfo: data.data,
      });
    });
  }

  closeviewinfo = () => {
    document.getElementById("viewinfo").style.display = "none";
    document.getElementById("viewinfo").classList.remove("in");
  }

  handleNotifyMsgClean = () => {
    this.setState({
      reqPwd: '',
      reqID: '',
      reqMsg: '',
      userName:"",
      name: "",
      password: "",
      partner: "",
    });
    document.getElementById("superAddUser").click();
  }

  handleSearch = (e) => {
    let dataArray = [...this.state.searchFilter];
    let searchUser = e.target.value.toLowerCase();
    const updateList = dataArray.filter((user) =>
      user.userName.toLowerCase().includes(searchUser)
    );
    this.setState({ data: updateList });
  };

  paginate = (pageNumber) => {
    this.setState({
      currentPage:pageNumber
    })
  }

  render() {
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = this.state.data?.slice(indexOfFirstPost, indexOfLastPost);
    return (
      <div>
        <Navbar />
        <Sidebar />
        <NotificationContainer/>
        <div className="forModal" />
      {
        this.state.load ?
        <div style={{height:'100vh', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
            <Loader type="Grid" color="#6c1945" height={100} width={100} />
        </div> :
        <div className="container body">
          <div className="main_container" id="sticky">
            <div id="userModal" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content"></div>
              </div>
            </div>
            <div className="right_col" role="main">
              <div className="col-md-12">
                <div className="title_new_at">

                  {
                    ////////////////////////////////// HEADER OF MASTER LISTING /////////////////////////////////
                  }

                  <span className="lable-user-name">Supermaster&nbsp;</span>
                  <select className="user-select" name="postsPerPage" onChange={this.handleChange} style={{ color: "black", margin: "auto" }} >
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                    {this.state.data.length>100&&
                      <option>{this.state.data.length}</option>
                    }
                  </select>&nbsp;
                  <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="userList" />
                  <form className="usersech user-mobile" id="formSubmit">
                    <input type="hidden" name="compute" defaultValue="fe6602731bf3d65605f0d8f6552a1c9f" /><input type="hidden" name="getUserType" id="getUserType" defaultValue={3} />
                    <input type="hidden" name="parentID" id="parentID" /><input type="hidden" name="formSubmit" defaultValue={1} /><input type="hidden" name="perpage" id="perpage" />

                    <input type="text" name="mstruserid" style={{ marginLeft: "5px" }} id="mstruserid" placeholder="Search here" onChange={this.handleSearch} />
                  </form>
                  <select className="user-mobile custom-user-select" name="useraction" id="useraction" onChange={this.handleChange} style={{ color: "black", margin: "auto" }} >
                    <option value>Select Action</option>
                    <option value="lgnusrlckbtng-0">Lock Betting</option>
                    <option value="lgnusrlckbtng-1">Open Betting</option>
                    <option value="mstrlock-0">Lock User</option>
                    <option value="mstrlock-1">Unlock User</option>
                    <option value="lgnusrCloseAc-0">Close User Account</option>
                  </select>
                  <button className="btn btn-warning btn-xs" onClick={this.setAction} style={{ padding: "5px", marginLeft: "4px" }} >
                    ACTION
                  </button>
                  <span id="superAddUser" data-toggle="modal" data-target="#exampleModalAddSuperMaster"></span>
                  <button className="btn btn-warning btn-xs" onClick={this.handleNotifyMsgClean}  style={{ padding: "5px", marginLeft: "2px", marginRight: "2px", }} >
                    ADD USER
                  </button>
                  <button className="btn btn-warning btn-xs " style={{ padding: "5px", marginTop: "2px" }} onClick={() => { this.props.history.goBack(); }} >
                    Back
                  </button>

                  {
                    ////////////////////////////// MODAL FOR ADD USER /////////////////////////////////////////
                  }

                  <div className="modal fade" id="exampleModalAddSuperMaster" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Add SuperMaster
                          </h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          {/* <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div> */}
                          <div class="row">
                            <div class="col-md-4 col-xs-6">
                              <label> Name *</label>
                              <input type="text" name="name" value={this.state.name} onChange={this.handleChange} class="form-control" id="left_master_name" autocomplete="off" />
                              <span id="left_master_nameN" class="errmsg"> {this.state.reqMsg ? this.state.reqMsg : null} </span>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <label> Registration Data </label>
                              <input type="text" name="FromDate" class="form-control" id="Fleft_romDate" autocomplete="off" value={this.currentDate} readonly="" />
                              <span id="left_FromDateN" class="errmsg"></span>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <label> User ID *</label>
                              <input type="text" name="userName" value={this.state.userName} onChange={this.handleChange} class="form-control" id="left_username" />
                              <span id="left_usernameN" class="errmsg"> {this.state.reqID ? this.state.reqID : null} </span>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <label> Password *</label>
                              <input type="password" name="password" value={this.state.password} onChange={this.handleChange} class="form-control" id="left_password" autocomplete="off" />
                              <span id="left_passwordN" class="errmsg"> {this.state.reqPwd ? this.state.reqPwd : null} </span>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <label id="partnerMAx">Partnership [0]</label>&nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnership"></span>
                              <input type="number" name="partner" value={this.state.partner} onChange={this.handleChange} class="form-control" id="left_partner" placeholder="%" max="100" min="0" autocomplete="off" />
                              <span id="left_partnerN" class="errmsg"></span>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <label id="partnershipCasino"> partnership Casino [ 0] </label> &nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnershipCasino"></span>
                              <input type="number" name="partnershipCasino" readonly="" class="form-control" id="left_partnershipCasino" max="100" min="0" autocomplete="off" value="0" />
                              <span id="left_partnerCasinoN" class="errmsg" ></span>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <label id="partnershipLiveTennPatti"> Partnership TeenPatti [ 0] </label> &nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnershipLiveTennPatti"></span>
                              <input type="number" name="partnershipLiveTennPatti" readonly="" class="form-control" id="left_partnershipLiveTennPatti" max="100" min="0" autocomplete="off" value="0" />
                              <span id="left_partnerLiveTennPattiN" class="errmsg" ></span>
                            </div>
                            <div class="col-md-12 col-xs-6 modal-footer">
                              {
                                JSON.parse(localStorage.getItem("data")).superAdmin ? 
                                <button type="button" class="blue_button Addsuper1" onClick={()=>this.save("superAddMaster")} id="child_player_add" >Add</button> : null
                              }
                              <button data-dismiss="modal" type="button" class="red_button" >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="clearfix" />
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading" />

                  {
                    /////////////////////////////// TABLE OF SUPER MASTER //////////////////////////////////////////// 
                  }

                  <div className="custom-scroll appendAjaxTbl">
                    <table className="table table-striped jambo_table bulk_action" id="datatabless">
                      <thead>
                        <tr className="headings">
                          {
                            this.state.tableHead.map((item, index) => <th className="text-center" key={index}><b>{item}</b></th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                         currentPosts && currentPosts.length > 0 ?
                         currentPosts.map((item, index) => {
                              return (
                                <tr id="user_row_152052">
                                  <td className="text-center">
                                    {indexOfFirstPost+index+1}
                                    <input type="checkbox" name="mName" onChange={this.handleChange} value={item.userName} className="select-users" />
                                  </td>
                                  <td className="text-center" style={{ paddingBottom: "0px" }}>
                                    <span className="m-bg">
                                      <Link to={"/master/" + item.userName} title="View Child">{item.userName}</Link>&nbsp;
                                      {item.status ? <i class="fa fa-user fa_custom fa-2x" title="locked" aria-hidden="true" style={{ color: "red" }} /> : null}
                                      {item.enableBetting ? <i class="fa fa-lock fa_custom fa-2x" title="Betting Locked" aria-hidden="true" style={{ color: "red" }} /> : null}
                                    </span>
                                  </td>
                                  <td className="text-center">LordsExch2</td>
                                  <td className="text-center">{item.freeChips}</td>
                                  <td className="text-center">{item.creditGiven}</td>
                                  <td className="text-center">{item.walletBalance.toFixed(2)}</td>
                                  <td className="text-center">0%</td>
                                  <td className="text-center">0%</td>
                                  <td className="text-center">0%</td>
                                  <td className="text-center">{item.Commission}</td>
                                  <td className="text-center">0.00</td>
                                  <td className="last">
                                    <span className="dropdown">
                                      <Link className="dropdown-toggle btn btn-xs btn-success" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" >View More
                                        <span className="caret" />
                                      </Link>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <Link className data-toggle="modal" masterName={item.userName} data-target="#commonpopup" onClick={() => this.addUser(item.userName)} >
                                            <span>Add User</span>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to={"/cacstatement/" + item.userName}>Statement</Link>
                                        </li>
                                        <li>
                                          <Link to={"/profitloss/" + item.userName}>Profit Loss</Link>
                                        </li>
                                        <li>
                                          <Link className title="View Account Info" onClick={() => this.view_account(item)} >
                                            <span>View Info</span>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link className title="Change Password" onClick={() => this.view_change_passs(item)} >
                                            <span>Change Password</span>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link className title="Free Chip In Out" onClick={() => this.openChipDeposit(item)} >
                                            <span>Free Chip Deposit</span>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link className title="Free Chip In Out" onClick={() => this.openChipWithdrawal(item)} >
                                            <span>Free Chip Withdrawal</span>
                                          </Link>
                                        </li>
                                      </ul>
                                    </span>
                                  </td>
                                </tr>
                              );
                            }) :
                            <tr>
                              <td colSpan={12} className="text-center">No Records Found...</td>
                            </tr>
                        }
                      </tbody>
                      {
                        currentPosts.length > 0 ?
                        <tfoot>
                          <tr>
                            <td className="text-center" colSpan={12}>Total Balance: {this.state.totalBalance.toFixed(2)}</td>
                          </tr>
                          {/* <tr>
                            <td colSpan={12}>
                                <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.data.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                            </td>  
                          </tr>  */}
                        </tfoot>:null
                      }
                    </table>
                    <p id="paginateClick" className="pull-right pagination-row dataTables_paginate paging_simple_numbers" />
                  </div>
                </div>
              </div>
            </div>

            {
              //////////////////////////////////////// MODAL FOR VIEW_INFO-ADD USER ///////////////////////////////////////////
            }

            <div id="commonpopup" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="popup_form">
                    <div className="title_popup">
                      <span>Add Master</span>
                      <button type="button" className="close" data-dismiss="modal" >
                        <div className="close_new"><i className="fa fa-ties-circle" /></div>
                      </button>
                    </div>
                    <div className="content_popup">
                      <div className="popup_form_row">
                        {/* <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div> */}
                        <div className="modal-body">
                          <div className="row">
                            <div className="col-md-4 col-xs-6">
                              <label> Name*</label>
                              <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control" id="left_master_name" autocomplete="off" />
                              <span id="left_master_nameN" className="errmsg"> {this.state.reqMsg ? "*" + this.state.reqMsg : null} </span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> Registration Data </label>
                              <input type="text" name="FromDate" className="form-control" id="Fleft_romDate" autocomplete="off" value={this.currentDate} readonly="" />
                              <span id="left_FromDateN" className="errmsg" ></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> User ID* </label>
                              <input type="text" name="userName" value={this.state.userName} onChange={this.handleChange} className="form-control" id="left_username" />
                              <span id="left_usernameN" className="errmsg"> {this.state.reqID ? "*" + this.state.reqID : null} </span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> Password*</label>
                              <input type="password" name="password" value={this.state.password} onChange={this.handleChange} className="form-control" id="left_password" autocomplete="off" />
                              <span id="left_passwordN" className="errmsg"> {this.state.reqPwd ? "*" + this.state.reqPwd : null} </span>
                            </div>
                            <div class="col-md-4 col-xs-6">
                              <label id="partnerMAx">Commission</label>&nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnership"></span>
                              <input type="number" name="partner" value={this.state.partner} onChange={this.handleChange} class="form-control" id="left_partner" placeholder="%" max="100" min="0" autocomplete="off" />
                              <span id="left_partnerN" class="errmsg"></span>
                            </div>
                            <div className="col-md-12 col-xs-6 modal-footer">
                              <span id="addMaster" data-dismiss="modal"></span>
                              <button type="button" className="blue_button Addsuper1" onClick={()=>this.save("addMaster")} id="child_player_add" >
                                Add
                              </button>
                              <button data-dismiss="modal" type="button" className="red_button" >
                                Cancel
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

            {
              ////////////////////////////////////////// MODAL FOR CHANGE PASSWORD ///////////////////////////////////
            }

            <div id="masterpasswordpopup" class="modal fade" role="dialog">
              <div class=" " id="changeUserPassword" role="main">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <button type="button" class="close" onClick={this.closePasswordpopup} data-dismiss="modal" > × </button>
                      <h4 class="modal-title">Change Password</h4>
                    </div>
                    {/* <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div> */}
                    <div class="modal-body">
                      <div id="PassUserMsg"></div>
                      <div class="row">
                        <form id="ChangePassword" method="post" autocomplete="off" >
                          <input type="hidden" name="compute" value="e34250a537dafd7d93f9f0827c207d74" />
                          <span id="msg_error"></span>
                          <span id="errmsg"></span>
                          <input type="hidden" name="userId" value="155374" />
                          <div class="col-md-6 col-xs-6">
                            <label>New Password</label>
                            <input type="password" name="newPassword" class="form-control" onChange={this.handleChange} id="newPassword" autocomplete="off" />
                            <span id="newPasswordN" class="errmsg">{this.state.reqNewPwd ? "*" + this.state.reqNewPwd : null}</span>
                          </div>
                          <div class="col-md-6 col-xs-6">
                            <label>Confirm Password</label>
                            <input type="password" name="confirm_password" class="form-control" onChange={this.handleChange} id="confirm_password" autocomplete="off" />
                            <span id="confirm_passwordN" class="errmsg">{this.state.reqConfirmPwd ? "*" + this.state.reqConfirmPwd : null}</span>
                          </div>
                          <div style={{ marginLeft: '20px ', color: 'red' }}> {this.state.notEqualMsg ? "*" + this.state.notEqualMsg : null} </div>
                          <div class="col-md-12 col-xs-6 modal-footer">
                            <button type="button" class="blue_button" onClick={this.updatePass} id="change_pass" >
                              Change
                            </button>
                            <button data-dismiss="modal" onClick={this.closePasswordpopup} type="button" class="red_button" >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {
              ///////////////////////////////////// MODAL FOR CHIP DEPOSIT //////////////////////////////////////////
            }

            <div id="chipdeposit" class="modal fade in" role="dialog" style={{ display: "none" }} >
              <div class=" " id="changeUserPassword" role="main">
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-header" style={{ background: "#6c1945", color: "white" }}>
                      <button type="button" class="close" data-dismiss="modal" onClick={this.closechipDepositpopup} > × </button>
                      <h4 class="modal-title">
                        <span id="tital_change"> Free Chips In/Out {this.state.username} </span>
                      </h4>
                    </div>
                    {/* <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div> */}
                    <div class="modal-body">
                      <div class="row">
                        <div id="UpdateChipsMsg"></div>
                        <form id="UpdateFreeChips" method="post">
                          <span id="msg_error"></span> <span id="errmsg"></span>
                          <div class="col-md-6">
                            <label> Free Chips : </label>
                            <input type="text" name="Chips" class="form-control" value={this.state.Chips} onChange={this.handleChange} autoComplete="off" required="" />
                            <span id="ChipsN" class="errmsg"></span>
                          </div>
                          <div class="col-md-12">
                            <div class="tabel_content ">
                              <table class="table-bordered">
                                <tbody>
                                  <tr>
                                    <td>Parant Free Chips</td>
                                    <td class="font-bold"> {this.state.walletBalance} </td>
                                  </tr>
                                  <tr>
                                    <td>User Balance </td>
                                    <td class="font-bold"> {this.state.userdetails.walletBalance} </td>
                                  </tr>
                                  <tr>
                                    <td>Parant New Free Chips</td>
                                    <td> <span id="ParantNewFreeChips"> {this.state.newParentChip} </span> </td>
                                  </tr>
                                  <tr>
                                    <td> {this.state.username} New Free Chips </td>
                                    <td> <span id="myNewFreeChips"> {this.state.newCurrChip} </span> </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div class="col-md-12 modal-footer">
                            <button type="button" class="btn btn-success pull-right chip-inout-button" onClick={this.update_free_chips} style={{ background: "#6c1945", color: "white" }}>
                              Deposit
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {
              //////////////////////////////////// MODAL FOR CHIP WITHDRAWL //////////////////////////////////////
            }

            <div id="chipwithdrawal" class="modal fade in" role="dialog" style={{ display: "none" }} >
              <div class=" " id="changeUserPassword" role="main">
                <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                    <div class="modal-header" style={{ background: "#6c1945", color: "white" }}>
                      <button type="button" class="close" data-dismiss="modal" onClick={this.closechipWithdrawalpopup} > × </button>
                      <h4 class="modal-title">
                        <span id="tital_change"> Free Chips In/Out {this.state.username} </span>
                      </h4>
                    </div>
                    {/* <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div> */}
                    <div class="modal-body">
                      <div class="row">
                        <div id="UpdateChipsMsg"></div>
                        <form id="UpdateFreeChips" method="post">
                          <input type="hidden" name="compute" value="931cdfb53a4885ba8f0f9fb6be92ade8" />
                          <span id="msg_error"></span> <span id="errmsg"></span>
                          <div class="col-md-6">
                            <label> Free Chips : </label>
                            <input type="text" name="Chips" class="form-control" value={this.state.Chips} onChange={this.handleChange} autoComplete="off" required="" />
                            <span id="ChipsN" class="errmsg"></span>
                          </div>
                          <div class="col-md-12">
                            <div class="tabel_content ">
                              <table class="table-bordered">
                                <tbody>
                                  <tr>
                                    <td>Parant Free Chips</td>
                                    <td class="font-bold">{this.state.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>User Balance </td>
                                    <td class="font-bold">{this.state.userdetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>Parant New Free Chips</td>
                                    <td><span id="ParantNewFreeChips">{this.state.newParentChip}</span></td>
                                  </tr>
                                  <tr>
                                    <td> {this.state.username} New Free Chips </td>
                                    <td><span id="myNewFreeChips">{this.state.newCurrChip}</span></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div class="col-md-12 modal-footer">
                            <button type="button" class="red_button pull-right chip-inout-button" onClick={this.update_free_chips} style={{ background: "#6c1945", color: "white" }}>
                              withdrawal
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {
              /////////////////////////////// MODAL FOR VIEW INFO //////////////////////////////////////////////////
            }

            <div id="viewinfo" class="modal fade" role="dialog" style={{ display: "none" }} >
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header" style={{ background: "#6c1945", color: "white" }}>
                    <button type="button" class="close" onClick={this.closeviewinfo} data-dismiss="modal" > &times; </button>
                    <h4 class="modal-title">
                      <span id="tital_change"> Account of {this.state.userdetails.userName} </span>
                    </h4>
                  </div>
                  <div class="modal-body">
                    <div class="row">
                      <div class="sub_heading">
                        <span id="tital_change">User </span>{" "}
                      </div>
                      <form>
                        <div class="col-md-4 col-xs-6">
                          <label>User ID</label>
                          <input type="text" class="form-control" value={this.state.userdetails.userName} name="userID" readOnly />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label>User Name</label>
                          <input type="text" class="form-control" name="Name" defaultValue={this.state.userdetails.Name} onChange={this.handleChange} />
                        </div>
                        <div class="col-md-4 col-xs-12">
                          <label>Update From General Setting</label> <br />

                          <input type="checkbox" name="usercheck" value="1" checked />
                        </div>
                        <div class="col-md-12 col-xs-12 modal-footer">
                          <button type="button" class="blue_button submit_user_setting" onClick={() => this.submit_userInfo()} >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                    <div class="sub_heading"> <span id="tital_change">Cricket </span> </div>
                    <div class="row">
                      <form>
                        <div class="col-md-4 col-xs-6">
                          <label> MIN STAKE</label>
                          <input type="text" name="min_stake" defaultValue={this.state.userInfo.cricketminStacks} onChange={this.handleChange} class="form-control" id="4_min_stake" />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label> Max STAKE </label>
                          <input type="text" name="max_stake" defaultValue={this.state.userInfo.cricketmaxStacks} onChange={this.handleChange} class="form-control" id="4_max_stake" />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label> MAX PROFIT </label>
                          <input type="text" name="max_profit" defaultValue={this.state.userInfo.cricketmaxProfit} onChange={this.handleChange} class="form-control" id="4_max_profit" />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label> Max Loss </label>
                          <input type="text" name="max_loss" defaultValue={this.state.userInfo.cricketmaxLoss} onChange={this.handleChange} class="form-control" id="4_max_loss" />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label> PRE INPLAY PROFIT</label>
                          <input type="text" name="PIP" defaultValue={this.state.userInfo.cricketPreInplayProfit} onChange={this.handleChange} class="form-control" id="4_pre_innplay_profit" />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label> PRE INPLAY STAKE</label>
                          <input type="text" name="PIS" defaultValue={this.state.userInfo.cricketPreInplayStack} onChange={this.handleChange} class="form-control" id="4_pre_inplay_stake" />
                        </div>

                        <div class="col-md-4 col-xs-6">
                          <label> MIN ODDS</label>
                          <input type="text" name="min_odds" defaultValue={this.state.userInfo.cricketminOdds} onChange={this.handleChange} class="form-control" id="4_min_odds" />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label> MAX ODDS</label>
                          <input type="text" name="max_odds" defaultValue={this.state.userInfo.cricketmaxOdds} onChange={this.handleChange} class="form-control" id="4_max_odds" />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label>UNMATCH BET</label>
                          <input type="checkbox" name="sport[is_unmatch_bet]" /> <br />
                        </div>
                        <div class="col-md-4 col-xs-6">
                          <label> LOCK BET</label>
                          <input type="checkbox" name="sport[lock_bet]" />{" "}
                          <br />
                        </div>
                        <div class="col-md-12 col-xs-12 modal-footer">
                          <button type="button" class="blue_button submit_user_setting" id="update-4-setting" onClick={this.submit_info} style={{ background: "#6c1945", color: "white" }}>
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
        <Footer />
      </div>
    );
  }
}
