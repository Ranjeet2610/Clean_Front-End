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
      resdata:allEvents,
      load: false
    })
  });
  }

  async componentDidMount() {
    if(JSON.parse(localStorage.getItem('data')).superAdmin === false){
      this.props.history.push('/dashboard')
    }
    await this.setState({
      load: true
    })
  this.events.getLiveEvents('',data=>{
    let allEvents = data.data;
    let isEventlive = allEvents.map(item => {
      this.setState(prevState => ({ 
        checkedItems: prevState.checkedItems.set(item.eventId, item.active) 
      }));
    });
    this.setState({
      resdata:allEvents,
      load: false
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

//   addInitialOdds = (e) => {
//   const itemName = e.target.name;
//   const itemId = e.target.id;
//   this.setState({
//     eventName:itemName,
//     eventID:itemId
//   })
//   this.service.getEventInitialOdds(itemId, (data) => {
//     this.setState({
//       oddsValue:data.data
//     })
//   });
//   }

//   addmarketevents = () => {
//   this.events.storeLiveEvents({},data=>{
//     this.setState({
//       notifyMsg: "Market Events Added Successfully.",
//       msgBox: "block"
//     });
//     switch ('success') {
//       case 'success':
//         NotificationManager.success(this.state.notifyMsg,"Success");
//         break;
//     }
//     this.reloadData()
//   });
//   }

//   handleSubmit = (event) => {
//   event.preventDefault();
//   const odds = new FormData(event.target);
//   const obj = {
//     eventID:Number(odds.get('eventID')),
//     odds1:Number(odds.get('odds1')),
//     odds2:Number(odds.get('odds2')),
//     odds3:Number(odds.get('odds3')),
//     odds4:Number(odds.get('odds4')),
//     odds5:Number(odds.get('odds5')),
//     odds6:Number(odds.get('odds6'))
//   }
//   this.events.updateInitialOdds(obj,data=>{
//     this.setState({
//       notifyMsg: "Odds Added successfully...!",
//       msgBox: "block",
//     });
//     setTimeout(() => {
//       window.location.reload();
//     }, 3000);
//   });
//   }

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

                {/* <div className="col-md-12">
                  <button className="btn_common"style={{margin:25}} onClick={() => {this.addmarketevents()}}>import Market</button>
                  <br></br>
                </div> */}

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
                                    <Link to={'/matchSettlement/' + item.eventId}><i>Match&nbsp;Settlement</i></Link>
                                    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                    <Link to={'/fancySettlement/' + item.eventId}><i>Fancy&nbsp;Settlement</i></Link>
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
        <Footer/>     
      </div>
    }
      </div>
    )
  }
}