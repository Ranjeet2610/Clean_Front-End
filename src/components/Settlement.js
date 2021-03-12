import React, { Component } from 'react'
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Navbar from './Navbar';
import Livevents from '../Services/livevents';
import Footer from './footer'
import Service from "../Services/Service";

export default class Liveevents extends Component {
  constructor(props){
    super(props);
    this.state = {
      load:false,
      tableHead:["S.No.","Event_Id","Event_Name","Event_Date","Status","Settlement_Type"],
      notifyMsg:'',
      msgBox:'none',
      resdata:[],
      newResData:[],
      eventName:'',
      eventID:'',
      showModal: false,
      oddsValue:'',
      disable:true,
    };
    this.events = new Livevents();
    this.service = new Service();
  }

  async componentDidMount() {
    if(JSON.parse(localStorage.getItem('data')).superAdmin === false){
      this.props.history.push('/dashboard')
    }
    await this.setState({
      load: true
    })
    this.events.getLiveEvents('',data=>{
      let allEvents = data.data.data.filter(newdata=>{
        return newdata.active===true;
      })
      let typeEvents = data.data.data.filter(ele=>ele.eventType === 4)
      this.setState({
        resdata:typeEvents,
        newResData:allEvents,
        load: false
      })
    });
  }

  handleTabFilter = (eventType) => {
    let betHistoryFilter = this.state.newResData.filter(ele => ele.eventType === eventType )
    this.setState({
      resdata:betHistoryFilter
    })
  }

  render(){
    return (
      <div>
        <Navbar />
        <NotificationContainer/>
    {
      this.state.load ?
      <div style={{height:'100vh', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
          <Loader type="Grid" color="#6c1945" height={100} width={100} />
      </div> :
      <div>
        <div className="forModal" />  
        <div className="container body">
          <div className="main_container" id="sticky" style={{width:'100%'}}>

{
  /////////////////////////////////// TITLE LIVEEVENTS //////////////////////////////////////////////
}

            <div className="right_col" role="main">
              <div className="row">
                <div className="col-md-12">
                  <div className="title_new_at">Settlement  
                    <div className="pull-right">
                      <button className="btn_common" onClick={() => {this.props.history.goBack()}}>Back</button>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 col-xs-12" style={{marginTop:'1rem'}}>
                <div className="tab_bets get-mchlist">
                 <ul id="betsalltab" className="nav nav-pills match-lists">
                     <li><Link onClick={()=>this.handleTabFilter(2)}>Tennis</Link></li>
                     <li><Link onClick={()=>this.handleTabFilter(4)}>Cricket</Link></li>
                     <li><Link onClick={()=>this.handleTabFilter(1)}>Soccer</Link></li>
                  </ul>
                </div>
              </div>

                {/* <div className="col-md-12">
                  <button className="btn_common"style={{margin:25}} onClick={() => {this.addmarketevents()}}>import Market</button>
                  <br></br>
                </div> */}

                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading"></div>

{
  ///////////////////////////////// TABLE OF LIVE EVENTS ///////////////////////////////////////
}

                  <div className="custom-scroll appendAjaxTbl" id="filterdata" style={{backgroundColor:'#95335c',color:'white',marginTop:'2rem'}}>
                    <table className="table table-bordered table-dark table_new_design" id="datatablesss">
                      <thead>
                        <tr className="headings" style={{backgroundColor:'#95335c',color:'white'}}>
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
                                  <td className="text-center red">{new Date(item.OpenDate).toLocaleString()}</td>
                                  {
                                    item.settlementStatus ? 
                                    <td className="text-center text-danger" style={{fontSize:'15px',fontWeight:'400'}}><i>Settled</i></td>:
                                    <td className="text-center text-success" style={{fontSize:'15px',fontWeight:'400'}}><i>Open</i></td>
                                  }
                                  {
                                    item.eventType === 4 ?
                                    <td className="text-center red">
                                      <Link to={{pathname:'/matchSettlement/' + item.eventId,state:{eventname:item.eventName,status:item.settlementStatus,statusValue:item.settledValue}}}><i>Match&nbsp;Settlement</i></Link>
                                      &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; <Link to={'/fancySettlement/' + item.eventId}><i>Fancy&nbsp;Settlement</i></Link>
                                    </td>
                                    :
                                    <td className="text-center red">
                                      <Link to={{pathname:'/matchSettlement/' + item.eventId,state:{eventname:item.eventName,status:item.settlementStatus,statusValue:item.settledValue}}}><i>Match&nbsp;Settlement</i></Link>
                                    </td>
                                  }
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
        <Footer/>     
      </div>
    }
      </div>
    )
  }
}