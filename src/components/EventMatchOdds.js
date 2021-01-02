import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';

export default class EventMatchOdds extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","Market_Id","Market_Name","Runner_Name","isEnable","Action"],
      marketata:'',
      runnersdata:[]
    };
    this.events = new Livevents();
  }

  componentDidMount() {
    this.events.getMatchOdds(this.props.match.params.id,data=>{
      let allMdata = data.data.data.marketData;
      let allrunners = data.data.data.runners[0];
      this.setState({
        marketata:allMdata,
        runnersdata:allrunners
      })
    });
  }

  handleChange = (event) => {
    this.events.lockMatchOdds({marketId:this.state.marketata.marketId},data=>{
      this.setState({
        marketata:data.data.Data,
      })
    })
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
                    <div className="title_new_at">Match Odds    
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
                                  return (
                                    <div key={index}>
                                      <p>Runner Name : {item.runnerName} </p>,
                                      <p>Selection Id : {item.selectionId}</p><br/>
                                    </div>
                                  )
                                })
                              }
                            </td>
                            <td className="text-center">
                              <input type="checkbox"  checked={this.state.marketata.isEnabled} name ="isEnable" onChange={(e)=>this.handleChange(e)}  style={{height: '20px',width: '20px'}}/>
                            </td> 					   
                            <td className="text-center"><Link to='#'>Action 1</Link> | <Link to="#">Action 2</Link></td>
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