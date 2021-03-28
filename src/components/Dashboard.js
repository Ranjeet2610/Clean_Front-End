import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import  Inplay from '../images/inplay.png';
import Loader from 'react-loader-spinner'
import Utilities from "./utilities";
import cbicon from "../images/cricket-ico.png"
import tbicon from "../images/tennis-ico.png"
import fbicon from "../images/soccer-ico.png"
import livegame from "../images/livegame.jpg"
import Sidebar from "./Sidebar";
import Footer from "./footer";
import Service from "../Services/Service";
import Users from '../Services/users';
import LivEvents from '../Services/livevents'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load:false,
      data: "",
      data1: "",
      name: "",
      userName: "",
      password: "",
      master: "",
      tenisData: [],
      soccerData: [],
      cricketData: [],
      redirectToReferrer: false,
      odds: "",
      InitialOdds: {},
      soccerStatus:[],
      tennisStatus:[],
      cricketStatus:[],
      inplayEvents:[],
      inplay:false
    };
    this.service = new Service();
    this.livevents = new LivEvents();
    this.users =new Users();
    this.odds = "";
  }

  componentDidMount() {
    this.setState({
        load:true
      })
    this.getallsports();
    this.service.getLiveEvents(data=>{
      const dataFFilter = data.data.Data.filter((ele)=>ele.eventType===1)
      const dataTFilter = data.data.Data.filter((ele)=>ele.eventType===2)
      const dataCFilter = data.data.Data.filter((ele)=>ele.eventType===4)
      const inplayData = data.data.Data.filter((ele)=>new Date(ele.OpenDate).getTime()<new Date().getTime())
      this.setState({
        inplayEvents:inplayData,
        soccerData:dataFFilter,
        tenisData:dataTFilter, 
        cricketData:dataCFilter,
        load: false
      })
    });
  }

  getallsports = () => {
    this.setState({
      load: true
    })
    this.users.getallsports(data=>{
      this.setState({ 
        data:data.data.data 
      })
      this.setState({
        load: false
      })
      let sStatus = this.state.data.filter((e)=>e.eventType===1)
      let tStatus = this.state.data.filter((e)=>e.eventType===2)
      let cStatus = this.state.data.filter((e)=>e.eventType===4)
      this.setState({
        soccerStatus:sStatus[0].status,
        tennisStatus:tStatus[0].status,
        cricketStatus:cStatus[0].status,
      })
    })
  }

  matchOddspage = async(txt,eventName,runners,date,sportType) => {
    this.setState({
      load:false
    })
    //alert(JSON.stringify(runners));
    let team;
    let team1 = await this.getTeam(0,eventName,runners);
    let team2 = await this.getTeam(1,eventName,runners);
    if(typeof(team1) !== 'undefined' && typeof(team2) !== 'undefined'){
      team = team1+" v "+team2;
    }else{
      team = eventName;
    }
    window.location.href = window.location.protocol + "//" + window.location.host + "/matchodds/" + txt;
    localStorage.setItem("matchname", JSON.stringify({name:eventName,date:date,sport:sportType}));
    this.setState({
      load:true
    })
  }
  getTeam = (sel,eventName,runners) => {
    let getTeam;
    let teams = eventName.split(" v ");
    let teamsel = teams[sel].split(" ");
    runners.length > 0 &&
    runners.map((item,index) => {
        let team1str = item.runnerName.split(" ");
        if(team1str.length>=1){
            if(teams[sel]===item.runnerName){
                getTeam = item.runnerName;
            }else if(teams[sel]===team1str[0] || teams[sel]===team1str[1]){
                getTeam = item.runnerName;
            }else if((teamsel[0].slice(0, 1)+' '+teamsel[1])===(team1str[0].slice(0, 1)+' '+team1str[1])){
                getTeam = item.runnerName;
            }else if(item.runnerName.includes(teams[sel])){
                getTeam = item.runnerName;
            }
            if(getTeam==="" && teamsel.length>1){
                if(item.runnerName.includes(teamsel[0])){
                    getTeam = item.runnerName;
                }else if(item.runnerName.includes(teamsel[1])){
                    getTeam = item.runnerName;
                }
            }
            if(getTeam==="" && team1str.length>2){
                if(teams[sel]===team1str[2]){
                    getTeam = item.runnerName;
                }else if(teams[sel]===(team1str[0].slice(0, 1)+' '+team1str[1]+' '+team1str[2]) || teams[sel]===(team1str[0].slice(0, 1)+' '+team1str[1].slice(0, 1)+' '+team1str[2])){
                    getTeam = item.runnerName;
                }
            }
        }else{
            getTeam = item.runnerName;
        }
    })
    return getTeam;
  }
  render() {
    return (
      <div>
        {
          this.state.load ?
            <div style={{opacity:'0.8', height:'100vh', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
                <Loader type="Grid" color="#6c1945" height={100} width={100} />
            </div> :
          <div>
          <Navbar />
          <Sidebar />
          <div className="forModal" />
        
          <div className="container body">
            <div className="main_container" id="sticky">
              <div className="right_col" role="main">
                <div className="fullrow tile_count">
                  <div className="col-md-8">
                    <div id="UpCommingData">
                      <div className="sport-highlight-content tabs" id="accountView" role="main" >
                        <div className="casinobg">
                          <span>
                            <Link to="#" className="blinking">
                              Live games
                            </Link>
                          </span>
                        </div>
                        
                        <div className="sports_box hidden-lg">
                          <div className="tittle_sports">
                            <span className="item_sport">
                              <img src={livegame} />
                            </span>
                            Live Casino Games
                          </div>
                        </div>

                        <div className="matches-all">
                          <span id="msg_error" /><span id="errmsg" />
                          
                          {
                          ////////////////////////////// CRICKET LIVE DATA /////////////////////////////////////////
                          }

                          {
                          (this.state.cricketStatus && !this.state.inplay) &&
                          <div className="sports_box">
                            <div className="tittle_sports">
                              <span className="item_sport">
                                <img src={cbicon} />
                              </span>
                              Cricket
                            </div>
                            {
                              this.state.cricketData.length <= 0 ? null :
                                this.state.cricketData.map((item,index) => {
                                  let inplay ;let eventDate;
                                  // let oddsDB = {
                                  //   item:item?.runners[0]?.backOdds,
                                  //   item:item?.runners[0]?.backOdds,
                                  //   item:item?.runners[0]?.backOdds,
                                  //   item:item?.runners[0]?.backOdds,
                                  //   item:item?.runners[0]?.backOdds,
                                  //   item:item?.runners[0]?.backOdds,
                                  // }
                                  // console.log(item);
                                  if(new Date(item.OpenDate).getTime()>new Date().getTime()){
                                    inplay ='GOING IN-PLAY';
                                  }
                                  else{
                                    inplay = 'IN-PLAY';
                                  }
                                  eventDate = Utilities.displayDateTime(item.OpenDate);
                                  return (
                                    <div key={index}>
                                      <div id="user_row_" className="sport_row sportrow-4 matchrow-29894585" title="Match OODS" >
                                        <div className="sport_name">
                                          <Link to="#" onClick={() => this.matchOddspage(item.eventId,item.eventName,item.runners,item.OpenDate,item.eventType) }>
                                            {item.eventName}
                                          </Link>
                                          <time>
                                            <i className="fa fa-clock-o" />&nbsp;{eventDate}
                                          </time>
                                          <span id="fav29894585">
                                            <i className="fa fa-star-o" aria-hidden="true" />
                                          </span>
                                        </div>
                                        <div className="match_status">
                                          <span className="inplay_txt"> {inplay}</span>
                                        </div>
                                        <div className="match_odds_front">
                                          <span className="back-cell">{item?.runners[0]?.backOdds?item.runners[0].backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[0]?.layOdds?item?.runners[0]?.layOdds:0}</span>
                                          <span className="back-cell">{item?.runners[2]?.backOdds?item?.runners[2]?.backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[2]?.layOdds?item?.runners[2]?.layOdds:0}</span>
                                          <span className="back-cell">{item?.runners[1]?.backOdds?item.runners[1]?.backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[1]?.layOdds?item?.runners[1]?.layOdds:0}</span>
                                      </div> 
                                      </div>
                                    </div>
                                  );
                                })
                            }
                          </div>
                          }

                          {
                          /////////////////////////////// TENNIS LIVE DATA //////////////////////////////////////////
                          }

                          {
                            (this.state.tennisStatus && !this.state.inplay) &&
                          <div className="sports_box">
                            <div className="tittle_sports">
                              <span className="item_sport"><img src={tbicon} /></span>Tennis
                            </div>
                            {
                              this.state.tenisData.length <= 0 ? null :
                                this.state.tenisData.map((item,index) => {
                                  let inplay ;let eventDate;
                                  if(new Date(item.OpenDate).getTime()>new Date().getTime()){
                                    inplay ='GOING IN-PLAY';
                                  }
                                  else{
                                    inplay = 'IN-PLAY';
                                  }
                                  eventDate = Utilities.displayDateTime(item.OpenDate);
                                  return (
                                    <div key={index} id="user_row_" className="sport_row sportrow-4  matchrow-29894585" title="Match OODS" >
                                      <div className="sport_name">
                                        <Link to="#" onClick={() => this.matchOddspage(item.eventId,item.eventName,item.runners,item.OpenDate,item.eventType)}>
                                          {item.eventName}
                                        </Link>
                                        <time>
                                          <i className="fa fa-clock-o" />&nbsp;{eventDate}
                                        </time>
                                        <span id="fav29894585">
                                          <i className="fa fa-star-o" aria-hidden="true" />
                                        </span>
                                      </div>
                                      <div className="match_status">
                                        <span className="inplay_txt"> {inplay}</span>
                                      </div>
                                      <div className="match_odds_front">
                                          <span className="back-cell">{item?.runners[0]?.backOdds?item.runners[0].backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[0]?.layOdds?item?.runners[0]?.layOdds:0}</span>
                                          <span className="back-cell">{item?.runners[2]?.backOdds?item?.runners[2]?.backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[2]?.layOdds?item?.runners[2]?.layOdds:0}</span>
                                          <span className="back-cell">{item?.runners[1]?.backOdds?item.runners[1]?.backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[1]?.layOdds?item?.runners[1]?.layOdds:0}</span>
                                      </div> 
                                    </div>
                                  );
                                })
                            }
                          </div>
                          }
                          
                          {
                          /////////////////////////////// SOCCER LIVE DATA ///////////////////////////////////////////
                          }

                          {
                            (this.state.soccerStatus && !this.state.inplay) &&
                          <div className="sports_box">
                            <div className="tittle_sports">
                              <span className="item_sport"><img src={fbicon}/></span>Soccer
                            </div>
                            {
                              this.state.soccerData.length <= 0 ? null :
                                this.state.soccerData.map((item,index) => {
                                  let inplay ;let eventDate;
                                  if(new Date(item.OpenDate).getTime()>new Date().getTime()){
                                    inplay ='GOING IN-PLAY';
                                  }
                                  else{
                                    inplay = 'IN-PLAY';
                                  }
                                  eventDate = Utilities.displayDateTime(item.OpenDate);
                                  return (
                                    <div key={index} id="user_row_" className="sport_row sportrow-4  matchrow-29894585" title="Match OODS" >
                                      <div className="sport_name">
                                        <Link to="#" onClick={() => this.matchOddspage(item.eventId,item.eventName,item.runners,item.OpenDate,item.eventType)}>
                                          {item.eventName}
                                        </Link>
                                        <time>
                                          <i className="fa fa-clock-o" />&nbsp;{eventDate}
                                        </time>
                                        <span id="fav29894585">
                                          <i className="fa fa-star-o" aria-hidden="true" />
                                        </span>
                                      </div>
                                      <div className="match_status">
                                        <span className="inplay_txt"> {inplay}</span>
                                      </div>
                                      <div className="match_odds_front">
                                          <span className="back-cell">{item?.runners[0]?.backOdds?item.runners[0].backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[0]?.layOdds?item?.runners[0]?.layOdds:0}</span>
                                          <span className="back-cell">{item?.runners[2]?.backOdds?item?.runners[2]?.backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[2]?.layOdds?item?.runners[2]?.layOdds:0}</span>
                                          <span className="back-cell">{item?.runners[1]?.backOdds?item.runners[1]?.backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[1]?.layOdds?item?.runners[1]?.layOdds:0}</span>
                                      </div> 
                            
                                    </div>
                                  );
                                })    
                            }
                          </div>
                          }

                          {
                            /////////////////////////// INPLAY EVENTS /////////////////////////////////////////////
                          }
                          {
                          this.state.inplay &&
                          <div className="sports_box">
                            <div className="tittle_sports">
                              <span className="item_sport"><img src={Inplay}/></span>In Play
                            </div>
                            {
                              this.state.inplayEvents.length <= 0 ? null :
                                this.state.inplayEvents.map((item,index) => {
                                  let inplay ;let eventDate;
                                  if(new Date(item.OpenDate).getTime()>new Date().getTime()){
                                    inplay ='GOING IN-PLAY';
                                  }
                                  else{
                                    inplay = 'IN-PLAY';
                                  }
                                  eventDate = Utilities.displayDateTime(item.OpenDate);
                                  return (
                                    <div key={index} id="user_row_" className="sport_row sportrow-4  matchrow-29894585" title="Match OODS" >
                                      <div className="sport_name">
                                        <Link to="#" onClick={() => this.matchOddspage(item.eventId,item.eventName,item.runners,item.OpenDate,item.eventType)}>
                                          {item.eventName}
                                        </Link>
                                        <time>
                                          <i className="fa fa-clock-o" />&nbsp;{eventDate}
                                        </time>
                                        <span id="fav29894585">
                                          <i className="fa fa-star-o" aria-hidden="true" />
                                        </span>
                                      </div>
                                      <div className="match_status">
                                        <span className="inplay_txt"> {inplay}</span>
                                      </div>
                                      <div className="match_odds_front">
                                          <span className="back-cell">{item?.runners[0]?.backOdds?item.runners[0].backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[0]?.layOdds?item?.runners[0]?.layOdds:0}</span>
                                          <span className="back-cell">{item?.runners[2]?.backOdds?item?.runners[2]?.backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[2]?.layOdds?item?.runners[2]?.layOdds:0}</span>
                                          <span className="back-cell">{item?.runners[1]?.backOdds?item.runners[1]?.backOdds:0}</span>
                                          <span className="lay-cell">{item?.runners[1]?.layOdds?item?.runners[1]?.layOdds:0}</span>
                                      </div> 
                                    </div>
                                  );
                                })    
                            }
                          </div>
                          }

                        { this.state.Inplay &&
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
                        }

                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {
                    //////////////////////// TOP CASINO GAMES //////////////////////////////
                  }

                  <div className="col-md-4 col-xs-12">
                    <div className="other-items">
                      <div className="balance-box">
                        <div className="panel-heading">
                          <h3 className="bal-tittle">Top Casino Games </h3>
                          <span className="pull-right clickable">
                            <i className="fa fa-chevron-down"></i>
                          </span>
                        </div>
                        <div className="balance-panel-body"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Footer />
            </div>
          </div>
        </div>
        }
      </div>
    );
  }
}
export default Dashboard;