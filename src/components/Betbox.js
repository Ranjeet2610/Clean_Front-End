import React, { Component } from 'react'
import Service from '../Services/Service';
import Loader from 'react-loader-spinner'
import fullsize from '../images/full-size.png';
import Users from '../Services/users'
import { Link } from 'react-router-dom'

export default class BetBox extends Component {

    constructor(props) {
      super(props);
      this.state = {
          chipName:["500","2000","5000","25000","50000","100000"],
          chipStake:["500","2000","5000","25000","50000"],
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
          isMobile    : window.matchMedia("only screen and (max-width: 480px)").matches,
          isTab       : window.matchMedia("only screen and (max-width: 767px)").matches,
          isDesktop   : window.matchMedia("only screen and (max-width: 1280px)").matches,
        }
      this.service = new Service();
      this.users = new Users();
      this.userDetails = JSON.parse(localStorage.getItem('data'))!=undefined?JSON.parse(localStorage.getItem('data')):'';
      this.matchName = this.props.matchName.split(" v ")
    }
  
    componentDidMount() {
        document.getElementById('tital_change').focus();
        this.interval = setInterval(() => {
            this.setState({
                betData: this.props.betData
            });
        }, 2000)
        this.service.betHistory(JSON.parse(localStorage.getItem('data')).userName, this.props.eventId, 'getUserOpenBetHistory', (data) => {
          this.setState({
              betHistroy: data,
              count: data.length
          });
      });
      const obj = {
          id: JSON.parse(localStorage.getItem('data')).id
      }
      this.service.getchipInfo(obj, (data) => {                
      });
      fetch("https://api.ipify.org?format=json")
          .then(response => {
              return response.json();
          }, "jsonp")
          .then(res => {
              this.setState({ IP: res.ip });
          })
          .catch(err => console.log(err))
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    getBetData = () => {
      let userName = JSON.parse(localStorage.getItem('data')).userName
      this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (Data) => {
        let betFill = Data.data.data.filter(item => item.clientName===userName)
        this.setState({
          betHistroy:betFill,
          count:betFill.length,
          load:false
        });  
      });
    }
    placeBet=async(e)=>{
      // device 1 for desktop,2 for mobile,3 for tab
      let device;
      if(this.state.isMobile)
      device = 2;
      if(this.state.isDesktop)
      device = 1;
      if(this.state.isTab)
      device = 3;
         
      e.preventDefault();
      debugger
      if(this.stackInput.value < 99 || this.stackInput.value > 50000 ){
        this.props.handleBetPlaceBox("Choose Stack...",'red','error')
      }
      else if(this.stackInput.value > JSON.parse(localStorage.getItem('data')).walletBalance){
        this.props.handleBetPlaceBox("Don't have enough balance...",'red','error')
      }
      else{
        document.getElementById("loader").style.display='block'
        document.getElementById("sidebetbox").style.display='none'
        await new Promise((resolve, reject) => setTimeout(resolve, 3000));
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
            await this.StaKeAmount(this.stackInput.value,this.state.getselfancyOdds,this.state.getselfancySize,this.isbackInput.value,this.props.index);
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
            IP:this.state.IP,
            device:device,
            marketType: this.props.betData.betType,
            bettype:this.isbackInput.value
           }
           //console.log(obj);
           this.service.fancyplaceBet(obj,data=>{ 
            const obj1 = {
              userName:JSON.parse(localStorage.getItem('data')).userName
            }
            this.users.getMyprofile(obj1,data=>{
              localStorage.setItem('data',JSON.stringify(data.data));
              this.props.handleBetPlaceBox("Bet Placed...!",'green','success')
              this.getBetData();
            })
           })
          }
        }
        else{
          if(this.state.getselOdds < this.odsInput.value){
            this.props.handleBetPlaceBox("Invaild Match odds...",'red','error')
          }else{
            await this.StaKeAmount(this.stackInput.value,this.state.getselOdds,this.state.getselfancySize,this.isbackInput.value,this.props.index);
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
            IP:this.state.IP,
            device:device,
            marketType: this.props.betData.betType !=undefined?this.props.betData.betType:'match odds',
            bettype:this.isbackInput.value
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
    document.getElementById("loader").style.display='none';
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
            loss:((fancysize/100)*stack).toFixed(2),
            profit:stack?stack:0.0
          })
        }
        else{
          this.setState({
            loss:stack,
            profit:((fancysize/100)*stack).toFixed(2)
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
        this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,teamBetType,stack,"true");
        }, 500)
      }
      if(this.props.betData.betType ===undefined)
      this.props.handleInput(e.target.value);
    }

    StaKeAmount=(val,ods,fancysize,type,index)=>{
      let teamSelection = this.props.betData.pData.runnerName;
      document.getElementsByClassName("stake-input")[index].value = val
      if(this.props.betData.betType !== undefined){
       if(type === 'Back'){
        this.setState({
          loss:((fancysize/100)*val).toFixed(2),
          profit:val?val:0.0
        })
      }
      else{
        this.setState({
          loss:val,
          profit:((fancysize/100)*val).toFixed(2)
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
          this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true");
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
            this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true");
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
        this.props.betData.betType === undefined && 
        this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true");
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
      document.getElementsByClassName("stake-input")[this.props.index].value = 0;
      let dval = 0.0;
      this.setState({
        profit:dval,
        loss:dval,
        display: 'none'
      });
      let teamSelection = this.props.betData.pData.runnerName;
      let type = this.props.betData.betType;
      this.props.getProfitandLoss(dval, dval,teamSelection,type,dval,"true");
    }
    closeWindow = () =>{
        document.getElementsByClassName("stake-input")[this.props.index].value = 0
        //document.getElementById('stakeValue').value=0
        this.props.handleRemove("none");
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
        }
        return (
            <>
            <div id="loader" style={{display:'none'}}>
            <div style={{opacity:"1", height:'175px',width:'100%',border:'2px solid black', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
                  <Loader type="Grid" color="#6c1945" height={50} width={50} />
                </div>
            </div>
            <div className="betBox border-box test" id="sidebetbox" style={display}>
                <div className="block_box">
                    <span id="msg_error" /><span id="errmsg" />
                    <form id="placeBetSilp" onSubmit={this.placeBet}>
                        <input type="hidden" name="compute" defaultValue="0868b55786c39fbc0074796526de70db" />
                        <label className="control-label m-t-xs BetFor">{this.props.type} (Bet For)</label>
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
                                    <input type="number" pattern="[0-9]*" step={1} name="stack" ref={(input) => { this.stackInput = input }} onChange={this.handleChange} defaultValue={0} min="0" className="calProfitLoss stake-input form-control CommanBtn" />
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
                                        <button className="btn  btn-success CommanBtn  chipName1" type="button" value={item} onClick={() => this.StaKeAmount(item,ods,fancysize,type,this.props.index)}>{item}</button>
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
          </>
          )
    }
} 