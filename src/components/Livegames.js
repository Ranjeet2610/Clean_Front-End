import React, { Component } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import  Inplay from '../images/inplay.png';
import Loader from 'react-loader-spinner'
import Utilities from "./utilities";
import livegame from "../images/livegame.jpg"
import Sidebar from "./Sidebar";
import Footer from "./footer";
import Service from "../Services/Service";
import Users from '../Services/users';
import LivEvents from '../Services/livevents'

class Livegames extends Component {
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
    /*********************************/
    axios.post('https://apiauth.hypexone.com/login',{username: 'kld',password: 'cySBkdEilae0Jd9Z8Y+tOuNiuX5GpRQ6ppW3eBjQfGeeSD0eFLK5Q9RZ1bPosRdNjep2d9QEBdxNYKv2j/G059ncihRzVFaYZDOhds8lZciDWoOzYyp+1jjGvJS5iMWIFwcreqvvrjxDJ2sCqdQnTaLHa1ClmJ686IW9dfjU9AQ=',uuid : this.generateUUID()})
    .then(async(response) => {
        //return response.data.jwtToken;
        await new Promise((resolve, reject) => setTimeout(resolve, 500));
        //console.log(response.data.jwtToken);
        var config = {
            crossDomain: true,
            mode: "cors",
            method: "POST", // POST, PUT, DELETE, etc.
            headers: {
              // the content type header value is usually auto-set
              // depending on the request body
              'Content-Type':'application/json'
            },
            body: JSON.stringify({"token":response.data.jwtToken,"operatorId":"9281"}), // string, FormData, Blob, BufferSource, or URLSearchParams
            referrer: "", // or "" to send no Referer header,
            accept: "application/json, text/plain, */*",
            // or an url from the current origin
            referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
            mode: "cors", // same-origin, no-cors
            credentials: "same-origin", // omit, include
            cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
            redirect: "follow", // manual, error
            integrity: "", // a hash, like "sha256-abcdef1234567890"
            keepalive: false, // true
            signal: undefined, // AbortController to abort request
            window: window // null
        };
        fetch('https://fawk.app/operator/auth', config).then(response => {
            return response.json();
          }, "jsonp").then(res => {
                fetch('https://fawk.app/menu/home/567',
                {
                    crossDomain: true,
                    mode: "cors",
                    method: 'GET', 
                    headers:{
                        'x-access-token': res.result.sessionId
                    },
                    referrer: "", // or "" to send no Referer header,
                    accept: "application/json, text/plain, */*",
                    // or an url from the current origin
                    referrerPolicy: "no-referrer-when-downgrade", // no-referrer, origin, same-origin...
                    mode: "cors", // same-origin, no-cors
                    credentials: "same-origin", // omit, include
                    cache: "default", // no-store, reload, no-cache, force-cache, or only-if-cached
                    redirect: "follow", // manual, error
                    integrity: "", // a hash, like "sha256-abcdef1234567890"
                    keepalive: false, // true
                    signal: undefined, // AbortController to abort request
                    window: window // null
            }).then(response => {
                return response.json();
              }, "jsonp").then(res => {
                this.setState({
                    cricketData:res.result.children,
                    load: false
                  })
                  console.log(res.result.children);
              }).catch(err => console.log(err));
        }).catch(err => console.log(err))
    }).catch((error) => console.log(error));
    //https://apiauth.hypexone.com/login
    //https://fawk.app/menu/home/567
    //https://fawk.app/api/exchange/odds/56767
    //https://fawk.app/result/past_result?gameId=67564
    //password: password encode
    //cySBkdEilae0Jd9Z8Y+tOuNiuX5GpRQ6ppW3eBjQfGeeSD0eFLK5Q9RZ1bPosRdNjep2d9QEBdxNYKv2j/G059ncihRzVFaYZDOhds8lZciDWoOzYyp+1jjGvJS5iMWIFwcreqvvrjxDJ2sCqdQnTaLHa1ClmJ686IW9dfjU9AQ=
    //OSwMH5+LkDK08pv/cojxrWSLGy5aKjdxfSwpxxIKp7Z2XW5NK8XuLVYTEUwRUwvnLTHxnbnDj0TS9aU4Dj0dGQlC9UJ2iCyclHIyYHzE7SE7BtJFaCloYvijDPi0535qiFa3Y53Wn1I3XlXLE2XNX5BcybjS2z74jtspzkaSOAM=
    /*********************************/
}
  generateUUID = () => { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }


  matchOddspage = async(txt,eventName,runners,date,sportType) => {
    this.setState({
      load:false
    })
    window.location.href = window.location.protocol + "//" + window.location.host + "/matchodds/" + txt;
    localStorage.setItem("matchname", JSON.stringify({name:eventName,date:date,sport:sportType}));
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
                            <Link to="#" className="blinking">Live games</Link>
                          </span>
                        </div>
                        
                        <div className="sports_box hidden-lg">
                          <div className="tittle_sports">
                            <span className="item_sport"><img src={livegame}/></span>
                            Live Casino Games
                          </div>
                        </div>

                        <div className="matches-all">
                          <span id="msg_error" /><span id="errmsg" />
                          
                          {
                          ////////////////////////////// CASINO LIVE DATA /////////////////////////////////////////
                          }

                          {
                          (this.state.cricketStatus && !this.state.inplay) &&
                          <div className="sports_box">
                            <div className="tittle_sports">
                              <span className="item_sport">
                                <img src={livegame} />
                              </span>
                              Casino
                            </div>
                            {
                              this.state.cricketData.length <= 0 ? null :
                                this.state.cricketData.map((item,index) => {
                                  return (
                                    <div key={index}>
                                      <div id="user_row_" className="sport_row sportrow-4 matchrow-29894585" title="Match OODS" >
                                        <div className="sport_name">
                                          <Link to="#" onClick={() => this.matchOddspage(item.eventId,item.eventName,item.runners,item.OpenDate,item.eventType) }>
                                            {item.name}
                                          </Link>
                                          
                                          <span id="fav29894585">
                                            <i className="fa fa-star-o" aria-hidden="true" />
                                          </span>
                                        </div>
                                        <div className="match_status">
                                          <span className="inplay_txt"> {item.status}</span>
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
export default Livegames;