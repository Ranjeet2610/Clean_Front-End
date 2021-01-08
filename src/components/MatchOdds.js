import React, { Component } from "react";
import Navbar from "./Navbar";
import tv from "../images/tv-screen.png";
import Sidebar from "./Sidebar";
import Sidebet from "./SideBet";
import "../App.css";
import Service from "../Services/Service";
import LiveEvents from "../Services/livevents";
import Footer from "./footer";
import BetBox from "./Betbox";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Sound from "../images/Recording.mp3";
import Loader from 'react-loader-spinner'

export default class MatchOdds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load:false,
      avilBlack: [
        {
          price: 0,
          size: 0.0
        },
        {
          price: 0,
          size: 0.0
        },
        {
          price: 0,
          size: 0.0
        }
      ],
      availLay: [
        {
          price: 0,
          size: 0.0
        },
        {
          price: 0,
          size: 0.0
        },
        {
          price: 0,
          size: 0.0
        }
      ],
      tableTd: ["0", "0", "0", "0", "0", "0"],
      bookArr: [],
      zeroStatus: "false",
      betProfit: 0,
      betLoss: 0,
      notifyMsg: "",
      display_status: "none",
      bgColor: "",
      notifyStatus: '',
      data: "",
      userName: "",
      description: "",
      selection: "",
      odds: "",
      stack: "",
      status: "",
      bettype: "",
      marketOdds: "",
      betData: "",
      betProfit: "",
      betLoss: "",
      display: ["none", "none", "none"],
      isenable: true,
      fancyOdds: "",
      fancymarket: "",
      exporunnerdata: "",
      matchName: JSON.parse(localStorage.getItem("matchname")).name !== undefined ? JSON.parse(localStorage.getItem("matchname")).name : " v ",
      timer: "",
      redirectToReferrer: false,
    };
    this.userDetails = JSON.parse(localStorage.getItem("data")) !== undefined ? JSON.parse(localStorage.getItem("data")) : "";
  }

  handleInputValue(val) {
    let profit;
    let loss;
    let odds = this.state.betData.odds - 1;
    if (this.state.betData.type === "Back") {
      profit = Math.round(odds * val);
      loss = val ? val : 0.0;
    } else {
      profit = val;
      loss = Math.round(odds * val);
    }
  }

  StaKeAmount(ods, type) {
    let val = document.getElementById("stakeValue").value;
    let odds = ods - 1;
    if (type === "Back") {
      this.setState({
        betProfit: Math.round(odds * val),
        betLoss: val ? val : 0.0,
      });
    } else {
      this.setState({
        betProfit: val,
        betLoss: Math.round(odds * val),
      });
    }
  }

  placeBet(type, odds, data, pdata, mid, index, width) {
    let displayTest;
    if (this.userDetails.Master !== true && this.userDetails.Admin !== true && this.userDetails.superAdmin !== true) {
      if (width <= 991) {
        displayTest = [...this.state.display];
        displayTest.forEach((item, i) => {
          if (i === index) {
            displayTest[index] = "block";
          } else {
            displayTest[i] = "none";
          }
        });
      } else {
        displayTest = "block";
      }
      this.setState({
        betData: {
          data: data,
          pData: pdata,
          type: type,
          odds: odds,
          mid: mid[0].marketId,
        },
        display: displayTest,
        toggleMatchIndex: index
      });
      this.StaKeAmount(odds, type);
      // setTimeout(() => {
      //   document.getElementById('stakeValue').value=0
      //   this.setState({
      //     display:'none',
      //     betProfit:0,
      //     betLoss:0,
      //     color:"green"
      //   })
      // }, 6000);
    }
  }

  betfancy(type, odds, data, pdata, selectoionData, mid, fancyType) {
    if (this.userDetails.Master !== true && this.userDetails.Admin !== true && this.userDetails.superAdmin !== true) {
      let fullData = Object.assign(pdata, {
        runnerName: selectoionData.runnerName,
        selectionId: selectoionData.selectionId,
      });
      this.setState({
        betData: {
          data: data,
          pData: fullData,
          type: type,
          odds: odds,
          mid: mid,
          betType: "Fancy",
          fancyType: fancyType,
        },
        display: "block",
      });
    }
    // setTimeout(() => {
    //   document.getElementById('stakeValue').value=0
    //   this.setState({
    //     display:'none',
    //     betProfit:0,
    //     betLoss:0,
    //     color:"green"
    //   })
    // }, 6000);
  }

  componentDidMount() {
    var service = new Service();
    var livevents = new LiveEvents();
    this.setState({
      load:true
    })
    this.interval = setInterval(() => {
      service.getListMarketType(this.props.match.params.id, (data) => {
        this.setState({
          marketOdds: data.odsData,
          isenable: data.isEnabled,
          data: data.pdata,
        });
      });
      livevents.getFancyMarket(this.props.match.params.id, (data) => {
        this.setState({
          fancyOdds: data.fodds,
          fancymarket: data.fancymarket,
        });
      });
      service.getLiveCricketScore((data) => {
        // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",data);
      })
    }, 1000);
    
    this.setState({
      load:false
    })

    let countDownDate = new Date(JSON.parse(localStorage.getItem("matchname")).date).getTime();
    var myfunc = setInterval(() => {
      var now = new Date().getTime();
      var timeleft = countDownDate - now;

      // Calculating the days, hours, minutes and seconds left
      var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
      var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
      this.setState({
        timer: days + "d " + hours + "h " + minutes + "m " + seconds + "s ",
      });

      // Display the message when countdown is over
      if (timeleft < 0) {
        clearInterval(myfunc);
        this.setState({
          timer: "",
        });
      }
    }, 1000);

    const obj = {
      eventID: this.props.match.params.id,
      userid: this.userDetails.id
    }
    service.geteventExpo(obj, (data) => {
      this.setState({
        exporunnerdata: data.data.runnersData,
      });
    }
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleRemove = (style, num, index) => {
    let displayTest;
    if (index !== 'desktop') {
      displayTest = this.state.display;
      displayTest[index] = style;
    } else {
      displayTest = style;
    }

    this.setState({
      display: displayTest,
      betLoss: num,
      betProfit: num,
      color: 'green',
    });
  };

  handleBetPlaceBox = (notfyMsg, bgColor, notfyStatus) => {
    this.setState({
      notifyMsg: notfyMsg,
      // display_status: 'block',
      bgColor: bgColor,
      notifyStatus: notfyStatus
    })
    switch (notfyStatus) {
      case 'success':
        NotificationManager.success(notfyMsg,"Success");
        const audioEl = document.getElementsByClassName("audio_element")[0]
        audioEl.play()
        break;
      case 'error':
        NotificationManager.error(notfyMsg,"Error");
        break;
    }
  }

  getProfitandLoss = async (profit, loss, status) => {
    await this.setState({
      betProfit: profit,
      betLoss: loss,
      zeroStatus: status,
      color: "red"
    })
  }

  render() {
    let inplay;
    let runners = this.state.data;
    let expoProfit = 0;
    let avilBlack;
    let availLay;
    if (new Date(JSON.parse(localStorage.getItem("matchname")).date).getTime() > new Date().getTime()) {
      inplay = "GOING IN-PLAY";
    } else {
      inplay = "IN-PLAY";
    }
    return (
      <div>
        <Navbar />
        <Sidebar />
        <NotificationContainer/>
        <audio className="audio_element">
          <source src={Sound} />
        </audio>
        <div className="forModal" />
        {
          this.state.load ? 
          <div style={{opacity:"0.5", height:'100vh', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
            <Loader type="Grid" color="#6c1945" height={100} width={100} />
        </div>:
        <div>
          <div class="container body">
          <div class="main_container" id="sticky">

            {
              ////////////////// NOTIFICATION BOX ////////////////////////////////
            }

            {
            //   <div className="error-box" style={{ border: "5px solid #fff", width: "30rem", height: "110px", textAlign: "center", color: "#fff", position: "absolute", left: "42%", top: "4%", zIndex: "100", display: this.state.display_status, backgroundColor: this.state.bgColor/*"#d63031"*/ }}>
            //   <div className="error-head" style={{ padding: "3px 0" }}>
            //     {this.state.notifyStatus === "s" ? <h2>SUCCESS</h2> : <h2>ERROR</h2>}
            //   </div>
            //   <div className="error-mess" style={{ padding: "5px 0" }}>
            //     <h6>{this.state.notifyMsg}</h6>
            //   </div>
            // </div>
}
            <div class="right_col" role="main">
              <div class="fullrow tile_count">
                <div className="col-md-8">

                  {
                    ////////////////////////HEADER OF SCORE BOARD /////////////////////////////
                  }
                  <div className="modal-header mod-header">
                    <div className="block_box">
                      <span id="tital_change">
                        <span id="fav29905278">
                          <i className="fa fa-star-o" aria-hidden="true" />&nbsp;{this.state.matchName}
                        </span>
                        <input type="hidden" defaultValue="Match Name" id="sportName_29905278" />
                      </span>
                    </div>
                  </div>

                  {
                    /////////////////////// SCORE BOARD ///////////////////////////////////////
                  }

                  <div style={{ height: '140px', width: '100%', backgroundColor: 'darkgreen', paddingTop: '7px', display: 'flex', marginBottom: '25px' }}>
                    <div style={{ borderTopLeftRadius: '5px', paddingTop: '30px', paddingLeft: '35px', borderBottomLeftRadius: '5px', marginLeft: '20px', width: '330px', height: '90px', marginTop: '15px', backgroundColor: '#0a3a06', opacity: '0.5' }}>
                      <span style={{ color: "white", fontSize: '15px' }}>Delhi Capitals</span>
                    </div>
                    <div style={{ width: '330px', paddingTop: '30px', paddingLeft: '35px', height: '120px', borderRadius: '10px', backgroundColor: '#6c191ba8', opacity: '1' }}>
                      <span style={{ color: "white", fontSize: '15px' }}>Cur RR: 5.5</span><br />
                      <span style={{ color: "white", fontSize: '15px' }}>Req RR: 10.6</span><br />
                      <span style={{ color: "white", fontSize: '15px' }}>Over:</span>
                    </div>
                    <div style={{ borderTopRightRadius: '5px', paddingTop: '30px', paddingLeft: '77px', borderBottomRightRadius: '5px', marginRight: '20px', width: '330px', height: '90px', marginTop: '15px', backgroundColor: '#0a3a06', opacity: '0.5' }}>
                      <span style={{ color: "white", fontSize: '15px' }}>Target:180</span>
                    </div>
                  </div>

                  <div id="MatchOddInfo">
                    <div className="fullrow matchBoxMain  matchBox_29905278 matchBoxs_1171389306">
                      <div className="modal-dialog-staff">
                        <div className="match_score_box">

                          {
                            //////////////////////// HEADER OF MATCH ODDS /////////////////////////////////
                          }

                          <div className="modal-header mod-header">
                            <div className="block_box">
                              <span id="tital_change">
                                <span id="fav29905278">
                                  <i className="fa fa-star-o" aria-hidden="true" />&nbsp;{this.state.matchName}
                                </span>
                                <input type="hidden" defaultValue="Match Name" id="sportName_29905278" />
                              </span>
                              <div className="block_box_btn">
                                <button className="btn btn-primary btn-xs">
                                  Bets
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="sportrow-4 matchOpenBox_1171389306">
                          <div className="match-odds-sec">
                            <div className="item match-status">Match Odds</div>
                            <div className="item match-status-odds">
                              <span className="going_inplay"> {inplay} </span>
                              <span className="click-tv">
                                <img className="tv-icons" src={tv} alt="Live Games" />
                              </span>
                            </div>
                            <div className="item match-shedule" id="demo_29905278">{this.state.timer}</div>
                          </div>

                          {
                            //////////////////////// TABLE OF MATCH ODDS /////////////////////////////
                          }

                          <div className="fullrow MatchIndentB" style={{ position: "relative" }}>
                            <table className={`table table-striped  bulk_actions matchTable1171389306 ${this.state.isenable ? "betting-disabled" : ""}`} id="matchTable29905278">
                              <tbody>
                                <tr className="headings mobile_heading">
                                  <th className="fix_heading color_red">Min stake:100 Max stake:50000</th>
                                  <th> </th>
                                  <th> </th>
                                  <th className="back_heading_color">Back</th>
                                  <th className="lay_heading_color">Lay</th>
                                  <th> </th>
                                  <th> </th>
                                </tr>
                              </tbody>
                              {
                                this.state.data.length > 0 ? runners.length > 0 ? runners.map((item, index) => {
                                  if (this.state.exporunnerdata.length > 0) {
                                    expoProfit = this.state.exporunnerdata.filter((itemexpo) => itemexpo.runnerId === item.selectionId).exposure;
                                  }

                                  if (this.state.marketOdds !== undefined) {
                                    if (this.state.marketOdds.length > 0) {
                                      let sordataBack = this.state.marketOdds[0].runners[index].ex.availableToBack.sort(function (a, b) {
                                        return a.price - b.price;
                                      })

                                      if (sordataBack.length < 3) {
                                        sordataBack.unshift({ price: 0, size: 0.0 });
                                      }

                                      avilBlack = sordataBack.map((itemback) => {
                                        return (
                                          <td className="32047099_0availableToBack2_price_1171389306" onClick={() => this.placeBet("Back", this.state.marketOdds[0].runners[index].ex.availableToBack[2].price, itemback, item, this.state.marketOdds, index, window.innerWidth)} >
                                            <span id="32047099_0availableToBack2_price_1171389306">{itemback.price}</span>
                                            <span id="32047099_0availableToBack2_size_1171389306">{itemback.size}</span>
                                          </td>
                                        )
                                      })

                                      let sordataLay = this.state.marketOdds[0].runners[index].ex.availableToLay.sort(function (a, b) {
                                        return a.price - b.price;
                                      })

                                      if (sordataLay.length < 3) {
                                        sordataLay.push({ price: 0, size: 0.0 });
                                      }

                                      availLay = sordataLay.map((itemlay) => {
                                        return (
                                          <td className="32047099_0availableToBack2_price_1171389306" onClick={() => this.placeBet("Lay", this.state.marketOdds[0].runners[index].ex.availableToLay[0].price, itemlay, item, this.state.marketOdds, index, window.innerWidth)} >
                                            <span id="32047099_0availableToBack2_price_1171389306">{itemlay.price}</span>
                                            <span id="32047099_0availableToBack2_size_1171389306">{itemlay.size}</span>
                                          </td>
                                        )
                                      })
                                    }
                                    else {
                                      avilBlack = this.state.avilBlack.map((itemback) => {
                                        return (
                                          <td className="32047099_0availableToBack2_price_1171389306" onClick={() => this.placeBet("Back", this.state.marketOdds[0].runners[index].ex.availableToBack[2].price, itemback, item, this.state.marketOdds, index, window.innerWidth)} >
                                            <span id="32047099_0availableToBack2_price_1171389306">{itemback.price}</span>
                                            <span id="32047099_0availableToBack2_size_1171389306">{itemback.size}</span>
                                          </td>
                                        )
                                      })

                                      availLay = this.state.availLay.map((itemlay) => {
                                        return (
                                          <td className="32047099_0availableToBack2_price_1171389306" onClick={() => this.placeBet("Lay", this.state.marketOdds[0].runners[index].ex.availableToLay[0].price, itemlay, item, this.state.marketOdds, index, window.innerWidth)} >
                                            <span id="32047099_0availableToBack2_price_1171389306">{itemlay.price}</span>
                                            <span id="32047099_0availableToBack2_size_1171389306">{itemlay.size}</span>
                                          </td>
                                        )
                                      })
                                    }
                                  }
                                  return (
                                    <>
                                      <tr id="user_row0" className="back_lay_color runner-row-32047099">
                                        <td>
                                          <p className="runner_text" id="runnderName0">{item.runnerName}</p>
                                          <p className="blue-odds" id={"profit" + item.selectionId}></p>
                                          <span className="runner_amount" style={{ color: "black" }} id={"loss" + item.selectionId} >
                                            0{/* {expoProfit} */}
                                          </span>

                                          {
                                            this.state.zeroStatus === "false" ?
                                              <p className="blue-odds" id={"profit" + item.selectionId}>0</p> :
                                              this.state.toggleMatchIndex === index ?
                                                <p className="blue-odds" id={"profit" + item.selectionId}>
                                                  {this.state.betProfit}
                                                </p> :
                                                <p className="blue-odds" id={"profit" + item.selectionId} style={{ color: this.state.color }}>
                                                  {this.state.betLoss}
                                                </p>
                                          }

                                          <input type="hidden" className="position_1171389306" id="selection_0" data-id={32047099} defaultValue={0} />
                                        </td>

                                        {avilBlack}
                                        {availLay}
                                      </tr>
                                      <tr>
                                        <td colSpan="7">
                                          <div className="mobileBetBox">
                                            <BetBox stake={0}
                                              index={index}
                                              betData={this.state.betData}
                                              betProfit={this.state.betProfit}
                                              handleRemove={(style, num) => {
                                                this.handleRemove(style, num, index);
                                              }}
                                              handleBetPlaceBox={(notfyMsg, bgColor, notfyStatus) => {
                                                this.handleBetPlaceBox(notfyMsg, bgColor, notfyStatus);
                                              }}
                                              getProfitandLoss={(profit, loss, status) => {
                                                this.getProfitandLoss(profit, loss, status);
                                              }}
                                              bookArr={(arr) => {
                                                this.bookArr(arr)
                                              }}
                                              betLoss={this.state.betLoss}
                                              setdisplay={this.state.display[index]}
                                              eventId={this.props.match.params.id}
                                              handleInput={(e) => this.handleInputValue(e)}
                                              runnderData={this.state.data}
                                              expoData={this.state.exporunnerdata} betData={this.state.betData} />
                                          </div>
                                        </td>
                                      </tr>

                                    </>
                                  )
                                })
                                  : null :
                                  <tbody>
                                    <tr id="user_row0" class="back_lay_color runner-row-32047099">
                                      <td>
                                        <p class="runner_text" id="runnderName0">{this.state.matchName.split(" v ")[0]}</p>
                                        <p class="blue-odds" id="Val1-117138930632047099">0</p>
                                        <span class="runner_amount" id="32047099_maxprofit_loss_runner_1171389306" >0</span>
                                      </td>
                                      {
                                        this.state.tableTd.map((item) => {
                                          return (
                                            <td class="32047099_0availableToBack2_price_1171389306">
                                              <span id="32047099_0availableToBack2_price_1171389306">{item}</span>
                                              <span id="32047099_0availableToBack2_size_1171389306">{item}</span>
                                            </td>
                                          )
                                        })
                                      }
                                    </tr>
                                    <tr id="user_row0" class="back_lay_color runner-row-32047099">
                                      <td>
                                        <p class="runner_text" id="runnderName0">{this.state.matchName.split(" v ")[1]}</p>
                                        <p class="blue-odds" id="Val1-117138930632047099">0</p>
                                        <span class="runner_amount" id="32047099_maxprofit_loss_runner_1171389306" >0</span>
                                      </td>
                                      {
                                        this.state.tableTd.map((item) => {
                                          return (
                                            <td class="32047099_0availableToBack2_price_1171389306">
                                              <span id="32047099_0availableToBack2_price_1171389306">{item}</span>
                                              <span id="32047099_0availableToBack2_size_1171389306">{item}</span>
                                            </td>
                                          )
                                        })
                                      }
                                    </tr>
                                  </tbody>
                              }
                            </table>
                          </div>
                        </div>

                        {
                          /////////////////////// HEADER OF FANCY ODDS //////////////////////////////////
                        }
                        <div className="fullrow margin_bottom fancybox" id="fancyM_29905278" >
                          <div style={{ display: "block" }} className="fancy-table" id="fbox29905278">
                            <div className="modal-header mod-header" style={{ marginTop: '25px' }}>
                              <div className="block_box">
                                <span id="tital_change">
                                  <span id="fav29905278">
                                    <i className="fa fa-star-o" aria-hidden="true" />&nbsp;{this.state.matchName}
                                  </span>
                                  <input type="hidden" defaultValue="Match Name" id="sportName_29905278" />
                                </span>
                              </div>
                            </div>

                            {
                              ////////////////////////// NO/YES BOX //////////////////////
                            }

                            <div className="fancy-heads">
                              <div className="event-sports">&nbsp;&nbsp; </div>
                              <div className="fancy_buttons">
                                <div className="fancy-backs head-no" style={{ backgroundColor: '#fa93a9' }}>
                                  <strong>NO</strong>
                                </div>
                              </div>
                              <div className="fancy_buttons">
                                <div className="fancy-lays head-yes" style={{ backgroundColor: '#72bbef' }}>
                                  <strong>YES</strong>
                                </div>
                              </div>
                            </div>

                            {
                              ///////////////////////// FANCY ODDS Table //////////////////////////
                            }

                            {
                              this.state.fancymarket.length > 0 ?
                                this.state.fancymarket.map((parentitem, index) => {
                                  return (
                                    <div>
                                      <div class="match_score_box">
                                        <div class="score_area">
                                          <span class="matchScore" id="matchScore_29905278"></span>
                                        </div>
                                      </div>

                                      <div class="fancyAPI">
                                        <div class="block_box f_m_4138 fancy_5303 f_m_5303" data-id="5303" >
                                          <ul class="sport-high fancyListDiv">
                                            <li>
                                              <div class="ses-fan-box">
                                                <table class={`table table-striped bulk_actions ${parentitem.marketData.isEnabled ? "fancyOddsDisabled" : ""}`} >
                                                  {
                                                    this.state.fancyOdds.length > 0 && this.state.fancyOdds[index] && this.state.fancyOdds[index].length > 0 ?
                                                      (
                                                        this.state.fancyOdds[index][0].runners.slice(0, 2).map((item, cindex) => {
                                                          if (item.ex.availableToBack.length < 1) {
                                                            item.ex.availableToBack.unshift({
                                                              price: 0,
                                                              size: 0,
                                                            });
                                                          }

                                                          if (item.ex.availableToLay.length < 1) {
                                                            item.ex.availableToLay.unshift({
                                                              price: 0,
                                                              size: 0,
                                                            });
                                                          }
                                                          return (
                                                            <tbody>
                                                              <tr class="session_content">
                                                                <td>
                                                                  <span class="fancyhead5303" id="fancy_name5303" >
                                                                    {
                                                                      parentitem.marketData.marketName.toLowerCase().replace('line', 'session')
                                                                    }
                                                                  </span>
                                                                  <div className="block_box_btn" style={{ marginRight: '50px' }}>
                                                                    <button className="btn btn-primary btn-xs" data-toggle="modal" data-target="#exampleModalForBook" style={{ color: 'white', border: 'none', outline: 'none', backgroundColor: '#6c1945' }}>
                                                                      Book
                                                                  </button>
                                                                    <button className="btn btn-primary btn-xs" style={{ color: 'white', border: 'none', outline: 'none', backgroundColor: '#6c1945' }}>
                                                                      Bets
                                                                  </button>
                                                                  </div>
                                                                  <b class="fancyLia5303"></b>
                                                                  <p class="position_btn"></p>
                                                                </td>
                                                                <td></td>
                                                                <td></td>
                                                                {
                                                                  item.ex.availableToBack.slice(0, 1).map((itemBack) => {
                                                                    return (
                                                                      <td class="fancy_lay" onClick={() => this.betfancy("Back", Math.round(itemBack.price), itemBack, parentitem, {
                                                                        runnerName: parentitem.runners[cindex].runnerName,
                                                                        selectionId: parentitem.runners[cindex].selectionId,
                                                                      }, parentitem.marketData.marketId, "NO")} >
                                                                        <button class="lay-cell cell-btn" id="LayNO_5303" >
                                                                          {Math.round(itemBack.price)}
                                                                        </button>
                                                                        <button id="NoValume_5303" class="disab-btn" >
                                                                          {
                                                                            Math.round(itemBack.price) > 0 ? 100 : itemBack.size
                                                                          }
                                                                        </button>
                                                                      </td>
                                                                    );
                                                                  })
                                                                }

                                                                {
                                                                  item.ex.availableToLay.slice(0, 1).map((itemLay) => {
                                                                    return (
                                                                      <td class="fancy_back" onClick={() => this.betfancy("Lay",
                                                                        Math.round(itemLay.price), itemLay, parentitem, {
                                                                        runnerName: parentitem.runners[cindex].runnerName,
                                                                        selectionId: parentitem.runners[cindex].selectionId,
                                                                      },
                                                                        parentitem.marketData.marketId, "YES")}>
                                                                        <button class="back-cell cell-btn" id="BackYes_5303" >{Math.round(itemLay.price)}</button>
                                                                        <button id="YesValume_5303" class="disab-btn" >{Math.round(itemLay.price) > 0 ? 100 : itemLay.size}</button>
                                                                      </td>
                                                                    );
                                                                  })}
                                                                <td></td>
                                                                <td></td>
                                                              </tr>
                                                            </tbody>
                                                          );
                                                        })
                                                      ) : (
                                                        <tbody>
                                                          <tr class="session_content">
                                                            <td>
                                                              <span class="fancyhead5303" id="fancy_name5303">10 Runs or more</span>
                                                              <b class="fancyLia5303"></b>
                                                              <p class="position_btn"></p>
                                                            </td>
                                                            <td></td>
                                                            <td></td>
                                                            <td class="fancy_lay">
                                                              <button class="lay-cell cell-btn" id="LayNO_5303">0</button>
                                                              <button id="NoValume_5303" class="disab-btn">0</button>
                                                            </td>
                                                            <td class="fancy_back">
                                                              <button class="back-cell cell-btn" id="BackYes_5303">0</button>
                                                              <button id="YesValume_5303" class="disab-btn">0</button>
                                                            </td>
                                                            <td></td>
                                                            <td></td>
                                                          </tr>
                                                        </tbody>
                                                      )
                                                  }
                                                </table>
                                              </div>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>

                                      {
                                        //////////////////////////// MODAL FOR BOOK //////////////////////////////////////////
                                      }

                                      <div class="modal fade" id="exampleModalForBook" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                          <div class="modal-content">
                                            <div class="modal-header">
                                              <h5 class="modal-title" id="exampleModalLabel">Fancy Position</h5>
                                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                              </button>
                                            </div>
                                            <div class="modal-body">
                                              {
                                                this.state.oddsProp ? this.state.bookArr.map((element, index) => {
                                                  if (this.state.fancyType === 'NO') {
                                                    return (
                                                      <div style={{ paddingRight: '25px', paddingLeft: '25px', margin: '10px' }}>
                                                        <span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{element}</span>
                                                        {
                                                          element >= this.state.oddsProp ?
                                                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: "red", float: 'right' }}>
                                                              <i className="fas fa-minus" style={{ fontSize: '10px' }} />{this.state.stackProp}
                                                            </span> :
                                                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: "green", float: 'right' }}>
                                                              <i className="fas fa-plus" style={{ fontSize: '10px' }} />{this.state.stackProp}
                                                            </span>
                                                        }
                                                      </div>
                                                    )
                                                  }
                                                  else {
                                                    return (
                                                      <div style={{ paddingRight: '25px', paddingLeft: '25px', margin: '10px' }}>
                                                        <span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{element}</span>
                                                        {
                                                          element < this.state.oddsProp ?
                                                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: "red", float: 'right' }}>
                                                              <i className="fas fa-minus" style={{ fontSize: '10px' }} />
                                                              {this.state.stackProp}
                                                            </span> :
                                                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: "green", float: 'right' }}>
                                                              <i className="fas fa-plus" style={{ fontSize: '10px' }} />{this.state.stackProp}
                                                            </span>
                                                        }
                                                      </div>
                                                    )
                                                  }
                                                })
                                                  : <div style={{ paddingRight: '25px', paddingLeft: '5px', margin: '10px' }}>No Record Found...</div>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }) : null
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Sidebet
                  stake={0}
                  betData={this.state.betData}
                  betProfit={this.state.betProfit}
                  handleRemove={(style, num) => {
                    this.handleRemove(style, num, 'desktop');
                  }}
                  handleBetPlaceBox={(notfyMsg, bgColor, notfyStatus) => {
                    this.handleBetPlaceBox(notfyMsg, bgColor, notfyStatus);
                  }}
                  getProfitandLoss={(profit, loss, status) => {
                    this.getProfitandLoss(profit, loss, status);
                  }}
                  bookArr={(arr) => {
                    this.bookArr(arr)
                  }}
                  betLoss={this.state.betLoss}
                  setdisplay={this.state.display}
                  eventId={this.props.match.params.id}
                  handleInput={(e) => this.handleInputValue(e)}
                  runnderData={this.state.data}
                  expoData={this.state.exporunnerdata}
                />
                <Footer />
              </div>
            </div>
          </div>
        </div>
        </div>
        }
      </div>
    );
  }
}
