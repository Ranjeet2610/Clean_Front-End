import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';

export default class EventMatchOdds extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","Market_Id","Market_Name","Runner_Name","isEnable","isVisible","Accept And Avoid Bets","Action"],
      marketata:'',
      allEventData: [],
      runnersdata:[]
    };
    this.events = new Livevents();
  }

  componentDidMount() {
    this.events.getMatchOdds(this.props.match.params.id,data=>{
      let allMdata = data.data.data[0].marketData;
      let allrunners = data.data.data[0].runners[0];
      this.setState({
        marketata:allMdata,
        runnersdata:allrunners,
        allEventData: data.data.data
      })
    });
  }

  handleChange = (marketId, marketName) => {
    this.events.lockMatchOdds({marketId: marketId,marketName: marketName},data=>{
      this.events.getMatchOdds(this.props.match.params.id,data=>{
        this.setState({
          allEventData: data.data.data
        })
      });
    })
  }

  visibleBookMaker  = (marketId, marketName) => {
    this.events.visibleMatchOdds({marketId: marketId,marketName: marketName},data=>{
      this.events.getMatchOdds(this.props.match.params.id,data=>{
        this.setState({
          allEventData: data.data.data
        })
      });
    })
  }
  
  acceptAvoidBookMakerBets  = (marketId, marketName) => {
    this.events.acceptAvoidBookMaker({marketId: marketId,marketName: marketName},data=>{
      this.events.getMatchOdds(this.props.match.params.id,data=>{
        this.setState({
          allEventData: data.data.data
        })
      });
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
                    <div className="title_new_at">Event Markets
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
                        {this.state.allEventData.map((item, i) => {
                       // console.log(item)
                        return (<>
                        <tbody>
                          <tr>
                            <td className="text-center">{i}</td>
                            <td className="text-center">{item.marketData.marketId}</td>
                            <td className="text-center">{item.marketData.marketName}</td>
                            <td className="text-center">
                            {
                                item.runners.length > 0 &&
                                item.runners[0].map((tt, index) => {
                                  return (
                                    <div key={index}>
                                      <p>Runner Name : {tt.runnerName} </p>,
                                      <p>Selection Id : {tt.selectionId}</p><br />
                                    </div>
                                  )
                                })
                              }
                            </td>
                            <td className="text-center">
                              <input type="checkbox"  checked={item.marketData.isEnabled} name ="isEnable" onClick={() => this.handleChange(item.marketData.marketId, item.marketData.marketName)} style={{height: '20px',width: '20px'}}/>
                            </td> 					   
                            <td className="text-center">
                              <input type="checkbox"  checked={item.marketData.isVisible} name ="isVisible" onClick={() => this.visibleBookMaker(item.marketData.marketId, item.marketData.marketName)} style={{height: '20px',width: '20px'}}/>
                            </td> 					   
                            <td className="text-center">
                              <input type="checkbox"  checked={item.marketData.betAcceptandAvoid} name ="betAcceptandAvoid" onClick={() => this.acceptAvoidBookMakerBets(item.marketData.marketId, item.marketData.marketName)} style={{height: '20px',width: '20px'}}/>
                            </td> 					   
                            <td className="text-center"><Link to='#'>Action 1</Link> | <Link to="#">Action 2</Link></td>
                          </tr>
                        </tbody>
                        </>
                        )

                    })}
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