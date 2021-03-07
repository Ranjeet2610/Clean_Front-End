import React, { Component } from 'react'
import Pagination from './Pagination'
import Loader from 'react-loader-spinner'
import Utilities from './utilities'
import  fullSize from '../images/full-size.png'
import Service from '../Services/Service';
import Users from '../Services/users'
import {Link} from 'react-router-dom'
import e from 'cors';
import Livevents from '../Services/livevents'
export default class SideBet extends Component {

  constructor(props) {
    super(props);
    this.state = {
        currentPage:1,
        postsPerPage:10,
        load:false,
        SoM:[],
        showCurrPosition:'none',
        chipName:["500","2000","5000","25000","50000","100000"],
        chipStake:["500","2000","5000","25000","50000"],
        color:'lightblue',
        betData:'',
        profit:0.00,
        loss: 0.00,
        betHistroy:[],
        fbetHistroy:[],
        display:'none',
        IP:'',
        count:0,
        fcount:0,
        runnderData:'',
        getExpo:[],
        expoData:'',
        historyType:'open',
        newResData:[],
        betHistroy:[],
        curPoAcc:'',
        DfPoAcc:'',
        backPoAcc:'',
        selUserName:'',
        matchRunner:'',
        openTab:'allBets',
        getselOdds:'',
        getselfancyOdds:'',
        getselfancySize:'',
        showLoader:false,
        sportType: JSON.parse(localStorage.getItem("matchname")).sport !== undefined ? JSON.parse(localStorage.getItem("matchname")).sport : null,
        isMobile    : window.matchMedia("only screen and (max-width: 480px)").matches,
        isTab       : window.matchMedia("only screen and (max-width: 767px)").matches,
        isDesktop   : window.matchMedia("only screen and (max-width: 1280px)").matches,
      }
    this.service = new Service();
    this.users = new Users();
    this.event = new Livevents();
    this.userDetails = JSON.parse(localStorage.getItem('data'))!=undefined?JSON.parse(localStorage.getItem('data')):'';
    this.matchName = this.props.matchName.split(" v ")
    if(this.state.isMobile){ setInterval(() => {
      this.getBetData();
    }, 3000)}
  }

  handleChange=(e)=>{
    let teamSelection = this.props.betData.pData.runnerName;
    let teamBetType = this.state.betData.type;
    let stack = e.target.value;
    e.preventDefault();
    if(this.props.betData.betType==="Fancy"){
      let fancysize = this.props.betData.data.size;
      if(this.state.betData.type === 'Back'){
       this.setState({
        profit:((fancysize/100)*stack).toFixed(2),
        loss:stack?stack:0.0
       })
     }
     else{
       this.setState({
        profit:stack?stack:0.0,
        loss:((fancysize/100)*stack).toFixed(2)
       })
     }
   }else{
       let odds = this.state.betData.odds-1;
       if(this.state.betData.type === 'Back'){
        this.setState({
          profit:(odds*e.target.value).toFixed(2),
          loss:e.target.value?e.target.value:0.0
        });
        if(this.state.getExpo!=undefined && this.state.getExpo.length>0){
          this.state.expoData = this.state.getExpo.map(item=>{
            let updatedRunners ={};
            if(item.runnerId == this.props.betData.pData.selectionId){
              updatedRunners.exposure =item.exposure + parseFloat((odds*e.target.value).toFixed(2))
            }
            else{
              updatedRunners.exposure = item.exposure +(- parseFloat(e.target.value))
            }
            updatedRunners.runnerId = item.runnerId;
            return updatedRunners;
          });
        }
        else{
          this.state.expoData = this.state.runnderData.map(item=>{
            let updatedRunners ={};
            if(item.selectionId == this.props.betData.pData.selectionId){
              updatedRunners.exposure = parseFloat((odds*e.target.value).toFixed(2))
            }
            else{
              updatedRunners.exposure = - parseFloat(e.target.value)
            }
          updatedRunners.runnerId = item.selectionId;
          return updatedRunners;
          });
        }
      }
      else{
        this.setState({
          profit:e.target.value,
          loss:(odds*e.target.value).toFixed(2)
        });
        if(this.state.getExpo!=undefined && this.state.getExpo.length>0){
          this.state.expoData = this.state.getExpo.map(item=>{
            let updatedRunners ={};
            if(item.runnerId == this.props.betData.pData.selectionId){
              updatedRunners.exposure =item.exposure + (- parseFloat((odds*e.target.value).toFixed(2)))
            }
            else{
              updatedRunners.exposure = item.exposure + parseFloat(e.target.value)
            } 
            updatedRunners.runnerId = item.runnerId;
            return updatedRunners;
          });
        }
        else{
          // console.log("XXXXXXXXX",this.state.runnderData)
          this.state.expoData = this.state.runnderData.map(item=>{
            let updatedRunners ={};
            if(item.selectionId == this.props.betData.pData.selectionId){
              updatedRunners.exposure = - parseFloat((odds*e.target.value).toFixed(2))
            }
            else{
              updatedRunners.exposure = parseFloat(e.target.value)
            }
          updatedRunners.runnerId = item.selectionId;
          return updatedRunners;
          });
        }
      }
     setTimeout(()=> {
      this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,teamBetType,stack,"true","handleChange");
     }, 500)
     this.props.handleInput(e.target.value);
    }
  }

  getBetTime = () =>{
    this.event.getbetplacetime(1,data=>{
      this.setState({
        timeDuration:data.data.data.timeDuration
      })
    })
  }

  changeBackground = (e,type) =>{
    if(type==='Back'){
      e.target.parentElement.classList.add('blue')
    }
    else{
      e.target.parentElement.classList.add('lightred')
    }
  }

  changeBackColor = (e,type) => {
    if(type==='Back'){
      e.target.parentElement.classList.remove('blue')
    }
    else{
      e.target.parentElement.classList.remove('lightred')
    }
  }

  placeBet=async(e)=>{
    this.getBetTime();
    // device 1 for desktop,2 for mobile,3 for tab
    let device;
    if(this.state.isMobile)
    device = 2;
    if(this.state.isDesktop)
    device = 1;
    if(this.state.isTab)
    device = 3;
    e.preventDefault();
    if(this.stackInput.value < 99 || this.stackInput.value > 50000 ){
      this.props.handleBetPlaceBox("Choose Stack...",'red','error')
    }
    else if(this.stackInput.value > JSON.parse(localStorage.getItem('data')).walletBalance){
      this.props.handleBetPlaceBox("Don't have enough balance...",'red','error')
    }
    else{
      this.setState({
        showLoader:true
      });
      await new Promise((resolve, reject) => setTimeout(resolve, this.state.timeDuration));
      if(this.props.betData.betType !=undefined){
        let fancysizeval;
        if(this.state.getselfancySize=='SUSPENDED' || this.state.getselfancySize=='Running'){
          fancysizeval = 0;
        }else{
          fancysizeval = this.state.getselfancySize;
        }
        if(fancysizeval < this.props.betData.data.size){
          this.props.handleBetPlaceBox("Invaild Fancy odds",'red','error')
        }else{
          await this.StaKeAmount(this.stackInput.value,this.state.getselfancyOdds,this.state.getselfancySize,this.isbackInput.value,"placeBet");
          const obj = {
          userName:JSON.parse(localStorage.getItem('data')).userName,
          description:localStorage.getItem('matchname'),
          selection:this.runnerNameInput.value,
          selectionID:this.selectionIdInput.value,
          odds:this.state.getselfancyOdds,
          stack:this.stackInput.value,
          eventID:this.props.eventId,
          status:"open",
          marketID:this.props.betData.mid,
          profit:this.state.profit,
          loss:this.state.loss,
          IP:this.props.IP,
          device:device,
          marketType: this.props.betData.betType,
          bettype:this.isbackInput.value,
          eventType:this.state.sportType
         }
         //console.log(obj);
         this.service.fancyplaceBet(obj,data=>{ 
          const obj1 = {
            userName:JSON.parse(localStorage.getItem('data')).userName
          }
          /*
          this.users.getMyprofile(obj1,data=>{
            localStorage.setItem('data',JSON.stringify(data.data));
            this.props.handleBetPlaceBox("Bet Placed...!",'green','success')
            this.getBetData();
          })*/
          this.users.getMyprofile(obj1,data=>{
            localStorage.setItem('data',JSON.stringify(data.data));
            localStorage.setItem('expo', -(JSON.stringify(data.data.exposure)));
            const obj2 = {
              userid:JSON.parse(localStorage.getItem('data')).id,
              eventID:this.props.eventId,
              marketType: this.props.betData.betType !=undefined?this.props.betData.betType:'match odds',
              runnersData :this.state.expoData
            }
            this.service.updateExpo(obj2,ddata=>{
              const obj3 = {
                userid:JSON.parse(localStorage.getItem('data')).id
              }
              this.users.getUserExposure(obj3,expodata=>{
                this.props.handleBetPlaceBox("Bet Placed...!",'green','success')
                this.getBetData();
              })
            });
           })
         })
        }
      }
      else{
        if(this.state.getselOdds < this.odsInput.value){
          this.props.handleBetPlaceBox("Invaild Match odds...",'red','error')
        }else{
          await this.StaKeAmount(this.stackInput.value,this.state.getselOdds,this.state.getselfancySize,this.isbackInput.value,"placeBet");
          const obj ={
          userName:JSON.parse(localStorage.getItem('data')).userName,
          description:localStorage.getItem('matchname'),
          selection:this.runnerNameInput.value,
          selectionID:this.selectionIdInput.value,
          odds:this.state.getselOdds,
          stack:this.stackInput.value,
          eventID:this.props.eventId,
          status:"open",
          marketID:this.props.betData.mid,
          profit:this.state.profit,
          loss:this.state.loss,
          IP:this.props.IP,
          device:device,
          marketType: this.props.betData.betType !=undefined?this.props.betData.betType:'match odds',
          bettype:this.isbackInput.value,
          eventType:this.state.sportType
         }
         //console.log(obj);
         this.service.placeBet(obj,data=>{ 
          const obj1 = {
            userName:JSON.parse(localStorage.getItem('data')).userName
          }
          this.users.getMyprofile(obj1,data=>{
            localStorage.setItem('data',JSON.stringify(data.data));
            localStorage.setItem('expo', -(JSON.stringify(data.data.exposure)));
            const obj2 = {
              userid:JSON.parse(localStorage.getItem('data')).id,
              eventID:this.props.eventId,
              marketType: this.props.betData.betType !=undefined?this.props.betData.betType:'match odds',
              runnersData :this.state.expoData
            }
            this.service.updateExpo(obj2,ddata=>{
              const obj3 = {
                userid:JSON.parse(localStorage.getItem('data')).id
              }
              this.users.getUserExposure(obj3,expodata=>{
                this.props.handleBetPlaceBox("Bet Placed...!",'green','success')
                this.getBetData();
              })
            });
           })
         })
        }
      }
    }
  this.closeWindow();
  }

  handlecurrentPositionAccess = async () => {
    if(this.userDetails.superAdmin){
      await this.setState({
        curPoAcc:'Admin',
        DfPoAcc:'Admin'
      })
    }
    else if(this.userDetails.Admin){
      await this.setState({
        curPoAcc:'Master',
        DfPoAcc:'Master'
      })
    }
    else if(this.userDetails.Master){
      await this.setState({
        curPoAcc:'User',
        DfPoAcc:'User'
      })
    }
}

  BackhandleUserAccess = async (item,userName) =>{
    debugger
    await this.setState({
      curPoAcc:item
    })
    await this.handleCurrentPosition(this.state.betHistroy,userName); 
  }

  handleUserAccess = async (item,userName) =>{
    debugger
    if(item === 'Admin'){
      await this.setState({
        curPoAcc:'Master'
      })
    }
    else if(item === 'Master'){
      await this.setState({
        curPoAcc:'User'
      })
    }
    this.handleCurrentPosition(this.state.betHistroy,userName);
  }

  handleCurrentPosition = async (data,userName) => {
    let getRunner = this.state.matchRunner.length;
    let Teamone = this.state.matchRunner[0].runnerName;
    let Teamtwo = this.state.matchRunner[1].runnerName;
    if(getRunner==3){
      var Teamthree = this.state.matchRunner[2].runnerName;
    }
    if(this.state.curPoAcc === 'Admin'){
      let arr = [];
      data.map(item => {
        let itemName = item.userInfo[0].superAdmin[0]
        if(arr.every((item) => item.name !== itemName)){
          arr.push({
            name:item.userInfo[0].superAdmin[0],
            T1TotalPL: 0,
            T2TotalPL : 0,
            T3TotalPL : 0,
            bettype: item.bettype,
            selection: item.selection
          })
        }
          let indx = arr.findIndex(e => e.name === itemName);
          if(item.bettype=='Back'){
            if(Teamone==item.selection){
              arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.P_L);
              arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.stack);
              arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.stack);
            }
            if(Teamtwo==item.selection){
              arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.P_L);
              arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.stack);
              arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.stack);
            }
            if(getRunner==3){
              if(Teamthree==item.selection){
                arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.P_L);
                arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.stack);
                arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.stack);
              }
            }  
          }else{
            if(Teamone==item.selection){
              arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.P_L);
              arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.stack);
              arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.stack);
            }
            if(Teamtwo==item.selection){
              arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.P_L);
              arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.stack);
              arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.stack);
            }
            if(getRunner==3){
              if(Teamthree==item.selection){
                arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.P_L);
                arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.stack);
                arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.stack);
              }
            }
          }
      })
      this.setState({
        SoM:arr,
        selUserName:userName
      })
    }
    else if(this.state.curPoAcc === 'Master'){
        let arr = [];
        let filterdata = data.filter(newdata=>{
          return newdata.userInfo[0].superAdmin[0]===userName;
        })
          filterdata.map(item => {
          let itemName = item.userInfo[0].admin[0]
          if(arr.every((item) => item.name !== itemName)){
            arr.push({
              name:item.userInfo[0].admin[0],
              T1TotalPL: 0,
              T2TotalPL : 0,
              T3TotalPL : 0,
              bettype: item.bettype,
              selection: item.selection
            })
          }
            let indx = arr.findIndex(e => e.name === itemName);
            if(item.bettype=='Back'){
              if(Teamone==item.selection){
                arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.P_L);
                arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.stack);
                arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.stack);
              }
              if(Teamtwo==item.selection){
                arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.P_L);
                arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.stack);
                arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.stack);
              }
              if(getRunner==3){
                if(Teamthree==item.selection){
                  arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.P_L);
                  arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.stack);
                  arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.stack);
                }
              }  
            }else{
              if(Teamone==item.selection){
                arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.P_L);
                arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.stack);
                arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.stack);
              }
              if(Teamtwo==item.selection){
                arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.P_L);
                arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.stack);
                arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.stack);
              }
              if(getRunner==3){
                if(Teamthree==item.selection){
                  arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.P_L);
                  arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.stack);
                  arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.stack);
                }
              }
            }
        })
        this.setState({
          SoM:arr,
          backPoAcc:'Admin',
          selUserName:userName,
        })
      }
    else if(this.state.curPoAcc === 'User'){
      let arr = [];
      let strUM = userName;
      let filterdata = data.filter(newdata=>{
        return newdata.userInfo[0].admin[0]===userName;
      })
      filterdata.map(item => {
        strUM = item.userInfo[0].superAdmin[0];
        let itemName = item.clientName
        if(arr.every((item) => item.name !== itemName)){
          arr.push({
            name:item.clientName,
            T1TotalPL: 0,
            T2TotalPL: 0,
            T3TotalPL: 0,
            bettype: item.bettype,
            selection: item.selection
          })
        }
          let indx = arr.findIndex(e => e.name === itemName);
          if(item.bettype=='Back'){
            if(Teamone==item.selection){
              arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.P_L);
              arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.stack);
              arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.stack);
            }
            if(Teamtwo==item.selection){
              arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.P_L);
              arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.stack);
              arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.stack);
            }
            if(getRunner==3){
              if(Teamthree==item.selection){
                arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.P_L);
                arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.stack);
                arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.stack);
              }
            }  
          }else{
            if(Teamone==item.selection){
              arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)+parseFloat(item.P_L);
              arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.stack);
              arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.stack);
            }
            if(Teamtwo==item.selection){
              arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)+parseFloat(item.P_L);
              arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.stack);
              arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)-parseFloat(item.stack);
            }
            if(getRunner==3){
              if(Teamthree==item.selection){
                arr[indx].T3TotalPL = parseFloat(arr[indx].T3TotalPL)+parseFloat(item.P_L);
                arr[indx].T2TotalPL = parseFloat(arr[indx].T2TotalPL)-parseFloat(item.stack);
                arr[indx].T1TotalPL = parseFloat(arr[indx].T1TotalPL)-parseFloat(item.stack);
              }
            }
          }
      })
      this.setState({
        SoM:arr,
        backPoAcc:'Master',
        selUserName:strUM
      })
    }
  }

  getBetData = () => {
    if(this.userDetails.superAdmin){
      let userName = JSON.parse(localStorage.getItem('data')).userName
      this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (Data) => {
        let fancyData = Data.data.data.filter(e => e.marketType === "Fancy")
      this.setState({
        fbetHistroy:fancyData,
        fcount:fancyData.length,
        betHistroy:Data.data.data,
        count:Data.data.data.length,
        load:false
      });
      if(this.state.selUserName!==""){
        this.handleCurrentPosition(this.state.betHistroy, this.state.selUserName);
      }else{
        this.handleCurrentPosition(this.state.betHistroy, userName);
      }
    }); 
   }
   else if(this.userDetails.Admin){
    let userName = JSON.parse(localStorage.getItem('data')).userName
    this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (Data) => {
      let betFill = Data.data.data.filter(item => item.userInfo[0].superAdmin[0]===userName)
      let fancyData = betFill.filter(e => e.marketType === "Fancy")
      this.setState({
        fbetHistroy:fancyData,
        fcount:fancyData.length,
        betHistroy:betFill,
        count:betFill.length,
        load:false
      });
      if(this.state.selUserName!==""){
        this.handleCurrentPosition(this.state.betHistroy, this.state.selUserName);
      }else{
        this.handleCurrentPosition(this.state.betHistroy, userName);
      }
    })
    }  
    else if(this.userDetails.Master){
      let userName = JSON.parse(localStorage.getItem('data')).userName
      this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (Data) => {
        let betFill = Data.data.data.filter(item => item.userInfo[0].admin[0]===userName)
        let fancyData =betFill.filter(e => e.marketType === "Fancy")
        this.setState({
          fbetHistroy:fancyData,
          fcount:fancyData.length,
          betHistroy:betFill,
          count:betFill.length,
          load:false
        });
        if(this.state.selUserName!==""){
          this.handleCurrentPosition(this.state.betHistroy, this.state.selUserName);
        }else{
          this.handleCurrentPosition(this.state.betHistroy, userName);
        }
      });
    }
    else{
      let userName = JSON.parse(localStorage.getItem('data')).userName
      this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (Data) => {
        let betFill = Data.data.data.filter(item => item.clientName===userName)
        let fancyData = betFill.filter(e => e.marketType === "Fancy")
        this.setState({
          fbetHistroy:fancyData,
          fcount:fancyData.length,
          betHistroy:betFill,
          count:betFill.length,
          load:false
        });  
      });
    }
    setTimeout(() => {
      //this.state.fbetHistroy?.reverse()
      //console.log("fancydata:",this.state.fbetHistroy.slice().reverse())
      this.props.getFancyBook(this.state.fbetHistroy)
    }, 5000);
}

  componentDidMount() {
    this.getBetTime();
    this.handlecurrentPositionAccess();
    document.getElementById('tital_change').focus();
    this.setState({
      betData:this.props.betData,
      IP:this.props.IP
    });
    //matchRunner
    this.service.getListMarketType(this.props.eventId, (data) => {
      this.setState({
        matchRunner: data.pdata,
      });
      //console.log("CDM",this.state.matchRunner);
      this.getBetData();
    });
    const obj ={
      id:JSON.parse(localStorage.getItem('data')).id
    }
    this.service.getchipInfo(obj,(data)=>{
      //console.log(data)
    });
  }

  StaKeAmount=(val,ods,fancysize,type,facFrom)=>{
    let teamSelection = this.props.betData.pData.runnerName;
    document.getElementById('stakeValue').value = val
    if(this.props.betData.betType !== undefined){
     if(type === 'Back'){
      this.setState({
        profit:((fancysize/100)*val).toFixed(2),
        loss:val?val:0.0
      })
    }
    else{
      this.setState({
        profit:val?val:0.0,
        loss:((fancysize/100)*val).toFixed(2)
      })
    }
  }else{
      let odds = ods-1;
      if(type === 'Back'){
        this.setState({
          profit:(odds*val).toFixed(2),
          loss:val?val:0.0
        },()=>{
        this.props.betData.betType === undefined && 
        this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true",facFrom);
        })
        if(this.state.getExpo!=undefined && this.state.getExpo.length>0){
          this.state.expoData = this.state.getExpo.map(item=>{
            let updatedRunners ={};
            if(item.runnerId == this.props.betData.pData.selectionId){
              updatedRunners.exposure =item.exposure + parseFloat((odds*val).toFixed(2))
            }
            else{
              updatedRunners.exposure = item.exposure +(- parseFloat(val))
            }
            updatedRunners.runnerId = item.runnerId;
            return updatedRunners;
          })
        }
        else{
          this.state.expoData = this.state.runnderData.map(item=>{
            let updatedRunners ={};
            if(item.selectionId == this.props.betData.pData.selectionId){
              updatedRunners.exposure = parseFloat((odds*val).toFixed(2))
            }
            else{
              updatedRunners.exposure = - parseFloat(val)
            }
          updatedRunners.runnerId = item.selectionId;
          return updatedRunners;
          });
        }
      }
      else{
        this.setState({
          profit:val,
          loss:(odds*val).toFixed(2)
        },()=>{
          this.props.betData.betType === undefined && 
          this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true",facFrom);
        })
        if(this.state.getExpo!=undefined && this.state.getExpo.length>0){
          this.state.expoData = this.state.runnderData.map(item=>{
            let updatedRunners ={};
            if(item.runnerId == this.props.betData.pData.selectionId){
              updatedRunners.exposure =item.exposure + (- parseFloat((odds*val).toFixed(2)))
            }
            else{
              updatedRunners.exposure = item.exposure + parseFloat(val)
            }        
            updatedRunners.runnerId = item.runnerId;
            return updatedRunners;
          });
        }
        else{
          this.state.expoData = this.state.runnderData.map(item=>{
            let updatedRunners ={};
            if(item.selectionId == this.props.betData.pData.selectionId){
              updatedRunners.exposure = - parseFloat((odds*val).toFixed(2))
            }
            else{
              updatedRunners.exposure = parseFloat(val)
            }
            updatedRunners.runnerId = item.selectionId;
            return updatedRunners;
          });
        }
      }
      this.props.handleInput(val);
    }
  }

  getDataByType=(e,type)=>{
    this.removeActiveClass();
    e.target.parentElement.parentElement.classList.add('active')
    if(type==='Fancy'){
      this.setState({
        showCurrPosition:'none',
        showAllBets:'block',
        openTab:'fancyBets'
      });
    }
    else{
    this.setState({
      showCurrPosition:'none',
      showAllBets:'block',
      openTab:'allBets'
    })
    }
  }

  currentPosition=(e)=>{
    this.setState({
      showCurrPosition:'block',
      showAllBets:'none',
      openTab:'currentPosition'
    })
    this.removeActiveClass();
    e.target.parentElement.classList.add('active')
  }

  removeActiveClass=()=>{
    var activeclass = document.querySelectorAll('#pills-tab li');
    for (var i = 0; i < activeclass.length; i++) {
      activeclass[i].classList.remove('active');
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  paginate = (pageNumber) => {
    this.setState({
      currentPage:pageNumber
    })
  }

  //this is called to before render method

  componentWillReceiveProps(nextProps){ 
    if(nextProps.betProfit){
      if(nextProps.betProfit!==this.props.betProfit){
      this.setState({
        profit:nextProps.betProfit
      })
      }
    }
    if(nextProps.betLoss){
      if(nextProps.betLoss!==this.props.betLoss){
      this.setState({
        loss:nextProps.betLoss
        })
      }
    }
    if(nextProps.runnderData){
      if(nextProps.runnderData !== this.props.runnderData){
      this.setState({
        runnderData:nextProps.runnderData
        })
      }
    }
    if(nextProps.expoData){
      if(nextProps.getExpo !== this.props.expoData){
      this.setState({
        getExpo:nextProps.expoData
        })
      }
    }
    if(nextProps.selOdds){
      if(nextProps.getselOdds !== this.props.selOdds){
        this.setState({
          getselOdds:nextProps.selOdds
        })
      }
    }
    if(nextProps.selfancyOdds){
      if(nextProps.getselfancyOdds !== this.props.selfancyOdds){
        this.setState({
          getselfancyOdds:nextProps.selfancyOdds
        })
      }
    }
    if(nextProps.selfancySize){
      if(nextProps.getselfancySize !== this.props.selfancySize){
        this.setState({
          getselfancySize:nextProps.selfancySize
        })
      }
    }
  }
  
  ClearAllSelection=()=>{
    document.getElementById('stakeValue').value=0;
    let dval = 0.0;
    this.setState({
      profit:dval,
      loss:dval,
      display: 'none'
    });
    let teamSelection = this.props.betData.pData.runnerName;
    let type = this.props.betData.betType;
    this.props.getProfitandLoss(dval, dval,teamSelection,type,dval,"true","ClearAllSelection");
  }

  handleSubmit=(event)=> {
    event.preventDefault();
    const data = new FormData(event.target);
  }

  closeWindow = () =>{
    document.getElementById('stakeValue').value=0;
    this.props.handleRemove("none");
    this.setState({
      showLoader:false
    });
  }

  render() {
    let color = this.state.color
    let ods =0;
    let fancysize =0;
    let runnerName ='';
    let type =''; 
    let selectionId ='';
    let betProfit= this.state.profit;
    let betLoss=this.state.loss;
    let display = {display:this.state.display};
    let parent_team1 = 0;
    let parent_team2 = 0;
    let parent_team3 = 0;
    let total_team1 = 0;
    let total_team2 = 0;
    let total_team3 = 0;
    if(this.props.betData){
      if(this.props.betData.betType==="Fancy"){
        fancysize = this.props.betData.data.size;
      }
      ods = this.props.betData.odds;
      type = this.props.betData.type;
      runnerName = this.props.betData.pData.runnerName;
      selectionId = this.props.betData.pData.selectionId;
    }
    if(this.props.setdisplay=='block'){
      display = {display:'block'};
    }
    // Loader render
    const stylebox = this.state.showLoader ? {display: 'block'} : {display: 'none'};
    if(this.state.showLoader===true){
      display = {display:'none'};
    }
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = this.state.betHistroy?.reverse().slice(indexOfFirstPost, indexOfLastPost);
    const fcurrentPosts = this.state.fbetHistroy?.reverse().slice(indexOfFirstPost, indexOfLastPost);

    return (
    <div className="col-md-4 col-xs-12">
      <div className="betSlipBox" style={{}}>
        <div className="betslip-head">
          <span id="tital_change" className="item">Bet Slip</span>
          <Link className="UserChipData" style={{textDecoration:"none"}} data-toggle="modal" data-target="#exampleModalForEditStake" data-backdrop="static" data-keyboard="false">
            Edit Stake
          </Link>
        </div>

{
  //////////////////////////// EDIT STAKE MODAL ////////////////////////////////////
}

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

{
  //////////////////////////// PLACE BET WINDOW FORM ////////////////////////////////////////////////
}

        <div>
            <div id="loader" style={stylebox}>
              <div style={{opacity:"1", height:'200px',width:'100%',background:'#fff9cc',border:'2px solid #c99d1e', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
                  <Loader type="Grid" color="#c99d1e" height={50} width={50} />
              </div>
            </div>
          <div id="sidebetbox" className="betBox border-box" style={display}>
            <div className="block_box">
              <span id="msg_error" /><span id="errmsg" />
              <form id="placeBetSilp" onSubmit={this.placeBet}>
                <input type="hidden" name="compute" defaultValue="0868b55786c39fbc0074796526de70db" />
                <label className="control-label m-t-xs BetFor">{type} (Bet For)</label>
                <div className="liabilityprofit" id=" ">
                  <span className="stake_label">Profit</span>
                  <div className="stack_input_field">
                    <span id="profitData" style={{ color: 'rgb(0, 124, 14)', fontWeight: 'bold' }}>{betProfit}</span>
                  </div>
                </div>
                <div className="liabilityprofit" id=" ">
                  <span className="stake_label">Loss</span>
                  <div className="stack_input_field">
                    <span id="LossData" style={{ color: 'rgb(255, 0, 0)', fontWeight: 'bold' }}>{betLoss}</span>
                  </div>
                </div>
                <div id="ShowRunnderName" className="match_runner_name">{runnerName}</div>
                <div className="odds-stake">
                  <div className="item form-group full_rowOdd">
                    <span className="stake_label">Odd</span>
                    <div className="stack_input_field numbers-row">
                      <input type="number" min="0" step="0.01" id="ShowBetPrice"  name ="ods" ref={(input) => { this.odsInput = input }} value ={ods} className="calProfitLoss odds-input form-control  CommanBtn" />
                    </div>
                  </div>
                  <div className="item form-group" id=" ">
                    <span className="stake_label">Stake</span>
                    <div className="stack_input_field numbers-row">
                      <input type="number" pattern="[0-9]*" step={1} id="stakeValue" name ="stack" ref={(input) => { this.stackInput = input }} onChange={this.handleChange} defaultValue={0}  min="0" className="calProfitLoss stake-input form-control  CommanBtn" />
                      <input type="hidden" name="selectionId" id="selectionId" ref={(input) => { this.selectionIdInput = input }}  value ={selectionId} defaultValue className="form-control" />
                      <input type="hidden" name="runnerName" id="runnerName" ref={(input) => { this.runnerNameInput = input }}  value ={runnerName} defaultValue className="form-control" />                      
                      <input type="hidden" name="matchId" id="matchId" ref={(input) => { this.matchIdInput = input }}  defaultValue className="form-control" />
                      <input type="hidden" name="isback" id="isback" ref={(input) => { this.isbackInput = input }}  value={type} defaultValue className="form-control" />
                      <input type="hidden" name="MarketId" id="MarketId" ref={(input) => { this.MarketIdInput = input }}  defaultValue className="form-control" />
                      <input type="hidden" name="placeName" id="placeName" ref={(input) => { this.placeNameInput = input }}  defaultValue className="form-control" />
                      <input type="hidden" name="stackcount" id="stackcount" ref={(input) => { this.stackcountInput = input }}  defaultValue={0} className="form-control" />
                      <input type="hidden" name="isfancy" id="isfancy" ref={(input) => { this.isfancyInput = input }}  defaultValue={0} className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="betPriceBox">
                  {
                    this.state.chipStake.map((item)=>{
                      return (
                      <button className="btn  btn-success CommanBtn  chipName1" type="button" value={item} onClick={()=>this.StaKeAmount(item,ods,fancysize,type,"StaKeAmount")}>{item}</button>
                      )
                    })
                  }
                  <button style={{backgroundColor:'red'}} className="btn btn-success CommanBtn " type="button" onClick={() => this.ClearAllSelection()}>Clear</button>
                </div>
                <div className="betFooter">
                  <button className="btn btn-danger CommanBtn" type="button" onClick={this.closeWindow}>Close</button>
                  <button className="btn btn-success  CommanBtn placebet" type="submit">Place Bet</button>
                </div>
              </form>
            </div>
          </div>

{
  ///////////////////////// BET HISTORY HEADER //////////////////////////////////////
}

          <div className="tab_bets">
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              <li className="nav-item betdata active-all active">
                <a className="allbet" style={{cursor:'pointer', fontSize:'12px'}} onClick={(e)=>this.getDataByType(e,'All')}>
                  <span className="bet-label">All Bet</span>
                  <span id="cnt_row">({this.state.count})</span>
                </a>
              </li>
              <li className="nav-item betdata">
                <a className="unmatchbet" style={{cursor:'pointer', fontSize:'12px'}} onClick={(e)=>this.getDataByType(e,'Fancy')}>
                  <span className="bet-label">Fancy Bet</span>
                  <span id="cnt_row3">({this.state.fcount})</span>
                </a>
              </li>
              {this.state.DfPoAcc==="" ? ''
              : <li className="nav-item active-position">
              <a className="currentposition" style={{cursor:'pointer', fontSize:'12px'}} onClick={(e)=>this.currentPosition(e)}>Current Position</a>
              </li>
              }
              <a className="btn full-btn" >
                <img src={fullSize} alt="..." />
              </a>
            </ul>
          </div>
        </div>
      </div>

{
  ////////////////////////////// TABLE OF BET HISTORY //////////////////////////////////////////
}

      <div className id="MatchUnMatchBetaData">
        <div className="border-box" id="accountView" role="main">
          <div className="fullrow">
            <div className="modal-dialog-staff">
              <div className="modal-content">
                <div className="modal-body"><span id="msg_error" /><span id="errmsg" />
                  <div className="match_bets MachShowHide" style={{display:this.state.showAllBets}}>
                    <table className="table table-striped jambo_table bulk_action">
                      <thead>
                        <tr className="headings">
                            <td className="text-center">S.no</td>
                            <td className="text-center">Runner</td>
                            <td className="text-center">Client</td>
                            <td className="text-center">Odds</td>
                            <td className="text-center">Stack</td>
                            <td className="text-center">BetType</td>
                            <td className="text-center">P&L</td>
                            <td className="text-center">Liability</td>
                            <td className="text-center">Time</td>
                            <td className="text-center">ID</td>
                            <td className="text-center">IP</td>
                            {
                              this.userDetails.superAdmin &&
                              <>
                                <td className="text-center">SuperMaster</td>
                                <td className="text-center">Master</td>
                              </>
                            }
                            {
                              this.userDetails.Admin &&
                                <td className="text-center">Master</td>
                            }
                        </tr>
                      </thead>
                      <tbody>
                      {
                        this.state.openTab==='fancyBets' ?
                        // fcurrentPosts.length>0 &&
                        fcurrentPosts.map((item,index)=>{
                          (item.bettype=='Lay') ? (color='#eb8295') : (color='#6ad0f1')
                          return(
                            <tr style={{backgroundColor:color}}  onMouseOver={(e)=>this.changeBackground(e,item.bettype)} onMouseOut={(e)=>this.changeBackColor(e,item.bettype)}>
                              <td className="text-center">{(this.state.fbetHistroy.length+1)-(indexOfFirstPost+index+1)}</td>
                              <td className="text-center">{item.selection}</td>
                              <td className="text-center">{item.clientName}</td>
                              <td className="text-center">{item.odds}</td>
                              <td className="text-center">{item.stack}</td>
                              <td className="text-center">{item.bettype}</td>
                              <td className="text-center">{item.P_L}</td>
                              <td className="text-center">{item.liability}</td>
                              <td className="text-center">{Utilities.datetime(item.createdDate)}</td>
                              <td className="text-center">{item.userid}</td>
                              <td className="text-center">{item.IP}</td>
                              {
                                this.userDetails.superAdmin &&
                                <>
                                  <td className="text-center">{item?.userInfo[0]?.superAdmin[0]}</td>
                                  <td className="text-center">{item?.userInfo[0]?.admin[0]}</td>
                                </>
                              }
                              {
                                this.userDetails.Admin &&
                                  <td className="text-center">{item?.userInfo[0]?.admin[0]}</td>
                              }
                            </tr>
                          );
                        })
                        :
                        currentPosts.length>0 &&
                          currentPosts.map((item,index)=>{
                            (item.bettype=='Lay') ? (color='#eb8295') : (color='#6ad0f1')
                            return(
                              <tr key={index} style={{backgroundColor:color}}  onMouseOver={(e)=>this.changeBackground(e,item.bettype)} onMouseOut={(e)=>this.changeBackColor(e,item.bettype)}>
                                <td className="text-center">{(this.state.betHistroy.length+1)-(indexOfFirstPost+index+1)}</td>
                                <td className="text-center">{item.selection}</td>
                                <td className="text-center">{item.clientName}</td>
                                <td className="text-center">{item.odds}</td>
                                <td className="text-center">{item.stack}</td>
                                <td className="text-center">{item.bettype}</td>
                                <td className="text-center">{item.P_L}</td>
                                <td className="text-center">{item.liability}</td>
                                <td className="text-center">{Utilities.datetime(item.createdDate)}</td>
                                <td className="text-center">{item.userid}</td>
                                <td className="text-center">{item.IP}</td>
                                {
                                  this.userDetails.superAdmin &&
                                  <>
                                    <td className="text-center">{item?.userInfo[0]?.superAdmin[0]}</td>
                                    <td className="text-center">{item?.userInfo[0]?.admin[0]}</td>
                                  </>
                                }
                                {
                                  this.userDetails.Admin &&
                                    <td className="text-center">{item?.userInfo[0]?.admin[0]}</td>
                                }
                              </tr>
                            );
                          })
                      }
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={16}>
                              <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.openTab==='fancyBets' ? this.state.fbetHistroy.length : this.state.betHistroy.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                          </td>  
                        </tr>  
                      </tfoot>    
                    </table>
                  </div>

{
  //////////////////////////// TABLE FOR CURRENT POSITION /////////////////////////////////
}

                  <div style={{display:this.state.showCurrPosition}}>
                  {this.state.DfPoAcc!==this.state.curPoAcc ? <button style={{float:'right',margin:'5px',fontSize:'15px', paddingRight:'10px',paddingLeft:'10px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px', color:'#FFF'}} onClick={() => this.BackhandleUserAccess(this.state.backPoAcc,this.state.selUserName)}>Back</button>:'' }
                    <table className="table table-striped jambo_table bulk_action" style={{marginBottom:'5rem'}}>
                      <thead>
                        <tr className="headings">
                            <th className="text-center" style={{width:'50px'}}><b>Account</b></th>
                            {this.props.runnderData.length>0 &&
                              this.props.runnderData.map((item,index)=>{
                                return (<th key={index} className="text-center" style={{width:'50px'}}><b>{item.runnerName}</b></th>)
                              })
                            }
                        </tr>
                      </thead>
                      <tbody>
                      {
                        this.state.SoM.length>0 &&
                        this.state.SoM.map((item,index)=>{
                          parent_team1 = parseFloat(parent_team1) + parseFloat(item.T1TotalPL);
                          parent_team2 = parseFloat(parent_team2) + parseFloat(item.T2TotalPL);
                          total_team1 = parseFloat(total_team1) + parseFloat(item.T1TotalPL);
                          total_team2 = parseFloat(total_team2) + parseFloat(item.T2TotalPL);
                          if(this.props.runnderData.length===3){
                            parent_team3 = parseFloat(parent_team3) + parseFloat(item.T3TotalPL);
                            total_team3 = parseFloat(total_team3) + parseFloat(item.T3TotalPL);
                          }
                              return(
                              <tr key={index}>
                                <td className="text-center">
                                  {this.state.curPoAcc==="User" ? item.name
                                  : <a style={{cursor:'pointer'}} onClick={() => this.handleUserAccess(this.state.curPoAcc,item.name)}>{item.name}</a>
                                  }
                                </td>
                                <td class={`text-center ${item.T1TotalPL>=0 ? "inplay_txt" : "color_red"}`}>{item.T1TotalPL}</td>
                                <td class={`text-center ${item.T2TotalPL>=0 ? "inplay_txt" : "color_red"}`}>{item.T2TotalPL}</td>
                                {this.props.runnderData.length===3 ? <td class={`text-center ${item.T3TotalPL>=0 ? "inplay_txt" : "color_red"}`}>{item.T3TotalPL}</td>:''}
                              </tr>
                            );
                          })
                      }
                        <tr>
                          <td className="text-center"><b>OWN</b></td>
                          <td className="text-center inplay_txt">0.00</td>
                          <td className="text-center inplay_txt">0.00</td>
                          {this.props.runnderData.length===3 ? <td className="text-center inplay_txt">0.00</td>:''}
                        </tr>
                        <tr>
                          <td className="text-center"><b>PARENT</b></td>
                          <td class={`text-center ${parent_team1>=0 ? "inplay_txt" : "color_red"}`}>{parent_team1}</td>
                          <td class={`text-center ${parent_team2>=0 ? "inplay_txt" : "color_red"}`}>{parent_team2}</td>
                          {this.props.runnderData.length===3 ? <td class={`text-center ${parent_team3>=0 ? "inplay_txt" : "color_red"}`}>{parent_team3}</td>:''}
                        </tr>
                        <tr>
                          <td className="text-center"><b>TOTAL</b></td>
                          <td class={`text-center ${total_team1>=0 ? "inplay_txt" : "color_red"}`}>{total_team1}</td>
                          <td class={`text-center ${total_team2>=0 ? "inplay_txt" : "color_red"}`}>{total_team2}</td>
                          {this.props.runnderData.length===3 ? <td class={`text-center ${total_team3>=0 ? "inplay_txt" : "color_red"}`}>{total_team3}</td>:''}
                        </tr>
                      </tbody>
                    </table>
                    {/* {this.state.DfPoAcc!==this.state.curPoAcc ? <button style={{float:'right',marginBottom:'5rem',fontSize:'15px', paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px', color:'#FFF'}} onClick={() => this.BackhandleUserAccess(this.state.backPoAcc,this.state.selUserName)}>Back</button>:'' } */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
}