import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Loader from 'react-loader-spinner'
import Utilities from "./utilities";
import cbicon from "../images/cricket-ico.png"
import tbicon from "../images/tennis-ico.png"
import fbicon from "../images/soccer-ico.png"
import livegame from "../images/livegame.jpg"
import Sidebar from "./Sidebar";
import Footer from "./footer";
import Service from "../Services/Service";
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
      tenisData: "",
      soccerData: "",
      redirectToReferrer: false,
      odds: "",
      liveEvents: "",
      InitialOdds: {},
    };
    this.service = new Service();
    this.livevents = new LivEvents();
    this.odds = "";
  }

  componentDidMount() {
    this.setState({
      load:true
    })
    // this.service.getdashboardData("2", (data) => {
    //   this.setState({
    //     tenisData: data,
    //     load:false
    //   });
    // });
    // this.service.getdashboardData("1", (data) => {
    //   this.setState({
    //     soccerData: data,
    //     load:false
    //   });
    // });

    let eveodds = [];

    this.service.getLiveEvents((data) => {
      data.data.Data.map((item) => {
        this.service.getEventInitialOdds(item.eventId, (data) => {
          eveodds.push({
            events: item,
            odds: data.data,
          });
          this.setState({
            liveEvents: eveodds,
            load:false
          });
        });
      });
    })
  }

  next(txt, name,date) {
    this.setState({
      load:false
    })
    window.location.href = window.location.protocol + "//" + window.location.host + "/matchodds/" + txt;
    localStorage.setItem("matchname", JSON.stringify({name:name,date:date}));
    this.setState({
      load:true
  })
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

                          <div className="sports_box">
                            <div className="tittle_sports">
                              <span className="item_sport">
                                <img src={cbicon} />
                              </span>
                              Cricket
                            </div>
                            {
                              this.state.liveEvents.length <= 0 ? null :
                                this.state.liveEvents.map((item,index) => {
                                  let inplay ;let eventDate;
                                  if(new Date(item.events.OpenDate).getTime()>new Date().getTime()){
                                    inplay ='GOING IN-PLAY';
                                  }
                                  else{
                                    inplay = 'IN-PLAY';
                                  }
                                  eventDate = Utilities.displayDateTime(item.events.OpenDate);
                                  return (
                                    <div key={index}>
                                      <div id="user_row_" className="sport_row sportrow-4 matchrow-29894585" title="Match OODS" >
                                        <div className="sport_name">
                                          <Link to="#" onClick={() => this.next(item.events.eventId, item.events.eventName,item.events.OpenDate) }>
                                            {item.events.eventName}
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
                                          <span className="back-cell">{item.odds.odds1}</span>
                                          <span className="lay-cell">{item.odds.odds2}</span>
                                          <span className="back-cell">{item.odds.odds3}</span>
                                          <span className="lay-cell">{item.odds.odds4}</span>
                                          <span className="back-cell">{item.odds.odds5}</span>
                                          <span className="lay-cell">{item.odds.odds6}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                            }
                          </div>

                          {
                          /////////////////////////////// TENNIS LIVE DATA //////////////////////////////////////////
                          }

                          {/* <div className="sports_box">
                            <div className="tittle_sports">
                              <span className="item_sport"><img src={tbicon} /></span>Tennis
                            </div>
                            {
                              this.state.tenisData.length <= 0 ? null :
                                this.state.tenisData.map((item,index) => {
                                  let inplay ;let eventDate;
                                  if(new Date(item.event.openDate).getTime()>new Date().getTime()){
                                    inplay ='GOING IN-PLAY';
                                  }
                                  else{
                                    inplay = 'IN-PLAY';
                                  }
                                  eventDate = Utilities.displayDateTime(item.event.openDate);
                                  return (
                                    <div key={index} id="user_row_" className="sport_row sportrow-4  matchrow-29894585" title="Match OODS" >
                                      <div className="sport_name">
                                        <Link to="#" onClick={() => this.next(item.event.id, item.event.name)}>
                                          {item.event.name}
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
                                        <span className="back-cell">{this.marketCount}</span>
                                        <span className="lay-cell">250</span>
                                        <span className="back-cell">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span className="lay-cell">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span className="back-cell">0</span>
                                        <span className="lay-cell">1.01</span>
                                      </div>
                                    </div>
                                  );
                                })
                            }
                          </div> */}

                          {
                          /////////////////////////////// SOCCER LIVE DATA ///////////////////////////////////////////
                          }

                          {/* <div className="sports_box">
                            <div className="tittle_sports">
                              <span className="item_sport"><img src={fbicon}/></span>Soccer
                            </div>
                            {
                              this.state.soccerData.length <= 0 ? null :
                                this.state.soccerData.map((item,index) => {
                                  let inplay ;let eventDate;
                                  if(new Date(item.event.openDate).getTime()>new Date().getTime()){
                                    inplay ='GOING IN-PLAY';
                                  }
                                  else{
                                    inplay = 'IN-PLAY';
                                  }
                                  eventDate = Utilities.displayDateTime(item.event.openDate);
                                  return (
                                    <div key={index} id="user_row_" className="sport_row sportrow-4  matchrow-29894585" title="Match OODS" >
                                      <div className="sport_name">
                                        <Link to="#" onClick={() => this.next(item.event.id, item.event.name)}>
                                          {item.event.name}
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
                                        <span className="back-cell">{this.marketCount}</span>
                                        <span className="lay-cell">250</span>
                                        <span className="back-cell">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span className="lay-cell">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <span className="back-cell">0</span>
                                        <span className="lay-cell">1.01</span>
                                      </div>
                                    </div>
                                  );
                                })    
                            }
                          </div> */}
                        
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
