import React, { Component } from 'react'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {Link} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';
import Users from '../Services/users';

export default class ManualBookMakerOdds extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","Market_Id","RunnerName","Favorite Team","BackOdds","LayOdds","Status"],
      notifyMsg:'',
      msgBox:'none',
      marketata:[],
      BackOddsT1:0,
      LayOddsT1:0,
      BackOddsT2:0,
      LayOddsT2:0,
      BackOddsT3:0,
      LayOddsT3:0,
      bookmakerstatus: "",
      msg:"All fields are required !",
      msgshow:false
    };
    this.events = new Livevents();
    this.users = new Users();
    this.onKeyUp = this.onKeyUp.bind(this);
}

importManualBookMakerOdds = () => {
  this.events.addManualBookMakerOdds(this.props.match.params.id,data=>{
    this.setState({
      notifyMsg: "Bookmaker Added Successfully.",
      msgBox: "block"
    });
    switch ('success') {
      case 'success':
        NotificationManager.success(this.state.notifyMsg,"Success");
        break;
    }
    this.getbookmakeroddsType();
    this.events.getMatchOdds(this.props.match.params.id,data=>{
      let bookmakerdata = this.reverseArray(data.data.data);
      this.setState({
        bookmakerstatus: bookmakerdata
      })
    });
  });
}

getbookmakeroddsType = async () => {
  await this.events.getManualBookMakerOdds(this.props.match.params.id,data=>{
    this.setState({
      marketata:data.bookmakerodds,
      BackOddsT1:data.bookmakerodds[0]?.manualBackOdds,
      LayOddsT1:data.bookmakerodds[0]?.manualLayOdds,
      BackOddsT2:data.bookmakerodds[1]?.manualBackOdds,
      LayOddsT2:data.bookmakerodds[1]?.manualLayOdds,
      BackOddsT3:data.bookmakerodds[2]?.manualBackOdds,
      LayOddsT3:data.bookmakerodds[2]?.manualLayOdds,
    });
  });
}

reverseArray(arr) {
  var newArray = [];
  var firstarr = false;
  for (var i = arr.length - 1; i >= 0; i--) {
    if(arr[i].marketData.marketName==="Match Bookmaker"){
      newArray.push(arr[i].marketData);
    }
    firstarr = true;
  }
  return newArray;
}

componentDidMount(){
  this.getbookmakeroddsType();
   this.events.getMatchOdds(this.props.match.params.id,data=>{
    let bookmakerdata = this.reverseArray(data.data.data);
    this.setState({
      bookmakerstatus: bookmakerdata
    })
  });
}

lockBookMaker  = (marketId, marketName) => {
  this.events.lockMatchOdds({marketId: marketId,marketName: marketName},data=>{
    this.events.getMatchOdds(this.props.match.params.id,data=>{
      let bookmakerdata = this.reverseArray(data.data.data);
      this.setState({
        bookmakerstatus: bookmakerdata
      })
    });
  })
}

visibleBookMaker  = (marketId, marketName) => {
  this.events.visibleMatchOdds({marketId: marketId,marketName: marketName},data=>{
    this.events.getMatchOdds(this.props.match.params.id,data=>{
      let bookmakerdata = this.reverseArray(data.data.data);
      this.setState({
        bookmakerstatus: bookmakerdata
      })
    });
  })
}

acceptAvoidBookMakerBets  = (marketId, marketName) => {
  this.events.acceptAvoidBookMaker({marketId: marketId,marketName: marketName},data=>{
    this.events.getMatchOdds(this.props.match.params.id,data=>{
      let bookmakerdata = this.reverseArray(data.data.data);
      this.setState({
        bookmakerstatus: bookmakerdata
      })
    });
  })
}

handleChangeoddsdiffBackLay  = (e) => {
  const obj = {
    id: this.state.bookmakerstatus[0]?._id,
    oddsdiffBackLay: e.target.value
  }
  this.events.updateOddsdiffBackLay(obj,data=>{
    window.location.reload();
  })
}

onKeyUp(event) {
  if(event.target.name==="manualLayOdds"){
    const obj = {
      id: event.target.alt,
      manualBackOdds: parseInt(event.target.value)-parseFloat(this.state.bookmakerstatus[0]?.oddsdiffBackLay),
      manualLayOdds: event.target.value
    }
    this.events.updateManualBookMakerOdds(obj, data=>{
      this.getbookmakeroddsType();
    })
  }else if(event.target.name==="manualLaySize"){
    const obj = {
      id: event.target.alt,
      manualLaySize: event.target.value
    }
    this.events.updateManualBookMakerOdds(obj,data=>{
      this.getbookmakeroddsType();
    })
  }else if(event.target.name==="manualBackOdds"){
    const obj = {
      id: event.target.alt,
      manualBackOdds: event.target.value,
      manualLayOdds: parseInt(event.target.value)+parseFloat(this.state.bookmakerstatus[0]?.oddsdiffBackLay)
    }
    this.events.updateManualBookMakerOdds(obj,data=>{
        this.getbookmakeroddsType();
    })
  }else if(event.target.name==="manualBackSize"){
    const obj = {
      id: event.target.alt,
      manualBackSize: event.target.value
    }
    this.events.updateManualBookMakerOdds(obj,data=>{
      this.getbookmakeroddsType();
    })
  }else if(event.target.name==="oddsdiffBackLay"){
    const obj = {
      id: event.target.alt,
      oddsdiffBackLay: event.target.value
    }
    this.events.updateOddsdiffBackLay(obj,data=>{
      window.location.reload();
    })
  }
}

handlemanualSatus = (event,id) =>{
    let status=event.target.value
    const obj = {
      id: id,
      status:status,
    }
    this.events.updateManualBookMakerOdds(obj,data=>{
      this.getbookmakeroddsType();
    })
}

favoriteteamstatus = (market_id,id) =>{
  const obj = {
    id: id,
    marketId:market_id,
  }
  this.events.updatefavoriteteamstatus(obj,data=>{
    this.getbookmakeroddsType();
  })
}

render(){
  let BackOdds = [this.state.BackOddsT1,this.state.BackOddsT2,this.state.BackOddsT3];
  let LayOdds = [this.state.LayOddsT1,this.state.LayOddsT2,this.state.LayOddsT3];
  return (
    <div>
      <Navbar />
      <ToastContainer/>
      <div className="forModal" />
      <div className="container body">
        <div className="main_container" id="sticky" style={{width:'100%'}}>
          <div className="right_col" role="main">
            <div className="row">
              <div className="col-md-12">
                <div className="title_new_at">Manual BookMaker Odds
                  <div className="pull-right"><button className="btn_common" onClick={() => this.props.history.goBack()}>Back</button> </div>
                </div>
              </div>
              <div className="col-md-12"><br></br></div>
              <div className="col-md-12" style={{paddingLeft:'5rem', marginBottom:"1rem"}}>
                <button className="btn_common"style={{padding:'5px',fontSize:'15px'}} onClick={() => this.importManualBookMakerOdds()}>Import Manual BookMaker Odds</button>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div id="divLoading"> </div>
                <div className="custom-scroll appendAjaxTbl" id="filterdata">
                  <table className="table table-bordered table-dark table_new_design" id="datatablesss">
                    <thead>
                      <tr className="headings">
                        {
                          this.state.tableHead.map((item,index)=><th className="text-center" key={index}>{item}</th>)
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.marketata.length > 0 ?
                          this.state.marketata.map((item,index) => {
                            return (
                              <tr key={index} style={item.favoriteteam?{backgroundColor: '#95335c', color:"#FFF" }:null}>
                                  <td>{index+1}</td>
                                  <td>{item.marketId}</td>
                                  <td>{item.runnerName}</td>
                                  <td><input type="radio" name="favoriteteam" onChange={(e)=>this.favoriteteamstatus(item.marketId,item._id)} value="OPEN" checked={item.favoriteteam} style={{height: '20px',width: '20px'}} className="form-control" /></td>
                                  <td className="back_heading_color text-center">
                                      <label>Price:
                                        <input onKeyUp={this.onKeyUp} defaultValue={BackOdds[index]} type="number" required alt={item._id} id={"backprice"+item._id} name ="manualBackOdds"  style={{height:'20px',width:'50px'}}/></label><br/>
                                      <label>Size:&nbsp;&nbsp;
                                        <input onKeyUp={this.onKeyUp} defaultValue={item.manualBackSize} type="text" required alt={item._id} id={"backsize"+item._id} name ="manualBackSize"  style={{outline:'none',height:'20px',width:'50px'}}/></label>
                                  </td>
                                  <td className="lay_heading_color text-center">
                                      <label>Price: {LayOdds[index]}
                                        {/* <input onKeyUp={this.onKeyUp} defaultValue={LayOdds[index]} type="text" required alt={item._id} id={"layprice"+item._id} name ="manualLayOdds" style={{height:'20px',width:'50px'}}/> */}
                                        </label><br/>
                                      <label>Size:&nbsp;&nbsp;
                                        <input onKeyUp={this.onKeyUp} defaultValue={item.manualLaySize} type="text" required alt={item._id} id={"laysize"+item._id} name ="manualLaySize"  style={{outline:'none',height:'20px',width:'50px'}}/></label>
                                  </td>
                                  <td className="red text-center">
                                  {
                                    <div style={{display:'flex'}}>
                                      <input type="radio" onChange={(e)=>this.handlemanualSatus(e,item._id)} id={"status"+item._id} value="OPEN" checked={item.status==="OPEN"} name={"status"+item._id} style={{height: '20px',width: '20px'}} className="form-control" />
                                      &nbsp;<label for="CLOSED">OPEN</label>&nbsp;
                                      <input type="radio" onChange={(e)=>this.handlemanualSatus(e,item._id)} id={"status"+item._id} value="SUSPENDED" checked={item.status==="SUSPENDED"} name={"status"+item._id} style={{height: '20px',width: '20px'}} className="form-control" />
                                      &nbsp;<label for="SUSPENDED">SUSPENDED</label>&nbsp;
                                    </div>
                                  }
                                  </td> 
                              </tr>
                            )
                          }):
                        <tr>
                          <td className="text-center" colSpan={9}>Empty...!</td>
                        </tr>
                      }
                        <tr>
                          <td className="text-center" colSpan={9}>Back And Lay Price Difference: 
                          {/* <Select
                          defaultValue={this.state.bookmakerstatus[0]?.oddsdiffBackLay}
                          value={this.state.bookmakerstatus[0]?.oddsdiffBackLay}
                          onChange={this.onKeyUp}
                          options={1,2,3,4,5,6}
                          /> */}
                          <select name="oddsdiffBackLay" value={this.state.bookmakerstatus[0]?.oddsdiffBackLay}  onChange={this.handleChangeoddsdiffBackLay}>
                          <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select></td>
                        </tr>
                        <tr>
                          <td className="text-center" colSpan={9}><input type="checkbox"  checked={this.state.bookmakerstatus[0]?.isEnabled} name ="isEnable" onClick={() => this.lockBookMaker(this.state.bookmakerstatus[0]?.marketId, this.state.bookmakerstatus[0]?.marketName)} style={{height: '10px',width: '10px'}}/>BookMaker isEnable <input type="checkbox"  checked={this.state.bookmakerstatus[0]?.isVisible} name ="isVisible" onClick={() => this.visibleBookMaker(this.state.bookmakerstatus[0]?.marketId, this.state.bookmakerstatus[0]?.marketName)} style={{height: '10px',width: '10px'}}/>BookMaker isVisible <input type="checkbox"  checked={this.state.bookmakerstatus[0]?.betAcceptandAvoid} name ="betAcceptandAvoid" onClick={() => this.acceptAvoidBookMakerBets(this.state.bookmakerstatus[0]?.marketId, this.state.bookmakerstatus[0]?.marketName)} style={{height: '10px',width: '10px'}}/>Accept And Avoid Bets</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}