import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Livevents from '../Services/livevents';
import Footer from './footer'
import Service from "../Services/Service";

export default class Liveevents extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","Event_Id","Event_Name","Event_Date","Status","Action"],
      notifyMsg:'',
      msgBox:'none',
      resdata:[],
      eventName:'',
      eventID:'',
      odds1:'',
      odds2:'',
      odds3:'',
      odds4:'',
      odds4:'',
      odds5:'',
      showModal: false,
      oddsValue:'',
      disable:true,
      checkedItems: new Map()
    };
    this.events = new Livevents();
    this.service = new Service();
  }

  handleEnable = () => {
  this.setState({
    disable:false
  })
  }

  reloadData = () => {
  this.events.getLiveEvents('',data=>{
    let allEvents = data.data;
    let isEventlive = allEvents.map(item => {
      this.setState(prevState => ({ 
        checkedItems: prevState.checkedItems.set(item.eventId, item.active) 
      }));
     });
    this.setState({
      resdata:allEvents
    })
  });
  }

  componentDidMount() {
  this.events.getLiveEvents('',data=>{
    let allEvents = data.data;
    let isEventlive = allEvents.map(item => {
      this.setState(prevState => ({ 
        checkedItems: prevState.checkedItems.set(item.eventId, item.active) 
      }));
    });
    this.setState({
      resdata:allEvents
    })
  });
  }

  handleChange = (e) => {
  const item = e.target.value;
  const isChecked = e.target.checked;
  this.events.UpdateEventFlag(item,(data)=>{
    this.reloadData();
  })
  this.setState(prevState => ({ 
    checkedItems: prevState.checkedItems.set(item, isChecked) 
  }));
  }

  addInitialOdds = (e) => {
  const itemName = e.target.name;
  const itemId = e.target.id;
  this.setState({
    eventName:itemName,
    eventID:itemId
  })
  this.service.getEventInitialOdds(itemId, (data) => {
    this.setState({
      oddsValue:data.data
    })
  });
  }

  addmarketevents = () => {
  this.events.storeLiveEvents({},data=>{
    this.setState({
      notifyMsg: "Market Events Added Successfully.",
      msgBox: "block",
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  });
  }

  handleSubmit = (event) => {
  event.preventDefault();
  const odds = new FormData(event.target);
  const obj = {
    eventID:Number(odds.get('eventID')),
    odds1:Number(odds.get('odds1')),
    odds2:Number(odds.get('odds2')),
    odds3:Number(odds.get('odds3')),
    odds4:Number(odds.get('odds4')),
    odds5:Number(odds.get('odds5')),
    odds6:Number(odds.get('odds6'))
  }
  this.events.updateInitialOdds(obj,data=>{
    this.setState({
      notifyMsg: "Odds Added successfully...!",
      msgBox: "block",
    });
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  });
  }

  render(){
    return (
      <div>
        <Navbar />
        <div className="forModal" />  
        <div className="container body">
          <div className="main_container" id="sticky" style={{width:'100%'}}>

{
  ///////////////////////////////////// NOTIFY MSG BOX /////////////////////////////////////////
}

            <div className="error-box" style={{ border: "5px solid #fff", width: "30rem", height: "110px", textAlign: "center", color: "#fff", position: "absolute", left: "42%", top: "2%", zIndex: "100", display:this.state.msgBox, backgroundColor: "green" }} >
              <div className="error-head" style={{ padding: "3px 0" }}>
                <h2>SUCCESS</h2>
              </div>
              <div className="error-mess" style={{ padding: "5px 0" }}>
                <h6>{this.state.notifyMsg}</h6>
              </div>
            </div>

{
  /////////////////////////////////// TITLE LIVEEVENTS //////////////////////////////////////////////
}

            <div className="right_col" role="main">
              <div className="row">
                <div className="col-md-12">
                  <div className="title_new_at">Live Events  
                    <div className="pull-right">
                      <button className="btn_common" onClick={() => {this.props.history.goBack()}}>Back</button>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <button className="btn_common"style={{margin:25}} onClick={() => {this.addmarketevents()}}>import Market</button>
                  <br></br>
                </div>

                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading"></div>

{
  ///////////////////////////////// TABLE OF LIVE EVENTS ///////////////////////////////////////
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
                        {
                          this.state.resdata.length > 0 ?
                            this.state.resdata.map((item,index) => {
                              return (
                                <tr key={index}>
                                  <td className="text-center">{index+1}</td>
                                  <td className="text-center">{item.eventId}</td>
                                  <td className="text-center green">{item.eventName}</td>
                                  <td className="text-center red">{item.OpenDate}</td>
                                  <td className="text-center green">
                                    <input type="checkbox" name={item.eventId} checked={this.state.checkedItems.get(item.eventId)} onChange={this.handleChange} value={item.eventId} style={{height: '20px',width: '20px'}} />
                                  </td>
                                  <td className="text-center red">
                                    <Link to="#" role="button" name={item.eventName} id={item.eventId} onClick={(e) => this.addInitialOdds(e)} data-toggle="modal" data-target="#exampleModal" data-backdrop="static" data-keyboard="false">Add Initial Odds</Link> |&nbsp; 
                                    <Link to={'/eventmatchodds/' + item.eventId}>Match Odds</Link> |&nbsp;
                                    <Link to={'/eventfancyodds/' + item.eventId}>Fancy Odds</Link>
                                  </td>
                                </tr>
                              )
                            }):
                          <tr>
                            <td className="text-center" colSpan={6}>Empty...!</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                    <p id="paginateClick" className="pagination-row dataTables_paginate paging_simple_numbers"> </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

{
  //////////////////////////// MODAL FOR ADD INITIAL ODDS ///////////////////////////////////////////
}

        <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div style={{float:'left'}}>
                  <h5 className="modal-title" id="exampleModalLabel">Add Initial Odds for {this.state.eventName}</h5>
                </div>
                <div style={{float:'right'}}>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                </div>
              </div>
              <div className="text-center" style={{color:'green',fontSize:'20px'}}>{this.state.notifyMsg}</div>
              <form onSubmit={this.handleSubmit}>
                <div className="modal-body">
                  <div className="modal-body row">
                    <div className="col-md-6">
                      <label>Back Odds:</label>
                      <input type="text" id="odds1" name="odds1" className="form-control" placeholder="Odds 1" defaultValue={this.state.oddsValue.odds1} disabled={this.state.disable}/>
                      <br/>
                      <input type="text" id="odds2" name="odds2" className="form-control" placeholder="Odds 2" defaultValue={this.state.oddsValue.odds2} disabled={this.state.disable}/>
                      <br/>
                      <input type="text" id="odds3" name="odds3" className="form-control" placeholder="Odds 3" defaultValue={this.state.oddsValue.odds3} disabled={this.state.disable}/>
                    </div>
                      
                    <div className="col-md-6">
                      <label>Lay Odds:</label>
                      <input type="text" id="odds4" name="odds4" className="form-control" placeholder="Odds 4" defaultValue={this.state.oddsValue.odds4} disabled={this.state.disable}/>
                      <br/>
                      <input type="text" id="odds5" name="odds5" className="form-control" placeholder="Odds 5" defaultValue={this.state.oddsValue.odds5} disabled={this.state.disable}/>
                      <br/>
                      <input type="text" id="odds6" name="odds6" className="form-control" placeholder="Odds 6" defaultValue={this.state.oddsValue.odds6} disabled={this.state.disable}/>
                    </div>
                  </div>
                </div>
                <input type="hidden" name="eventID" id="eventID" className="form-control" value={this.state.eventID} />
                <div className="modal-footer">
                  <button type="submit"  className="btn btn-primary text-center">Update</button>
                  <button type="button" onClick={this.handleEnable} className="btn btn-primary text-center">Add Odds</button>
                </div>
              </form>
            </div>
          </div>
        </div>  
        <Footer/>     
      </div>
    )
  }
}