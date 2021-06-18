import BetBox from "./Betbox";

import { NotificationContainer, NotificationManager } from 'react-notifications';
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
import Users from "../Services/users";
import Footer from "./footer";
import MatchOddsTable from '../widgets/matchOddsTable';
import { sortDataByName } from '../helpers/matchOddHelper'

// const BASE_URL = 'ws://localhost:4500';
const BASE_URL = 'ws://3.108.95.93:4500';
export default class MatchOdds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      oddsload: true,
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
      display: ["none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none", "none" ],
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
      selbetType: '',
      selTeamSelection: '',
      selIndex: '',
      selmIndex: '',
      selmarketName:'',
      selfancymarketId: '',
      fbetHistroyProp: '',
      filterbookdata: '',
      IP: '',
      scoreId: '',
      sportInfo: '',
      fancyInfo: '',
      matchName: JSON.parse(localStorage.getItem("matchname")).name !== undefined ? JSON.parse(localStorage.getItem("matchname")).name : " v ",
      sportType: JSON.parse(localStorage.getItem("matchname")).sport !== undefined ? JSON.parse(localStorage.getItem("matchname")).sport : null,
      timer: "",
      redirectToReferrer: false,
      Mteams: [],
      DMteams: [],
      matchOddData16: [],
      marketData16: [],
      teamRows: 0,
      TRindex: [],
      boxopen:'close',
      SoM: [],
      curPoAcc: '',
      curbetHistroy:'',
      curmatchRunner:0,
      scorecard: false,
      openboxid:0,
      isdisabled: false,
      warningTime: 10000, //10sec
  };
    this.service = new Service();
    this.users = new Users();
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
  getselOdds(index, ods, type, teamSelection, marketName, mindex) {
    this.setState({
      selOdds: ods,
      selbetType: type,
      selTeamSelection: teamSelection,
      selIndex: index,
      selmIndex: mindex,
      selmarketName:marketName
    });
  }
  StaKeAmount(index, ods, type, teamSelection, marketName, mindex) {
    if(this.state.selmarketName!==marketName){
      this.MteamsDvalue();
    }
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
    this.getselOdds(index, ods, type, teamSelection, marketName, mindex);
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
    setTimeout(() => {
      const spindex = this.state.Mteams.findIndex(x => x.marketName === marketName);
      let getRunner = this.state.Mteams[spindex][marketName][0].length;
      let Team1 = this.state.Mteams[spindex][marketName][0][0];
      let Team2 = this.state.Mteams[spindex][marketName][0][1];
      if (getRunner == 3) {
        var Team3 = this.state.Mteams[spindex][marketName][0][2];
      }
      if (val != 0) {
        if (type == 'Back') {
          let Mteams = [...this.state.Mteams];
          if (teamSelection == Team1) {
            this.state.Mteams[spindex].DTonePL = parseFloat(this.state.Mteams[spindex].DTonePL) + parseFloat(this.state.betProfit);
            this.state.Mteams[spindex].DTtwoPL = parseFloat(this.state.Mteams[spindex].DTtwoPL) - parseFloat(val);
            this.state.Mteams[spindex].TthreePL = parseFloat(this.state.Mteams[spindex].DTthreePL) - parseFloat(val);
          }
          if (teamSelection == Team2) {
            this.state.Mteams[spindex].DTtwoPL = parseFloat(this.state.Mteams[spindex].DTtwoPL) + parseFloat(this.state.betProfit);
            this.state.Mteams[spindex].TonePL = parseFloat(this.state.Mteams[spindex].DTonePL) - parseFloat(val);
            this.state.Mteams[spindex].TthreePL = parseFloat(this.state.Mteams[spindex].DTthreePL) - parseFloat(val);
          }
          if (getRunner == 3) {
            if (teamSelection == Team3) {
              this.state.Mteams[spindex].DTthreePL = parseFloat(this.state.Mteams[spindex].DTthreePL) + parseFloat(this.state.betProfit);
              this.state.Mteams[spindex].DTtwoPL = parseFloat(this.state.Mteams[spindex].DTtwoPL) - parseFloat(val);
              this.state.Mteams[spindex].DTonePL = parseFloat(this.state.Mteams[spindex].DTonePL) - parseFloat(val);
            }
          }
          this.setState({ Mteams });
        } else {
          let Mteams = [...this.state.Mteams];
          if (teamSelection == Team1) {
            this.state.Mteams[spindex].DTonePL = parseFloat(this.state.Mteams[spindex].DTonePL) - parseFloat(this.state.betLoss);
            this.state.Mteams[spindex].DTtwoPL = parseFloat(this.state.Mteams[spindex].DTtwoPL) + parseFloat(val);
            this.state.Mteams[spindex].DTthreePL = parseFloat(this.state.Mteams[spindex].DTthreePL) + parseFloat(val);
          }
          if (teamSelection == Team2) {
            this.state.Mteams[spindex].DTtwoPL = parseFloat(this.state.Mteams[spindex].DTtwoPL) - parseFloat(this.state.betLoss);
            this.state.Mteams[spindex].DTonePL = parseFloat(this.state.Mteams[spindex].DTonePL) + parseFloat(val);
            this.state.Mteams[spindex].DTthreePL = parseFloat(this.state.Mteams[spindex].DTthreePL) + parseFloat(val);
          }
          if (getRunner == 3) {
            if (teamSelection == Team3) {
              this.state.Mteams[spindex].DTthreePL = parseFloat(this.state.Mteams[spindex].DTthreePL) - parseFloat(this.state.betLoss);
              this.state.Mteams[spindex].DTtwoPL = parseFloat(this.state.Mteams[spindex].DTtwoPL) + parseFloat(val);
              this.state.Mteams[spindex].DTonePL = parseFloat(this.state.Mteams[spindex].DTonePL) + parseFloat(val);
            }
          }
          this.setState({ Mteams });
        }
        let Mteams = [...this.state.Mteams];
        if (this.state.Mteams[spindex].TonePL >= 0) {
          this.state.Mteams[spindex].ToneColor = "blue-odds";
        } else {
          this.state.Mteams[spindex].ToneColor = "color_red";
        }
        if (this.state.Mteams[spindex].TtwoPL >= 0) {
          this.state.Mteams[spindex].TtwoColor = "blue-odds";
        } else {
          this.state.Mteams[spindex].TtwoColor = "color_red";
        }
        if (getRunner == 3) {
          if (this.state.Mteams[spindex].TthreePL >= 0) {
            this.state.Mteams[spindex].TthreeColor = "blue-odds";
          } else {
            this.state.Mteams[spindex].TthreeColor = "color_red";
          }
        }
        this.setState({ Mteams });
      }
    }, 500)
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
  }
  getFancyBook = async (fbetHistroy) => {
    await this.setState({
      fbetHistroyProp: fbetHistroy
    })
    //console.log('fbetHistroy',this.state.fbetHistroyProp)
  }
  showfilterbook(marketName, marketId) {
    let filterbook = [];
    if (this.state.fbetHistroyProp.length > 0) {
      filterbook = this.state.fbetHistroyProp.filter(newdata => {
        return newdata.marketID === marketId;
      }).reverse().slice(0, 1);
    }
    this.setState({
      filterbookdata: filterbook
    })
    //console.log('filterbookdata',this.state.filterbookdata)
  }

  placeBet = (marketName, type, odds, data, pdata, mid, index, width, mindex) => {
    // debugger
    let displayTest;
    let betType = "match odds";
    if (this.userDetails?.Master !== true && this.userDetails?.Admin !== true && this.userDetails?.superAdmin !== true) {
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
          betType: betType,
          marketName:marketName?marketName:''
        },
        display: displayTest,
        toggleMatchIndex: index,
        IP: this.state?.IP,
        boxopen:'open'
      });
      this.StaKeAmount(index, odds, type, pdata.selectionId, marketName, mindex);
    }
  }

  getselfancyOdds(ods, oddssize, type, fancymarketId, index) {
    this.setState({
      selfancyOdds: ods,
      selfancySize: oddssize,
      selbetType: type,
      selfancymarketId: fancymarketId,
      selIndex: index
    });
  }

  fancyStaKeAmount(odds, oddsize, type, fancymarketId, index) {
    let val = document.getElementById("stakeValue").value;
    if (type === "Back") {
      this.setState({
        betProfit: Math.round((oddsize / 100) * val),
        betLoss: val ? val : 0.0,
      });
    } else {
      this.setState({
        betProfit: val ? val : 0.0,
        betLoss: Math.round((oddsize / 100) * val),
      });
    }
    this.getselfancyOdds(odds, oddsize, type, fancymarketId, index);
  }
  betfancy = (type, oddsprice, oddssize, data, fancyType, index, width, indx, MPriceKey, isManual) => {
    if (this.userDetails.Master !== true && this.userDetails.Admin !== true && this.userDetails.superAdmin !== true) {
      if (oddssize !== 'SUSPENDED' && oddssize !== 'Running') {
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
              price: oddsprice,
              size: oddssize
            },
            pData: {
              marketId: data.marketId,
              runnerName: data.marketName,
              selectionId: data.marketId
            },
            type: type,
            odds: oddsprice,
            mid: data.marketId,
            betType: "Fancy",
            fancyType: fancyType,
            ManualPriceKey: MPriceKey,
            isItManual: isManual
          },
          display: displayTest,
          IP: this.state.IP,
          boxopen:'open'
        });
        this.fancyStaKeAmount(oddsprice, oddssize, type, data.marketId, index);
      }
    }
    //console.log("FANCY", this.state.betData)  
  }
  reverseArray(arr) {
    var newArray = [];
    var firstarr = false;
    for (var i = arr.length - 1; i >= 0; i--) {
      if(arr[i].marketName==="Match Odds"){
        newArray.push(arr[i]);
      }
      firstarr = true;
    }
    for (var i = arr.length - 1; i >= 0; i--) {
      if(firstarr && arr[i].marketName!=="Match Odds"){
        newArray.push(arr[i]);
      }
    }
    return newArray;
  }
  componentDidMount() {
    var service = new Service();
    var livevents = new LiveEvents();
    this.setState({
      load: true
    })
    
    let wsc = new WebSocket(`${BASE_URL}/marketTypeData/eventId/${this.props.match.params.id}`);
    wsc.onerror = (e) => {
      alert("Something Went Wrong!")
    }
    wsc.onmessage = (e) => {
      let data = JSON.parse(e.data);
      const sortedList =  this.reverseArray(data); //data.reverse();//sortDataByName(this.state.marketData16, data)
      this.setState({
        marketOdds: sortedList[0].odsData,
        isenable: sortedList[0].isEnabled,
        data: sortedList[0].pdata,
        oddsload: false,
        matchOddData16: sortedList //data //tempJson
      });
      //console.log("matchOddData16",this.state.matchOddData16)
      if (this.state.selbetType !== "" && this.state.selOdds !== "") {
        //console.log(this.state.matchOddData16)
        let filterrunners = this.state.matchOddData16.filter(newdata => {
          return newdata.marketName === this.state.selmarketName;
        })
        //console.log("filterrunners",filterrunners[0].odsData[0]);
        let getUodds = "";
        if (this.state.selbetType === "Back") {
          getUodds = filterrunners[0]?.odsData[0]?.runners[this.state.selmIndex]?.ex?.availableToBack[0]?.price;
        } else {
          getUodds = filterrunners[0]?.odsData[0]?.runners[this.state.selmIndex]?.ex.availableToLay[0]?.price;
        }
        //console.log("getselOdds",this.state.selIndex, getUodds, this.state.selbetType, this.state.selTeamSelection, this.state.selmarketName,this.state.selmIndex);
        this.getselOdds(this.state.selIndex, getUodds!=undefined?getUodds:0, this.state.selbetType, this.state.selTeamSelection, this.state.selmarketName,this.state.selmIndex);
      }

        let teams=[];
        let teamrows=0;
        let teamrowsindex=[];
        let findex = 0;
        let Rmatch = 0;
        sortedList.map((item, index) => {
        if(item.odsData[0]?.runners?.length){
          if(this.state.Mteams.length===0){
            if(item.marketName==="Match Odds"){
              Rmatch = item.odsData[0]?.runners?.length;
            }
            if(item.odsData[0]?.runners?.length === 3){
              teams.push({
                marketName:item.marketName,
                [item.marketName]: Array(1).fill(0).map(row => new Array(item.odsData[0]?.runners?.length).fill(1).map((_,i) => item.odsData[0]?.runners[i]?.selectionId)),
                TonePL: 0,ToneColor: "blue-odds",
                DTonePL: 0,DToneColor: "blue-odds",
                TtwoPL: 0,TtwoColor: "blue-odds",
                DTtwoPL: 0,DTtwoColor: "blue-odds",
                TthreePL: 0,TthreeColor: "blue-odds",
                DTthreePL: 0,DTthreeColor: "blue-odds"
              });
            }else{
              teams.push({
                marketName:item.marketName,
                [item.marketName]: Array(1).fill(0).map(row => new Array(item.odsData[0]?.runners?.length).fill(1).map((_,i) => item.odsData[0]?.runners[i]?.selectionId)),
                TonePL: 0,ToneColor: "blue-odds",
                DTonePL: 0,DToneColor: "blue-odds",
                TtwoPL: 0,TtwoColor: "blue-odds",
                DTtwoPL: 0,DTtwoColor: "blue-odds"
              });
            }
          }
          teamrows = teamrows+item.odsData[0]?.runners?.length;
          if(index===0){
            teamrowsindex.push(0);
            findex = item.odsData[0]?.runners?.length;
          }else if(index===1){
            teamrowsindex.push(findex);
          }else{
            teamrowsindex.push(teamrows-item.odsData[0]?.runners?.length);
          }
        }
      })
      if(this.state.Mteams.length===0){
        this.setState({
          Mteams:teams,
          DMteams:teams,
          teamRows:teamrows,
          TRindex:teamrowsindex,
          curmatchRunner:Rmatch
        })
      }else{
        this.setState({
          teamRows:teamrows,
          TRindex:teamrowsindex,
          curmatchRunner:Rmatch
        })
      }
    }
    let sportName;
    let showHide = (this.userDetails.Master !== true && this.userDetails.Admin !== true && this.userDetails.superAdmin !== true);
    //cricket,fancy,tennis,soccer
    if (this.state.sportType === 1) {
      sportName = "tennis";
    } else if (this.state.sportType === 2) {
      sportName = "soccer";
    } else if (this.state.sportType === 4) {
      sportName = "cricket";
      this.users.userSportsInfo({ id: this.userDetails.id, type: "fancy" }, (data) => {
        this.setState({
          fancyInfo: data.data,
        });
      });
    }
    this.users.userSportsInfo({ id: this.userDetails.id, type: sportName }, (data) => {
      this.setState({
        sportInfo: data.data,
      });
    });

    if (this.state.sportType === 4) {
      let wsfancy = new WebSocket(`${BASE_URL}/fancyMarketTypeData/eventId/${this.props.match.params.id}`)
      wsfancy.onerror = (e) => {
        alert("Something Went Wrong!!!");
      }
      wsfancy.onmessage = (e) => {
        let data = JSON.parse(e.data);
        this.setState({
          fancymarket: data.fancymarket,
        });
        if (this.state.fancymarket.length !== 0) {
          if (this.state.selbetType !== "" && this.state.selfancyOdds !== "") {
            let getUodds = "";
            let getUsize = "";
            if (this.state.selbetType === "Back") {
              getUodds = this.state.fancymarket[this.state.selIndex]?.marketData?.BackPrice;
              getUsize = this.state.fancymarket[this.state.selIndex]?.marketData?.BackSize;
            } else {
              getUodds = this.state.fancymarket[this.state.selIndex]?.marketData?.LayPrice;
              getUsize = this.state.fancymarket[this.state.selIndex]?.marketData?.LaySize;
            }
            //console.log("fancy",this.state.selIndex,getUodds!=undefined?getUodds:0,getUsize!=undefined?getUsize:0,this.state.selbetType,this.state.selfancymarketId)
            this.getselfancyOdds(getUodds!=undefined?getUodds:0, getUsize!=undefined?getUsize:0, this.state.selbetType, this.state.selfancymarketId, this.state.selIndex);
          }
        }
      }
    }
     this.interval = setInterval( async() => {
      if(this.state.boxopen=="close"){
        showHide? await this.MteamsDvalue() : await this.getBetData()
       }
      // service.getListMarketType(this.props.match.params.id, (data) => {
      //   // console.log("Data Abhi Kaisa aarha --->>>",data);
      //   this.setState({
      //     marketOdds: data.odsData,
      //     isenable: data.isEnabled,
      //     data: data.pdata,
      //     oddsload:false
      //   });
      //   //console.log("marketOdds",this.state.marketOdds);
      //   //console.log("data",this.state.data);
      //   if(this.state.selbetType !== "" && this.state.selOdds!==""){
      //     let getUodds = "";
      //     if(this.state.selbetType==="Back"){
      //       getUodds = this.state.marketOdds[0].runners[this.state.selIndex].ex.availableToBack[2].price;
      //     }else{
      //       getUodds = this.state.marketOdds[0].runners[this.state.selIndex].ex.availableToLay[0].price;
      //     }
      //     this.getselOdds(this.state.selIndex, getUodds, this.state.selbetType, this.state.selTeamSelection);
      //   }
      // });
      // if(this.state.sportType===4){
      //   livevents.getFancyMarket(this.props.match.params.id, (data) => {
      //     this.setState({
      //       fancymarket: data.fancymarket,
      //     });
      //     if(this.state.fancymarket.length!==0){
      //       if(this.state.selbetType !== "" && this.state.selOdds!==""){
      //         let getUodds = "";
      //         let getUsize = "";
      //         if(this.state.selbetType==="Back"){
      //           getUodds = this.state.fancymarket[this.state.selIndex].marketData.BackPrice;
      //           getUsize = this.state.fancymarket[this.state.selIndex].marketData.BackSize;
      //         }else{
      //           getUodds = this.state.fancymarket[this.state.selIndex].marketData.LayPrice;
      //           getUsize = this.state.fancymarket[this.state.selIndex].marketData.LaySize;
      //         }
      //         this.getselfancyOdds(getUodds, getUsize, this.state.selbetType, this.state.selfancymarketId,this.state.selIndex);
      //       }
      //     }
      //   });
      // }  
    }, 30000);
    this.setState({
      load: false
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
    service.getListMarketType(this.props.match.params.id, (data, wholeData) => {
        //console.log("sachin",this.state.matchOddData16,this.state.data)
        //let Mteams = Array(2).fill(0).map(row => new Array(3).fill(1))
       //console.log("wholeData",wholeData);
        // console.log("teams",teams);
        this.setState({
          marketData16: wholeData,
        })
        // console.log("marketData16",this.state.marketData16[0].runners[0].length);
         // console.log("Mteams",this.state.Mteams);
        // console.log("Mteams length",this.state.Mteams.length);
        setTimeout(() => { showHide? this.MteamsDvalue() : this.getBetData() }, 1500)
        
      /* end */
    });
    /*********************************/
    fetch("https://api.ipify.org?format=json").then(response => {
        return response.json();
      }, "jsonp").then(res => {
        //console.log(res);
        this.setState({ IP: res.ip });
      }).catch(err => console.log(err))
    /*********************************/
    setTimeout(() => {
    fetch("http://173.249.21.26/SkyImporter/MatchImporter.svc/GetScoreId?eventid=" + this.props.match.params.id).then(response => {
        return response.json();
      }, "jsonp").then(res => {
        //console.log(res);
        this.setState({ scoreId: res.scoreId, scorecard:true });
      }).catch(err => console.log(err))
    }, 2000)
    /*********************************/
    // set Interval

  this.events = [
    'load',
    'mousemove',
    'mousedown',
    'click',
    'scroll',
    'keypress'
  ];

  //console.log(this.userdetail);
  for (var i in this.events) {
    window.addEventListener(this.events[i], this.resetTimeout);
  }
  this.setTimeout();
  /*********************************************/    
  }
  clearTimeoutFunc = () => {
    if (this.warnTimeout) clearTimeout(this.warnTimeout);
  };
  
  setTimeout = () => {
    this.warnTimeout = setTimeout(this.warn, this.state.warningTime);
  };
  
  resetTimeout = () => {
    this.clearTimeoutFunc();
    this.setTimeout();
  };
  
  warn = () => {
    if (this.state.sportType === 4) {
      let wsfancy = new WebSocket(`${BASE_URL}/fancyMarketTypeData/eventId/${this.props.match.params.id}`)
      wsfancy.onerror = (e) => {
        alert("Something Went Wrong!!!");
      }
      wsfancy.onmessage = (e) => {
        let data = JSON.parse(e.data);
        this.setState({
          fancymarket: data.fancymarket,
          selfancyOdds: 0,
          selfancySize: 0,
        });
      }
    }
    this.resetTimeout();
  };

  MteamsDvalue() {
    this.state.Mteams.map((item, MTindex) => {
        let getRunner = this.state.Mteams[MTindex][item.marketName][0].length;
        let Teamone = this.state.Mteams[MTindex][item.marketName][0][0];
        let Teamtwo = this.state.Mteams[MTindex][item.marketName][0][1];
        if (getRunner == 3) {
          var Teamthree = this.state.Mteams[MTindex][item.marketName][0][2];
        }
        let T1TotalPL = 0;
        let T2TotalPL = 0;
        let T3TotalPL = 0;
        this.service.betHistory(JSON.parse(localStorage.getItem('data')).userName, this.props.match.params.id, 'getUserOpenBetHistory', (data) => {
          let betFill = data.filter(e => e.marketName === item.marketName);
          //console.log("betFill",betFill);
          betFill.map((item, index) => {
            if (item.bettype == 'Back') {
              if (Teamone == item.selectionID) {
                T1TotalPL = parseFloat(T1TotalPL) + parseFloat(item.P_L);
                T2TotalPL = parseFloat(T2TotalPL) - parseFloat(item.stack);
                T3TotalPL = parseFloat(T3TotalPL) - parseFloat(item.stack);
              }
              if (Teamtwo == item.selectionID) {
                T2TotalPL = parseFloat(T2TotalPL) + parseFloat(item.P_L);
                T1TotalPL = parseFloat(T1TotalPL) - parseFloat(item.stack);
                T3TotalPL = parseFloat(T3TotalPL) - parseFloat(item.stack);
              }
              if (getRunner == 3) {
                if (Teamthree == item.selectionID) {
                  T3TotalPL = parseFloat(T3TotalPL) + parseFloat(item.P_L);
                  T2TotalPL = parseFloat(T2TotalPL) - parseFloat(item.stack);
                  T1TotalPL = parseFloat(T1TotalPL) - parseFloat(item.stack);
                }
              }
            } else {
              if (Teamone == item.selectionID) {
                T1TotalPL = parseFloat(T1TotalPL) - parseFloat(item.P_L);
                T2TotalPL = parseFloat(T2TotalPL) + parseFloat(item.stack);
                T3TotalPL = parseFloat(T3TotalPL) + parseFloat(item.stack);
              }
              if (Teamtwo == item.selectionID) {
                T2TotalPL = parseFloat(T2TotalPL) - parseFloat(item.P_L);
                T1TotalPL = parseFloat(T1TotalPL) + parseFloat(item.stack);
                T3TotalPL = parseFloat(T3TotalPL) + parseFloat(item.stack);
              }
              if (getRunner == 3) {
                if (Teamthree == item.selectionID) {
                  T3TotalPL = parseFloat(T3TotalPL) - parseFloat(item.P_L);
                  T2TotalPL = parseFloat(T2TotalPL) + parseFloat(item.stack);
                  T1TotalPL = parseFloat(T1TotalPL) + parseFloat(item.stack);
                }
              }
            }
          })
          let Mteams = [...this.state.Mteams];
          if(T1TotalPL>=0){
            this.state.Mteams[MTindex].TonePL = T1TotalPL;
            this.state.Mteams[MTindex].DTonePL = T1TotalPL;
            this.state.Mteams[MTindex].ToneColor = "blue-odds";
            this.state.Mteams[MTindex].DToneColor = "blue-odds";
          }else{
            this.state.Mteams[MTindex].TonePL = T1TotalPL;
            this.state.Mteams[MTindex].DTonePL = T1TotalPL;
            this.state.Mteams[MTindex].ToneColor = "color_red";
            this.state.Mteams[MTindex].DToneColor = "color_red";
          }
          if(T2TotalPL>=0){
            this.state.Mteams[MTindex].TtwoPL = T2TotalPL;
            this.state.Mteams[MTindex].DTtwoPL = T2TotalPL;
            this.state.Mteams[MTindex].TtwoColor = "blue-odds";
            this.state.Mteams[MTindex].DTtwoColor = "blue-odds";
          }else{
            this.state.Mteams[MTindex].TtwoPL = T2TotalPL;
            this.state.Mteams[MTindex].DTtwoPL = T2TotalPL;
            this.state.Mteams[MTindex].TtwoColor = "color_red";
            this.state.Mteams[MTindex].DTtwoColor = "color_red";
          }
          if(getRunner==3){
            if(T3TotalPL>=0){
                this.state.Mteams[MTindex].TthreePL = T3TotalPL;
                this.state.Mteams[MTindex].DTthreePL = T3TotalPL;
                this.state.Mteams[MTindex].TthreeColor = "blue-odds";
                this.state.Mteams[MTindex].DTthreeColor = "blue-odds";
            }else{
                this.state.Mteams[MTindex].TthreePL = T3TotalPL;
                this.state.Mteams[MTindex].DTthreePL = T3TotalPL;
                this.state.Mteams[MTindex].TthreeColor = "color_red";
                this.state.Mteams[MTindex].DTthreeColor = "color_red";
            }
          }
          this.setState({ Mteams });
        });
    });
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

  disabledbox = (index,status) => {
    this.setState({
      openboxid: index,
      isdisabled: status
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
        NotificationManager.success(notfyMsg, "Success");
        const audioEl = document.getElementsByClassName("audio_element")[0]
        audioEl.play()
        break;
      case 'error':
        NotificationManager.error(notfyMsg, "Error");
        break;
    }
  }

  getProfitandLoss = async (profit, loss, teamSelection, betType, stack, status, facFrom, marketName) => {
    await this.setState({
      betProfit: profit,
      betLoss: loss,
      zeroStatus: status,
      color: "red"
    })
    if(facFrom==="ClearAllSelection"){
      await this.setState({
        boxopen: "close"
      })
    }
    if(typeof(marketName) !== 'undefined'){
      setTimeout(() => {
        const gpindex = this.state.Mteams.findIndex(x => x.marketName === marketName);
        /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
        let getRunner = this.state.Mteams[gpindex][marketName][0].length;
        let Team1 = this.state.Mteams[gpindex][marketName][0][0];
        let Team2 = this.state.Mteams[gpindex][marketName][0][1];
        if (getRunner == 3) {
          var Team3 = this.state.Mteams[gpindex][marketName][0][2];
        }

        if (betType == 'Back') {
          let Mteams = [...this.state.Mteams];
          if (teamSelection == Team1) {
            this.state.Mteams[gpindex].TonePL = parseFloat(this.state.Mteams[gpindex].DTonePL) + parseFloat(profit);
            this.state.Mteams[gpindex].TtwoPL = parseFloat(this.state.Mteams[gpindex].DTtwoPL) - parseFloat(stack);
            this.state.Mteams[gpindex].TthreePL = parseFloat(this.state.Mteams[gpindex].DTthreePL) - parseFloat(stack);
          }
          if (teamSelection == Team2) {
            this.state.Mteams[gpindex].TtwoPL = parseFloat(this.state.Mteams[gpindex].DTtwoPL) + parseFloat(profit);
            this.state.Mteams[gpindex].TonePL = parseFloat(this.state.Mteams[gpindex].DTonePL) - parseFloat(stack);
            this.state.Mteams[gpindex].TthreePL = parseFloat(this.state.Mteams[gpindex].DTthreePL) - parseFloat(stack);
          }
          if (getRunner == 3) {
            if (teamSelection == Team3) {
              this.state.Mteams[gpindex].TthreePL = parseFloat(this.state.Mteams[gpindex].DTthreePL) + parseFloat(profit);
              this.state.Mteams[gpindex].TtwoPL = parseFloat(this.state.Mteams[gpindex].DTtwoPL) - parseFloat(stack);
              this.state.Mteams[gpindex].TonePL = parseFloat(this.state.Mteams[gpindex].DTonePL) - parseFloat(stack);
            }
          }
          this.setState({ Mteams });
        } else {
          let Mteams = [...this.state.Mteams];
          if (teamSelection == Team1) {
            this.state.Mteams[gpindex].TonePL = parseFloat(this.state.Mteams[gpindex].DTonePL) - parseFloat(loss);
            this.state.Mteams[gpindex].TtwoPL = parseFloat(this.state.Mteams[gpindex].DTtwoPL) + parseFloat(stack);
            this.state.Mteams[gpindex].TthreePL = parseFloat(this.state.Mteams[gpindex].DTthreePL) + parseFloat(stack);
          }
          if (teamSelection == Team2) {
            this.state.Mteams[gpindex].TtwoPL = parseFloat(this.state.Mteams[gpindex].DTtwoPL) - parseFloat(loss);
            this.state.Mteams[gpindex].TonePL = parseFloat(this.state.Mteams[gpindex].DTonePL) + parseFloat(stack);
            this.state.Mteams[gpindex].TthreePL = parseFloat(this.state.Mteams[gpindex].DTthreePL) + parseFloat(stack);
          }
          if (getRunner == 3) {
            if (teamSelection == Team3) {
              this.state.Mteams[gpindex].TthreePL = parseFloat(this.state.Mteams[gpindex].DTthreePL) - parseFloat(loss);
              this.state.Mteams[gpindex].TtwoPL = parseFloat(this.state.Mteams[gpindex].DTtwoPL) + parseFloat(stack);
              this.state.Mteams[gpindex].TonePL = parseFloat(this.state.Mteams[gpindex].DTonePL) + parseFloat(stack);
            }
          }
          this.setState({ Mteams });
        }
        let Mteams = [...this.state.Mteams];
        if (this.state.Mteams[gpindex].TonePL >= 0) {
          this.state.Mteams[gpindex].ToneColor = "blue-odds";
        } else {
          this.state.Mteams[gpindex].ToneColor = "color_red";
        }
        if (this.state.Mteams[gpindex].TtwoPL >= 0) {
          this.state.Mteams[gpindex].TtwoColor = "blue-odds";
        } else {
          this.state.Mteams[gpindex].TtwoColor = "color_red";
        }

        if (facFrom === "placeBet") {
            this.state.Mteams[gpindex].DTonePL = this.state.Mteams[gpindex].TonePL;
            this.state.Mteams[gpindex].DTtwoPL = this.state.Mteams[gpindex].TtwoPL;
            this.state.Mteams[gpindex].DToneColor = this.state.Mteams[gpindex].ToneColor;
            this.state.Mteams[gpindex].DTtwoColor = this.state.Mteams[gpindex].TtwoColor;
        }
        if (getRunner == 3) {
          if (this.state.Mteams[gpindex].TthreePL >= 0) {
            this.state.Mteams[gpindex].TthreeColor = "blue-odds";
          } else {
            this.state.Mteams[gpindex].TthreeColor = "color_red";
          }
          if (facFrom === "placeBet") {
            this.state.Mteams[gpindex].DTthreePL = this.state.Mteams[gpindex].TthreePL;
            this.state.Mteams[gpindex].DTthreeColor = this.state.Mteams[gpindex].TthreeColor;
          }
        }
        this.setState({ Mteams });
      }, 100)
    }
    /* @@@@@@@@@@@@@@@@@@@@@@@@@@@@ */
  }
// getting all bet data

getBetData = () => {
  let userName = JSON.parse(localStorage.getItem('data')).userName;
  if (this.userDetails.superAdmin) {
    this.users.getAllBettings(`/getAllBetting?event_id=${this.props.match.params.id}`, (Data) => {
      this.setState({
        curbetHistroy: Data.data.data,
      });
      this.handleTeamCurrentPosition(this.state.curbetHistroy);
    });
  }
  else if (this.userDetails.Admin) {
    this.users.getAllBettings(`/getAllBetting?event_id=${this.props.match.params.id}`, (Data) => {
      let betFill = Data.data.data.filter(item => item.userInfo[0].superAdmin[0] === userName);
      this.setState({
        curbetHistroy: betFill
      });
      this.handleTeamCurrentPosition(this.state.curbetHistroy);
    });
  }
  else if (this.userDetails.Master) {
    this.users.getAllBettings(`/getAllBetting?event_id=${this.props.match.params.id}`, (Data) => {
      let betFill = Data.data.data.filter(item => item.userInfo[0].admin[0] === userName)
      this.setState({
        curbetHistroy: betFill
      });
      this.handleTeamCurrentPosition(this.state.curbetHistroy);
    });
  }
  else {
    this.users.getAllBettings(`/getAllBetting?event_id=${this.props.match.params.id}`, (Data) => {
      let betFill = Data.data.data.filter(item => item.clientName === userName)
      this.setState({
        curbetHistroy: betFill
      });
      this.handleTeamCurrentPosition(this.state.curbetHistroy);
    });
  }
}
handleTeamCurrentPosition = async (betdata) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 500));
    this.state.DMteams.map((item, MTindex) => {
      let getRunner = this.state.DMteams[MTindex][item.marketName][0].length;
      let Teamone = this.state.DMteams[MTindex][item.marketName][0][0];
      let Teamtwo = this.state.DMteams[MTindex][item.marketName][0][1];
      if (getRunner == 3) {
        var Teamthree = this.state.DMteams[MTindex][item.marketName][0][2];
      }
      let T1TotalPL = 0;
      let T2TotalPL = 0;
      let T3TotalPL = 0;
        let betFill = betdata.filter(e => e.marketName === item.marketName);
        betFill.map((item, index) => {
          if (item.bettype == 'Back') {
            if (Teamone == item.selectionID) {
              T1TotalPL = parseFloat(T1TotalPL) - parseFloat(item.P_L);
              T2TotalPL = parseFloat(T2TotalPL) + parseFloat(item.stack);
              T3TotalPL = parseFloat(T3TotalPL) + parseFloat(item.stack);
            }
            if (Teamtwo == item.selectionID) {
              T2TotalPL = parseFloat(T2TotalPL) - parseFloat(item.P_L);
              T1TotalPL = parseFloat(T1TotalPL) + parseFloat(item.stack);
              T3TotalPL = parseFloat(T3TotalPL) + parseFloat(item.stack);
            }
            if (getRunner == 3) {
              if (Teamthree == item.selectionID) {
                T3TotalPL = parseFloat(T3TotalPL) - parseFloat(item.P_L);
                T2TotalPL = parseFloat(T2TotalPL) + parseFloat(item.stack);
                T1TotalPL = parseFloat(T1TotalPL) + parseFloat(item.stack);
              }
            }
          } else {
            if (Teamone == item.selectionID) {
              T1TotalPL = parseFloat(T1TotalPL) + parseFloat(item.P_L);
              T2TotalPL = parseFloat(T2TotalPL) - parseFloat(item.stack);
              T3TotalPL = parseFloat(T3TotalPL) - parseFloat(item.stack);
            }
            if (Teamtwo == item.selectionID) {
              T2TotalPL = parseFloat(T2TotalPL) + parseFloat(item.P_L);
              T1TotalPL = parseFloat(T1TotalPL) - parseFloat(item.stack);
              T3TotalPL = parseFloat(T3TotalPL) - parseFloat(item.stack);
            }
            if (getRunner == 3) {
              if (Teamthree == item.selectionID) {
                T3TotalPL = parseFloat(T3TotalPL) + parseFloat(item.P_L);
                T2TotalPL = parseFloat(T2TotalPL) - parseFloat(item.stack);
                T1TotalPL = parseFloat(T1TotalPL) - parseFloat(item.stack);
              }
            }
          }
        })
        let DMteams = [...this.state.DMteams];
        if(T1TotalPL>=0){
          this.state.DMteams[MTindex].TonePL = T1TotalPL;
          this.state.DMteams[MTindex].ToneColor = "blue-odds";
        }else{
          this.state.DMteams[MTindex].TonePL = T1TotalPL;
          this.state.DMteams[MTindex].ToneColor = "color_red";
        }
        if(T2TotalPL>=0){
          this.state.DMteams[MTindex].TtwoPL = T2TotalPL;
          this.state.DMteams[MTindex].TtwoColor = "blue-odds";
        }else{
          this.state.DMteams[MTindex].TtwoPL = T2TotalPL;
          this.state.DMteams[MTindex].TtwoColor = "color_red";
        }
        if(getRunner==3){
          if(T3TotalPL>=0){
              this.state.DMteams[MTindex].TthreePL = T3TotalPL;
              this.state.DMteams[MTindex].TthreeColor = "blue-odds";
          }else{
              this.state.DMteams[MTindex].TthreePL = T3TotalPL;
              this.state.DMteams[MTindex].TthreeColor = "color_red";
          }
        }
        //console.log("Mteams",DMteams);
        this.setState({ DMteams });
  });
}

render() {
    let inplay;
    let runners = this.state.data;
    let filterrunners = [];
    let bookitems = [];
    let bookodds;
    let expoProfit = 0;
    let j = 0;
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
        <NotificationContainer />
        <audio className="audio_element">
          <source src={Sound} />
        </audio>
        <div className="forModal" />
        {
          this.state.load ?
            <div style={{ opacity: "1", height: '100vh', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
              <Loader type="Grid" color="#6c1945" height={100} width={100} />
            </div> :
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
                                {/* <div className="modal-header mod-header">
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
                                </div> */}
                              </div>
                              {//this.state.sportType === 4
                                (this.state?.matchOddData16?.length > 0 && this.state.sportType===4 && <>
                                  <div style={{ height: '100%', width: '100%', paddingTop: '0px', display: 'flex', marginBottom: '5px' }}>
                                    {this.state.scorecard?<iframe allowfullscreen="true" style={{ border: 'none', width: '100%', height: '281px' }} src={`https://shivexch.com/sport_score_api/cricketscore/index.html?scoreId=${this.state.scoreId}&matchDate=${JSON.parse(localStorage.getItem("matchname")).date}`}></iframe>:''}
                                  </div>
                                </>)
                              }
                              <div className="sportrow-4 matchOpenBox_1171389306">
                                {/* <div className="match-odds-sec">
                                  <div className="item match-status match-odds"><span class="match-odd-top">Match Odds</span> <span class="sid-image"></span></div>
                                  <div className="item match-status-odds">
                                    <span className="going_inplay green"> {inplay} </span>
                                    <span className="click-tv">
                                      <img className="tv-icons" src={tv} alt="Live Games" />
                                    </span>
                                  </div>
                                  <div className="item match-shedule" id="demo_29905278">{this.state.timer}</div>
                                </div> */}
                                {
                                  (this.state.matchOddData16?.length > 0 && this.state.matchOddData16?.map((item, i) =>
                                    <MatchOddsTable
                                      {...item}
                                      {...{ marketData: this.state.marketData16 }}
                                      {...{ timer: this.state.timer }}
                                      exporunnerdata={this.state.exporunnerdata}
                                      matchName={this.state.matchName}
                                      handleRemove={this.handleRemove}
                                      disabledbox={this.disabledbox}
                                      handleBetPlaceBox={this.handleBetPlaceBox}
                                      getProfitandLoss={this.getProfitandLoss}
                                      handleInputValue={(e) => this.handleInputValue(e)}
                                      getFancyBook={this.getFancyBook}
                                      placeBet={this.placeBet}
                                      Mteams={this.state.Mteams}
                                      DMteams={this.state.DMteams}
                                      TBindex={this.state.TRindex[i]}
                                      display={this.state.display}
                                      eventType={this.state.sportType}
                                      betData={this.state.betData}
                                      betProfit={this.state.betProfit}
                                      betLoss={this.state.betLoss}
                                      eventId={this.props.match.params.id}
                                      runnderData={this.state.data}
                                      expoData={this.state.exporunnerdata}
                                      selOdds={this.state.selOdds}
                                      selfancyOdds={this.state.selfancyOdds}
                                      selfancySize={this.state.selfancySize}
                                      IP={this.state.IP}
                                      sportInfo={this.state.sportInfo}
                                      fancyInfo={this.state.fancyInfo}
                                      SoM={this.state.SoM}
                                      isdisabled={this.state.isdisabled}
                                    />
                                  ))
                                }

                                {
                                  //////////////////////// TABLE OF MATCH ODDS /////////////////////////////
                                }
                              </div>
                              {
                                this.state.sportType === 4
                                  && this.state.fancymarket?.length > 0
                                  && this.state.marketOdds?.length > 0 ?
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
                                        <div className="event-sports" style={{ color: 'red' }}>Min stake:{this.state.fancyInfo?.fancyminStacks} Max stake:{this.state.fancyInfo?.fancymaxStacks} </div>
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
                                        this.state.fancymarket?.length > 0 ?
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
                                                          <table className={`table table-striped bulk_actions ${this.state.isdisabled ? "fancyOddsDisabled-placebet" : ""} ${parentitem.marketData.isEnabled ? "fancyOddsDisabled" : ""}`} >
                                                            <tbody>
                                                              <tr class="session_content">
                                                                <td>
                                                                  <span class="fancyhead5303" id="fancy_name5303">{parentitem.marketData.marketName}</span>
                                                                  <div className="block_box_btn1" style={{ marginRight: '50px' }}>
                                                                    <button className="btn btn-primary btn-xs" onClick={() => this.showfilterbook(parentitem.marketData.marketName, parentitem.marketData.marketId)} data-toggle="modal" data-target="#exampleModalForBook" style={{ color: 'white', border: 'none', outline: 'none', backgroundColor: '#6c1945' }}>Book</button>
                                                                  </div>
                                                                  <b class="fancyLia5303"></b>
                                                                  <p class="position_btn"></p>
                                                                </td>
                                                                <td></td>
                                                                <td></td>
                                                                <div class={`${parentitem.marketData.status === 'SUSPENDED' ? "fancyOddsSBR" : "fancyOddsSBRnone"}`}>SUSPENDED</div>
                                                                <div class={`${parentitem.marketData.status === 'Ball Running' ? "fancyOddsSBR" : "fancyOddsSBRnone"}`}>BALL RUNNING</div>
                                                                <td class="fancy_lay" onClick={() => this.betfancy("Lay", parentitem.marketData.LayPrice, parentitem.marketData.LaySize, parentitem.marketData, "NO", index, window.innerWidth, index + this.state.teamRows, parentitem.marketData.ManualPriceKey, parentitem.marketData.isItManual)}>
                                                                  <button class="back-cell cell-btn" id="BackYes_5303">{parentitem.marketData.LayPrice}</button>
                                                                  <button id="YesValume_5303" class="disab-btn">{parentitem.marketData.LaySize}</button>
                                                                </td>
                                                                <td class="fancy_back" onClick={() => this.betfancy("Back", parentitem.marketData.BackPrice, parentitem.marketData.BackSize, parentitem.marketData, "YES", index, window.innerWidth, index + this.state.teamRows, parentitem.marketData.ManualPriceKey, parentitem.marketData.isItManual)}>
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
                                                    eventType={this.state.sportType}
                                                    matchName={this.state.matchName}
                                                    stake={0}
                                                    index={index + this.state.teamRows}
                                                    betData={this.state.betData}
                                                    betProfit={this.state.betProfit}
                                                    handleRemove={(style, num) => {
                                                      this.handleRemove(style, num, index + this.state.teamRows);
                                                    }}
                                                    disabledbox={(isdisabled) => {
                                                      this.disabledbox(index + this.state.teamRows,isdisabled);
                                                    }}
                                                    handleBetPlaceBox={(notfyMsg, bgColor, notfyStatus) => {
                                                      this.handleBetPlaceBox(notfyMsg, bgColor, notfyStatus);
                                                    }}
                                                    getProfitandLoss={(profit, loss, teamSelection, betType, stack, status, facFrom, marketName) => {
                                                      this.getProfitandLoss(profit, loss, teamSelection, betType, stack, status, facFrom, marketName);
                                                    }}
                                                    betLoss={this.state.betLoss}
                                                    setdisplay={this.state.display[index + this.state.teamRows]}
                                                    eventId={this.props.match.params.id}
                                                    handleInput={(e) => this.handleInputValue(e)}
                                                    runnderData={this.state.data}
                                                    expoData={this.state.exporunnerdata}
                                                    selOdds={this.state.selOdds}
                                                    selfancyOdds={this.state.selfancyOdds}
                                                    selfancySize={this.state.selfancySize}
                                                    IP={this.state.IP}
                                                    sportInfo={this.state.sportInfo}
                                                    fancyInfo={this.state.fancyInfo}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          }) : null
                                      }
                                    </div>
                                  </div> : null
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
                                          bookodds = (item.odds - 10);
                                          for (let i = 0; i <= 20; i++) {
                                            if (bookodds >= 0) {
                                              bookitems.push(i >= 10 ?
                                                <div><span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{bookodds + j}</span>
                                                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: "red", float: 'right' }}>
                                                    -{item.stack}
                                                  </span><hr style={{ marginTop: '5px', marginBottom: '5px' }}></hr></div> :
                                                <div><span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{bookodds + j}</span>
                                                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: "green", float: 'right' }}>
                                                    {item.stack}
                                                  </span><hr style={{ marginTop: '5px', marginBottom: '5px' }}></hr></div>)
                                              j++
                                            } else { bookodds++ }
                                          }
                                          return (
                                            <div style={{ paddingRight: '25px', paddingLeft: '25px', margin: '10px' }}>
                                              <span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>Score</span>
                                              <span className="" style={{ fontSize: '15px', fontWeight: 'bold', float: 'right' }}>Amount</span>
                                              {bookitems}
                                            </div>
                                          )
                                        }
                                        else {
                                          bookodds = (item.odds - 10);
                                          for (let i = 0; i <= 20; i++) {
                                            if (bookodds >= 0) {
                                              bookitems.push(i >= 10 ?
                                                <div><span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{bookodds + j}</span>
                                                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: "green", float: 'right' }}>
                                                    {item.stack}
                                                  </span><hr style={{ marginTop: '5px', marginBottom: '5px' }}></hr></div> :
                                                <div><span className="" style={{ fontSize: '15px', fontWeight: 'bold' }}>{bookodds + j}</span>
                                                  <span style={{ fontSize: '15px', fontWeight: 'bold', color: "red", float: 'right' }}>
                                                    -{item.stack}
                                                  </span><hr style={{ marginTop: '5px', marginBottom: '5px' }}></hr></div>)
                                              j++
                                            } else { bookodds++ }
                                          }
                                          return (
                                            <div style={{ paddingRight: '25px', paddingLeft: '25px', margin: '10px' }}>
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
                          : null
                      }
                      <Sidebet
                        eventType={this.state.sportType}
                        matchName={this.state.matchName}
                        stake={0}
                        betData={this.state.betData}
                        betProfit={this.state.betProfit}
                        handleRemove={(style, num) => {
                          this.handleRemove(style, num, 'desktop');
                        }}
                        disabledbox={(isdisabled) => {
                          this.disabledbox('desktop',isdisabled);
                        }}
                        handleBetPlaceBox={(notfyMsg, bgColor, notfyStatus) => {
                          this.handleBetPlaceBox(notfyMsg, bgColor, notfyStatus);
                        }}
                        getProfitandLoss={(profit, loss, teamSelection, betType, stack, status, facFrom, marketName) => {
                          this.getProfitandLoss(profit, loss, teamSelection, betType, stack, status, facFrom, marketName);
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
                        IP={this.state.IP}
                        sportInfo={this.state.sportInfo}
                        fancyInfo={this.state.fancyInfo}
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
