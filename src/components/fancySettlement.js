import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';

export default class ManageFancyOdds extends Component {
  constructor(props){
    super(props);
    this.state = {
        result:'',
        tableHead:["S.No.","Market_Id","Market_Name","Status","Settlement"],
        marketata:[],
        runnersdata:''
    };
    this.events = new Livevents();
}

  componentDidMount() {
    // this.events.getFancySettlementData(this.props.match.params.id,data=>{ 
    //   this.setState({
    //     marketata:data.data.data
    //   });
    // });
    this.getFancySettlementData();
  }

  getFancySettlementData = () => {
    this.events.getFancySettlementData(this.props.match.params.id,data=>{ 
      this.setState({
        marketata:data.data.data
      });
    });
  }

//   handleChange = (event,marketId,type) => {
//     if(type==1){
//       this.events.enableFancyOdds({marketId:marketId},data=>{
//         this.events.getFancyMarketType(this.props.match.params.id,data=>{      
//             this.setState({
//               marketata:data.fancymarket
//             })
//           }); 
//       })
//     }
//     else{
//       this.events.visiableFancyOdds({marketId:marketId},data=>{
//         this.events.getFancyMarketType(this.props.match.params.id,data=>{      
//           this.setState({
//             marketata:data.fancymarket
//           })
//         }); 
//       })  
//     }
//   }

  handleOnChange = (event) => {
      this.setState({
          [event.target.name]:event.target.value
      })
  }

  handleFancySettlement = (id) => {
    if(this.state.result!==""){
      const obj = {
          selectionId : id,
          result: this.state.result
      }
      this.events.fancyBetSettle(obj,(data)=>{
        // fancyBetSettleNotification:
        this.getFancySettlementData();
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
                  <div className="title_new_at">Fancy Settlement    
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
                        <tr className="headings" style={{backgroundColor:'#95335c',color:'white'}}>
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
                                    <td className="text-center">{index+1}</td>
                                    <td className="text-center">{item.marketId}</td>
                                    <td className="text-center">{item.marketName}</td>
                                    {
                                      item.settlementStatus ? 
                                      <td className="text-center " style={{fontSize:'15px',fontWeight:'500',color:'red'}}><i>Settled!</i></td>:
                                      <td className="text-center " style={{fontSize:'15px',fontWeight:'500',color:'green'}}><i>Open</i></td>
                                    }
                                    <td className="red text-center">
                                        {
                                          // this.state.disabledIndex===index ?
                                          <>
                                            <input type="text" size="5" name="result" value={item.settledValue} disabled={item.settlementStatus ? true : false} onChange={this.handleOnChange}/>
                                            <input type="button" onClick={(id)=>this.handleFancySettlement(item.marketId)} value="Settle" disabled={item.settlementStatus ? true : false} className="SettleButton" style={item.settlementStatus ? {backgroundColor:'rgb(149 51 92 / 48%)'} : {backgroundColor:'#95335c'}}/>
                                          </>
                                          // :
                                          // <>
                                          //   <input type="text" size="5" name="result" onChange={this.handleOnChange}/>
                                          //   <input type="button" onClick={(id)=>this.handleFancySettlement(item.marketId,index)} value="Settle" className="SettleButton" style={{backgroundColor:'#95335c'}}/>
                                          // </>
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