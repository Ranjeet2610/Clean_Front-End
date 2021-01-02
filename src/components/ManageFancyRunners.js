import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Livevents from '../Services/livevents';

export default class ManageFancyRunners extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","SelectionId","RunnerName","isVisiable","Action"],
      marketata:[],
      runnersdata:''
    };
    this.events = new Livevents();
    this.query = new URLSearchParams(this.props.location.search);
  }

  componentDidMount() {   
    let marketId = this.query.get('marketid');
    this.events.getFancyMarketType(this.props.match.params.id,data=>{ 
      let filterData = data.fancymarket.filter((item)=>item.marketData.marketId == marketId);
      this.setState({
        marketata:filterData[0].runners
      });
    });
  }

  handleChange = (event,selectionId) => {
    let mId = this.query.get('marketid');
    this.events.visiableFancyRunners({marketId:mId,selectionId:selectionId},data=>{
      this.events.getFancyMarketType(this.props.match.params.id,data=>{ 
        let filterData = data.fancymarket.filter((item)=>item.marketData.marketId == mId);
        this.setState({
          marketata:filterData[0].runners
        });
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
                  <div className="title_new_at">Fancy Odds    
                    <div className="pull-right"><button className="btn_common" onClick={() => this.props.history.goBack()}>Back</button> </div>
                  </div>
                </div>
                <div className="col-md-12"><br></br></div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading"> </div>

{
  /////////////////////////////// TABLE OF FANCY RUNNERS //////////////////////////////////
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
                          this.state.marketata.length > 0 ?
                            this.state.marketata.map((item,index) => {
                              return (
                                <tr key={index}>
                                  <td>{index+1}</td>
                                  <td className="text-center">{item.selectionId}</td>
                                  <td className="text-center">{item.runnerName!=undefined?item.runnerName:''}</td>
                                  <td className="text-center red"><input type="checkbox" checked={item.isRunnersVisible} name ="isVisible" onChange={(e)=>this.handleChange(e,item.selectionId)}   style={{height: '20px',width: '20px'}}></input></td> 					   
                                  <td className="red text-center"><Link to="#">Action</Link></td>
                                </tr>
                              )
                            }):
                          <tr>
                            <td className="text-center" colSpan={5}>Empty...!</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                    <p id="paginateClick" className="pagination-row dataTables_paginate paging_simple_numbers"> </p>
                  </div>
                </div>
              </div>
            </div>
          </div></div></div>
         
    )
}
}