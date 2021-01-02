import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Account from "../Services/account";
import Footer from './footer'


export default class ProfitLoss extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profitAndLossTableHead:["S.No.","Event Name","Market","P_L","Commission","Created On","Action"],
      showBetHistoryTableHead:["S.No.","User Name","Description","selectionName","Type","Odds","Stack","Date","P_L","Profit","Liability","STATUS","Bet Code"],
      allGames:["Cricket","Soccer","Tennis","Live teenpatti","Live Casino","Fancy"],
      data: '',
      ispl: false,
      showbetData: '',
      from_date: '',
      to_date: '',
      searchTerm:'',
      currentDate: ''
    }
    this.account = new Account();
    this.userDetails = "";
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: [event.target.value]
    })
  }

  handleFilter =  (e) => {
    let fD =  this.state.from_date
    let tD =  this.state.to_date
    if (fD <= tD) {
      if (this.userDetails.superAdmin) {
        this.account.superAdminProfitAndLoss({ userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName }, data => {
          this.setState({
            data: data.data
          });
        });
      }
      else if (this.userDetails.Admin) {
        this.account.adminProfitAndLoss({ adminName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName }, data => {
          this.setState({
            data: data.data
          });
        });
      }
      else if (this.userDetails.Master) {
        this.account.masterProfitAndLoss({ masterName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName }, data => {
          this.setState({
            data: data.data
          });
        });
      }
      else {
        this.account.getprofitloss({ date1: fD, date2: tD, userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName }, data => {
          this.setState({
            data: data.data
          });
  
        });
      }
    }

  };

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentDate,
      to_date:this.state.currentDate,
    })
    this.getprofitlossData();
  }

  getprofitlossData = () =>{
    var date1 = new Date();
    var res1 = date1.toISOString().substring(0, 10);
    var date2 = new Date();
    var res2 = date2.toISOString().substring(0, 10);

    this.userDetails = JSON.parse(localStorage.getItem('data'));
    if (this.userDetails.superAdmin) {
      this.account.superAdminProfitAndLoss({date1: res1, date2: res2, userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName }, data => {
        this.setState({
          data: data.data
        });
      });
    }
    else if (this.userDetails.Admin) {
      this.account.adminProfitAndLoss({ date1: res1, date2: res2,adminName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName }, data => {
        this.setState({
          data: data.data
        });
      });
    }
    else if (this.userDetails.Master) {
      this.account.masterProfitAndLoss({ date1: res1, date2: res2,masterName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName }, data => {
        this.setState({
          data: data.data
        });
      });
    }
    else {
      this.account.getprofitloss({ date1: res1, date2: res2, userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName }, data => {
        console.log(this.state.data)
        this.setState({
          data: data.data
        });

      });
    }
  }

  componentDidMount() {
    this.getprofitlossData();
    let curr = new Date();
    curr.setDate(curr.getDate());
    let date = curr.toISOString().substr(0,10);
   this.setState({
      currentDate:date,
      from_date:this.state.currentDate,
      to_date:this.state.currentDate,
     }) 
  }

  goBack = () => {
    this.setState({
      ispl: false
    });
  }

  showBet(data) {
    this.setState({
      showbetData: data,
      ispl: true,
    })
  }

  render() {
    let totalPL = 0;
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className="container body">
          <div className="main_container" id="sticky">
            {this.state.ispl ? 
              <div className="row">
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="clearfix data-background">
                    <div className="col-md-12">

{
  ////////////////////////// LISTING FOR SHOW BET HISTORY /////////////////////////////////////
}

                      <div className="title_new_at">
                        Show Bet History
                        <button style={{float:'right',paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px', marginTop:'3px' }} onClick={()=>{this.props.history.goBack()}}>
                          Back
                        </button>
                      </div>
                    </div>
                    <div className="custom-scroll appendAjaxTbl data-background">

{
  /////////////////////////// TABLE FOR SHOW BET HISTORY //////////////////////////////////////
}

                      <table className="table table-striped jambo_table bulk_action dataTable no-footer" id="datatable" role="grid" aria-describedby="datatable_info" >
                        <thead>
                          <tr className="headings" role="row">
                            {
                              this.state.showBetHistoryTableHead.map((item)=>{
                                return(
                                <th className="sorting text-center" tabindex="0" aria-controls="datatable" rowspan="1" colspan="1" aria-label={`${item} : activate to sort column descending`} >
                                  {item}
                                </th>
                                )
                              })
                            }
                          </tr>
                        </thead>
                        <tbody>
                          {
                            this.state.showbetData.map((item,index) => {
                              return (
                                <tr className="mark-back content_user_table  odd" role="row">
                                  <td className="sorting_1">{index+1}</td>
                                  <td className="text-center">{item.clientName}</td>
                                  <td className="text-center">Cricket&gt;{item.description}&gt;{item.marketType}&nbsp;</td>
                                  <td className="text-center">{item.selection}</td>
                                  <td className="text-center">{item.bettype} </td>
                                  <td className="text-center">{item.odds}</td>
                                  <td className="text-center">{item.stack}</td>
                                  <td className="text-center">{item.createdDate}</td>
                                  <td className="text-center">{item.P_L}</td>
                                  <td className="text-center">{item.profit}</td>
                                  <td className="text-center">{item.liability}</td>
                                  <td className="text-center">{item.status}</td>
                                  <td className="text-center">{item._id} </td>
                                </tr>
                              );
                            })
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              : 

///////////////////////// PROFIT LOSS LISTING ///////////////////////////////////////

              <div className="right_col" role="main">
                <div className="col-md-12">
                  <div className="title_new_at">
                    Profit Loss Listing
                    <select style={{ color: "black", marginLeft:'2px' }} >
                      <option value={10} active="true">10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <button style={{float:'right',paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px', marginTop:'3px' }} onClick={this.goBack}>Back</button>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="filter_page data-background">
                    <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="Cprofitloss" />

{
  ///////////////////////////// FROM FOR PROFIT & LOSS ////////////////////////////////////
}

                    <form id="formSubmit" className="form-horizontal form-label-left input_mask" >
                      <div className="col-md-3 col-xs-6">
                        <input type="hidden" name="user_id" defaultValue={145315} />
                        <input type="hidden" name="perpage" id="perpage" defaultValue={10} />
                        <select className="form-control" name="sportid">
                          <option value={0} active="true">All</option>
                          {
                            this.state.allGames.map((item,index)=><option key={index} value={index+1}>{item}</option>)
                          }
                        </select>
                      </div>
                      <div className="col-md-2 col-xs-6">
                        <input type="date" onChange={this.handleChange} name="from_date" defaultValue={this.state.currentDate} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left" placeholder="From date" autoComplete="off" />
                      </div>
                      <div className="col-md-2 col-xs-6">
                        <input type="date" onChange={this.handleChange} name="to_date" defaultValue={this.state.currentDate} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left" placeholder="To date" autoComplete="off" />
                      </div>

{
  /////////////////////// SEARCH BOX ////////////////////////////////////////////////// 
}

                      <div className="col-md-2 col-xs-6">
                        <input type="text" className="form-control" placeholder="Via event name" name="searchTerm" value={this.state.searchTerm} onChange={this.handleChange} />
                      </div>

{
  /////////////////////// FILTER AND CLEAR BUTTON //////////////////////////////////////
}

                      <div className="col-md-3 col-xs-12">
                        <button type="button" className="blue_button" style={{ marginRight: "5px" }} id="submit_form_button" value="filter" onClick={this.handleFilter} >
                          Filter
                        </button>
                        <button type="reset" className="red_button" onClick={this.handleClear} >
                          Clear
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading"/>
                  <div className="custom-scroll appendAjaxTbl data-background">
                    
{
  ////////////////////////// TABLE OF PROFIT AND LOSS ///////////////////////////////////
}

                    <table className="table table-striped jambo_table bulk_action">
                      <thead>
                        <tr className="headings">
                          {
                            this.state.profitAndLossTableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.data.length > 0 ?
                          this.state.data.map((item,index) => {
                              totalPL += item.ProfitLoss;
                              return (
                                <tr>
                                  <td className>{index+1}</td>
                                  <td className>{item.data[0].description}</td>
                                  <td className>{item.data[0].marketType}</td>
                                  <td className>{item.ProfitLoss}</td>
                                  <td className>0.0</td>
                                  <td className>{item.data[0].createdDate} </td>
                                  <td className>
                                    <Link style={{ cursor: "pointer" }} onClick={() => this.showBet(item.data)} >
                                      Show Bet
                                    </Link>
                                  </td>
                                </tr>
                              );
                            }):
                            <tr>
                              <th colSpan="8" className="text-center">No record found...</th>
                            </tr>
                        }
                      </tbody>
                    </table>
                    
{
  //////////////////////////// 2nd PROFIT LOSS TABLE ////////////////////////////////////////
}

                    <table className="table table-striped jambo_table bulk_action">
                      <thead>
                        <tr>
                          <th>(Total P &amp; L ) {totalPL}</th>
                          <th>(Total Commition) 0</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
