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
      tableHead:["S.No.","Market_Id","Market_Name","Enable","Visiable","ManualFancyLayOdds","ManualFancyBackOdds","ManualPriceKey"],
      marketata:[],
      runnersdata:'',
      ManualLayPrice:0,
      ManualBackPrice:0,
      ManualPriceKey:false,
      indx:''
    };
    this.events = new Livevents();
    this.users = new Users();
}

  getFancyMarketType = async () => {
    this.events.getFancyMarketType(this.props.match.params.id,data=>{ 
      this.setState({
        marketata:data.fancymarket,
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

  handlemanualFancyOdds = (event,id) =>{
    let manualkey=event.target.checked
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
          ManualPriceKey: manualkey
        }
        this.users.updateManualOdds(obj,data=>{
          this.getFancyMarketType();
          this.setState({
            ManualLayPrice:"",
            ManualBackPrice:"",
            indx:""
          })
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
                <div className="col-md-12"><br></br>
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
                                // console.log(item.marketData);
                              return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td className="">{item.marketData.marketId}</td>
                                    <td className="">{item.marketData.marketName}</td>
                                    <td className="red text-left">
                                        <input type="checkbox"  checked={item.marketData.isEnabled} name ="isEnable" onChange={(e)=>this.handleChange(e,item.marketData.marketId,1)}  style={{height: '20px',width: '20px'}}/>
                                    </td> 					   
                                    <td className="red text-center">
                                        <input type="checkbox"  checked={item.marketData.isVisible} name ="isVisible" onChange={(e)=>this.handleChange(e,item.marketData.marketId,2)}  style={{height: '20px',width: '20px'}}/>
                                    </td> 					   
                                    <td className="red text-center">
                                        <label>Price:
                                          <input onChange={(e)=>this.handlemanualFancyOdds(e,item.marketData._id)} type="number" id={"layprice"+item.marketData._id} name ="ManualLayPrice" style={{height:'20px',width:'50px'}}/></label>&nbsp;{item.marketData.LayPrice}<br/>
                                        <label>Size:&nbsp;&nbsp;
                                          <input onChange={(e)=>this.handlemanualFancyOdds(e,item.marketData._id)} type="number" id={"laysize"+item.marketData._id} name ="ManualLaySize"  style={{outline:'none',height:'20px',width:'50px'}}/></label>&nbsp;{item.marketData.LaySize}
                                    </td> 

                                    <td className="red text-center">
                                        <label>Price:
                                          <input onChange={(e)=>this.handlemanualFancyOdds(e,item.marketData._id)} type="number" id={"backprice"+item.marketData._id} name ="ManualBackPrice"  style={{height:'20px',width:'50px'}}/></label>&nbsp;{item.marketData.BackPrice}<br/>
                                        <label>Size:&nbsp;&nbsp;
                                          <input onChange={(e)=>this.handlemanualFancyOdds(e,item.marketData._id)} type="number" id={"backsize"+item.marketData._id} name ="ManualBackSize"  style={{outline:'none',height:'20px',width:'50px'}}/></label>&nbsp;{item.marketData.BackSize}
                                    </td> 

                                    <td className="red text-center">
                                        <input type="checkbox" checked={item.marketData.ManualPriceKey===true?true:false}  name ="ManualPriceKey" onChange={(e)=>this.handlemanualFancyOdds(e,item.marketData._id)}  style={{height: '20px',width: '20px'}}/>
                                    </td> 					   
                                    {/* <td className="red text-center">
                                        <input type="button" value="submit" onClick={(e)=>this.handlemanualFancyOdds(e,item.marketData._id)} style={{background:"#95335c",color:'white',outline:'none'}}/>
                                    </td> 
                                    <td className="red text-center">
                                        <Link to={'/managefrunners/'+this.props.match.params.id+'?marketid='+item.marketData.marketId} >Manage Runners</Link> | 
                                        <Link to="#">Action 2</Link>
                                    </td>
                                    */}
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
        <Footer />
      </div>
    )
  }
}