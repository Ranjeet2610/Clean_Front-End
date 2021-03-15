import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';
import Users from '../Services/users';

export default class ManualFancyOdds extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","Market_Id","Market_Name","isEnable","isVisiable","ManualLayPrice","ManualBackPrice","ManualPriceKey","Action"],
      marketata:[],
      runnersdata:'',
      ManualLayPrice:'',
      ManualBackPrice:'',
      ManualPriceKey:'',
      indx:''
    };
    this.events = new Livevents();
    this.users = new Users();
}

  componentDidMount() {
    this.events.getFancyMarketType(this.props.match.params.id,data=>{ 
      this.setState({
        marketata:data.fancymarket
      });
    });
  }

  handleChange = (event,marketId,type) => {
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
    else if(type===3){
        this.setState({
            [event.target.name]:event.target.checked,
            indx:marketId
        })
    }
    else{
        if(parseInt(event.target.value)){
            this.setState({
                [event.target.name]:event.target.value,
                inde:marketId
            })
            console.log(event.target.name,"=>",event.target.value);
        }
    }
  }

  handlemanualFancyOdds = (id) =>{
    if(this.state.ManualLayPrice && this.state.ManualBackPrice){
      const obj = {
        id: id,
        ManualLayPrice: this.state.ManualLayPrice===""?0:this.state.ManualLayPrice,
        ManualBackPrice: this.state.ManualBackPrice===""?0:this.state.ManualBackPrice,
        ManualPriceKey: this.state.ManualPriceKey
    }
    this.users.updateManualOdds(obj,data=>{
        alert(data.data.message);
    })
    }
    else{
        alert("Please...Enter number");
    }
  }

  render(){
    return (
      <div>
        <Navbar />
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
                                        <input type="text" size="5" name ="ManualLayPrice" value={this.state.indx===index?this.state.ManualLayPrice:null} onChange={(e)=>this.handleChange(e,index,4)}  style={{height: '20px'}}/>
                                    </td> 					   
                                    <td className="red text-center">
                                        <input type="text" size="5" name ="ManualBackPrice" value={this.state.indx===index?this.state.ManualBackPrice:null} onChange={(e)=>this.handleChange(e,index,4)}  style={{height: '20px'}}/>
                                    </td> 					   
                                    <td className="red text-center">
                                        <input type="checkbox"  name ="ManualPriceKey" onChange={(e)=>this.handleChange(e,item.marketData._id,3)}  style={{height: '20px',width: '20px'}}/>
                                    </td> 					   
                                    <td className="red text-center">
                                        <input type="button" value="submit" onClick={()=>this.handlemanualFancyOdds(item.marketData._id)} style={{background:"#95335c",color:'white',outline:'none'}}/>
                                    </td>
                                    {/* <td className="red text-center">
                                        <Link to={'/managefrunners/'+this.props.match.params.id+'?marketid='+item.marketData.marketId} >Manage Runners</Link> | 
                                        <Link to="#">Action 2</Link>
                                    </td> */}
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