import React, { Component } from "react";
import Pagination from './Pagination'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Loader from 'react-loader-spinner'
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Utilities from "./utilities";
import Users from "../Services/users";
import { Link } from "react-router-dom";
import Footer from './footer'

export default class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage:1,
      postsPerPage:10,
      load:false,
      tableHead: ["S.No", "User_ID", "Website", "Master", "Winnings", "Credit_Limits", "Exposure", "Balance", "M.comm", "S.comm", "View More"],
      Cpwd: '',
      msgBox: 'none',
      Npwd: '',
      notEqualMsg: "",
      eqlOrNot: '',
      confirm_password: '',
      newPassword: '',
      data: [],
      redirectToReferrer: false,
      newPassword: "",
      confirm_password: "",
      username: "",
      usermasterName: "",
      selecteduser: "",
      useraction: "",
      userdetails: "",
      newParentChip: "",
      newCurrChip: "",
      isDeposit: false,
      Chips: "",
      masterDetails: "",
      userInfo: "",
      soccerInfo: "",
      tennisInfo: "",
      fancyInfo:"",
      Name: "",
      max_stake: "",
      min_stake: "",
      max_profit: "",
      max_loss: "",
      PIP: "",
      PIS: "",
      min_odds: "",
      max_odds: "",
      unmatch_bet:"",
      lock_bet:"",
      parentdetails: "",
      searchFilter: [],
      totalBalance: 0,
      tabOn:"cricket",
      fancymaxStacks:"",
      fancyminStacks:"",
      fancymaxProfit:"",
      fancyBetDelay:"",
      manualfancymaxStacks:"",
      manualfancyminStacks:"",
      manualfancymaxProfit:"",
      manualfancyBetDelay:"",
      objID:"",
      expoData:[],
    };
    this.users = new Users();
    this.currentDate = Utilities.formatDate(new Date());
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    })
    if (this.state.isDeposit) {
      if (!isNaN(this.state.masterDetails)) {
        this.state.masterDetails = this.state.parentdetails;
      }
      this.setState({
        newParentChip: this.state.masterDetails.walletBalance - parseInt(event.target.value),
        newCurrChip: this.state.userdetails.walletBalance + parseInt(event.target.value),
      })
    }
    else {
      if (!isNaN(this.state.masterDetails)) {
        this.state.masterDetails = this.state.parentdetails;
      }
      this.setState({
        newParentChip: this.state.masterDetails.walletBalance + parseInt(event.target.value),
        newCurrChip: this.state.userdetails.walletBalance - parseInt(event.target.value),
      })
    }
  }

  handleSearch = (e) => {
    let dataArray = [...this.state.searchFilter];
    let searchUser = e.target.value.toUpperCase();
    const updateList = dataArray.filter((user) => user.userName.toUpperCase().includes(searchUser))
    this.setState({
      data: updateList
    })
  };

  supervisorBasedUser = () => {
    let info = JSON.parse(localStorage.getItem('data'))
    let propName = this.props?.match?.params?.username?this.props?.match?.params?.username:undefined
    if(propName===undefined){
    if(this.props.match.params.username ? this.props.match.params.username : info.Admin){
      this.setState({
        load:true
      })
      this.users.getAllUserBasedOnSuperMaster(info.userName, (data) => {
        let sortdata = data.data.data.sort((a,b)=>{
          const aDate = new Date(a.createdAt)
          const bDate = new Date(b.createdAt)
          return bDate.getTime() - aDate.getTime()
        })
        this.setState({
          data: sortdata,
          searchFilter: data.data,
        });
        let totalBalance = 0;
        this.state.data.map((ele) => totalBalance += ele.walletBalance);
        this.setState({
          totalBalance,
        load:false
        });
      });
      const obj = {
        userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem("data")).userName,
      }
      this.users.getMyprofile(obj, (data) => {
        this.setState({
          masterDetails: data.data,
        })
      });
    }
    else if (this.props.match.params.username || JSON.parse(localStorage.getItem("data")).Master) {
      this.setState({
        load:true
      })
      this.users.getUsersforMaster(this.props.match.params.username, (data) => {
        let sortdata = data.data.sort((a,b)=>{
          const aDate = new Date(a.createdAt)
          const bDate = new Date(b.createdAt)
          return bDate.getTime() - aDate.getTime()
        })
        this.setState({
          data: sortdata,
          searchFilter: sortdata,
        });
        let totalBalance = 0;
        this.state.data.map((ele) => totalBalance += ele.walletBalance);
        this.setState({
          totalBalance,
        load:false
        });
      });
      const obj = {
        userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem("data")).userName,
      }
      this.users.getMyprofile(obj, (data) => {
        this.setState({
          masterDetails: data.data,
        })
      });
    }
    else {
      this.setState({
        load:true
      })
      this.users.getAllusers((data) => {
        let sortdata = data.data.sort((a,b)=>{
          const aDate = new Date(a.createdAt)
          const bDate = new Date(b.createdAt)
          return bDate.getTime() - aDate.getTime()
        })
        this.setState({
          data: sortdata,
          searchFilter: sortdata,
        });
        let totalBalance = 0;
        this.state.data.map((ele) => totalBalance += ele.walletBalance);
        this.setState({
          totalBalance,
          load:false
        });
      });
    }
  }
  else{
    this.setState({
      load:true
    })
    this.users.getUsersforMaster(this.props.match.params.username, (data) => {
      let sortdata = data.data.sort((a,b)=>{
        const aDate = new Date(a.createdAt)
        const bDate = new Date(b.createdAt)
        return bDate.getTime() - aDate.getTime()
      })
      this.setState({
        data: sortdata,
        searchFilter: sortdata,
      });
      let totalBalance = 0;
      this.state.data.map((ele) => totalBalance += ele.walletBalance);
      this.setState({
        totalBalance,
      load:false
      });
    });
    const obj = {
      userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem("data")).userName,
    }
    this.users.getMyprofile(obj, (data) => {
      this.setState({
        masterDetails: data.data,
      })
    });
  }
  }

  componentDidMount() {
    let infoDetails = JSON.parse(localStorage.getItem('data'));
    this.exposureDistribution(infoDetails.userName);
    if(infoDetails.superAdmin === infoDetails.Admin === infoDetails.Master === false){
      this.props.history.push('/dashboard')
    }
    else{
      this.supervisorBasedUser();
    }
  }

  view_change_passs = (userdetails) => {
    this.setState({
      username: userdetails.userName,
      userdetails: userdetails,
    });
    document.getElementById("userpasswordpopup").classList.add("in");
    document.getElementById("userpasswordpopup").style.display = "block";
  }

  update_free_chips = () => {
    if (this.state.isDeposit) {
      const obj = {
        userid: this.state.userdetails.id,
        fillAmount: this.state.Chips
      }
      this.users.creditbyUser(obj, "creditAmountByMaster", (Data) => {
        // const obj1 = {
        //   userName: JSON.parse(localStorage.getItem("data")).userName
        // }
        // this.users.getMyprofile(obj1, (data) => {
        //   this.setState({
        //     notifyMsg: Data.data.message
        //   });
        //   setTimeout(() => {
        //     localStorage.setItem("data", JSON.stringify(data.data));
        //     window.location.reload();
        //   }, 1000)
        // });
      });
      switch ('success') {
        case 'success':
          NotificationManager.success("Credit successfully  !","Success");
        break;
      }
      this.supervisorBasedUser();
      this.closechipDepositpopup();
    }
    else {
      const obj = {
        userid: this.state.userdetails.id,
        fillAmount: this.state.Chips
      }
      this.users.debitbyUser(obj, "debitAmountByMaster", (Data) => {
        // const obj1 = {
        //   userName: JSON.parse(localStorage.getItem("data")).userName
        // }
        // this.users.getMyprofile(obj1, (data) => {
        //   this.setState({
        //     notifyMsg: Data.data.message
        //   });
        //   setTimeout(() => {
        //     localStorage.setItem("data", JSON.stringify(data.data));
        //     window.location.reload();
        //   }, 1000)
        // });
      });
      switch ('success') {
        case 'success':
          NotificationManager.success("Debited successfully...!","Success");
        break;
      }
      this.supervisorBasedUser();
      this.closechipWithdrawalpopup();
    }
  }

  openChipDeposit = (userdetails) => {
    const obj = {
      userName: userdetails.master
    }
    this.users.getMyprofile(obj, (data) => {
      this.setState({
        parentdetails: data.data,
      });
    });
    this.setState({
      username: userdetails.userName,
      userdetails: userdetails,
      isDeposit: true,
    });
    document.getElementById("chipdeposit").classList.add("in");
    document.getElementById("chipdeposit").style.display = "block";
  }

  openChipWithdrawal = (userdetails) => {
    this.users.getMyprofile({ userName: userdetails.master }, (data) => {
      this.setState({
        parentdetails: data.data,
      });
    });
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
      reqNewPwd:"",
      reqConfirmPwd:"",
      notEqualMsg:""
    })
    document.getElementById("userpasswordpopup").style.display = "none";
    document.getElementById("userpasswordpopup").classList.remove("in");
  }

  closechipDepositpopup = () => {
    document.getElementById("chipdeposit").style.display = "none";
    document.getElementById("chipdeposit").classList.remove("in");
    this.setState({
      newParentChip: "",
      newCurrChip: "",
      Chips:""
    })
  }

  closechipWithdrawalpopup = () => {
    document.getElementById("chipwithdrawal").style.display = "none";
    document.getElementById("chipwithdrawal").classList.remove("in");
    this.setState({
      newParentChip: "",
      newCurrChip: "",
      Chips:""
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

  validateChangePassword = async () => {
    ///////////////////////////// validation for newPassword //////////////////////////////////

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

    /////////////////////////////////// validation for confirm_password ////////////////////////////////

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

  savePass = async () => {
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
      }
    }
  }

  save = () => {
    let path;
    let data = {
      userName: this.state.userName,
      Name: this.state.name,
      password: this.state.password,
      master: JSON.parse(localStorage.getItem("data")).userName,
    };
    this.users.createUser(data, (data) => {
      this.setState({
        notifyMsg: "User Added Successfully"
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    });
  }

  setAction = () => {
    if (this.state.useraction == "mstrlock-0") {
      const obj = {
        userName: this.state.selecteduser
      }
      this.users.lockunlock(obj, (data) => {
        switch ('success') {
          case 'success':
            NotificationManager.success("User locked successfully...!","Success");
          break;
        }
        this.supervisorBasedUser();
      });
    }
    else if (this.state.useraction == "mstrlock-1") {
      const obj = {
        userName: this.state.selecteduser
      }
      this.users.lockunlock(obj, (data) => {
        switch ('success') {
          case 'success':
            NotificationManager.success("User unlocked successfully...!","Success");
          break;
        }
        this.supervisorBasedUser();
      });
    }
    else if (this.state.useraction == "lgnusrCloseAc-0") {
      const obj = {
        userName: this.state.selecteduser
      }
      this.users.closeuser(obj, (data) => {
        switch ('success') {
          case 'success':
            NotificationManager.success("User close successfully...!","Success");
          break;
        }
        this.supervisorBasedUser();
      });
    }
    else if (this.state.useraction == "lgnusrlckbtng-0") {
      const obj = {
        userName: this.state.selecteduser
      }
      this.users.lockingUnlockingBetting(obj, (data) => {
        switch ('success') {
          case 'success':
            NotificationManager.success("Betting locked successfully...!","Success");
          break;
        }
        this.supervisorBasedUser();
      });
    }
    else if (this.state.useraction == "lgnusrlckbtng-1") {
      const obj = {
        userName: this.state.selecteduser
      }
      this.users.lockingUnlockingBetting(obj, (data) => {
        switch ('success') {
          case 'success':
            NotificationManager.success("Betting unlocked successfully...!","Success");
          break;
        }
        this.supervisorBasedUser();
      });
    }
  }

  view_account = async (user) => {
    await this.setState({
      userdetails: user,
    })
    document.getElementById("viewinfo").classList.add("in");
    document.getElementById("viewinfo").style.display = "block";
    //cricket,fancy,tennis,soccer
    const obj = {
      userId:user.userName,
      id: this.state.userdetails.id,
      type:"cricket"
    }
    this.users.userSportsInfo(obj, (data) => {
      this.setState({
        userInfo: data.data,
        objID:data.data._id
      });
    });
  }

  sportsTabData =  (tab) => {
    const obj = {
      id: this.state.userdetails.id,
      userId: this.state.userdetails.userName,
      type:tab
    }
    if(tab==="cricket"){
    this.users.userSportsInfo(obj, async(data) => {
      await this.setState({
        userInfo: data.data,
        objID:data.data._id
      });
    });
  }
  else if(tab==="fancy"){
    this.users.userSportsInfo(obj,async(data) => {
      await this.setState({
        fancyInfo: data.data,
        objID:data.data._id
      });
    });
  }
  else if(tab==="soccer"){
    this.users.userSportsInfo(obj,async(data) => {
      await this.setState({
        soccerInfo: data.data,
        objID:data.data._id
      });
    });
  }
  else{
    this.users.userSportsInfo(obj,async(data) => {
      await this.setState({
        tennisInfo: data.data,
        objID:data.data._id
      });
    });
  }
  }

  submit_info = (fancyType) => {
    const obj={
      userId:  this.state.userdetails.userName,
      id: this.state.objID
    };
      if(this.state.tabOn==="cricket" || this.state.tabOn==="soccer" || this.state.tabOn==="tennis"){
        obj.type=this.state.tabOn
        if(this.state.max_stake!==""){
          obj.maxStacks=this.state.max_stake
        }
        if(this.state.min_stake!==""){
          obj.minStacks=this.state.min_stake
        }
        if(this.state.max_profit!==""){
          obj.maxProfit=this.state.max_profit
        }
        if(this.state.max_loss!==""){
          obj.maxLoss=this.state.max_loss
        }
        if(this.state.PIP!==""){
          obj.PreInplayProfit=this.state.PIP
        }
        if(this.state.PIS!==""){
          obj.PreInplayStack=this.state.PIS
        }
        if(this.state.min_odds!==""){
          obj.minOdds=this.state.min_odds
        }
        if(this.state.max_odds!==""){
          obj.maxOdds=this.state.max_odds
        }
        if(this.state.unmatch_bet!==""){
          obj.unmatchBet=this.state.unmatch_bet
        }
        if(this.state.lock_bet!==""){
          obj.lockBet=this.state.lock_bet
        }
      }
      else{
        // alert(this.state.tabOn)
        obj.type=this.state.tabOn
        if(fancyType!=="manual"){
          if(this.state.fancymaxStacks!==""){
            obj.fancymaxStacks=this.state.fancymaxStacks
          }
          if(this.state.fancyminStacks!==""){
            obj.fancyminStacks=this.state.fancyminStacks
          }
          if(this.state.fancymaxProfit!==""){
            obj.fancymaxProfit=this.state.fancymaxProfit
          }
          if(this.state.fancyBetDelay!==""){
            obj.fancyBetDelay=this.state.fancyBetDelay
          }
          if(this.state.lock_bet!==""){
            obj.lockBet=this.state.lock_bet
          }
        }
        else{
          if(this.state.manualfancymaxStacks!==""){
            obj.manualfancymaxStacks=this.state.manualfancymaxStacks
          }
          if(this.state.manualfancyminStacks!==""){
            obj.manualfancyminStacks=this.state.manualfancyminStacks
          }
          if(this.state.manualfancymaxProfit!==""){
            obj.manualfancymaxProfit=this.state.manualfancymaxProfit
          }
          if(this.state.manualfancyBetDelay!==""){
            obj.manualfancyBetDelay=this.state.manualfancyBetDelay
          }
          if(this.state.lock_bet!==""){
            obj.lockBet=this.state.lock_bet
          }
        }
      }
      this.users.updateUserSportsInfo(obj, (data) => {
        window.location.reload();
      });
  }

  submit_userInfo() {
    const obj = {
      userName: this.state.userdetails.userName,
      Name: this.state.Name
    }
    this.users.updateMyprofile(obj, (data) => {
      alert("updated");
    });
  }

  closeviewinfo = () => {
    document.getElementById("viewinfo").style.display = "none";
    document.getElementById("viewinfo").classList.remove("in");
  }

  paginate = (pageNumber) => {
    this.setState({
      currentPage:pageNumber
    })
  }

  handleTabs = (tabtype) => {
    this.setState({
      tabOn:tabtype
    })
    this.sportsTabData(tabtype);  
  }

  handleCheckbox = (event) => {
    this.setState({
      [event.target.name]:event.target.checked
    })
  }

  handleFancyTabFields = (event,check) => {
    if(check==="check"){
      this.setState({
        [event.target.name]:event.target.checked
      })
    }
    else{
      this.setState({
        [event.target.name]:event.target.value
      })
    }
  }

  exposureDistribution = (user) => {
    this.users.exposureDistribution(user, async(data)=>{
      await this.setState({
        expoData:data.data.data
      })
      console.log(this.state.expoData);
    })
  }

  expoModal = async(user) => {
    await this.exposureDistribution(user);
    document.getElementById('yourModal').classList.add("in");
    document.getElementById('yourModal').style.display = 'block';
  }
  
  closeExpoModal=()=>{
    document.getElementById('yourModal').style.display = 'none';
    document.getElementById('yourModal').classList.remove("in");
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
      
        <div className="container body">
          <div className="main_container" id="sticky">
            <div id="userModal" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content"></div>
              </div>
            </div>
            <div className="right_col" role="main">

            {
              ////////////////////////////////////// USER HEADER /////////////////////////////////
            }

              <div className="col-md-12">
                <div className="title_new_at">
                  <span className="lable-user-name">Users Listing</span>
                  <select className="user-select" name="postsPerPage" onChange={this.handleChange} style={{ color: "black" }}>
                    <option>10</option>
                    <option>25</option>
                    <option>50</option>
                    <option>100</option>
                    {this.state.data.length>100&&
                      <option>{this.state.data.length}</option>
                    }
                  </select>
                  <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="userList" />
                  <div className="usersech user-mobile" id="formSubmit" method="post" >
                    <input type="hidden" name="compute" defaultValue="fe6602731bf3d65605f0d8f6552a1c9f" />
                    <input type="hidden" name="getUserType" id="getUserType" defaultValue={4} />
                    <input type="hidden" name="parentID" id="parentID" defaultValue />
                    <input type="hidden" name="formSubmit" defaultValue={1} />
                    <input type="hidden" name="perpage" id="perpage" />
                    <input type="text" name="mstruserid" id="myInput" style={{ marginLeft: "5px" }} onChange={this.handleSearch} placeholder="Search here" autoComplete="off" />
                  </div>
                  <select className="user-mobile custom-user-select" name="useraction" id="useraction" onChange={this.handleChange} style={{ color: "black", margin: '2px' }} >
                    <option value>Select Action</option>
                    <option value="lgnusrlckbtng-0">Lock Betting</option>
                    <option value="lgnusrlckbtng-1">Open Betting</option>
                    <option value="mstrlock-0">Lock User</option>
                    <option value="mstrlock-1">Unlock User</option>
                    <option value="lgnusrCloseAc-0">Close User Account</option>
                  </select>
                  <button className="btn btn-warning btn-xs" onClick={this.setAction} style={{ padding: "5px", margin: "2px" }} >
                    ACTION
                  </button>
                  {
                    JSON.parse(localStorage.getItem('data')).Master ?
                      <button className="btn btn-warning btn-xs" data-toggle="modal" data-target="#exampleModal" style={{ padding: "4px 5px" }} >
                        ADD USER
                    </button> : null
                  }
                  <button className="btn btn-warning btn-xs" onClick={() => { this.props.history.goBack() }} style={{ padding: "5px", marginTop: "2px" }} >
                    Back
                  </button>

                  {
                    ////////////////////////////////////// MODAL FOR ADD USER /////////////////////////////////
                  }

                  <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="exampleModalLabel">
                            Add User
                          </h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close" >
                            <span aria-hidden="true">×</span>
                          </button>
                        </div>
                        <div className="modal-body">
                          <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div>
                          <div className="row">
                            <div className="col-md-4 col-xs-6">
                              <label> Name</label>
                              <input type="text" name="name" required onChange={this.handleChange} className="form-control" id="left_master_name" autoComplete="off" />
                              <span id="left_master_nameN" className="errmsg" ></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> Registration Data </label>
                              <input type="text" name="FromDate" className="form-control" id="Fleft_romDate" autoComplete="off" value={this.currentDate} readonly="" />
                              <span id="left_FromDateN" className="errmsg"></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> User ID </label>
                              <input type="text" required name="userName" onChange={this.handleChange} className="form-control" id="left_username" />
                              <span id="left_usernameN"></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label> Password</label>
                              <input type="password" required name="password" onChange={this.handleChange} className="form-control" id="left_password" autoComplete="off" />
                              <span id="left_passwordN" className="errmsg"></span>
                            </div>
                            {/* <div className="col-md-4 col-xs-6">
                              <label id="partnerMAx">Partnership [ 0]</label>&nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnership"></span>
                              <input type="number" required name="partner" className="form-control" id="left_partner" max="100" min="0" autoComplete="off" defaultValue="0" />
                              <span id="left_partnerN" className="errmsg"></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label id="partnershipCasino">partnership Casino [ 0]</label> &nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnershipCasino"></span>
                              <input type="number" name="partnershipCasino" className="form-control" id="left_partnershipCasino" max="100" min="0" autoComplete="off" defaultValue="0" />
                              <span id="left_partnerCasinoN" className="errmsg" ></span>
                            </div>
                            <div className="col-md-4 col-xs-6">
                              <label id="partnershipLiveTennPatti">Partnership TeenPatti [0]</label> &nbsp;&nbsp;&nbsp;&nbsp;
                              <span id="less-partnershipLiveTennPatti"></span>
                              <input type="number" required name="partnershipLiveTennPatti" className="form-control" id="left_partnershipLiveTennPatti" max="100" min="0" autoComplete="off" defaultValue="0" />
                              <span id="left_partnerLiveTennPattiN" className="errmsg"></span>
                            </div> */}
                            <div className="col-md-12 col-xs-6 modal-footer">
                              <button type="button" className="blue_button Addsuper1" onClick={this.save} id="child_player_add" >
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

              {
                ////////////////////////////////////// TABLE FOR USER /////////////////////////////////
              }

              <div className="clearfix" />
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading" />
                  {
        this.state.load ?
        <div style={{height:'100vh', justifyContent:'center', display:'flex' ,marginTop:'5rem'}}>
            <Loader type="Grid" color="#6c1945" height={100} width={100} />
        </div> :
                  <div className="custom-scroll appendAjaxTbl">
                    <table className="table table-striped jambo_table bulk_action" id="myTable" >
                      <thead>
                        <tr className="headings">
                          {
                            this.state.tableHead.map((item, index) => <th key={index} className="text-center">{item}</th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          currentPosts.length > 0 ?
                          currentPosts.map((item, index) => {
                              return (
                                <tr key={index} id="user_row_152262">
                                  <td className="text-center">
                                    {indexOfFirstPost+index+1}
                                    <input type="checkbox" name="selecteduser" onChange={this.handleChange} value={item.userName} className="select-users" />
                                  </td>
                                  <td className="text-center" style={{ paddingBottom: "0px" }}>
                                    <span className="m-bg">{item.userName} &nbsp;
                                      {item.status ?
                                        <i className="fa fa-user fa_custom fa-2x" title="locked" aria-hidden="true" style={{ color: "red" }} /> : ""}
                                      {item.enableBetting ?
                                        <i className="fa fa-lock fa_custom fa-2x" title="Betting Locked" aria-hidden="true" style={{ color: "red" }} ></i> : ""}
                                    </span>
                                  </td>
                                  <td className="text-center">BETFUN360</td>
                                  <td className="text-center">{item.master}</td>
                                  <td className="text-center">{item.profitLossChips}</td>
                                  <td className="text-center">{item.freeChips}</td>
                                  <td className="text-center">
                                    <Link to="#" role="button" onClick={()=>this.expoModal(item.userName)} className="btn btn-success btn-xs">{item?.exposure>0?-item.exposure:item.exposure}</Link>
                                  </td>
                                  <td className="text-center">{item.walletBalance} </td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="last">
                                    <span className="dropdown">
                                      <Link to="#" className="dropdown-toggle btn btn-xs btn-success" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" >
                                        View More <span className="caret" />
                                      </Link>
                                      <ul className="dropdown-menu">
                                        <li>
                                          <Link to={"/cacstatement/" + item.userName}>Statement</Link>
                                        </li>
                                        <li>
                                          <Link to={"/profitloss/" + item.userName}>Profit Loss</Link>
                                        </li>
                                        <li>
                                          <Link to="#" title="View Account Info" onClick={() => this.view_account(item)} >
                                            <span>View Info</span>
                                          </Link>
                                        </li>
                                        <li>

                                          <Link to="#" title="Change Password" onClick={() => this.view_change_passs(item)} >
                                            <span>Change Password</span>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#" title="Free Chip In Out" onClick={() => this.openChipDeposit(item)} >
                                            <span>Free Chip Deposit</span>
                                          </Link>
                                        </li>
                                        <li>
                                          <Link to="#" title="Free Chip In Out" onClick={() => this.openChipWithdrawal(item)} >
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
                              <td colSpan={11} className="text-center">No Records Found...</td>
                            </tr>
                        }
                      </tbody>
                      {  
                        currentPosts.length > 0 ?
                        <tfoot>
                            <tr>
                              <td colSpan={11} className="text-center">Total Balance:{this.state.totalBalance}</td>
                            </tr>
                            {/* <tr>
                              <td colSpan={11}>
                                  <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.data.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                              </td>  
                            </tr>   */}
                        </tfoot> : null  
                      }
                    </table>
                  </div>
  }</div>
              </div>
            </div>

            {
              ////////////////////////////////////// MODAL FOR CHANGE PASSWORD /////////////////////////////////
            }

            <div id="userpasswordpopup" className="modal fade" role="dialog">
              <div className=" " id="changeUserPassword" role="main">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" onClick={this.closePasswordpopup} data-dismiss="modal" >×</button>
                      <h4 className="modal-title">Change Password</h4>
                    </div>
                    {/* <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div> */}
                    <div className="modal-body">
                      <div id="PassUserMsg"></div>
                      <div className="row">
                        <form id="ChangePassword" method="post" autoComplete="off" >
                          <input type="hidden" name="compute" defaultValue="e34250a537dafd7d93f9f0827c207d74" />
                          <span id="msg_error"></span><span id="errmsg"></span>
                          <input type="hidden" name="userId" defaultValue="155374" />
                          <div className="col-md-6 col-xs-6">
                            <label>New Password</label>
                            <input type="password" name="newPassword" className="form-control" onChange={this.handleChange} id="newPassword" autoComplete="off" />
                            <span id="newPasswordN" className="errmsg">{this.state.reqNewPwd ? "*" + this.state.reqNewPwd : null}</span>
                          </div>
                          <div className="col-md-6 col-xs-6">
                            <label>Confirm Password</label>
                            <input type="password" name="confirm_password" className="form-control" onChange={this.handleChange} id="confirm_password" autoComplete="off" />
                            <span id="confirm_passwordN" className="errmsg">{this.state.reqConfirmPwd ? "*" + this.state.reqConfirmPwd : null}</span>
                          </div>
                          <span style={{ marginLeft: '20px ', color: 'red' }}>
                            {this.state.notEqualMsg ? "*" + this.state.notEqualMsg : null}
                          </span>
                          <div className="col-md-12 col-xs-6 modal-footer">
                            <button type="button" className="blue_button" onClick={this.savePass} id="change_pass" > Change </button>
                            <button data-dismiss="modal" onClick={this.closePasswordpopup} type="button" className="red_button" >
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
              //////////////////////////////////// MODAL FOR CHIP DEPOSIT ////////////////////////////////////////////
            }

            <div id="chipdeposit" className="modal fade in" role="dialog" style={{ display: "none" }} >
              <div id="changeUserPassword" role="main">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" onClick={this.closechipDepositpopup}>×</button>
                      <h4 className="modal-title">
                        <span id="tital_change">Free Chips In/Out {this.state.username}</span>
                      </h4>
                    </div>
                    <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div>
                    <div className="modal-body">
                      <div className="row">
                        <div id="UpdateChipsMsg"></div>
                        <form id="UpdateFreeChips" method="post">
                          <span id="msg_error"></span><span id="errmsg"></span>
                          <div className="col-md-6">
                            <label> Free Chips : </label>
                            <input type="text" name="Chips" value={this.state.Chips} className="form-control" onChange={this.handleChange} required="" />
                            <span id="ChipsN" className="errmsg"></span>
                          </div>
                          <div className="col-md-12">
                            <div className="tabel_content ">
                              <table className="table-bordered">
                                <tbody>
                                  <tr>
                                    <td>Parant Free Chips</td>
                                    <td className="font-bold">{this.state.masterDetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>User Balance </td>
                                    <td className="font-bold">{this.state.userdetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>Parant New Free Chips</td>
                                    <td><span id="ParantNewFreeChips">{this.state.newParentChip}</span></td>
                                  </tr>
                                  <tr>
                                    <td>{this.state.username} New Free Chips</td>
                                    <td><span id="myNewFreeChips">{this.state.newCurrChip}</span></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-md-12 modal-footer">
                            <button type="button" className="btn btn-success pull-right chip-inout-button" onClick={this.update_free_chips} >
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
              /////////////////////////////////// MODAL FOR CHIP WITHDRAWL ///////////////////////////////////
            }

            <div id="chipwithdrawal" className="modal fade in" role="dialog" style={{ display: "none" }} >
              <div id="changeUserPassword" role="main">
                <div className="modal-dialog modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" onClick={this.closechipWithdrawalpopup} >×</button>
                      <h4 className="modal-title">
                        <span id="tital_change">
                          Free Chips In/Out {this.state.username}
                        </span>
                      </h4>
                    </div>
                    <div className="text-center" style={{ color: 'green', fontSize: '20px' }}>{this.state.notifyMsg}</div>
                    <div className="modal-body">
                      <div className="row">
                        <div id="UpdateChipsMsg"></div>
                        <form id="UpdateFreeChips" method="post">
                          <span id="msg_error"></span>
                          <span id="errmsg"></span>

                          <div className="col-md-6">
                            <label> Free Chips : </label>
                            <input type="text" name="Chips" value={this.state.Chips} className="form-control" onChange={this.handleChange} required="" />
                            <span id="ChipsN" className="errmsg"></span>
                          </div>
                          <div className="col-md-12">
                            <div className="tabel_content ">
                              <table className="table-bordered">
                                <tbody>
                                  <tr>
                                    <td>Parant Free Chips</td>
                                    <td className="font-bold">{this.state.masterDetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>User Balance </td>
                                    <td className="font-bold">{this.state.userdetails.walletBalance}</td>
                                  </tr>
                                  <tr>
                                    <td>Parant New Free Chips</td>
                                    <td><span id="ParantNewFreeChips">{this.state.newParentChip}</span></td>
                                  </tr>
                                  <tr>
                                    <td>{this.state.username} New Free Chips</td>
                                    <td><span id="myNewFreeChips">{this.state.newCurrChip}</span></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="col-md-12 modal-footer">
                            <button type="button" className="red_button pull-right chip-inout-button" onClick={this.update_free_chips} style={{ background: "red", borderColor: "red" }} >
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
  //////////////////////////////////// MODAL FOR EXPOSURE /////////////////////////////////////
}

            <div className="modal fade" id="yourModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header" style={{background:"#6c1945"}}>
                    <button type="button" className="close" onClick={this.closeExpoModal} aria-label="Close">
                      <span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="myModalLabel">Exposure</h4>
                  </div>
                  <div className="modal-body">
                      <div className="col-md-12 col-sm-12 col-xs-12">
                          <div className="table-scroll  table-responsive" id="filterdata" style={{marginTop:"1rem"}}>
                            <table className="table table-bordered table-striped jambo_table bulk_action">
                                <thead>
                                  <tr className="headings" style={{background: "rgb(149, 51, 92)",color: "white"}}>
                                      <th className="text-center">Event </th>
                                      <th className="text-center">Market </th>
                                      <th className="text-center">Exposure</th>
                                      <th className="text-center">Sport</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    this.state.expoData.length>0?
                                    this.state.expoData.map((item)=>
                                        <tr>
                                          <td className="text-center">{item?.event}</td>
                                          <td className="text-center">{item?.marketId}</td>
                                          <td className="text-center">{item?.exposure}</td>
                                          {item?.eventType===4&&<td className="text-center">Cricket</td>}
                                          {item?.eventType===1&&<td className="text-center">Soccer</td>}
                                          {item?.eventType===2&&<td className="text-center">Tennis</td>}
                                        </tr>
                                       ):null
                                   }
                                  
                                </tbody>
                            </table>
                          </div>
                      </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" style={{background:"#95335c",color:'white',outline:'none'}} className="btn btn-default" onClick={this.closeExpoModal}>Close</button>
                  </div>
                </div>
              </div>
            </div>



            {
              ///////////////////////////////// MODAL FOR VIEW INFO ///////////////////////////////////////
            }

            <div id="viewinfo" className="modal fade" role="dialog" style={{ display: "none" }} >
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header" style={{background:'#6c1945'}}>
                    <button type="button" className="close" onClick={() => this.closeviewinfo()} data-dismiss="modal" >×</button>
                    <h4 className="modal-title">
                      <span id="tital_change">
                        Account of {this.state.userdetails.userName}
                      </span>
                    </h4>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="sub_heading">
                        <span id="tital_change" style={{fontSize:"17px"}}>User </span>
                      </div>
                      <form>
                        <div className="col-md-4 col-xs-6">
                          <label>User ID</label>
                          <input type="text" className="form-control" value={this.state.userdetails.userName} name="userID" readOnly />
                        </div>
                        <div className="col-md-4 col-xs-6">
                          <label>User Name</label>
                          <input type="text" className="form-control" name="Name" defaultValue={this.state.userdetails.Name} onChange={this.handleChange} />
                        </div>
                        <div className="col-md-4 col-xs-12">
                          <label>Update From General Setting</label>
                          <br />
                          <input type="checkbox" name="usercheck" defaultValue="1" defaultChecked />
                        </div>
                        <div className="col-md-12 col-xs-12 modal-footer">
                          <button type="button" className="blue_button submit_user_setting" onClick={() => this.submit_userInfo()} >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="tab_bets get-mchlist" style={{marginTop:'1rem',marginBottom:'1rem'}}>
                      <ul id="betsalltab" className="nav nav-pills match-lists">
                        <li><Link to="#" onClick={()=>this.handleTabs("fancy")} role="button">Fancy</Link></li>
                        <li><Link to="#" onClick={()=>this.handleTabs("tennis")} role="button">Tennis</Link></li>
                        <li><Link to="#" onClick={()=>this.handleTabs("soccer")} role="button">Soccer</Link></li>
                        <li><Link to="#" onClick={()=>this.handleTabs("cricket")} role="button">Cricket</Link></li>
                      </ul>
                    </div>
                    <div className="sub_heading">
                      {this.state.tabOn==="cricket"?<span id="tital_change" style={{fontSize:"17px"}}>Cricket</span>:null}
                      {this.state.tabOn==="soccer"?<span id="tital_change" style={{fontSize:"17px"}}>Soccer</span>:null}
                      {this.state.tabOn==="tennis"?<span id="tital_change" style={{fontSize:"17px"}}>Tennis</span>:null}
                      {this.state.tabOn==="fancy"?<span id="tital_change" style={{fontSize:"17px"}}>Fancy</span>:null}
                    </div>
                    <div className="col-md-12 col-sm-12 col-xs-12">
                    </div>
                    {
                      (this.state.tabOn==="cricket"||this.state.tabOn==="soccer"||this.state.tabOn==="tennis")?
                      <div className="row">
                        <form>
                          <div className="col-md-4 col-xs-6">
                            <label> MIN STAKE</label>
                            {this.state.tabOn==="cricket"&&<input type="text" name="min_stake" defaultValue={this.state?.userInfo?.minStacks} onChange={this.handleChange} className="form-control" id="4_min_stake" />}
                            {this.state.tabOn==="soccer"&&<input type="text" name="min_stake" defaultValue={this.state?.soccerInfo?.minStacks} onChange={this.handleChange} className="form-control" id="4_min_stake" />}
                            { this.state.tabOn==="tennis"&&<input type="text" name="min_stake" defaultValue={this.state?.tennisInfo?.minStacks} onChange={this.handleChange} className="form-control" id="4_min_stake" />}
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> Max STAKE </label>
                            {this.state.tabOn==="cricket"&&<input type="text" name="max_stake" defaultValue={this.state?.userInfo?.maxStacks} onChange={this.handleChange} className="form-control" id="4_max_stake" /> }
                            {this.state.tabOn==="soccer"&&<input type="text" name="max_stake" defaultValue={this.state?.soccerInfo?.maxStacks} onChange={this.handleChange} className="form-control" id="4_max_stake" />}
                            {this.state.tabOn==="tennis"&&<input type="text" name="max_stake" defaultValue={this.state?.tennisInfo?.maxStacks} onChange={this.handleChange} className="form-control" id="4_max_stake" />}
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> MAX PROFIT </label>
                            {this.state.tabOn==="cricket"&&<input type="text" name="max_profit" defaultValue={this.state?.userInfo?.maxProfit} onChange={this.handleChange} className="form-control" id="4_max_profit" />}
                            {this.state.tabOn==="soccer"&&<input type="text" name="max_profit" defaultValue={this.state?.soccerInfo?.maxProfit} onChange={this.handleChange} className="form-control" id="4_max_profit" />}
                            {this.state.tabOn==="tennis"&&<input type="text" name="max_profit" defaultValue={this.state?.tennisInfo?.maxProfit} onChange={this.handleChange} className="form-control" id="4_max_profit" />}
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> Max Loss </label>
                            {this.state.tabOn==="cricket"&&<input type="text" name="max_loss" defaultValue={this.state?.userInfo?.maxLoss} onChange={this.handleChange} className="form-control" id="4_max_loss" />}
                            {this.state.tabOn==="soccer"&&<input type="text" name="max_loss" defaultValue={this.state?.soccerInfo?.maxLoss} onChange={this.handleChange} className="form-control" id="4_max_loss" />}
                            {this.state.tabOn==="tennis"&&<input type="text" name="max_loss" defaultValue={this.state?.tennisInfo?.maxLoss} onChange={this.handleChange} className="form-control" id="4_max_loss" />}
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> PRE INPLAY PROFIT</label>
                            {this.state.tabOn==="cricket"&&<input type="text" name="PIP" defaultValue={this.state?.userInfo?.PreInplayProfit} onChange={this.handleChange} className="form-control" id="4_pre_innplay_profit" />}
                            {this.state.tabOn==="soccer"&&<input type="text" name="PIP" defaultValue={this.state?.soccerInfo?.PreInplayProfit} onChange={this.handleChange} className="form-control" id="4_pre_innplay_profit" />}
                            {this.state.tabOn==="tennis"&&<input type="text" name="PIP" defaultValue={this.state?.tennisInfo?.PreInplayProfit} onChange={this.handleChange} className="form-control" id="4_pre_innplay_profit" />}
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> PRE INPLAY STAKE</label>
                            {this.state.tabOn==="cricket"&&<input type="text" name="PIS" defaultValue={this.state?.userInfo?.PreInplayStack} onChange={this.handleChange} className="form-control" id="4_pre_inplay_stake" />}
                            {this.state.tabOn==="soccer"&&<input type="text" name="PIS" defaultValue={this.state?.soccerInfo?.PreInplayStack} onChange={this.handleChange} className="form-control" id="4_pre_inplay_stake" />}
                            {this.state.tabOn==="tennis"&&<input type="text" name="PIS" defaultValue={this.state?.tennisInfo?.PreInplayStack} onChange={this.handleChange} className="form-control" id="4_pre_inplay_stake" />}
                          </div>

                          <div className="col-md-4 col-xs-6">
                            <label> MIN ODDS</label>
                            {this.state.tabOn==="cricket"&&<input type="text" name="min_odds" defaultValue={this.state?.userInfo?.minOdds} onChange={this.handleChange} className="form-control" id="4_min_odds" />}
                            {this.state.tabOn==="soccer"&&<input type="text" name="min_odds" defaultValue={this.state?.soccerInfo?.minOdds} onChange={this.handleChange} className="form-control" id="4_min_odds" />}
                            {this.state.tabOn==="tennis"&&<input type="text" name="min_odds" defaultValue={this.state?.tennisInfo?.minOdds} onChange={this.handleChange} className="form-control" id="4_min_odds" />}

                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> MAX ODDS</label>
                            {this.state.tabOn==="cricket"&&<input type="text" name="max_odds" defaultValue={this.state?.userInfo?.maxOdds} onChange={this.handleChange} className="form-control" id="4_max_odds" />}
                            {this.state.tabOn==="soccer"&&<input type="text" name="max_odds" defaultValue={this.state?.soccerInfo?.maxOdds} onChange={this.handleChange} className="form-control" id="4_max_odds" />}
                            {this.state.tabOn==="tennis"&&<input type="text" name="max_odds" defaultValue={this.state?.tennisInfo?.maxOdds} onChange={this.handleChange} className="form-control" id="4_max_odds" />}

                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label>UNMATCH BET</label>
                            {this.state.tabOn==="cricket"&&<input type="checkbox" name="unmatch_bet" onChange={this.handleCheckbox} />}
                            {this.state.tabOn==="soccer"&&<input type="checkbox" name="unmatch_bet" onChange={this.handleCheckbox} />}
                            {this.state.tabOn==="tennis"&&<input type="checkbox" name="unmatch_bet" onChange={this.handleCheckbox} />}

                            <br />
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label>LOCK BET</label>
                            {this.state.tabOn==="cricket"&&<input type="checkbox" name="lock_bet" onChange={this.handleCheckbox} />}
                            {this.state.tabOn==="soccer"&&<input type="checkbox" name="lock_bet" onChange={this.handleCheckbox} />}
                            {this.state.tabOn==="tennis"&&<input type="checkbox" name="lock_bet" onChange={this.handleCheckbox} />}

                            <br />
                          </div>
                          <div className="col-md-12 col-xs-12 modal-footer">
                            <button type="button" className="blue_button submit_user_setting" id="update-4-setting" onClick={() => this.submit_info("")} >
                              Update
                            </button>
                          </div>
                        </form>
                      </div>:
                      <>
                      <div className="row">
                        <form>
                          <div className="col-md-4 col-xs-6">
                            <label> MIN STAKE
                            <input type="text" name="fancyminStacks" defaultValue={this.state?.fancyInfo?.fancyminStacks} onChange={(e)=>this.handleFancyTabFields(e,"")} className="form-control" /></label>
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> Max STAKE 
                            <input type="text" name="fancymaxStacks" defaultValue={this.state?.fancyInfo?.fancymaxStacks} onChange={(e)=>this.handleFancyTabFields(e,"")} className="form-control" /></label>
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> MAX PROFIT 
                            <input type="text" name="fancymaxProfit" defaultValue={this.state?.fancyInfo?.fancymaxProfit}onChange={(e)=>this.handleFancyTabFields(e,"")} className="form-control" /></label>
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> BET DELAY
                            <input type="text" name="fancyBetDelay" defaultValue={this.state?.fancyInfo?.fancyBetDelay}onChange={(e)=>this.handleFancyTabFields(e,"")}  className="form-control"/></label>
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label>LOCK BET&nbsp;
                            <input type="checkbox" name="lock_bet" onChange={(e)=>this.handleFancyTabFields(e,"check")} /></label>
                          </div>
                          <div className="col-md-12 col-xs-12 modal-footer">
                            <button type="button" className="blue_button submit_user_setting" id="update-4-setting" onClick={() => this.submit_info("fancy")} >
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                      <div className="sub_heading">
                      <span id="tital_change" style={{fontSize:"17px"}}>Manual Fancy</span>
                    </div>
                    <div className="row">
                        <form>
                          <div className="col-md-4 col-xs-6">
                            <label> MIN STAKE
                            <input type="text" name="manualfancyminStacks" defaultValue={this.state?.fancyInfo?.manualfancyminStacks} onChange={(e)=>this.handleFancyTabFields(e,"")} className="form-control" /></label>
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> Max STAKE 
                            <input type="text" name="manualfancymaxStacks" defaultValue={this.state?.fancyInfo?.manualfancymaxStacks} onChange={(e)=>this.handleFancyTabFields(e,"")} className="form-control" /></label>
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> MAX PROFIT 
                            <input type="text" name="manualfancymaxProfit" defaultValue={this.state?.fancyInfo?.manualfancymaxProfit} onChange={(e)=>this.handleFancyTabFields(e,"")} className="form-control" /></label>
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label> BET DELAY
                            <input type="text" name="manualfancyBetDelay"  defaultValue={this.state?.fancyInfo?.manualfancyBetDelay} onChange={(e)=>this.handleFancyTabFields(e,"")} className="form-control"/></label>
                          </div>
                          <div className="col-md-4 col-xs-6">
                            <label>LOCK BET&nbsp;
                            <input type="checkbox" name="lock_bet" onChange={(e)=>this.handleFancyTabFields(e,"check")} /></label>
                          </div>
                          <div className="col-md-12 col-xs-12 modal-footer">
                            <button type="button" className="blue_button submit_user_setting" id="update-4-setting" onClick={() => this.submit_info("manual")} >
                              Update
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                    }
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
