import React, { Component } from 'react'
import Loader from 'react-loader-spinner'
import Utilities from "./utilities";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Livevents from '../Services/livevents';
import Footer from './footer'
import Service from "../Services/Service";

export default class Liveevents extends Component {
  constructor(props){
    super(props);
    this.state = {
      access:false ,
        sportName:this.props.location.state.name,
      load:false,
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

    reloadData = () => {
        const obj = {
            eventType:this.props.location.state.eventType
        }
        this.events.getLiveEvents(obj,data=>{
            const dataFilter = data.data.data.filter((ele)=>ele.eventType===this.props.location.state.eventType)
        this.setState({
        resdata: dataFilter,
        load: false
        })
    });
    }

    async componentDidMount() {
        if(JSON.parse(localStorage.getItem('data')).userName!=="lords11"&&JSON.parse(localStorage.getItem('data')).userName!=="AdminO222"){
        this.props.history.push('/dashboard')
        }
        else{
          if(JSON.parse(localStorage.getItem('data')).superAdmin===JSON.parse(localStorage.getItem('data')).Admin===JSON.parse(localStorage.getItem('data')).Master===false&&JSON.parse(localStorage.getItem('data')).userName==="AdminO222"){
            this.setState({
              access:true
            })
          }
            await this.setState({
            load: true
            })
            await this.reloadData();
        }
    }

    handleChange = (e) => {
        const item = e.target.value;
        const isChecked = e.target.checked;
        this.events.UpdateEventFlag(item,(data)=>{
            this.reloadData();
        })
    }

  render(){
    return (
      <div>
        <Navbar />
        <NotificationContainer/>
      <div>
        <div className="forModal" />  
        <div className="container body">
          <div className="main_container" id="sticky" style={{width:'100%'}}>


{
  /////////////////////////////////// TITLE LIVEEVENTS //////////////////////////////////////////////
}

            <div className="right_col" role="main">
              <div className="row">
                <div className="col-md-12" style={{marginBottom:'1rem'}}>
                  <div className="title_new_at">{this.state.sportName}  
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
                        <tr className="headings" style={{backgroundColor:'#95335c',color:'white'}}>
                          {
                            this.state.tableHead.map((item,index)=><th className="text-center" key={index}>{item}</th>)
                          }
                        </tr>
                      </thead>
                      {
                          this.state.load ?
                          <div style={{height:'100vh',width:'822%', justifyContent:'center', display:'flex' ,marginTop:'5rem'}}>
                              <Loader type="Grid" color="#6c1945" height={35} width={35} />
                          </div> :
                      <tbody>
                        {
                          this.state.resdata.length > 0 ?
                          this.state.resdata.map((item,index) => {
                            let eventDate = Utilities.displayDateTime(item.OpenDate);
                            return (
                              <tr key={index}>
                                  <td className="text-center">{index+1}</td>
                                  <td className="text-center">{item.eventId}</td>
                                  <td className="text-center green">{item.eventName}</td>
                                  <td className="text-center red">{eventDate}</td>
                                  <td className="text-center green">
                                    <input type="checkbox" name={item.eventId} checked={item.active} onChange={this.handleChange} value={item.eventId} style={{height: '20px',width: '20px'}} />
                                  </td>
                                  <td className="text-center red">
                                    <Link to={'/eventmatchodds/' + item.eventId}>Match Odds</Link>
                                    {
                                        this.props.location.state.eventType===4 ?
                                        <Link to={'/eventfancyodds/' + item.eventId}>&nbsp;|&nbsp;Fancy Odds</Link>:null
                                    } 
                                    {
                                      (this.state.access&&this.props.location.state.eventType===4)?
                                      <Link to={'/manualfancyodds/' + item.eventId}>&nbsp;|&nbsp;Manual Fancy</Link>:null
                                    }
                                  </td>
                                </tr>
                              )
                            }):
                          <tr>
                            <td className="text-center" colSpan={6}>Empty...!</td>
                          </tr>
                        }
                      </tbody>
                        }
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
    
      </div>
    )
  }
}