import React, { Component } from 'react'
import Pagination from './Pagination'
import  fullSize from '../images/full-size.png'
import Service from '../Services/Service';
import Users from '../Services/users'
import {Link} from 'react-router-dom'
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
        betHistroy:'',
        display:'none',
        IP:'',
        count:0,
        fcount:0,
        runnderData:'',
        getExpo:'',
        expoData:'',
        historyType:'open',
        newResData:[],
        betHistroy:[],
        curPoAcc:'',
        isMobile    : window.matchMedia("only screen and (max-width: 480px)").matches,
        isTab       : window.matchMedia("only screen and (max-width: 767px)").matches,
        isDesktop   : window.matchMedia("only screen and (max-width: 1280px)").matches,
      }
    this.service = new Service();
    this.users = new Users();
    this.userDetails = JSON.parse(localStorage.getItem('data'))!=undefined?JSON.parse(localStorage.getItem('data')):'';
    this.matchName = this.props.matchName.split(" v ")
  }

  handleChange=(e)=>{
    debugger
    let teamSelection = this.props.betData.pData.runnerName;
    let teamBetType = this.state.betData.type;
    let stack = e.target.value;
    e.preventDefault();
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
      if(this.state.runnderData.length>0){
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
     /*14Jan sachin */
     setTimeout(()=> {
       this.props.betData.betType === undefined &&
      this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,teamBetType,stack,"true");
    }, 500)
    /*14Jan sachin */
    if(this.props.betData.betType ==undefined)
    this.props.handleInput(e.target.value);
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

  placeBet=(e)=>{
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
      if(this.props.betData.betType !=undefined){
        const obj = {
          userName:JSON.parse(localStorage.getItem('data')).userName,
          description:localStorage.getItem('matchname'),
          selection:this.runnerNameInput.value,
          selectionID:this.selectionIdInput.value,
          odds:this.odsInput.value,
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
      else{
        const obj ={
          userName:JSON.parse(localStorage.getItem('data')).userName,
          description:localStorage.getItem('matchname'),
          selection:this.runnerNameInput.value,
          selectionID:this.selectionIdInput.value,
          odds:this.odsInput.value,
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
    this.closeWindow();
  }

  handlecurrentPositionAccess = async () => {
    if(this.userDetails.superAdmin){
      await this.setState({
        curPoAcc:'superAdmin'
      })
    }
    else if(this.userDetails.Admin){
      await this.setState({
        curPoAcc:'Admin'
      })
    }
    else if(this.userDetails.Master){
      await this.setState({
        curPoAcc:'Master'
      })
    }
  }

  handleUserAccess = (item,userName) =>{
    if(item === 'superAdmin'){
      this.setState({
        curPoAcc:'Admin'
      })
    }
    else if(item === 'Admin'){
      this.setState({
        curPoAcc:'Master'
      })
    }
    else if(item === 'Back'){
      this.setState({
        curPoAcc:'superAdmin'
      })
    }
    this.handleCurrentPosition(this.state.betHistroy,userName); 
  }

  handleCurrentPosition = (data,userName) => {
    if(this.state.curPoAcc === 'superAdmin'){
      let arr = [];
      let stn = '';
      data.map(item => {
        let itemName = item.userInfo[0].superAdmin[0]
        if(itemName !== stn){
          arr.push({
            name:item.userInfo[0].superAdmin[0],
            profit: item.P_L,
            loss : item.liability
          })
          stn = itemName
        }
        else{
          let indx = arr.findIndex(e => e.name === itemName);
          arr[indx].profit += item.P_L;
          arr[indx].loss += item.liability;
        }
      })
      this.setState({
        SoM:arr
      })
    }
    else if(this.state.curPoAcc === 'Admin'){
        let arr = [];
        let stn = '';
        data.map(item => {
          let itemName = item.userInfo[0].admin[0]
          if(itemName !== stn){
            arr.push({
              name:item.userInfo[0].admin[0],
              profit: item.P_L,
              loss : item.liability
            })
            stn = itemName
          }
          else{
            let indx = arr.findIndex(e => e.name === itemName);
            arr[indx].profit += item.P_L;
            arr[indx].loss += item.liability;
          }
        })
        this.setState({
          SoM:arr
        })
    }
    else if(this.state.curPoAcc === 'Master'){
      let arr = [];
      let stn = '';
      data.map(item => {
        let itemName = item.userInfo[0].admin[0]
        if(itemName !== stn){
          arr.push({
            name:item.userInfo[0].admin[0],
            profit: item.P_L,
            loss : item.liability
          })
          stn = itemName
        }
        else{
          let indx = arr.findIndex(e => e.name === itemName);
          arr[indx].profit += item.P_L;
          arr[indx].loss += item.liability;
        }
      })
      this.setState({
        SoM:arr
      })
    }
  }

  getBetData = () => {
    if(this.userDetails.superAdmin){
      let userName = JSON.parse(localStorage.getItem('data')).userName
      this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (Data) => {
      this.setState({
        betHistroy:Data.data.data,
        count:Data.data.data.length,
        load:false
      });
      this.handleCurrentPosition(this.state.betHistroy, userName);           
    }); 
   }
   else if(this.userDetails.Admin){
    let userName = JSON.parse(localStorage.getItem('data')).userName
    this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (Data) => {
      let betFill = Data.data.data.filter(item => item.userInfo[0].superAdmin[0]===userName)
      this.setState({
        betHistroy:betFill,
        count:betFill.length,
        load:false
      });
      this.handleCurrentPosition(this.state.betHistroy,userName); 
    })
    }  
    else if(this.userDetails.Master){
      let userName = JSON.parse(localStorage.getItem('data')).userName
        this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (Data) => {
          let betFill = Data.data.data.filter(item => item.userInfo[0].admin[0]===userName)
        this.setState({
          betHistroy:betFill,
          count:betFill.length,
          load:false
        }); 
        this.handleCurrentPosition(this.state.betHistroy,userName); 
      });
    }
    else{
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
  }

  componentDidMount() {
    this.handlecurrentPositionAccess();
    document.getElementById('tital_change').focus();
    this.interval = setInterval(() => {
      this.setState({
        betData:this.props.betData
      });
    },2000)
    this.getBetData();
    const obj ={
      id:JSON.parse(localStorage.getItem('data')).id
    }
    this.service.getchipInfo(obj,(data)=>{
      //console.log(data)                 
    });
    fetch("https://api.ipify.org?format=json")
    .then(response => {
      return response.json();
     }, "jsonp")
    .then(res => {
     this.setState({IP:res.ip});
    })
    .catch(err => console.log(err)) 
  }

  StaKeAmount=(val,ods,type)=>{
    let teamSelection = this.props.betData.pData.runnerName;
    document.getElementById('stakeValue').value = val
    if(this.props.betData.betType !== undefined){
      if(type=='Back'){
        this.setState({
          profit:Math.round(val),
          loss:val?val:0.0
        })
        this.props.betData.betType === undefined && 
        this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true");
      }
      else{
        this.setState({
          profit:Math.round(val),
          loss:val?val:0.0
        })
        this.props.betData.betType === undefined && 
        this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true");
      }
      this.props.betData.betType === undefined && 
        this.props.getProfitandLoss(this.state.profit, this.state.loss,teamSelection,type,val,"true");
    }
    else{
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

  getDataByType=(e,type)=>{
    this.removeActiveClass();
    e.target.parentElement.parentElement.classList.add('active')
    if(type=='Fancy'){
      this.service.betHistory(JSON.parse(localStorage.getItem('data')).userName,this.props.eventId,'getUserOpenfancyBetHistory',(data)=>{
        this.setState({
          betHistroy:data,
          fcount:data.length
        });             
      })
    }
    else{
    // this.service.betHistory(JSON.parse(localStorage.getItem('data')).userName,this.props.eventId,'getUserOpenBetHistory',(data)=>{
    //   // this.users.getAllBettings(`/getAllBetting?event_id=${this.props.eventId}`, (data) => {  
    //     this.setState({
    //       betHistroy:data,
    //       count:data.length
    //     });             
    //   })
    this.getBetData();
    this.setState({
      showCurrPosition:'none',
      showAllBets:'block'
    })
    }
  }

  currentPosition=(e)=>{
    this.setState({
      showCurrPosition:'block',
      showAllBets:'none'
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
    this.props.getProfitandLoss(dval, dval,teamSelection,type,dval,"true");
  }

  handleSubmit=(event)=> {
    event.preventDefault();
    const data = new FormData(event.target);
  }

  closeWindow = () =>{
    document.getElementById('stakeValue').value=0
    this.props.handleRemove("none");
  }

    render() {
    let color = this.state.color
    let ods =0;
    let runnerName ='';
    let type =''; 
    let selectionId ='';
    let betProfit= this.state.profit;
    let betLoss=this.state.loss;
    let display = {display:this.state.display};
    if(this.props.betData){
      ods = this.props.betData.odds;
      type = this.props.betData.type;
      runnerName = this.props.betData.pData.runnerName;
      selectionId = this.props.betData.pData.selectionId;
    }
    if(this.props.setdisplay=='block'){
      display = {display:'block'};
    }

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = this.state.betHistroy?.reverse()?.slice(indexOfFirstPost, indexOfLastPost);

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
          <div className="betBox border-box" style={display}>
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
                      <button className="btn  btn-success CommanBtn  chipName1" type="button" value={item} onClick={()=>this.StaKeAmount(item,ods,type)}>{item}</button>
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
                <a className="allbet" style={{cursor:'pointer'}} onClick={(e)=>this.getDataByType(e,'All')}>
                  <span className="bet-label">All Bet</span>
                  <span id="cnt_row">({this.state.count})</span>
                </a>
              </li>
              <li className="nav-item betdata">
                <a className="unmatchbet" style={{cursor:'pointer'}} onClick={(e)=>this.getDataByType(e,'Fancy')}>
                  <span className="bet-label">Fancy Bet</span>
                  <span id="cnt_row3">({this.state.fcount})</span>
                </a>
              </li>
              <li className="nav-item active-position">
                <a className="currentposition" style={{cursor:'pointer'}} onClick={(e)=>this.currentPosition(e)}>Current Position</a>
              </li>
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
                        currentPosts.length>0 &&
                          currentPosts.map((item,index)=>{
                            (item.bettype=='Lay') ? (color='#eb8295') : (color='#6ad0f1')
                            return(
                              <tr key={index} style={{backgroundColor:color}}  onMouseOver={(e)=>this.changeBackground(e,item.bettype)} onMouseOut={(e)=>this.changeBackColor(e,item.bettype)}>
                                <td>{(this.state.betHistroy.length+1)-(indexOfFirstPost+index+1)}</td>
                                <td>{item.selection}</td>
                                <td>{item.clientName}</td>
                                <td>{item.odds}</td>
                                <td>{item.stack}</td>
                                <td>{item.bettype}</td>
                                <td>{item.P_L}</td>
                                <td>{item.liability}</td>
                                <td>{item.createdDate}</td>
                                <td>{item.userid}</td>
                                <td>{item.IP}</td>
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
                              <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.betHistroy.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                          </td>  
                        </tr>  
                      </tfoot>    
                    </table>
                  </div>
                  <div style={{display:this.state.showCurrPosition}}>
                    <table className="table table-striped jambo_table bulk_action">
                      <thead>
                        <tr className="headings">
                            <th className="text-center" style={{width:'50px'}}><b>Account</b></th>
                            <th className="text-center" style={{width:'50px'}}><b>{this.matchName[0]}</b></th>
                            <th className="text-center" style={{width:'50px'}}><b>{this.matchName[1]}</b></th >
                        </tr>
                      </thead>
                      <tbody>
                      {
                        this.state.SoM.length>0 &&
                        this.state.SoM.map((item,index)=>{
                            return(
                              <tr key={index}>
                                <td className="text-center"><a style={{cursor:'pointer'}} onClick={() => this.handleUserAccess(this.state.curPoAcc,item.name)}>{item.name}</a></td>
                                <td className="text-center">{item.profit}</td>
                                <td className="text-center">{item.loss}</td>
                              </tr>
                            );
                          })
                      }
                        <tr>
                          <td className="text-center"><b>OWN</b></td>
                          <td className="text-center">0.00</td>
                          <td className="text-center">0.00</td>
                        </tr>
                        <tr>
                          <td className="text-center"><b>PARENT</b></td>
                          <td className="text-center">0.00</td>
                          <td className="text-center">0.00</td>
                        </tr>
                        <tr>
                          <td className="text-center"><b>TOTAL</b></td>
                          <td className="text-center">0.00</td>
                          <td className="text-center">0.00</td>
                        </tr>
                      </tbody>
                      {/* <tfoot> 
                        <tr>
                          <td colSpan={16}>
                              <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.betHistroy.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                          </td>  
                        </tr>  
                    </tfoot>     */}
                    </table>
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