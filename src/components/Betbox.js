import React, { Component } from 'react'
import Service from '../Services/Service'
import Loader from 'react-loader-spinner'
import Users from '../Services/users'
import Livevents from '../Services/livevents'

export default class BetBox extends Component {
    constructor(props) {
      super(props);
      this.state = {
          exposure:'',
          balance:'',
          timeDuration:'',
          chipName:["500","2000","5000","25000","50000","100000"],
          chipStake:["500","2000","5000","25000","50000"],
          chips:["200000","500000","1000000","2500000"],
          color:'lightblue',
          load:false,
          betData:'',
          profit:0.00,
          loss: 0.00,
          betHistroy: [],
          count: 0,
          display:'none',
          IP:'',
          runnderData:'',
          getExpo:[],
          expoData:'',
          getselOdds:'',
          getselfancyOdds:'',
          getselfancySize:'',
          showLoader:false,
          timerstop:true,
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
    }
    
    componentDidMount() {
      this.getUserInfo();
      document.getElementById('tital_change').focus();
      this.setState({
          betData: this.props.betData,
          IP:this.props.IP
      });
    }

    getBetTime = async () =>{
      if(this.props.betData.betType==="Fancy"){
        let timeDuration;
        if(this.props.betData.ManualPriceKey===true || this.props.betData.isItManual===true){
          timeDuration=this.props.fancyInfo.manualbetDelay
        }else{
          timeDuration=this.props.fancyInfo.betDelay
        }
        this.event.getbetplacetime(5,async data=>{
          if(data.data.data.timeDuration > (timeDuration!=undefined?timeDuration:0)){
            await this.setState({
              timeDuration:(data.data.data.timeDuration-1000)
            })
          }else{
            await this.setState({
              timeDuration:(timeDuration-1000)
            })
          }
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      }else if(this.props.betData.marketName==="Bookmaker"){
        this.setState({
          timeDuration:2000
        })
      }
      else{
        this.event.getbetplacetime(this.state.sportType,async data=>{
          await this.setState({
            timeDuration:(data.data.data.timeDuration-1000)
          })
        })
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
      }
    }

    getUserInfo = () => {
      this.users.getUserInfo(JSON.parse(localStorage.getItem('data')).userName, (data)=>{
        this.setState({
          balance:data.data.data.walletBalance,
          exposure:data.data.data.exposure,
        })
      })
    }

    placeBet=async(e)=>{
      this.getBetTime();
      let disableBetting = JSON.parse(localStorage.getItem('data')).enableBetting;
      let inplay;
      if (new Date(JSON.parse(localStorage.getItem("matchname")).date).getTime() > new Date().getTime()) {
        inplay = "GOING IN-PLAY";
      } else {
        inplay = "IN-PLAY";
      }
      // device 1 for desktop,2 for mobile,3 for tab
      let device;
      if(this.state.isMobile)
      device = 2;
      if(this.state.isDesktop)
      device = 1;
      if(this.state.isTab)
      device = 3;
      e.preventDefault();
      let dobet=true;
      if(this.props.betData.betType==="Fancy"){
        if(this.props.betData.ManualPriceKey===true || this.props.betData.isItManual===true){
          if(this.props.fancyInfo.manuallockBet===true){
            this.props.handleBetPlaceBox("Your Betting is locked...!",'red','error')
            dobet=false;
          }
          else if(this.stackInput.value < this.props.fancyInfo.manualfancyminStacks || this.stackInput.value > this.props.fancyInfo.manualfancymaxStacks){
            this.props.handleBetPlaceBox("Invalid Stack...",'red','error')
            dobet=false;
          }
          else if(this.state.profit < 0 || this.state.profit > this.props.fancyInfo.manualfancymaxProfit){
            this.props.handleBetPlaceBox("Amount limit exceed",'red','error')
            dobet=false;
          }
          else if(this.stackInput.value > this.state.balance){
            this.props.handleBetPlaceBox("Don't have enough balance...",'red','error')
            dobet=false;
          }
          else if(this.state.loss > this.state.balance){
            this.props.handleBetPlaceBox("Invalid Bet...",'red','error')
            dobet=false;
          }
          else if(this.state.balance < 0){
            this.props.handleBetPlaceBox("Invalid Bet...",'red','error')
            dobet=false;
          }
        }else{
          if(this.props.fancyInfo.lockBet===true){
            this.props.handleBetPlaceBox("Your Betting is locked...!",'red','error')
            dobet=false;
          }
          else if(this.stackInput.value < this.props.fancyInfo.fancyminStacks || this.stackInput.value > this.props.fancyInfo.fancymaxStacks ){
            this.props.handleBetPlaceBox("Invalid Stack...",'red','error')
            dobet=false;
          }
          else if(this.state.profit < 0 || this.state.profit > this.props.fancyInfo.fancymaxProfit ){
            this.props.handleBetPlaceBox("Amount limit exceed",'red','error')
            dobet=false;
          }
          else if(this.stackInput.value > this.state.balance){
            this.props.handleBetPlaceBox("Don't have enough balance...",'red','error')
            dobet=false;
          }
           else if(this.state.loss > this.state.balance){
            this.props.handleBetPlaceBox("Invalid Bet...",'red','error')
            dobet=false;
          }
          else if(this.state.balance < 0){
            this.props.handleBetPlaceBox("Invalid Bet...",'red','error')
            dobet=false;
          }  
        }
      }else{
        if(this.props.sportInfo.lockBet===true){
          this.props.handleBetPlaceBox("Your Betting is locked...!",'red','error')
          dobet=false;
        }
        else if(this.stackInput.value < this.props.sportInfo.minStacks || this.stackInput.value > this.props.sportInfo.maxStacks){
          this.props.handleBetPlaceBox("Invalid Stack...",'red','error')
          dobet=false;
        }
        else if(this.state.profit < 0 || this.state.profit > this.props.sportInfo.maxProfit){
          this.props.handleBetPlaceBox("Profit limit exceed",'red','error')
          dobet=false;
        }
        else if(this.state.loss < 0 || this.state.loss > this.props.sportInfo.maxLoss){
          this.props.handleBetPlaceBox("Loss limit exceed",'red','error')
          dobet=false;
        }
        else if(this.odsInput.value >= this.props.sportInfo.maxOdds){
          this.props.handleBetPlaceBox("Invalid Odds..",'red','error')
          dobet=false;
        }
        else if(this.odsInput.value <= this.props.sportInfo.minOdds){
          this.props.handleBetPlaceBox("Invalid Odds...",'red','error')
          dobet=false;
        }
        else if(this.stackInput.value > this.state.balance){
          this.props.handleBetPlaceBox("Don't have enough balance...",'red','error')
          dobet=false;
        }
        else if(this.state.loss > this.state.balance){
          this.props.handleBetPlaceBox("Invalid Bet...B",'red','error')
          dobet=false;
        }
        else if(this.state.balance < 0){
          this.props.handleBetPlaceBox("Invalid Bet...0",'red','error')
          dobet=false;
        }
        if(inplay === "GOING IN-PLAY"){
          if(this.stackInput.value > this.props.sportInfo.PreInplayStack){
            this.props.handleBetPlaceBox("Invalid Stack...",'red','error')
            dobet=false;
          }
          else if(this.state.profit > this.props.sportInfo.PreInplayProfit){
            this.props.handleBetPlaceBox("Profit limit exceed",'red','error')
            dobet=false;
          }
        }
      }
      if(!disableBetting){
        if(dobet===true){
        if(this.state.loss > this.state.balance){
          this.props.handleBetPlaceBox("Invalid Bet...",'red','error')
        }
        else{
          this.setState({
            showLoader:true
          });
          this.props.disabledbox(true);
          await this.getBetTime();
          await new Promise((resolve, reject) => setTimeout(resolve, this.state.timeDuration));
          if(this.props.betData.betType==="Fancy"){
            let fancysizeval;
            if(this.state.getselfancySize=='SUSPENDED' || this.state.getselfancySize=='Running'){
              fancysizeval = 0;
            }else{
              fancysizeval = this.state.getselfancySize;
            }
            if(fancysizeval > this.props.betData.data.size || fancysizeval==0){
              this.props.handleBetPlaceBox("Invaild Fancy odds",'red','error')
            } else if(this.state.loss > this.state.balance){
                this.props.handleBetPlaceBox("Invalid Bet...F",'red','error')      
            }else{
              await this.StaKeAmount(this.stackInput.value,this.state.getselfancyOdds,this.state.getselfancySize,this.isbackInput.value,this.props.index,"placeBet");
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
              marketType:'Fancy',
              marketName:'Fancy',
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
              })*/
              this.users.getMyprofile(obj1,data=>{
                localStorage.setItem('data',JSON.stringify(data.data));
                localStorage.setItem('expo', -(JSON.stringify(data.data.exposure)));
                const obj2 = {
                  userid:JSON.parse(localStorage.getItem('data')).id,
                  eventID:this.props.eventId,
                  marketType: 'Fancy',
                  runnersData :this.state.expoData
                }
                this.service.updateExpo(obj2,ddata=>{
                  const obj3 = {
                    userid:JSON.parse(localStorage.getItem('data')).id
                  }
                  this.users.getUserExposure(obj3,expodata=>{
                    /********************************/
                    this.getUserInfo();
                    /********************************/                  
                    this.props.handleBetPlaceBox("Bet Placed...!",'green','success')
                  })
                });
              })
            })
            }
          }
          else{
            if((this.state.getselOdds > this.odsInput.value) || (this.state.getselOdds <= 1) || (this.odsInput.value <= 1)){
              this.props.handleBetPlaceBox("Invaild Match odds...",'red','error')
            } else if(this.state.loss > this.state.balance){
              this.props.handleBetPlaceBox("Invalid Bet...F",'red','error')      
            }else if(this.props.betData.marketName===''){
              this.props.handleBetPlaceBox("Invaild Market Name...",'red','error')
            }else{
              await this.StaKeAmount(this.stackInput.value,this.state.getselOdds,this.state.getselfancySize,this.isbackInput.value,this.props.index,"placeBet");
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
              marketType:'match odds',
              //marketType:(this.props.betData.marketName==="Match Odds" || this.props.betData.marketName==="Bookmaker")?'match odds':'Fancy',
              marketName:this.props.betData.marketName,
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
                  marketType: 'match odds',
                  runnersData :this.state.expoData
                }
                this.service.updateExpo(obj2,ddata=>{
                  const obj3 = {
                    userid:JSON.parse(localStorage.getItem('data')).id
                  }
                  this.users.getUserExposure(obj3,expodata=>{
                    this.props.handleBetPlaceBox("Bet Placed...!",'green','success')
                    /********************************/
                    this.getUserInfo();
                    /********************************/                  
                  })
                });
              })
            })
            }
          }
        }
      }
    }
    else{
      this.props.handleBetPlaceBox("Your Betting is locked...!",'red','error')
    }
    this.closeWindow();
    }
    
    handleChange=(e)=>{
      let marketName = this.props.betData.marketName;
      let teamSelection = this.props.betData.pData.selectionId;
      let teamBetType = this.props.betData.type;
      let stack = e.target.value;
      e.preventDefault();
      if(this.props.betData.betType==="Fancy"){
        let fancysize = this.props.betData.data.size;
        if(this.props.betData.type === 'Back'){
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
        let odds = this.props.betData.odds-1;
        if(this.props.betData.type === 'Back'){
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
        this.props.getProfitandLoss(this.state.profit,this.state.loss,teamSelection,teamBetType,stack,"true","handleChange",marketName);
        }, 500)
        this.props.handleInput(e.target.value);
      }
    }

    StaKeAmount=(val,ods,fancysize,type,index,facFrom)=>{      
      let marketName = this.props.betData.marketName;
      let teamSelection = this.props.betData.pData.selectionId;
      document.getElementById('stakeValue').value = val
      if(this.props.betData.betType==="Fancy"){
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
          this.props.betData.betType !== "Fancy" && 
          this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true",facFrom,marketName);
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
            this.props.betData.betType !== "Fancy" && 
            this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true",facFrom,marketName);
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

    componentWillReceiveProps(nextProps){ 
      if(nextProps.betProfit!==this.props.betProfit){
      this.setState({
        profit:nextProps.betProfit
       })
      }
      if(nextProps.betLoss!==this.props.betLoss){
      this.setState({
        loss:nextProps.betLoss
        })
      }
      if(nextProps.runnderData !== this.props.runnderData){
      this.setState({
        runnderData:nextProps.runnderData
        })
      }
      if(nextProps.getExpo !== this.props.expoData){
      this.setState({
        getExpo:nextProps.expoData
        })
      }
      if(nextProps.getselOdds !== this.props.selOdds){
        this.setState({
          getselOdds:nextProps.selOdds
        })
      }
      if(nextProps.getselfancyOdds !== this.props.selfancyOdds){
        this.setState({
          getselfancyOdds:nextProps.selfancyOdds
        })
      }
      if(nextProps.getselfancySize !== this.props.selfancySize){
        this.setState({
          getselfancySize:nextProps.selfancySize
        })
      }
    }
    ClearAllSelection=()=>{
      document.getElementById('stakeValue').value=0
      let dval = 0.0;
      this.setState({
        profit:dval,
        loss:dval,
        display: 'none'
      });
      let marketName = this.props?.betData?.marketName;
      let teamSelection = this.props?.betData?.pData?.selectionId;
      let type = this.props?.betData?.betType;
      this.props.getProfitandLoss(dval,dval,teamSelection,type,dval,"true","ClearAllSelection",marketName);
    }
    closeWindow = () =>{
        document.getElementById('stakeValue').value=0
        this.props.handleRemove("none");
        this.setState({
          showLoader:false
        });
        this.props.disabledbox(false);
        this.ClearAllSelection();
    }
    render() {
        let ods = 0;
        let fancysize =0;
        let runnerName = '';
        let type = '';
        let selectionId = '';
        let betProfit = this.state.profit;
        let betLoss = this.state.loss;
        let display = { display: this.state.display };
        if(this.props.betData){
          if(this.props.betData.betType==="Fancy"){
            fancysize = this.props.betData.data.size;
          }
          ods = this.props.betData.odds;
          type = this.props.betData.type;
          runnerName = this.props.betData.pData.runnerName;
          selectionId = this.props.betData.pData.selectionId;
        }
        if (this.props.setdisplay === 'block') {
            display = { display: 'block' };
            setTimeout(() => {
              if(this.state.timerstop){
                this.closeWindow();
              }
              this.setState({
                timerstop: false,
              });
            }, 8000)
          }
        // Loader render
        const stylebox = this.state.showLoader ? {display: 'block'} : {display: 'none'};
        if(this.state.showLoader===true){
          display = {display:'none'};
        }
        return (
            <>
            <div id="loader" style={stylebox}>
            <div style={{opacity:"1", height:'175px',background:'#fff9cc',width:'100%',border:'2px solid #c99d1e', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
                  <Loader type="Grid" color="#c99d1e" height={50} width={50} />
                </div>
            </div>
            {
             this.props.setdisplay === 'block' ? 
              <div className="betBox border-box test" id="sidebetbox" style={display}>
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
                                    <input type="number" min="0" step="0.01" id="ShowBetPrice" name="ods" ref={(input) => { this.odsInput = input }} value={ods} className="calProfitLoss odds-input form-control  CommanBtn" />
                                </div>
                            </div>
                            <div className="item form-group" id=" ">
                                <span className="stake_label">Stake</span>
                                <div className="stack_input_field numbers-row">
                                    <input type="number" pattern="[0-9]*" step={1} name="stack" id="stakeValue" ref={(input) => { this.stackInput = input }} onChange={this.handleChange} defaultValue={0} min="0" className="calProfitLoss stake-input form-control CommanBtn" />
                                    <input type="hidden" name="selectionId" id="selectionId" ref={(input) => { this.selectionIdInput = input }} value={selectionId} defaultValue className="form-control" />
                                    <input type="hidden" name="runnerName" id="runnerName" ref={(input) => { this.runnerNameInput = input }} value={runnerName} defaultValue className="form-control" />
                                    <input type="hidden" name="matchId" id="matchId" ref={(input) => { this.matchIdInput = input }} defaultValue className="form-control" />
                                    <input type="hidden" name="isback" id="isback" ref={(input) => { this.isbackInput = input }} value={type} defaultValue className="form-control" />
                                    <input type="hidden" name="MarketId" id="MarketId" ref={(input) => { this.MarketIdInput = input }} defaultValue className="form-control" />
                                    <input type="hidden" name="placeName" id="placeName" ref={(input) => { this.placeNameInput = input }} defaultValue className="form-control" />
                                    <input type="hidden" name="stackcount" id="stackcount" ref={(input) => { this.stackcountInput = input }} defaultValue={0} className="form-control" />
                                    <input type="hidden" name="isfancy" id="isfancy" ref={(input) => { this.isfancyInput = input }} defaultValue={0} className="form-control" />
                                </div>
                            </div>
                        </div>
                        <div className="betPriceBox">
                            {
                                this.state.chipStake.map((item) => {
                                    return (
                                        <button className="btn  btn-success CommanBtn  chipName1" type="button" value={item} onClick={() => this.StaKeAmount(item,ods,fancysize,type,this.props.index,"StaKeAmount")}>{item}</button>
                                    )
                                })
                            }
                            {/* <button style={{ backgroundColor: 'red' }} className="btn btn-success CommanBtn " type="button" onClick={() => this.ClearAllSelection()}>Clear</button> */}
                        </div>
                        <div className="betPriceBox" style={{marginTop:"1rem"}}>
                            {
                                this.state.chips.map((item) => {
                                    return (
                                        <button className="btn  btn-success CommanBtn  chipName1" type="button" value={item} onClick={() => this.StaKeAmount(item,ods,fancysize,type,this.props.index,"StaKeAmount")}>{item}</button>
                                    )
                                })
                            }
                            <button style={{ backgroundColor: 'red' }} className="btn btn-success CommanBtn " type="button" onClick={() => this.ClearAllSelection()}>Clear</button>
                        </div>
                        <div className="betFooter">
                            <button className="btn btn-danger CommanBtn" type="button" onClick={this.closeWindow}>Close</button>
                            <button className="btn btn-success  CommanBtn placebet" type="submit">Place Bet</button>
                        </div>
                    </form>
                </div>
              </div>
             : null
            }
          </>
          )
    }
} 