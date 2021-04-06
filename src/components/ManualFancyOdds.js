import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';
import Users from '../Services/users';

export default class ManualFancyOdds extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","Market_Id","Market_Name","Enable","Visiable","ManualFancyLayOdds","ManualFancyBackOdds","ManualPriceKey","isItManual"],
      marketata:[],
      runnersdata:'',
      ManualLayPrice:0,
      ManualBackPrice:0,
      ManualPriceKey:false,
      indx:'',
      addFancy:"",
      addmarketId:"",
      addmarketName:'',
      addEnable:"",
      addVisible:"",
      LayPrice:"",
      LaySize:'',
      BackPrice:'',
      BackSize:'',
      PriceKey:"",
      eventId:"",
      msg:"All fields are required !",
      msgshow:false
    };
    this.events = new Livevents();
    this.users = new Users();
    this.onKeyUp = this.onKeyUp.bind(this);
}

  getFancyMarketType = async () => {
    this.events.getFancyMarketType(this.props.match.params.id,data=>{ 
      this.setState({
        marketata:data.fancymarket,
        eventId:data.fancymarket[0].marketData.eventId,
      });
    });
    await this.setState({
      ManualLayPrice:"",
      ManualBackPrice:"",
      indx:''
    });
  }

  componentDidMount() {
    this.getFancyMarketType();
  }

  handleChange = async (event,marketId,type) => {
    if(type==1){
      this.events.enableFancyOdds({marketId:marketId},data=>{
        this.events.getFancyMarketType(this.props.match.params.id,data=>{      
            this.setState({
              marketata:data.fancymarket
            })
          }); 
      })
    }
    else if(type==2){
      this.events.visiableFancyOdds({marketId:marketId},data=>{
        this.events.getFancyMarketType(this.props.match.params.id,data=>{      
          this.setState({
            marketata:data.fancymarket
          })
        }); 
      })  
    }
    // else if(type===3){
    //     this.setState({
    //         [event.target.name]:event.target.checked,
    //         indx:marketId
    //     })
    // }
    // else{
    //     if(parseInt(event.target.value)>=0){
    //         await this.setState({
    //             [event.target.name]:event.target.value,
    //             indx:marketId
    //         })
    //     }
    // }
  }

  handlemanualPriceKey = (event,id) =>{
    let manualkey=event.target.checked
    const obj = {
      id: id,
      ManualPriceKey: manualkey
    }
    this.users.updateManualOdds(obj,data=>{
      this.getFancyMarketType();
    })
  }

  onKeyUp(event) {
    if(event.target.name==="ManualLayPrice"){
      const obj = {
        id: event.target.alt,
        ManualLayPrice: event.target.value
      }
      //console.log(obj);
      this.users.updateManualOdds(obj,data=>{
        this.getFancyMarketType();
      })
    }else if(event.target.name==="ManualLaySize"){
        const obj = {
          id: event.target.alt,
          ManualLaySize: event.target.value
        }
        //console.log(obj);
      this.users.updateManualOdds(obj,data=>{
        this.getFancyMarketType();
      })
    }else if(event.target.name==="ManualBackPrice"){
      const obj = {
        id: event.target.alt,
        ManualBackPrice: event.target.value
      }
      //console.log(obj);
      this.users.updateManualOdds(obj,data=>{
        this.getFancyMarketType();
      })
    }else if(event.target.name==="ManualBackSize"){
      const obj = {
        id: event.target.alt,
        ManualBackSize: event.target.value
      }
      //console.log(obj);
      this.users.updateManualOdds(obj,data=>{
        this.getFancyMarketType();
      })
    }
  }
  /*
  handlemanualFancyOdds = (event,id) =>{
    let layprice=document.getElementById("layprice"+id).value//this.state.ManualLayPrice
    let laysize=document.getElementById("laysize"+id).value
    let backprice=document.getElementById("backprice"+id).value//this.state.ManualBackPrice
    let backsize=document.getElementById("backsize"+id).value
    const obj = {
      id: id,
      ManualLayPrice: parseInt(layprice)===""?0:layprice,
      ManualLaySize:parseInt(laysize)===""?0:laysize,
      ManualBackPrice: parseInt(backprice)===""?0:backprice,
      ManualBackSize:parseInt(backsize)===""?0:backsize,
    }
    this.users.updateManualOdds(obj,data=>{
      this.getFancyMarketType();
      this.setState({
        ManualLayPrice:"",
        ManualBackPrice:"",
        indx:""
      })
    })
  }*/

  handlemanualSatus = (event,id) =>{
      let status=event.target.value
      const obj = {
        id: id,
        status:status,
      }
      this.users.updateManualOdds(obj,data=>{
        this.getFancyMarketType();
      })
  }

  handleSubmitManualFancies = (eventId) => {
    const obj = { 
      selectionI:this.state.addmarketId,
      runnerName:this.state.addmarketName,
      eventId:eventId,
      marketId:this.state.addmarketId,
      marketName:this.state.addmarketName,
      ManualLayPrice:this.state.LayPrice,
      ManualLaySize:this.state.LaySize,
      ManualBackPrice:this.state.BackPrice,
      ManualBackSize:this.state.BackSize,
      status:this.state.status,
      ManualPriceKey:this.state.PriceKey,
      isEnabled:this.state.addEnable,
      isVisible:this.state.addVisible, 
    }
    if(this.state.addmarketId!==""&&this.state.addmarketName!==""){
      this.users.addmanualfancy(obj,data=>{
        this.getFancyMarketType();
        this.setState({
          ManualLayPrice:"",
          ManualBackPrice:"",
          indx:""
        })
      })
      this.setState({
        addmarketId:"",
        addmarketName:'',
        addEnable:"",
        addVisible:"",
        LayPrice:"",
        LaySize:"",
        BackPrice:"",
        BackSize:"",
        PriceKey:"",
        eventId:""
      })
      document.getElementById("cancel").click();
    }
    else{
      this.setState({
        msgshow:true
      })
    }
  }

  methodOnChange = (event,check) => {
    if(check==="Check"){
      this.setState({
        [event.target.name]:event.target.checked
      })
    }
    else{
      this.setState({
        [event.target.name]:event.target.value
      })
    }
  }

  handleManualFancies=()=>{
    this.setState({
      addFancy:!this.state.addFancy
    })
  }

  render(){
    return (
      <div>
        <Navbar />
        <ToastContainer/>
        <div className="forModal" />
        <div className="container body">
          <div className="main_container" id="sticky" style={{width:'100%'}}>
            <div className="right_col" role="main">
              <div className="row">
                <div className="col-md-12">
                  <div className="title_new_at">Manual Fancy Odds    
                    <div className="pull-right"><button className="btn_common" onClick={() => this.props.history.goBack()}>Back</button> </div>
                  </div>
                </div>
                <div className="col-md-12"><br></br></div>
                <div className="col-md-12" style={{paddingLeft:'5rem', marginBottom:"1rem"}}>
                  <button className="btn_common"style={{padding:'5px',fontSize:'15px'}} data-toggle="modal" data-target="#addManualFancy">Add Manual Fancy</button>
                </div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading"> </div>
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
                          this.state.marketata.length > 0 ?
                            this.state.marketata.map((item,index) => {
                              return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td className="">{item.marketData.marketId}</td>
                                    <td className="">{item.marketData.marketName}</td>
                                    <td className="red text-left">
                                        <input type="checkbox"  checked={item.marketData.isEnabled?item.marketData.isEnabled:false} name ="isEnable" onChange={(e)=>this.handleChange(e,item.marketData.marketId,1)}  style={{height: '20px',width: '20px'}}/>
                                    </td> 					   
                                    <td className="red text-center">
                                        <input type="checkbox"  checked={item.marketData.isVisible?item.marketData.isVisible:false} name ="isVisible" onChange={(e)=>this.handleChange(e,item.marketData.marketId,2)}  style={{height: '20px',width: '20px'}}/>
                                    </td> 					   
                                    <td className="red text-center">
                                        <label>Price:
                                          <input onKeyUp={this.onKeyUp} defaultValue={item.marketData.ManualLayPrice} type="number" required alt={item.marketData._id} id={"layprice"+item.marketData._id} name ="ManualLayPrice" style={{height:'20px',width:'50px'}}/></label>&nbsp;{item.marketData.LayPrice}<br/>
                                        <label>Size:&nbsp;&nbsp;
                                          <input onKeyUp={this.onKeyUp} defaultValue={item.marketData.ManualLaySize} type="number" required alt={item.marketData._id} id={"laysize"+item.marketData._id} name ="ManualLaySize"  style={{outline:'none',height:'20px',width:'50px'}}/></label>&nbsp;{item.marketData.LaySize}
                                    </td> 

                                    <td className="red text-center">
                                        <label>Price:
                                          <input onKeyUp={this.onKeyUp} defaultValue={item.marketData.ManualBackPrice} type="number" required alt={item.marketData._id} id={"backprice"+item.marketData._id} name ="ManualBackPrice"  style={{height:'20px',width:'50px'}}/></label>&nbsp;{item.marketData.BackPrice}<br/>
                                        <label>Size:&nbsp;&nbsp;
                                          <input onKeyUp={this.onKeyUp} defaultValue={item.marketData.ManualBackSize} type="number" required alt={item.marketData._id} id={"backsize"+item.marketData._id} name ="ManualBackSize"  style={{outline:'none',height:'20px',width:'50px'}}/></label>&nbsp;{item.marketData.BackSize}
                                    </td> 

                                    <td className="red text-center">
                                        <input type="checkbox" checked={item.marketData.ManualPriceKey===true?true:false}  name ="ManualPriceKey" onChange={(e)=>this.handlemanualPriceKey(e,item.marketData._id)}  style={{height: '20px',width: '20px'}}/>
                                    </td> 					   
                                    
                                    <td className="red text-center">
                                    {/* <label>Status:</label>&nbsp; */
                                    console.log(new Date(item.marketData.updatedAt).getTime(),new Date().getTime())
                                    }
                                    {
                                      item.marketData.isItManual ?
                                      <div style={{display:'flex'}}>
                                        <input type="radio" onChange={(e)=>this.handlemanualSatus(e,item.marketData._id)} id={"status"+item.marketData._id} value="Ball Running" checked={item.marketData.status==="Ball Running"} name={"status"+item.marketData._id} style={{height: '20px',width: '20px'}} className="form-control" />
                                        &nbsp;<label for="BallRunning">Ball&nbsp;Running</label>&nbsp;
                                        <input type="radio" onChange={(e)=>this.handlemanualSatus(e,item.marketData._id)} id={"status"+item.marketData._id} value="SUSPENDED" checked={item.marketData.status==="SUSPENDED"} name={"status"+item.marketData._id} style={{height: '20px',width: '20px'}} className="form-control" />
                                        &nbsp;<label for="SUSPENDED">SUSPENDED</label>&nbsp;
                                        <input type="radio" onChange={(e)=>this.handlemanualSatus(e,item.marketData._id)} id={"status"+item.marketData._id} value="CLOSED" checked={item.marketData.status==="CLOSED"} name={"status"+item.marketData._id} style={{height: '20px',width: '20px'}} className="form-control" />
                                        &nbsp;<label for="CLOSED">CLOSED</label>&nbsp;
                                        <input type="radio" onChange={(e)=>this.handlemanualSatus(e,item.marketData._id)} id={"status"+item.marketData._id} value="" checked={item.marketData.status===""} name={"status"+item.marketData._id} style={{height: '20px',width: '20px'}} className="form-control" />
                                        &nbsp;<label for="CLOSED">OPEN</label>&nbsp;
                                      </div>:
                                      new Date(item.marketData.updatedAt).getTime()<new Date().getTime()?
                                      <div style={{display:'flex'}}>
                                        <input type="radio" onChange={(e)=>this.handlemanualSatus(e,item.marketData._id)} id={"status"+item.marketData._id} value="CLOSED" checked={item.marketData.status==="CLOSED"} name={"status"+item.marketData._id} style={{height: '20px',width: '20px'}} className="form-control" />
                                        &nbsp;<label for="CLOSED">CLOSED</label>&nbsp;
                                      </div>
                                      :'---'
                                    }
                                    </td> 
                                </tr>
                              )
                            }):
                          <tr>
                            <td className="text-center" colSpan={9}>Empty...!</td>
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
  /////////////////////////////// ADD MANUAL FANCY ////////////////////////////////////
}

<div id="addManualFancy" className="modal fade" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="popup_form">
                    <div className="title_popup">
                      <span>Add Manual Fancy</span>
                      <button type="button" className="close" data-dismiss="modal" >
                        <div className="close_new"><i className="fa fa-ties-circle" /></div>
                      </button>
                    </div>
                    <div className="text-center" style={{ color: 'red', fontSize: '20px' }}>{this.state.msgshow&&this.state.msg}</div>
                    <div className="content_popup">
                      <div className="popup_form_row">
                        <div className="modal-body">
                          <div className="row">
                            <div className="col-md-4 col-xs-6">
                              <label> MarketId*</label>
                              <input type="number" required onChange={(event)=>this.methodOnChange(event,"notCheck")} value={this.state.addmarketId} name="addmarketId" className="form-control" autocomplete="off" />
                            </div>

                            <div className="col-md-4 col-xs-6">
                              <label> MarketName</label>
                              <input type="text" onChange={(event)=>this.methodOnChange(event,"notCheck")} value={this.state.addmarketName} name="addmarketName" className="form-control" autocomplete="off" />
                            </div>

                            <div className="col-md-4 col-xs-6">
                              <label>LayPrice</label>
                              <input  type="number" required onChange={(event)=>this.methodOnChange(event,"notCheck")} value={this.state.LayPrice} name ="LayPrice" className="form-control" />
                            </div>

                            <div className="col-md-4 col-xs-6">
                              <label>LaySize</label>
                              <input type="number" required onChange={(event)=>this.methodOnChange(event,"notCheck")} value={this.state.LaySize} name="LaySize" className="form-control"  />
                            </div>

                            <div className="col-md-4 col-xs-6">
                              <label>BackPrice</label>
                              <input type="number" required onChange={(event)=>this.methodOnChange(event,"notCheck")} value={this.state.BackPrice} name="BackPrice" className="form-control" />
                            </div>

                            <div className="col-md-4 col-xs-6">
                              <label>BackSize</label>
                              <input type="number" required onChange={(event)=>this.methodOnChange(event,"notCheck")} value={this.state.BackSize} name="BackSize" className="form-control" />
                            </div>

                            <div class="col-md-4 col-xs-4" style={{display:'flex'}}>
                              <label>PriceKey</label>&nbsp;&nbsp;&nbsp;&nbsp;
                              <input type="checkbox" onChange={(event)=>this.methodOnChange(event,"Check")} value={this.state.PriceKey} name="PriceKey" style={{height: '20px',width: '20px'}} class="form-control" />
                            </div>
                            <div class="col-md-4 col-xs-4" style={{display:'flex'}}>
                              <label>Enable</label>&nbsp;&nbsp;&nbsp;&nbsp;
                              <input type="checkbox" onChange={(event)=>this.methodOnChange(event,"Check")} value={this.state.addEnable} name="addEnable" style={{height: '20px',width: '20px'}} class="form-control" />
                            </div>
                            <div class="col-md-4 col-xs-4" style={{display:'flex'}}>
                              <label>Visible</label>&nbsp;&nbsp;&nbsp;&nbsp;
                              <input type="checkbox" onChange={(event)=>this.methodOnChange(event,"Check")} value={this.state.addVisible} name="addVisible" style={{height: '20px',width: '20px'}} class="form-control" />
                            </div>

                            <div className="col-md-4 col-xs-12" style={{display:'flex'}}>
                              <label>Status:</label>&nbsp;
                              <div style={{display:'flex'}}>
                                <input type="radio" onChange={(event)=>this.methodOnChange(event,"notCheck")} value="Ball Running" name="status" style={{height: '20px',width: '20px'}} className="form-control" />
                                &nbsp;<label for="BallRunning">Ball&nbsp;Running</label>&nbsp;
                                <input type="radio" onChange={(event)=>this.methodOnChange(event,"notCheck")} value="SUSPENDED" name="status" style={{height: '20px',width: '20px'}} className="form-control" />
                                &nbsp;<label for="SUSPENDED">SUSPENDED</label>&nbsp;
                                <input type="radio" onChange={(event)=>this.methodOnChange(event,"notCheck")} value="CLOSED" name="status" style={{height: '20px',width: '20px'}} className="form-control" />
                                &nbsp;<label for="CLOSED">CLOSED</label>&nbsp;
                                <input type="radio" onChange={(event)=>this.methodOnChange(event,"notCheck")} value="" name="status" style={{height: '20px',width: '20px'}} className="form-control" />
                                &nbsp;<label for="CLOSED">OPEN</label>&nbsp;
                              </div>
                            </div>

                            <div className="col-md-12 col-xs-6 modal-footer">
                              <button type="button" className="blue_button Addsuper1" onClick={()=>this.handleSubmitManualFancies(this.state.eventId)} id="child_player_add" >
                               Submit
                              </button>
                              <button id="cancel" data-dismiss="modal" type="button" className="red_button" >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
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