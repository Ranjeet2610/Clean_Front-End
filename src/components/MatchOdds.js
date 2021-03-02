import BetBox from "./Betbox";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Sound from "../images/Recording.mp3";
import Loader from 'react-loader-spinner'
import React, { Component } from "react";
import Navbar from "./Navbar";
import tv from "../images/tv-screen.png";
import Sidebar from "./Sidebar";
import Sidebet from "./SideBet";
import "../App.css";
import Service from "../Services/Service";
import LiveEvents from "../Services/livevents";
import Footer from "./footer";

export default class MatchOdds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load:false,
      oddsload:true,
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
      // betProfit: "",
      // betLoss: "",
      display: ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none"],
      isenable: true,
      fancyOdds: "",
      fancymarket: "",
      exporunnerdata: "", 
      ToneColor: "blue-odds",
      TtwoColor: "blue-odds",
      TthreeColor: "blue-odds",
      DToneColor: "blue-odds",
      DTtwoColor: "blue-odds",
      DTthreeColor: "blue-odds",
      TonePL: 0,
      TtwoPL: 0,
      TthreePL: 0,
      DTonePL: 0,
      DTtwoPL: 0,
      DTthreePL: 0,
      selOdds: 0,
      selfancyOdds: 0, 
      selfancySize: 0,
      selbetType:'',
      selTeamSelection:'',
      selIndex:'',
      selfancymarketId:'',
      fbetHistroyProp: '',
      filterbookdata:'',
      IP:'',
      scoreId:'',
      matchName: JSON.parse(localStorage.getItem("matchname")).name !== undefined ? JSON.parse(localStorage.getItem("matchname")).name : " v ",
      sportType: JSON.parse(localStorage.getItem("matchname")).sport !== undefined ? JSON.parse(localStorage.getItem("matchname")).sport : null,
      timer: "",
      redirectToReferrer: false,
    };
    this.service = new Service();
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
  getselOdds(index, ods, type, teamSelection){
    this.setState({
      selOdds:ods,
      selbetType:type,
      selTeamSelection:teamSelection,
      selIndex:index
    });
  }
  StaKeAmount(index, ods, type, teamSelection) {
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
    this.getselOdds(index, ods, type, teamSelection);
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
    setTimeout(()=> {
    let getRunner = this.state.data.length;
    let Team1 = this.state.data[0].runnerName;
    let Team2 = this.state.data[1].runnerName;
    if(getRunner==3){
      var Team3 = this.state.data[2].runnerName;
    }
    if(val!=0){
      if(type=='Back'){
        if(teamSelection==Team1){
          this.setState({
            TonePL: parseFloat(this.state.DTonePL)+parseFloat(this.state.betProfit),
            TtwoPL: parseFloat(this.state.DTtwoPL)-parseFloat(val),
            TthreePL: parseFloat(this.state.DTthreePL)-parseFloat(val)
          });
        }
        if(teamSelection==Team2){
          this.setState({
            TtwoPL: parseFloat(this.state.DTtwoPL)+parseFloat(this.state.betProfit),
            TonePL: parseFloat(this.state.DTonePL)-parseFloat(val),
            TthreePL: parseFloat(this.state.DTthreePL)-parseFloat(val)
          });
        }
        if(getRunner==3){
          if(teamSelection==Team3){
            this.setState({
              TthreePL: parseFloat(this.state.DTthreePL)+parseFloat(this.state.betProfit),
              TonePL: parseFloat(this.state.DTonePL)-parseFloat(val),
              TtwoPL: parseFloat(this.state.DTtwoPL)-parseFloat(val)
            });
          }
        }
      }else{
        if(teamSelection==Team1){
          this.setState({
            TonePL: parseFloat(this.state.DTonePL)-parseFloat(this.state.betLoss),
            TtwoPL: parseFloat(this.state.DTtwoPL)+parseFloat(val),
            TthreePL: parseFloat(this.state.DTthreePL)+parseFloat(val)
          });
        }
        if(teamSelection==Team2){
          this.setState({
            TtwoPL: parseFloat(this.state.DTtwoPL)-parseFloat(this.state.betLoss),
            TonePL: parseFloat(this.state.DTonePL)+parseFloat(val),
            TthreePL: parseFloat(this.state.DTthreePL)+parseFloat(val)
          });
        }
        if(getRunner==3){
          if(teamSelection==Team3){
            this.setState({
              TthreePL: parseFloat(this.state.DTthreePL)-parseFloat(this.state.betLoss),
              TonePL: parseFloat(this.state.DTonePL)+parseFloat(val),
              TtwoPL: parseFloat(this.state.DTtwoPL)+parseFloat(val)
            });
          }
        }
      }
      if(this.state.TonePL>=0){
        this.setState({
          ToneColor: "blue-odds",
        });
      }else{
        this.setState({
          ToneColor: "color_red",
        });
      }
      if(this.state.TtwoPL>=0){
        this.setState({
          TtwoColor: "blue-odds",
        });
      }else{
        this.setState({
          TtwoColor: "color_red",
        });
      }
      if(getRunner==3){
        if(this.state.TthreePL>=0){
          this.setState({
            TthreeColor: "blue-odds",
          });
        }else{
          this.setState({
            TthreeColor: "color_red",
          });
        }
      }
    }
  }, 100)
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
  }
  getFancyBook = async (fbetHistroy) => {
    await this.setState({
      fbetHistroyProp: fbetHistroy
    })
    //console.log('fbetHistroy',this.state.fbetHistroyProp)
  }
  showfilterbook(marketName,marketId){
    let filterbook = [];
    if(this.state.fbetHistroyProp.length > 0){
      filterbook = this.state.fbetHistroyProp.filter(newdata=>{
        return newdata.marketID===marketId;
      }).reverse().slice(0, 1);
    }
    this.setState({
      filterbookdata: filterbook
    })
    //console.log('filterbookdata',this.state.filterbookdata)
  }
   
  placeBet(type, odds, data, pdata, mid, index, width) {
    // debugger
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
        toggleMatchIndex: index,
        IP:this.state.IP
      });
      this.StaKeAmount(index, odds, type, pdata.runnerName);
    }
  }
  
  getselfancyOdds(ods, oddssize, type, fancymarketId,index){
    this.setState({
      selfancyOdds:ods,
      selfancySize:oddssize,
      selbetType:type,
      selfancymarketId:fancymarketId,
      selIndex:index
    });
  }

  fancyStaKeAmount(odds,oddsize,type,fancymarketId,index) {
    let val = document.getElementById("stakeValue").value;
    if (type === "Back") {
      this.setState({
        betProfit: Math.round((oddsize/100) * val),
        betLoss: val ? val : 0.0,
      });
    } else {
      this.setState({
        betProfit: val ? val : 0.0,
        betLoss: Math.round((oddsize/100) * val),
      });
    }
    this.getselfancyOdds(odds, oddsize, type, fancymarketId,index);
  }
  betfancy = (type,oddsprice,oddssize,data,fancyType, index, width, indx) => {
    if (this.userDetails.Master !== true && this.userDetails.Admin !== true && this.userDetails.superAdmin !== true) {
      if(oddssize!=='SUSPENDED' && oddssize!=='Running'){
        let displayTest;
        if (width <= 991) {
          displayTest = [...this.state.display];
          displayTest.forEach((item, i) => {
            if (i === indx) {
              displayTest[indx] = "block";
            } else {
              displayTest[i] = "none";
            }
          });
        } else {
          displayTest = "block";
        }
        this.setState({
          betData: {
            data: {
              price:oddsprice,
              size:oddssize
            },
            pData:{
              marketId:data.marketId,
              runnerName:data.marketName,
              selectionId:data.marketId
            },
            type: type,
            odds: oddsprice,
            mid: data.marketId,
            betType: "Fancy",
            fancyType: fancyType,
          },
          display: displayTest,
          IP:this.state.IP
        });
        this.fancyStaKeAmount(oddsprice,oddssize,type,data.marketId,index);
      }
    }
    //console.log("FANCY", this.state.betData)  
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
          oddsload:false
        });
        if(this.state.selbetType !== "" && this.state.selOdds!==""){
          let getUodds = "";
          if(this.state.selbetType==="Back"){
            getUodds = this.state.marketOdds[0].runners[this.state.selIndex].ex.availableToBack[2].price;
          }else{
            getUodds = this.state.marketOdds[0].runners[this.state.selIndex].ex.availableToLay[0].price;
          }
          this.getselOdds(this.state.selIndex, getUodds, this.state.selbetType, this.state.selTeamSelection);
        }
      });
      livevents.getFancyMarket(this.props.match.params.id, (data) => {
        this.setState({
          fancymarket: data.fancymarket,
        });
        if(this.state.selbetType !== "" && this.state.selOdds!==""){
          let getUodds = "";
          let getUsize = "";
          if(this.state.selbetType==="Back"){
            getUodds = this.state.fancymarket[this.state.selIndex].marketData.BackPrice;
            getUsize = this.state.fancymarket[this.state.selIndex].marketData.BackSize;
          }else{
            getUodds = this.state.fancymarket[this.state.selIndex].marketData.LayPrice;
            getUsize = this.state.fancymarket[this.state.selIndex].marketData.LaySize;
          }
          this.getselfancyOdds(getUodds, getUsize, this.state.selbetType, this.state.selfancymarketId,this.state.selIndex);
        }
      });
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
    });
    service.getListMarketType(this.props.match.params.id, (data) => {
      // this.setState({
      //   data: data.pdata,
      // });
        let getRunner = data.pdata.length;
        // console.log("DDDD",data.pdata);
        let Teamone = data.pdata[0].runnerName;
        let Teamtwo = data.pdata[1].runnerName;
        if(getRunner==3){
          var Teamthree = data.pdata[2].runnerName;
        }
        let T1TotalPL = 0;
        let T2TotalPL = 0;
        let T3TotalPL = 0;
        this.service.betHistory(JSON.parse(localStorage.getItem('data')).userName,this.props.match.params.id,'getUserOpenBetHistory',(data)=>{
            data.map((item,index)=>{
              if(item.bettype=='Back'){
                if(Teamone==item.selection){
                  T1TotalPL = parseFloat(T1TotalPL)+parseFloat(item.P_L);
                  T2TotalPL = parseFloat(T2TotalPL)-parseFloat(item.stack);
                  T3TotalPL = parseFloat(T3TotalPL)-parseFloat(item.stack);
                }
                if(Teamtwo==item.selection){
                  T2TotalPL = parseFloat(T2TotalPL)+parseFloat(item.P_L);
                  T1TotalPL = parseFloat(T1TotalPL)-parseFloat(item.stack);
                  T3TotalPL = parseFloat(T3TotalPL)-parseFloat(item.stack);
                }
                if(getRunner==3){
                  if(Teamthree==item.selection){
                    T3TotalPL = parseFloat(T3TotalPL)+parseFloat(item.P_L);
                    T2TotalPL = parseFloat(T2TotalPL)-parseFloat(item.stack);
                    T1TotalPL = parseFloat(T1TotalPL)-parseFloat(item.stack);
                  }
                }  
              }else{
                if(Teamone==item.selection){
                  T1TotalPL = parseFloat(T1TotalPL)-parseFloat(item.P_L);
                  T2TotalPL = parseFloat(T2TotalPL)+parseFloat(item.stack);
                  T3TotalPL = parseFloat(T3TotalPL)+parseFloat(item.stack);
                }
                if(Teamtwo==item.selection){
                  T2TotalPL = parseFloat(T2TotalPL)-parseFloat(item.P_L);
                  T1TotalPL = parseFloat(T1TotalPL)+parseFloat(item.stack);
                  T3TotalPL = parseFloat(T3TotalPL)+parseFloat(item.stack);
                }
                if(getRunner==3){
                  if(Teamthree==item.selection){
                    T3TotalPL = parseFloat(T3TotalPL)-parseFloat(item.P_L);
                    T2TotalPL = parseFloat(T2TotalPL)+parseFloat(item.stack);
                    T1TotalPL = parseFloat(T1TotalPL)+parseFloat(item.stack);
                  }
                }
              }
            })
            //console.log(T1TotalPL);
            //console.log(T2TotalPL);
            //console.log(T3TotalPL);
            if(T1TotalPL>=0){
              this.setState({
                TonePL: T1TotalPL,
                DTonePL: T1TotalPL,
                ToneColor: "blue-odds",
                DToneColor: "blue-odds",
              });
            }else{
              this.setState({
                TonePL: T1TotalPL,
                DTonePL: T1TotalPL,
                ToneColor: "color_red",
                DToneColor: "color_red",
              });
            }
            if(T2TotalPL>=0){
              this.setState({
                TtwoPL: T2TotalPL,
                DTtwoPL: T2TotalPL,
                TtwoColor: "blue-odds",
                DTtwoColor: "blue-odds",
              });
            }else{
              this.setState({
                TtwoPL: T2TotalPL,
                DTtwoPL: T2TotalPL,
                TtwoColor: "color_red",
                DTtwoColor: "color_red",
              });
            }
            if(getRunner==3){
              if(T3TotalPL>=0){
                this.setState({
                  TthreePL: T3TotalPL,
                  DTthreePL: T3TotalPL,
                  TthreeColor: "blue-odds",
                  DTthreeColor: "blue-odds",
                });
              }else{
                this.setState({
                  TthreePL: T3TotalPL,
                  DTthreePL: T3TotalPL,
                  TthreeColor: "color_red",
                  DTthreeColor: "color_red",
                });
              }
            }
        });
        /* end */
    });
    fetch("https://api.ipify.org?format=json")
    .then(response => {
      return response.json();
     }, "jsonp")
    .then(res => {
    //console.log(res);
     this.setState({IP:res.ip});
    })
    .catch(err => console.log(err))
    /*********************************/
    fetch("http://173.249.21.26/SkyImporter/MatchImporter.svc/GetScoreId?eventid="+this.props.match.params.id)
    .then(response => {
      return response.json();
     }, "jsonp")
    .then(res => {
    //console.log(res);
     this.setState({scoreId:res.scoreId});
    })
    .catch(err => console.log(err)) 
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
      TonePL: this.state.DTonePL,
      TtwoPL: this.state.DTtwoPL,
      TthreePL: this.state.DTthreePL,
      ToneColor: this.state.DToneColor,
      TtwoColor: this.state.DTtwoColor,
      TthreeColor: this.state.DTthreeColor
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

 getProfitandLoss=async(profit,loss,teamSelection,betType,stack,status,facFrom)=>{
    await this.setState({
      betProfit:profit,
      betLoss:loss,
      zeroStatus:status,
      color:"red"
    })
    setTimeout(()=> {
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
    let getRunner = this.state.data.length;
    let Team1 = this.state.data[0].runnerName;
    let Team2 = this.state.data[1].runnerName;
    if(getRunner==3){
      var Team3 = this.state.data[2].runnerName;
    }
    if(betType=='Back'){
      if(teamSelection==Team1){
        this.setState({
          TonePL: parseFloat(this.state.DTonePL)+parseFloat(profit),
          TtwoPL: parseFloat(this.state.DTtwoPL)-parseFloat(stack),
          TthreePL: parseFloat(this.state.DTthreePL)-parseFloat(stack)
        });
      }
      if(teamSelection==Team2){
        this.setState({
          TtwoPL: parseFloat(this.state.DTtwoPL)+parseFloat(profit),
          TonePL: parseFloat(this.state.DTonePL)-parseFloat(stack),
          TthreePL: parseFloat(this.state.DTthreePL)-parseFloat(stack)
        });
      }
      if(getRunner==3){
        if(teamSelection==Team3){
          this.setState({
            TthreePL: parseFloat(this.state.DTthreePL)+parseFloat(profit),
            TonePL: parseFloat(this.state.DTonePL)-parseFloat(stack),
            TtwoPL: parseFloat(this.state.DTtwoPL)-parseFloat(stack)
          });
        }
      }
    }else{
      if(teamSelection==Team1){
        this.setState({
          TonePL: parseFloat(this.state.DTonePL)-parseFloat(loss),
          TtwoPL: parseFloat(this.state.DTtwoPL)+parseFloat(stack),
          TthreePL: parseFloat(this.state.DTthreePL)+parseFloat(stack)
        });
      }
      if(teamSelection==Team2){
        this.setState({
          TtwoPL: parseFloat(this.state.DTtwoPL)-parseFloat(loss),
          TonePL: parseFloat(this.state.DTonePL)+parseFloat(stack),
          TthreePL: parseFloat(this.state.DTthreePL)+parseFloat(stack)
        });
      }
      if(getRunner==3){
        if(teamSelection==Team3){
          this.setState({
            TthreePL: parseFloat(this.state.DTthreePL)-parseFloat(loss),
            TonePL: parseFloat(this.state.DTonePL)+parseFloat(stack),
            TtwoPL: parseFloat(this.state.DTtwoPL)+parseFloat(stack)
          });
        }
      }
    }
    if(facFrom==="placeBet"){
      this.setState({
        DTonePL:this.state.TonePL,
        DTtwoPL:this.state.TtwoPL
      });
    }
   if(this.state.TonePL>=0){
      this.setState({
        ToneColor: "blue-odds",
      });
    }else{
      this.setState({
        ToneColor: "color_red",
      });
    }
    if(this.state.TtwoPL>=0){
      this.setState({
        TtwoColor: "blue-odds",
      });
    }else{
      this.setState({
        TtwoColor: "color_red",
      });
    }
    if(getRunner==3){
      if(facFrom==="placeBet"){
        this.setState({
          DTthreePL:this.state.TthreePL
        });
      }
      if(this.state.TthreePL>=0){
        this.setState({
          TthreeColor: "blue-odds",
        });
      }else{
        this.setState({
          TthreeColor: "color_red",
        });
      }
    }
  }, 100)
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
  }

  render() {
    let inplay;
    let runners = this.state.data;
    let filterrunners = [];
    let bookitems = [];
    let bookodds;
    let expoProfit = 0;
    let j=0;
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
          <div style={{opacity:"1", height:'100vh', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
            <Loader type="Grid" color="#6c1945" height={100} width={100} />
         </div>:
         <div>
          <div className="container body">
          <div className="main_container" id="sticky">
            <div className="right_col" role="main">
              <div className="fullrow tile_count">
                <div className="col-md-8">

                  {
                    ////////////////////////HEADER OF SCORE BOARD /////////////////////////////
                  }

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
                        {
                          this.state.sportType === 4 && this.state.marketOdds.length > 0?
                          <>
                          <div style={{ height: '100%', width: '100%', paddingTop: '7px', display: 'flex', marginBottom: '25px' }}>
                          <iframe allowfullscreen="true" style={{ border: 'none', width: '100%', height: '281px'}} src={`https://shivexch.com/sport_score_api/cricketscore/index.html?scoreId=${this.state.scoreId}&matchDate=${JSON.parse(localStorage.getItem("matchname")).date}`}></iframe>
                          </div>
                          </>
                          :null
                        }
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
                                this.state.data.length > 0 ? this.state.marketOdds.length > 0 ? 
                                  runners.map((item, index) => {
                                    if (this.state.exporunnerdata.length > 0) {
                                      expoProfit = this.state.exporunnerdata.filter((itemexpo) => itemexpo.runnerId === item.selectionId).exposure;
                                    }
                                    filterrunners = this.state.data.filter(newdata=>{
                                      return newdata.selectionId===this.state.marketOdds[0].runners[index].selectionId;
                                    })
                                    if (this.state.marketOdds.length > 0) {
                                      let sordataBack = this.state.marketOdds[0].runners[index].ex.availableToBack.sort(function (a, b) {
                                        return a.price - b.price;
                                      })

                                      if (sordataBack.length < 3) {
                                        sordataBack.unshift({ price: 0, size: 0.0 });
                                      }

                                      avilBlack = sordataBack.map((itemback) => {
                                        return (
                                          <td className="32047099_0availableToBack2_price_1171389306" onClick={() => this.placeBet("Back", this.state.marketOdds[0].runners[index].ex.availableToBack[2].price, itemback, this.state.data.filter(newdata=>{return newdata.selectionId===this.state.marketOdds[0].runners[index].selectionId})[0], this.state.marketOdds, index, window.innerWidth)} >
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
                                          <td className="32047099_0availableToBack2_price_1171389306" onClick={() => this.placeBet("Lay", this.state.marketOdds[0].runners[index].ex.availableToLay[0].price, itemlay, this.state.data.filter(newdata=>{return newdata.selectionId===this.state.marketOdds[0].runners[index].selectionId})[0], this.state.marketOdds, index, window.innerWidth)} >
                                            <span id="32047099_0availableToBack2_price_1171389306">{itemlay.price}</span>
                                            <span id="32047099_0availableToBack2_size_1171389306">{itemlay.size}</span>
                                          </td>
                                        )
                                      })
                                    }
                                    else {
                                      avilBlack = this.state.avilBlack.map((itemback) => {
                                        return (
                                          <td className="32047099_0availableToBack2_price_1171389306" onClick={() => this.placeBet("Back", this.state.marketOdds[0].runners[index].ex.availableToBack[2].price, itemback, this.state.data.filter(newdata=>{return newdata.selectionId===this.state.marketOdds[0].runners[index].selectionId})[0], this.state.marketOdds, index, window.innerWidth)} >
                                            <span id="32047099_0availableToBack2_price_1171389306">{itemback.price}</span>
                                            <span id="32047099_0availableToBack2_size_1171389306">{itemback.size}</span>
                                          </td>
                                        )
                                      })

                                      availLay = this.state.availLay.map((itemlay) => {
                                        return (
                                          <td className="32047099_0availableToBack2_price_1171389306" onClick={() => this.placeBet("Lay", this.state.marketOdds[0].runners[index].ex.availableToLay[0].price, itemlay, this.state.data.filter(newdata=>{return newdata.selectionId===this.state.marketOdds[0].runners[index].selectionId})[0], this.state.marketOdds, index, window.innerWidth)} >
                                            <span id="32047099_0availableToBack2_price_1171389306">{itemlay.price}</span>
                                            <span id="32047099_0availableToBack2_size_1171389306">{itemlay.size}</span>
                                          </td>
                                        )
                                      })
                                    }
                                   // if(item.selectionId==this.state.marketOdds[0].runners[index].selectionId){}
                                   if (filterrunners.length > 0) {
                                   return (
                                    <>
                                      <tr id="user_row0" className="back_lay_color runner-row-32047099">
                                        <td>
                                          <p className="runner_text" id="runnderName0">{filterrunners[0]?.runnerName}</p>
                                          <p className="blue-odds" id={"profit" + filterrunners[0]?.selectionId}></p>
                                          <span className="runner_amount" style={{ color: "black" }} id={"loss" + filterrunners[0]?.selectionId} >
                                            0{/* {expoProfit} */}
                                          </span>

                                          {
                                            <p className="blue-odds" id={"profit" + filterrunners[0]?.selectionId}>
                                              {this.state.data.length==3 ? index==0 ? <span class={"runner_amount "+this.state.ToneColor}>{this.state.TonePL}</span>
                                              : index==1 ? <span class={"runner_amount "+this.state.TtwoColor}>{this.state.TtwoPL}</span>
                                              : <span class={"runner_amount "+this.state.TthreeColor}>{this.state.TthreePL}</span>
                                              : index==0 ? <span class={"runner_amount "+this.state.ToneColor}>{this.state.TonePL}</span>
                                              :<span class={"runner_amount "+this.state.TtwoColor}>{this.state.TtwoPL}</span>}
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
                                            <BetBox
                                            matchName={this.state.matchName}
                                            index={index}
                                            stake={0}
                                            betData={this.state.betData}
                                            betProfit={this.state.betProfit}
                                            handleRemove={(style, num) => {
                                              this.handleRemove(style, num, index);
                                            }}
                                            handleBetPlaceBox={(notfyMsg, bgColor, notfyStatus) => {
                                              this.handleBetPlaceBox(notfyMsg, bgColor, notfyStatus);
                                            }}
                                            getProfitandLoss={(profit,loss,teamSelection,betType,stack,status,facFrom)=>{
                                              this.getProfitandLoss(profit,loss,teamSelection,betType,stack,status,facFrom);
                                            }}
                                            betLoss={this.state.betLoss}
                                            setdisplay={this.state.display[index]}
                                            eventId={this.props.match.params.id}
                                            handleInput={(e) => this.handleInputValue(e)}
                                            runnderData={this.state.data}
                                            expoData={this.state.exporunnerdata}
                                            selOdds={this.state.selOdds}
                                            selfancyOdds={this.state.selfancyOdds} 
                                            selfancySize={this.state.selfancySize}
                                            IP = {this.state.IP}
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    </>
                                   )
                                   }
                                  })
                                 :
                                  <tbody>
                                  <tr>
                                  <td colSpan="7" className="text-center"><h2>CLOSED</h2></td>
                                  </tr>
                                  </tbody>
                                  :
                                    filterrunners.length === 0 && inplay === "IN-PLAY" ?
                                      this.state.oddsload ? 
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
                                    :
                                      <tbody>
                                        <tr>
                                        <td colSpan="7" className="text-center"><h2>CLOSED</h2></td>
                                        </tr>
                                      </tbody>
                                    :
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
                        this.state.sportType === 4 && this.state.fancymarket.length > 0 && this.state.marketOdds.length > 0 ?
                        <div className="fullrow margin_bottom fancybox" id="fancyM_29905278" >
                          <div style={{ display: "block" }} className="fancy-table" id="fbox29905278">

                            {
                              /////////////////////// HEADER OF FANCY ODDS //////////////////////////////////
                            }

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
                                      <div className="match_score_box">
                                        <div className="score_area">
                                          <span className="matchScore" id="matchScore_29905278"></span>
                                        </div>
                                      </div>

                                      <div className="fancyAPI">
                                        <div className="block_box f_m_4138 fancy_5303 f_m_5303" data-id="5303" >
                                          <ul className="sport-high fancyListDiv">
                                            <li>
                                              <div className="ses-fan-box">
                                                <table className={`table table-striped bulk_actions ${parentitem.marketData.isEnabled ? "fancyOddsDisabled" : ""}`} >
                                                  <tbody>
                                                    <tr class="session_content">
                                                      <td>
                                                        <span class="fancyhead5303" id="fancy_name5303">{parentitem.marketData.marketName}</span>
                                                        <div className="block_box_btn1" style={{marginRight:'50px'}}>
                                                          <button className="btn btn-primary btn-xs" onClick={() => this.showfilterbook(parentitem.marketData.marketName,parentitem.marketData.marketId)} data-toggle="modal" data-target="#exampleModalForBook" style={{color:'white',border:'none',outline:'none',backgroundColor:'#6c1945'}}>
                                                            Book
                                                          </button>
                                                        </div>
                                                        <b class="fancyLia5303"></b>
                                                        <p class="position_btn"></p>
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                      <div class={`${ parentitem.marketData.status==='SUSPENDED' ? "fancyOddsSBR" : "fancyOddsSBRnone" }`}>SUSPENDED</div>
                                                      <div class={`${ parentitem.marketData.status==='Ball Running' ? "fancyOddsSBR" : "fancyOddsSBRnone" }`}>BALL RUNNING</div>
                                                      <td class="fancy_lay" onClick={() => this.betfancy("Lay",parentitem.marketData.LayPrice,parentitem.marketData.LaySize,parentitem.marketData, "NO", index, window.innerWidth, index+this.state.data.length)}>
                                                        <button class="back-cell cell-btn" id="BackYes_5303">{parentitem.marketData.LayPrice}</button>
                                                        <button id="YesValume_5303" class="disab-btn">{parentitem.marketData.LaySize}</button>
                                                      </td>
                                                      <td class="fancy_back" onClick={() => this.betfancy("Back",parentitem.marketData.BackPrice,parentitem.marketData.BackSize,parentitem.marketData,"YES", index, window.innerWidth, index+this.state.data.length)}>
                                                        <button class="lay-cell cell-btn" id="LayNO_5303">{parentitem.marketData.BackPrice}</button>
                                                        <button id="NoValume_5303" class="disab-btn">{parentitem.marketData.BackSize}</button>
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </div>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                      <div className="mobileBetBox">
                                      <BetBox
                                        matchName={this.state.matchName}
                                        stake={0}
                                        index={index+this.state.data.length}
                                        betData={this.state.betData}
                                        betProfit={this.state.betProfit}
                                        handleRemove={(style, num) => {
                                          this.handleRemove(style, num, index+this.state.data.length);
                                        }}
                                        handleBetPlaceBox={(notfyMsg, bgColor, notfyStatus) => {
                                          this.handleBetPlaceBox(notfyMsg, bgColor, notfyStatus);
                                        }}
                                        getProfitandLoss={(profit,loss,teamSelection,betType,stack,status,facFrom)=>{
                                          this.getProfitandLoss(profit,loss,teamSelection,betType,stack,status,facFrom);
                                        }}
                                        betLoss={this.state.betLoss}
                                        setdisplay={this.state.display[index+this.state.data.length]}
                                        eventId={this.props.match.params.id}
                                        handleInput={(e) => this.handleInputValue(e)}
                                        runnderData={this.state.data}
                                        expoData={this.state.exporunnerdata}
                                        selOdds={this.state.selOdds}
                                        selfancyOdds={this.state.selfancyOdds} 
                                        selfancySize={this.state.selfancySize}
                                        IP = {this.state.IP}
                                        />
                                     </div>
                                    </div>
                                  );
                                }) : null
                            }
                          </div>
                        </div>:null
                      }
                      </div>
                    </div>
                  </div>
                </div>
                {
                  //////////////////////////// MODAL FOR BOOK //////////////////////////////////////////
                }
                {
                  this.state.fancymarket.length > 0 ?
                  <div class="modal fade" id="exampleModalForBook" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                            this.state.filterbookdata.length >= 1 ? 
                            this.state.filterbookdata.map((item, index) => {
                              bookitems = [];
                              if (item.bettype === 'Lay') {
                                bookodds = (item.odds-10);
                                for (let i=0; i <= 20; i++) {
                                  if(bookodds>=0){
                                  bookitems.push(i >= 10 ?
                                    <div><span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{bookodds+j}</span>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: "red", float: 'right' }}>
                                      -{item.stack}
                                    </span><hr style={{ marginTop: '5px',marginBottom: '5px' }}></hr></div> :
                                    <div><span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{bookodds+j}</span>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: "green", float: 'right' }}>
                                      {item.stack}
                                    </span><hr style={{ marginTop: '5px',marginBottom: '5px' }}></hr></div>)
                                    j++
                                    }else{bookodds++}
                                }
                                return (
                                  <div style={{ paddingRight: '25px', paddingLeft: '25px', margin: '10px'}}>
                                    <span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>Score</span>
                                    <span className="" style={{ fontSize: '15px', fontWeight: 'bold', float: 'right' }}>Amount</span>
                                    {bookitems}
                                  </div>
                                )
                              }
                              else {
                                bookodds = (item.odds-10);
                                for (let i=0; i <= 20; i++) {
                                  if(bookodds>=0){
                                  bookitems.push(i >= 10 ?
                                    <div><span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{bookodds+j}</span>
                                      <span style={{ fontSize: '15px', fontWeight: 'bold', color: "green", float: 'right' }}>
                                      {item.stack}
                                    </span><hr style={{ marginTop: '5px',marginBottom: '5px' }}></hr></div> :
                                    <div><span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{bookodds+j}</span>
                                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: "red", float: 'right' }}>
                                      -{item.stack}
                                    </span><hr style={{ marginTop: '5px',marginBottom: '5px' }}></hr></div>)
                                    j++
                                  }else{bookodds++}
                                }
                                return (
                                  <div style={{ paddingRight: '25px', paddingLeft: '25px', margin: '10px'}}>
                                    <span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>Score</span>
                                    <span className="" style={{ fontSize: '15px', fontWeight: 'bold', float: 'right' }}>Amount</span>
                                    {bookitems}
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
                  :null
                  }
                <Sidebet
                  matchName={this.state.matchName}
                  stake={0}
                  betData={this.state.betData}
                  betProfit={this.state.betProfit}
                  handleRemove={(style, num) => {
                    this.handleRemove(style, num, 'desktop');
                  }}
                  handleBetPlaceBox={(notfyMsg, bgColor, notfyStatus) => {
                    this.handleBetPlaceBox(notfyMsg, bgColor, notfyStatus);
                  }}
                  // getProfitandLoss={(profit, loss, status) => {
                  //   this.getProfitandLoss(profit, loss, status);
                  // }}
                  getProfitandLoss={(profit,loss,teamSelection,betType,stack,status,facFrom)=>{
                    this.getProfitandLoss(profit,loss,teamSelection,betType,stack,status,facFrom);
                  }}
                  getFancyBook={(fbetHistroy) => {
                    this.getFancyBook(fbetHistroy)
                  }}
                  betLoss={this.state.betLoss}
                  setdisplay={this.state.display}
                  eventId={this.props.match.params.id}
                  handleInput={(e) => this.handleInputValue(e)}
                  runnderData={this.state.data}
                  expoData={this.state.exporunnerdata}
                  selOdds={this.state.selOdds}
                  selfancyOdds={this.state.selfancyOdds} 
                  selfancySize={this.state.selfancySize}
                  IP = {this.state.IP}
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
