import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';
import Users from '../Services/users';

export default class EventMatchOdds extends Component {
  constructor(props){
    super(props);
    this.state = {
      runnerID:'',
      disabled:false,
      tableHead:["S.No.","Market_Id","Market_Name","Runner_Name","Settlement"],
      marketata:'',
      liveodds:'',
      runnersdata:[],
      winnerTeam:'',
      selectionOne:'',
      selectionTwo:'',
      selectionThree:'',
      settledisabled:false
    };
    this.events = new Livevents();
    this.users = new Users();
  }

  getMatchOdds = () => {
    this.events.getMatchOdds(this.props.match.params.id,data=>{
      let allMdata = data.data.data.marketData;
      let allrunners = data.data.data.runners[0];
       this.events.ListMarketOdds(allMdata.marketId,async (data)=>{
          //console.log(data.data.data);
          await this.setState({
            liveodds:data.data.data
          })
        })
      this.setState({
        marketata:allMdata,
        runnersdata:allrunners
      })
    });
  }

  componentDidMount() {
    this.getMatchOdds();
    // this.events.getMatchOdds(this.props.match.params.id,data=>{
    //   let allMdata = data.data.data.marketData;
    //   let allrunners = data.data.data.runners[0];
    //   this.setState({
    //     marketata:allMdata,
    //     runnersdata:allrunners
    //   })
    // });
  }

  handleChange = (event) => {
    this.events.lockMatchOdds({marketId:this.state.marketata.marketId},data=>{
      this.setState({
        marketata:data.data.Data,
      })
    })
  }

  handleSettlement = (selectionId,marketId,winnerTeam,selectionOne,selectionTwo,selectionThree) => {
    if(selectionId !== ""){
      const obj = {
        selectionId:selectionId,
        marketId:marketId,
        eventId:this.props.match.params.id,
        winnerTeam:winnerTeam,
        selectionOne:selectionOne,
        selectionTwo:selectionTwo,
        selectionThree:selectionThree
      }
      console.log(obj);
     this.users.matchSettlement(obj,(data)=>{
        // console.log("DDDDDDDDD",data);
        this.getMatchOdds();
      })
    }
    this.setState({
      disabled:true
    })
  }

  handleMatchSettle = (event) => {
      this.setState({
          [event.target.name]:event.target.value.split("||")[0],
          winnerTeam:event.target.value.split("||")[1],
          selectionOne:event.target.value.split("||")[3],
          selectionTwo:event.target.value.split("||")[4],
          selectionThree:event.target.value.split("||")[5]
      })
  }
  render(){
    let teamSelectionsID;
    return (
        <div>
          <Navbar />
          <div className="forModal" />
          <div className="container body">
            <div className="main_container" id="sticky" style={{width:'100%'}}>
              <div className="right_col" role="main">
                <div className="row">
                  <div className="col-md-12">
                    <div className="title_new_at">Match Settlement   
                      <div className="pull-right">
                        <button className="btn_common" onClick={() => this.props.history.goBack()}>Back</button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12"><br></br></div>
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div id="divLoading"> </div>

{
  //////////////////////////// TABLE OF MATCH ODDS /////////////////////////////////////
}

                    <div className="custom-scroll appendAjaxTbl" id="filterdata">
                      <table className="table table-bordered table-dark table_new_design" id="datatablesss">
                        <thead>
                          <tr className="headings">
                            {
                              this.state.tableHead.map((item,index)=><th className="text-center" key={index}>{item}</th>)
                            }
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-center">1</td>
                            <td className="text-center">{this.state.marketata.marketId}</td>
                            <td className="text-center">{this.state.marketata.marketName}</td>
                            <td className="text-center">
                              {
                                this.state.runnersdata.length > 0 &&
                                this.state.runnersdata.map((item,index) => {
                                teamSelectionsID = teamSelectionsID+'||'+item.selectionId;
                                return (
                                        <div key={index}>
                                            <p>Runner Name : {item.runnerName} </p>,
                                            <p>Selection Id : {item.selectionId}</p><br/>
                                        </div>
                                    )
                                })
                              }
                            </td>
                            {/* <td className="text-center">
                              <input type="checkbox"  checked={this.state.marketata.isEnabled} name ="isEnable" onChange={(e)=>this.handleChange(e)}  style={{height: '20px',width: '20px'}}/>
                            </td> 					    */}
                            <td className="text-center">
                                {
                                /*
                                  this.props.location.state.status!==undefined ? <i style={{fontSize:'25px',fontWeight:'400',color:'red'}}>Settled!</i> : null
                                */}
                                {
                                this.props.location.state.status!==undefined ? <i style={{fontSize:'25px',fontWeight:'400',color:'red'}}>Settled!</i>:
                               // new Date(this.state.marketata.marketStartTime).getTime()<new Date().getTime() && this.state.liveodds.length===0 ? '' :"In-Play"
                                <form>
                                    <select name="runnerID" value={this.props.location.state.statusValue} onChange={this.handleMatchSettle} disabled={this.props.location.state.status==="settled" || this.state.disabled } style={{borderColor:'gray',borderRadius:'3px',width:'auto'}}> 
                                    <option value="">Select Winner</option>
                                        {
                                            this.state.runnersdata.length > 0 &&
                                            this.state.runnersdata.map((item,index) => {
                                            return(
                                                <option key={index} value={item.selectionId+'||'+item.runnerName+'||'+teamSelectionsID}>{item.runnerName}</option>
                                            )}
                                            )
                                        }
                                    </select>
                                    <input type="button" value="Settle" onClick={()=>this.handleSettlement(this.state.runnerID, this.state.marketata.marketId, this.state.winnerTeam, this.state.selectionOne, this.state.selectionTwo, this.state.selectionThree)} className="SettleButton" disabled={this.props.location.state.status==="settled"} style={this.props.location.state.status==="settled" ? {backgroundColor:'rgb(149 51 92 / 48%)'} : {backgroundColor:'#95335c'}}/>
                                </form>
                                
                                }
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p id="paginateClick" className="pagination-row dataTables_paginate paging_simple_numbers"> </p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
}
}