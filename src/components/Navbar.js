import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import  mainLogo from '../betfun-logo.png';
import Users from '../Services/users';
import Modal from 'react-bootstrap/Modal'
import e from 'cors';


class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      old_password:'',
      newpassword :'',
      Renewpassword:'',
      addFunds:0,
      balance:0,
      show:false,
      addNews:'',
      userName:'',
      NewsList:[],
      reqMsg:'',
      op:'',
      np:'',
      rp:''
    };
    this.users =new Users();
    this.userDetails = JSON.parse(localStorage.getItem('data')) != undefined ? JSON.parse(localStorage.getItem('data')) : "";  
   if(window.screen.width > 768){    
      this.menduDisplay = 'block';  
   }
   else{
    this.menduDisplay = 'none'
   }
}

handleShow = () => {
  this.setState({
    show:true
  })
}

handleClose = () => {
  this.setState({
    show:false
  })
}

handleChange = (event)=>{
  this.setState({
      [event.target.name] : event.target.value
  })
}

resetForm = () => {
  this.setState({
    old_password:'',
    newpassword :'',
    Renewpassword:''
});
}

upperCaseLetters=(char)=>{
  let upperCaseLetters = /[A-Z]/g;
  if(char.match(upperCaseLetters)){
    return false
  }
  else{
    return true
  }
}

hasNumber = (num) => {
  return /\d/.test(num)
}

validateChangePassword = async () => {
  if(this.state.old_password===""){
    await this.setState({
      reqMsg:'This field is required !',
      op:false
    })
  }else{
    await this.setState({
      op:true,
      reqMsg:''
    })
  }

  if (this.state.newpassword !== "") {
    if (this.state.newpassword.length >= 8) {
      let char = this.state.newpassword[0];
      let chU = this.upperCaseLetters(char);
      if (chU) {
        await this.setState({
          reqNpMsg: "1st letter capital & length must be 8",
          np: false,
        });
      } else {
        await this.setState({
          np: true,
          reqNpMsg: "",
        });
      }
    } else {
      await this.setState({
        reqNpMsg: "Password must have at least 8 character !",
        np: false,
      });
    }
  } else {
    await this.setState({
      reqNpMsg: "This field is required !",
      np: false,
    });
  }

  if(this.state.Renewpassword){
    if(this.state.newpassword === this.state.Renewpassword){
      await this.setState({
        rp:true,
        rpMsg:''
      })
    }
    else{
      await this.setState({
        rpMsg:'New and Renew Password do not match',
        rp:false
      })
    }
  }
  else{
    await this.setState({
      rpMsg:'This field is required !',
      rp:false
    })
  }

  if(this.state.op && this.state.np && this.state.rp){
    return true
  }
  else{
    return false
  }
}

savePass = async() =>{
  const permit = await this.validateChangePassword();
  if(permit===true){
  if(this.state.old_password &&  this.state.newpassword && this.state.Renewpassword){
  this.users.updatePassword({userName:JSON.parse(localStorage.getItem('data')).userName,oldPassword:this.state.old_password,newPassword:this.state.Renewpassword},data=>{ 
    this.setState({
      old_password:'',
      newpassword :'',
      Renewpassword:''
  });
    this.setState({
      notifyMsg: data.data.message
    });
    setTimeout(()=>{
    window.location.reload();
    },1000)
  });
  }
}
}

addFundsToSuperMaster = () => {
let wB = JSON.parse(localStorage.getItem('data'))
const obj = {
  funds:Number(this.state.balance)+Number(this.state.addFunds)
}
  this.users.addFunds(obj, (data) => {
    const obj1 = {
      userName:this.state.userName
    }
    this.users.getMyprofile(obj1,data => {
      wB.walletBalance=data.data.walletBalance
      this.setState({
        balance:data.data.walletBalance
      },()=>{
        localStorage.setItem('data',JSON.stringify(wB))
      });
      this.closeAddFunds();
      window.location.reload();
    });
  });
}

saveNews = (e)=>{
  e.preventDefault();
  this.users.addNews(this.state.addNews,(data,methodType) => {
    if(methodType==='get'){
    this.setState({
      NewsList:data.data.data
    })
  } 
    else
      {
        console.log("waala",data.data.data);
      }
    // this.closeAddNews();
  })
}

openNav=()=>{
    document.getElementById("lefttSidenav").style.width = "250px";
}

closeNav=()=> {
    document.getElementById("lefttSidenav").style.width = "0";
  }

logout=()=>{
  localStorage.clear();
  window.location.href ='/';
}

closePasswordpopup=()=>{
  document.getElementById('passwordpopup').style.display = 'none';
  document.getElementById('passwordpopup').classList.remove("in");
}

closeAddFunds=()=>{
  document.getElementById('addFundsModal').style.display = 'none';
  document.getElementById('addFundsModal').classList.remove("in");
}

closeAddNews=()=>{
  document.getElementById('addNewsModal').style.display = 'none';
  document.getElementById('addNewsModal').classList.remove("in");
}

view_change_passs=()=>{
  document.getElementById('passwordpopup').classList.add("in");
  document.getElementById('passwordpopup').style.display = 'block';
}

view_add_funds=()=>{
  document.getElementById('addFundsModal').classList.add("in");
  document.getElementById('addFundsModal').style.display = 'block';
}

view_add_news(){
  document.getElementById('addNewsModal').classList.add("in");
  document.getElementById('addNewsModal').style.display = 'block';
}

componentDidMount(){
  if( JSON.parse(localStorage.getItem('data')).superAdmin){
    if(localStorage.getItem('data') !=undefined){
      this.userDetails = JSON.parse(localStorage.getItem('data'));    
    }
    else{
      localStorage.clear();
      window.location.href ='/'; 
    }
    this.setState({
        balance : (JSON.parse(localStorage.getItem("data"))).walletBalance 
    })
  }
  else{
    const user = {
      userName: JSON.parse(localStorage.getItem('data')).userName,
      password: JSON.parse(localStorage.getItem('data')).passwordString
    };
    this.users.login(user,data=>{
      localStorage.setItem('data', JSON.stringify(data.data.data));
      this.setState({
        balance:data.data.data.walletBalance
      })
    })
  }
}

showchildMenu=(e)=>{
  if ( e.target.nextElementSibling.style.display == "none") {
      e.target.nextElementSibling.style.display = 'block';
      e.target.classList.add('submenu-opened');
  } else {
    e.target.nextElementSibling.style.display = 'none';
    e.target.classList.remove('submenu-opened');
  }
}

  render() {
    let cond =''; 
    let report ='';
    let blockmarket ='';
    let userName = this.userDetails.userName;
    this.state.userName = this.userDetails.userName;
    let exposure = JSON.parse(localStorage.getItem('expo'));

    if(this.userDetails.superAdmin){
      cond = (
        <li className="has-sub">
          <Link to="#"><i className="fa fa-users" /> User </Link>
          <span className="submenu-button" onClick={(e)=>this.showchildMenu(e)}></span>
          <ul style={{display: this.menduDisplay}}>
            <li>
              <Link to="/supermaster">Super Master</Link>
            </li> 
            <li>
              <Link to="/master"> Master</Link> 
            </li>
            <li>
              <Link to="/user"> Users</Link>
            </li>
            <li>
              <Link to="/closeuser"> Close Users</Link>
            </li>
          </ul>
        </li>
      );

  report = ( 
    <li>
      <Link to="#">Report</Link>
      <span className="submenu-button" onClick={(e)=>this.showchildMenu(e)}></span>
      <ul style={{display: this.menduDisplay}}>
        <li>
          <Link to="/acinfo">Account Info </Link> 
        </li>
        <li>
          <Link to="/cacstatement">Account Statement </Link> 
        </li>
        <li>
          <Link to="/chipsummary">Chip Summary </Link> 
        </li>
        <li>
          <Link to="/liveevents">Live Events </Link> 
        </li>
        <li>
          <Link to="/clientpl">Client P L</Link> 
        </li>
        <li>
          <Link to="/marketpl">Market P L</Link> 
        </li>
        <li>
          <Link to="/sportspl">Sport P L</Link> 
        </li>
        <li>
          <Link to="/userpl">User P L</Link> 
        </li>
        <li>
          <Link to="/profitloss">Profit &amp; Loss</Link> 
        </li>
        <li>
          <Link to="/bethistory">Bet History</Link> 
        </li>
        <li>
          <Link to="/fancystack">Fancy Stack</Link> 
        </li>
        <li> 
          <Link to="#" onClick={()=>this.view_add_funds()}>Add Funds</Link>
        </li>
        <li> 
          <Link to="#" onClick={()=>this.view_add_news()}>Add News</Link>
        </li>
      </ul>
    </li>
  );

  blockmarket = ( 
    <li>
      <Link to="/blockmarket">Block Market</Link>
    </li>
  )
}
    
  else if(this.userDetails.Admin){
    cond = (
      <li className="has-sub">
        <Link to="#"><i className="fa fa-users" /> User </Link>
        <span className="submenu-button" onClick={(e)=>this.showchildMenu(e)}></span>
        <ul style={{display: this.menduDisplay}}>
          <li>
            <Link to="/master"> Master</Link> 
          </li>
          <li>
            <Link to="/user"> Users</Link>
          </li>
          <li>
            <Link to="/closeuser"> Close Users</Link>
          </li>
        </ul>
      </li>
    );

  report = ( 
    <li>
      <Link to="#">Report</Link>
      <span className="submenu-button" onClick={(e)=>this.showchildMenu(e)}></span>
      <ul style={{display: this.menduDisplay}}>
        <li>
          <Link to="/acinfo">Account Info </Link>
        </li>
        <li>
          <Link to="/cacstatement">Account Statement </Link>
        </li>
        <li>
          <Link to="/chipsummary">Chip Summary </Link>
        </li>
        <li>
          <Link to="/clientpl">Client P L</Link>
        </li>
        <li>
          <Link to="/marketpl">Market P L</Link>
        </li>
        <li>
          <Link to="/sportspl">Sport P L</Link>
        </li>
        <li>
          <Link to="/userpl">User P L</Link>
        </li>
        <li>
          <Link to="/profitloss">Profit &amp; Loss</Link>
        </li>
        <li>
          <Link to="/bethistory">Bet History</Link>
        </li>
        <li>
          <Link to="/fancystack">Fancy Stack</Link>
        </li>
      </ul>
    </li>
  );

  blockmarket = ( 
    <li>
      <Link to="/blockmarket">Block Market</Link>
    </li>)
}
    
  else if(this.userDetails.Master){
    cond = (
      <li className="has-sub">
        <Link to="#"><i className="fa fa-users" /> User </Link>
        <span className="submenu-button" onClick={(e)=>this.showchildMenu(e)}></span>
        <ul style={{display: this.menduDisplay}}>
          <li>
            <Link to="/user"> Users</Link>
          </li>
          <li>
            <Link to="/closeuser"> Close Users</Link>
          </li>
        </ul>
      </li>
    );

  report =( 
    <li>
      <Link to="#">Report</Link>
      <span className="submenu-button" onClick={(e)=>this.showchildMenu(e)}></span>
      <ul style={{display: this.menduDisplay}}>
        <li>
          <Link to="/acinfo">Account Info </Link>
        </li>
        <li>
          <Link to="/cacstatement">Account Statement </Link>
        </li>
        <li>
          <Link to="/chipsummary">Chip Summary </Link>
        </li>
        <li>
          <Link to="/clientpl">Client P L</Link>
        </li>
        <li>
          <Link to="/marketpl">Market P L</Link>
        </li>
        <li>
          <Link to="/sportspl">Sport P L</Link>
        </li>
        <li>
          <Link to="/userpl">User P L</Link>
        </li>
        <li>
          <Link to="/profitloss">Profit &amp; Loss</Link>
        </li>
        <li>
          <Link to="/bethistory">Bet History</Link>
        </li>
        <li>
          <Link to="/fancystack">Fancy Stack</Link>
        </li>
      </ul>
    </li>
  );

  blockmarket =( 
    <li>
      <Link to="/blockmarket">Block Market</Link>
    </li>)
  }
      
  else{
    report = ( 
      <li>
        <Link to="#">Report</Link>
        <span className="submenu-button" onClick={(e)=>this.showchildMenu(e)}></span>
        <ul style={{display: this.menduDisplay}}>
          <li>
            <Link to="/acinfo">Account Info </Link>
          </li>
          <li>
            <Link to="/cacstatement">Account Statement </Link> 
          </li>            
          <li>
            <Link to="/profitloss">Profit &amp; Loss</Link> 
          </li>
          <li>
            <Link to="/bethistory">Bet History</Link> 
          </li>
        </ul>
      </li>
    )
  }
      
  if (window.location.pathname === '/') {
    return null;
  }
    
  return  (
    <div className="header-section">
      <div className="top_nav">
        <div className="righttogal righttogalhide">
          <span style={{cursor: 'pointer'}} onClick={this.openNav}>☰ </span>
        </div>
        <div className="nav_menu">
          <nav role="navigation">
            <div className="nav_title">
              <Link to="/dashboard" className="site_title endcooki"> 
                <img  src={mainLogo} alt="fireSpot"/>
              </Link>
            </div>
            <div id="lefttSidenav" className="left_col  sidenav">
              <a  className="closebtn righttogalhide" onClick={this.closeNav}>×</a> 
              <div className="left_col scroll-view">
                <div className="clearfix" />
                <nav id="cssmenu">
                  <ul className="nav">
                    <li className="hidden-xs">
                      <Link className="endcooki" to="/dashboard"><i className="fa fa-home hidden-xs" /></Link>
                    </li>
                    { cond }
                    {blockmarket}
                    <li><Link to="#">Favorite</Link></li>
                    <li><Link to="#">My Market</Link></li>
                    {report}
                  </ul>
                </nav>
              </div>
            </div>

{
//////////////////// MAIN-EXPOSURE-USERNAME BOX /////////////////////////////////////
}

            <div className="nav navbar-nav navbar-right">
              <ul>
                <li className="belance-top">
                  <Link to="#" id="Wallet">Main: <span className="mWallet">{this.state.balance}</span></Link>
                  <Link to="#" id="UserLiability">Exposure: <span className="liability">{exposure}</span></Link>
                  
                  <Link to="#" className="user-profile dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                    <i className="fa fa-user-circle-o" />&nbsp;
                    {userName}
                    <span className=" fa fa-angle-down" />
                  </Link>
                  <ul className="dropdown-menu dropdown-usermenu">
                    <li>
                      <Link to="#" onClick={()=>this.view_change_passs()}>Change Password</Link> 
                    </li>
                    <li className="dropdown-footer">
                      <Link to="#" className="endcooki" onClick={this.logout}>Log Out</Link> 
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>

{
  //////////////////// NEWS FEED /////////////////////////////////////
}
          
      <div className="marquee">
        <marquee><i className="fa fa-bell-o" />  Dear user, agar koi bhi user 1 min me bar bar khai-lagai(cheating) karta paya gya to uska soda valid nhi mana jayega...  <i className="fa fa-bell-o" /></marquee>
      </div>

{
  //////////////////// MODAL FOR CHANGING PASSWORD /////////////////////////////////////
}

      <div  id="passwordpopup" className="modal fade" role="dialog">
        <div className=" " id="changeUserPassword" role="main">
          <div className="modal-dialog">
            <div className="modal-content">   	
              <div className="modal-header">
                <button type="button" className="close" onClick={this.closePasswordpopup} data-dismiss="modal">×</button>
                <h4 className="modal-title">Change Password</h4>
              </div>
              <div className="text-center" style={{color:'green',fontSize:'20px'}}>{this.state.notifyMsg}</div>
              <div className="modal-body">
                <div id="PassUserMsg"></div>
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <form  className="form-horizontal form-label-left" method="post" acceptCharset="utf-8">
                      <input type="hidden"  name="compute" value="b507c08cbda82ed93f147c8e3af45214"/>
                      <div className="item form-group">
                        <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="firstname">
                          Old Password
                        </label>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <input type="password" name="old_password" value={this.state.old_password} className="form-control col-md-7 col-xs-12" placeholder="Old Password" label="" onChange={this.handleChange} required="required" autoComplete="off"/>
                          {this.state.reqMsg ? <span style={{color:'red'}}>*{this.state.reqMsg}</span>:null}
                        </div>
                      </div> 
                      <div className="item form-group">
                        <label className="control-label col-md-3 col-sm-3 col-xs-12"  htmlFor="firstname">
                          New Password
                        </label>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <input type="password" name="newpassword" value={this.state.newpassword} className="form-control col-md-7 col-xs-12" placeholder="New Password" label="" onChange={this.handleChange} required="required" autoComplete="off"/>
                          {this.state.reqNpMsg ? <span style={{color:'red'}}>*{this.state.reqNpMsg}</span>:null}
                        </div>
                      </div>
                      <div className="item form-group">
                        <label className="control-label col-md-3 col-sm-3 col-xs-12" required htmlFor="firstname">
                          Retype New Password
                        </label>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <input type="password" name="Renewpassword" value={this.state.Renewpassword} className="form-control col-md-7 col-xs-12" placeholder="Retype Password" label="" onChange={this.handleChange} required="required" autoComplete="off"/>
                          {this.state.rpMsg ? <span style={{color:'red'}}>*{this.state.rpMsg}</span>:null}
                        </div>
                      </div> 
                      <div className="ln_solid"></div>  
                      <div className="form-group">
                        <div className="col-md-6 col-md-offset-3">
                          <button type="reset" style={{marginTop:"5px", marginRight:"5px"}} className="btn btn-primary" onClick={this.resetForm}>Reset</button>
                          <button type="button" style={{marginTop:"5px", marginLeft:"5px"}} className="btn btn-success" onClick={this.savePass}>Submit</button>
                        </div>
                      </div>
                    </form>    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 

{
  //////////////////// MODAL FOR ADDING FUNDS /////////////////////////////////////
}

      <div className="modal fade" id="addFundsModal">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" onClick={this.closeAddFunds}>
                <span aria-hidden="true">×</span>
              </button>
              <h5 className="modal-title" id="addFundsLabel">Add Funds</h5>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <form  className="form-horizontal form-label-left" method="post" acceptCharset="utf-8">
                      <div className="item form-group">
                        <label className="control-label col-md-3 col-sm-3 col-xs-12">Current Balance</label>
                        <div className="add-funds-dialog-current-amount">{this.state.balance}</div>
                      </div>
                      <div className="item form-group">
                        <label className="control-label col-md-3 col-sm-3 col-xs-12" htmlFor="amount">Amount<span className="required">*</span></label>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <input type="text" name="addFunds" value={this.state.addFunds} className="form-control col-md-7 col-xs-12" onChange={this.handleChange} placeholder="Amount" label=""  required="required" autoComplete="off"/>
                        </div>
                      </div>
                      <div className="item form-group">
                        <label className="control-label col-md-3 col-sm-3 col-xs-12">Total Balance</label>
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <input type="text" name="addFunds" value={this.state.balance+Number(this.state.addFunds)} disabled className="form-control col-md-7 col-xs-12" onChange={this.handleChange} placeholder="Amount" label=""  required="required" autoComplete="off"/>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-md-6 col-md-offset-3">
                          <button type="button" style={{marginTop:"5px", marginLeft:"5px"}} className="btn btn-success" onClick={this.addFundsToSuperMaster}>Save</button>
                          <button type="button" style={{marginTop:"5px", marginLeft:"5px"}} className="btn btn-primary" onClick={this.closeAddFunds}>Cancel</button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

{
  //////////////////// MODAL FOR ADDING NEWS /////////////////////////////////////
}

        <div className="modal fade" id="addNewsModal">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" onClick={this.closeAddNews}>
                  <span aria-hidden="true">×</span>
                </button>
                <h5 className="modal-title" id="addNewsLabel">Add News</h5>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <form  className="form-horizontal form-label-left">
                      <div className="form-group">
                        <button type="button" className="btn btn-defaut" onClick={this.saveNews} style={{backgroundColor:'#6c1945',color:'white',margin:'2rem'}}>Add New</button>
                        <button type="button" className="btn btn-defaut" style={{backgroundColor:'#6c1945',color:'white',margin:'2rem'}}>Delete</button>
                        <span style={{float:'right',marginRight:'3rem', marginTop:'3rem',color:'black',fontSize:'15px'}}>Total Records : {this.state.NewsList.length}</span>
                      </div>                          
                      <div className="item form-group">
                        <div className="col-md-6 col-sm-6 col-xs-12">
                          <input type="text" style={{width:'200%'}} name="addNews" value={this.state.addNews} className="form-control col-md-7 col-xs-12" onChange={this.handleChange} placeholder="News" label=""  required="required" autoComplete="off"/>
                        </div>
                      </div>
                      <div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>         
    </div>
  )}
}
export default Navbar;