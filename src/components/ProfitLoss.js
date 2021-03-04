import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Utilities from './utilities'
import Sidebar from "./Sidebar";
import Account from "../Services/account";
import Footer from './footer'


export default class ProfitLoss extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage:1,
      postsPerPage:10,
      profitAndLossTableHead:["S.No.","EventName","Market","P_L","Commission","CreatedOn","Action"],
      showBetHistoryTableHead:["S.No.","UserName","Description","selectionName","Type","Odds","Stack","Date","P_L","Profit","Liability","Status","Bet Code"],
      // allGames:["Cricket","Soccer","Tennis"/*,"Live Teenpatti","Live Casino","Fancy"*/],
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

  handleFilter = async () => {
    let fD = await new Date(this.state.from_date);
    let tD = await new Date(this.state.to_date);
    if(fD <= tD){
      let betHistoryFilter = this.state.newResData.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
      await this.setState({
          data:betHistoryFilter
        })
      }
  };

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentStart,
      to_date:this.state.currentend,
    })
    this.getprofitlossData();
  }

    getprofitlossData = () =>{
      console.log(this.props);
      this.userDetails = JSON.parse(localStorage.getItem('data'));
      if (this.userDetails.superAdmin) {
        this.account.superAdminProfitAndLoss({ userName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          this.setState({
            data: data.data,
            newResData: data.data
          });
        });
      }
      else if (this.userDetails.Admin) {
        this.account.adminProfitAndLoss({ adminName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          this.setState({
            data: data.data,
            newResData: data.data
          });
        });
      }
      else if (this.userDetails.Master) {
        this.account.masterProfitAndLoss({ masterName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          this.setState({
            data: data.data,
            newResData: data.data
          });
          console.log(data.data);
        });
      }
      else {
        this.account.getprofitloss({userName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          this.setState({
            data: data.data,
            newResData: data.data
          });
        });
      }
    }
    
    async componentDidMount() {
    await this.getprofitlossData();
    let currD = new Date().toISOString().substr(0,10);
    //let currT = Utilities.datetime(new Date()).slice(11,16)
    let Scurr = currD+"T00:00:01"
    let Ecurr = currD+"T23:59:59"
    this.setState({
      currentStart:currD+"T00:00:01",
      currentend:currD+"T23:59:59",
      from_date:Scurr,
      to_date:Ecurr,
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

  handleGameFilter = (event) => {
    let sportId = event.target.value
    if(sportId!==""){
      let betHistoryFilter = this.state.newResData.filter(ele => ele.eventType === sportId )
        this.setState({
          data:betHistoryFilter
        })
      }
    else{
      this.setState({
        data: this.state.newResData
      })
    }
  }

  render() {
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentdataPosts = this.state.data?.slice(indexOfFirstPost, indexOfLastPost);
    const currentmasterDataPosts = this.state.masterData?.slice(indexOfFirstPost, indexOfLastPost);
    const currentadminDataPosts = this.state.adminData?.slice(indexOfFirstPost, indexOfLastPost);
    let sportType;
    let mTotal=0;
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
                        <button style={{float:'right',paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px', marginTop:'3px' }} onClick={this.goBack}>
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
                          <tr className="headings" role="row" style={{backgroundColor:'#95335c',color:'white'}}>
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
                                  <td className="text-center">{new Date(item.createdDate).toLocaleString()}</td>
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
                    <button style={{float:'right',paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px', marginTop:'3px' }} onClick={()=>this.props.history.goBack()}>Back</button>
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
                        <select className="form-control" name="sportid" onChange={this.handleGameFilter}>
                          <option value="">All</option>
                          <option value="4">Cricket</option>
                          <option value="2">Tennis</option>
                          <option value="1">Soccer</option>
                        </select>
                      </div>
                      <div className="col-md-2 col-xs-6">
                        <input type="datetime-local" onChange={this.handleChange} name="from_date" value={this.state.from_date} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left" placeholder="From date" autoComplete="off" />
                      </div>
                      <div className="col-md-2 col-xs-6">
                        <input type="datetime-local" onChange={this.handleChange} name="to_date" value={this.state.to_date} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left" placeholder="To date" autoComplete="off" />
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
                        <tr className="headings" style={{backgroundColor:"#95335c",color:'white'}}>
                          {
                            this.state.profitAndLossTableHead.map((item,index)=><th key={index} className="text-center"><b>{item}</b></th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          currentdataPosts.length > 0 ?
                          currentdataPosts.map((item,index) => {
                            if(item.data[0].eventType === 4){
                              sportType = "Cricket";
                            }else if(item.data[0].eventType === 1){
                              sportType = "Tennis";
                            }else if(item.data[0].eventType === 2){
                              sportType = "Soccer";
                            }else{
                              sportType = "Event";
                            }
                            mTotal=mTotal+item.ProfitLoss;
                            let eventName = JSON.parse(item.data[0].description);
                              totalPL += item.ProfitLoss;
                              return (
                                <tr>
                                  <td className="text-center">{index+1}</td>
                                  <td className="text-center">{sportType}/{eventName.name}/Selection{item.data[0].selection}/Match Odds:{item.data[0].marketType}({item.data[0].odds})/Result:{item.data[0].settledValue}</td>
                                  <td className="text-center">{item.data[0].marketType}</td>
                                  <td className="text-center">{item.ProfitLoss}</td>
                                  <td className="text-center">0.0</td>
                                  <td className="text-center">{new Date(item.data[0].createdDate).toLocaleString()} </td>
                                  <td className="text-center">
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
                        <tr style={{backgroundColor:"#95335c",color:'white'}}>
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
