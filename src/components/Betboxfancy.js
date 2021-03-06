import React, { Component } from 'react'
import Service from '../Services/Service';
import fullsize from '../images/full-size.png';
import Users from '../Services/users'
import { Link } from 'react-router-dom'

export default class BetBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tableHead: ["No.", "Runner", "Client", "Odds", "Stack", "Bet Type", "P&L", "Time", "ID", "IP"],
            chipName: ["500", "2000", "5000", "25000", "50000", "100000"],
            chipStake: ["500", "2000", "5000", "25000", "50000"],
            betData: '',
            profit: 0.00,
            loss: 0.00,
            betHistroy: '',
            display: 'none',
            IP: '',
            count: 0,
            fcount: 0,
            runnderData: '',
            getExpo: '',
            expoData: '',
        }
        this.service = new Service();
        this.users = new Users();
    }

    componentDidMount() {
        //document.getElementById('tital_change').focus();
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
    placeBet=(e)=>{
        e.preventDefault();
        if(this.stackInput.value < 99 || this.stackInput.value > 49999 ){
          this.props.handleBetPlaceBox("Choose Stack...",'red','error')
          setTimeout(()=>{
            window.location.reload();     
          },5000);
        }
        else if(this.stackInput.value > JSON.parse(localStorage.getItem('data')).walletBalance){
          this.props.handleBetPlaceBox("Don't have enough balance...",'red','error')
          setTimeout(()=>{
            window.location.reload();     
          },5000);
        }
        else{
          if(this.props.betData.betType !== undefined){
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
              //device:device,
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
                // setTimeout(()=>{
                //   window.location.reload();     
                // },5000);
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
              //device:device,
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
                    // setTimeout(()=>{
                    //   window.location.reload();     
                    // },3000);
                  })
                }); 
              })
            }) 
          }
        }
        this.closeWindow();
      }
    
    handleChange=(e)=>{
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
        if(this.props.betData.betType ==undefined)
        this.props.handleInput(e.target.value);
      }

    StaKeAmount = (val, ods, type, index) => {
      document.getElementsByClassName("stake-input")[index].value = val
        if (this.props.betData.betType != undefined) {
            if (type == 'Back') {
                this.setState({
                    profit: Math.round(val),
                    loss: val ? val : 0.0
                })
                this.props.getProfitandLoss(this.state.profit, this.state.loss, "true");
            }
            else {
                this.setState({
                    profit: Math.round(val),
                    loss: val ? val : 0.0
                })
                this.props.getProfitandLoss(this.state.profit, this.state.loss, "true");
            }
            this.props.getProfitandLoss(this.state.profit, this.state.loss, "true");
        }
        else {
            let odds = ods - 1;
            if (type === 'Back') {
                this.setState({
                    profit: (odds * val).toFixed(2),
                    loss: val ? val : 0.0
                }, () => {
                    this.props.getProfitandLoss(this.state.profit, this.state.loss, "true");
                })
                if (this.state.getExpo != undefined && this.state.getExpo.length > 0) {
                    this.state.expoData = this.state.getExpo.map(item => {
                        let updatedRunners = {};
                        if (item.runnerId == this.props.betData.pData.selectionId) {
                            updatedRunners.exposure = item.exposure + parseFloat((odds * val).toFixed(2))
                        }
                        else {
                            updatedRunners.exposure = item.exposure + (- parseFloat(val))
                        }
                        updatedRunners.runnerId = item.runnerId;
                        return updatedRunners;
                    })
                }
                else {
                    this.state.expoData = this.state.runnderData.map(item => {
                        let updatedRunners = {};
                        if (item.selectionId == this.props.betData.pData.selectionId) {
                            updatedRunners.exposure = parseFloat((odds * val).toFixed(2))
                        }
                        else {
                            updatedRunners.exposure = - parseFloat(val)
                        }
                        updatedRunners.runnerId = item.selectionId;
                        return updatedRunners;
                    });
                }
            }
            else {
                this.setState({
                    profit: val,
                    loss: (odds * val).toFixed(2)
                }, () => {
                    this.props.getProfitandLoss(this.state.profit, this.state.loss, "true");
                })
                if (this.state.getExpo != undefined && this.state.getExpo.length > 0) {
                    this.state.expoData = this.state.runnderData.map(item => {
                        let updatedRunners = {};
                        if (item.runnerId == this.props.betData.pData.selectionId) {
                            updatedRunners.exposure = item.exposure + (- parseFloat((odds * val).toFixed(2)))
                        }
                        else {
                            updatedRunners.exposure = item.exposure + parseFloat(val)
                        }
                        updatedRunners.runnerId = item.runnerId;
                        return updatedRunners;
                    });
                }
                else {
                    this.state.expoData = this.state.runnderData.map(item => {
                        let updatedRunners = {};
                        if (item.selectionId == this.props.betData.pData.selectionId) {
                            updatedRunners.exposure = - parseFloat((odds * val).toFixed(2))
                        }
                        else {
                            updatedRunners.exposure = parseFloat(val)
                        }
                        updatedRunners.runnerId = item.selectionId;
                        return updatedRunners;
                    });
                }
            }
            this.props.getProfitandLoss(this.state.profit, this.state.loss, "true");
            this.props.handleInput(val);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.betProfit !== this.props.betProfit) {
            this.setState({
                profit: nextProps.betProfit
            })
        }
        if (nextProps.betLoss !== this.props.betLoss) {
            this.setState({
                loss: nextProps.betLoss
            })
        }
        if (nextProps.runnderData !== this.props.runnderData) {
            this.setState({
                runnderData: nextProps.runnderData
            })
        }
        if (nextProps.getExpo !== this.props.expoData) {
            this.setState({
                getExpo: nextProps.expoData
            })
        }
    }
    ClearAllSelection = () => {
        document.getElementsByClassName("stake-input")[this.props.index].value = 0;
        let dval = 0.0;
        this.setState({
            profit: dval,
            loss: dval,
            display: 'none'
        });
    }
    closeWindow = () =>{
        document.getElementsByClassName("stake-input")[this.props.index].value = 0
        //document.getElementById('stakeValue').value=0
        this.props.handleRemove("none");
      }
    render() {
        let ods = 0;
        let runnerName = '';
        let type = '';
        let selectionId = '';
        let betProfit = this.state.profit;
        let betLoss = this.state.loss;
        let display = { display: this.state.display };
        if (this.props.betData) {
            ods = this.props.betData.odds;
            type = this.props.betData.type;
            runnerName = this.props.betData.data.marketName;
            selectionId = this.props.betData.mid;
        }
        if (this.props.setdisplay === 'block') {
            display = { display: 'block' };
        }
        return (
            <div className="betBox border-box test" style={display}>
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
                                        <button className="btn  btn-success CommanBtn  chipName1" type="button" value={item} onClick={() => this.StaKeAmount(item, ods, type, this.props.index)}>{item}</button>
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
          )
    }
} 