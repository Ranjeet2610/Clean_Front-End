import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';

export default class ManageFancyOdds extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","Market_Id","Market_Name","isEnable","isVisiable","Action"],
      marketata:[],
      runnersdata:''
    };
    this.events = new Livevents();
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
    else{
      this.events.visiableFancyOdds({marketId:marketId},data=>{
        this.events.getFancyMarketType(this.props.match.params.id,data=>{      
          this.setState({
            marketata:data.fancymarket
          })
        }); 
      })  
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
                  <div className="title_new_at">Fancy Odds    
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
                                  <td className="red text-left"><input type="checkbox"  checked={item.marketData.isEnabled} name ="isEnable" onChange={(e)=>this.handleChange(e,item.marketData.marketId,1)}  style={{height: '20px',width: '20px'}}></input></td> 					   
                                  <td className="red text-left"><input type="checkbox"  checked={item.marketData.isVisible} name ="isVisible" onChange={(e)=>this.handleChange(e,item.marketData.marketId,2)}  style={{height: '20px',width: '20px'}}></input></td> 					   
                                  <td className="red text-center">
                                    <Link to={'/managefrunners/'+this.props.match.params.id+'?marketid='+item.marketData.marketId} >Manage Runners</Link> | 
                                    <Link to="#">Action 2</Link>
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
        <Footer />
      </div>
    )
  }
}