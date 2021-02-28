import React, { Component } from 'react'
import Loader from 'react-loader-spinner'
import Pagination from './Pagination'
import { Link } from 'react-router-dom'
import Navbar from './Navbar';
import Utilities from './utilities'
import Account from '../Services/account';
import Footer from './footer';

export default class Userpl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPage:1,
      postsPerPage:10,
      load:false,
      tableHead:["S.No.","Username","Cricket","Tennis","Soccer","Teenpatti","Fancy"],
      data: '',
      masterData: '',
      adminData: '',
      ispl: false,
      showbetData: '',
      from_date: '',
      to_date: '',
      filter_sport:'cricket',
      filter_sport_pos:'cricket',
      filter_order:'desc',
      filter_value:10,
      currentDate: '',
      currentStart:'',
      currentend:''
    }
    this.account = new Account();
    this.userDetails = JSON.parse(localStorage.getItem('data'));
  }

  async componentDidMount() {
    let currD = new Date().toISOString().substr(0,10);
    //let currT = Utilities.datetime(new Date()).slice(11,16)
    let Scurr = currD+"T00:00:01";
    let Ecurr = currD+"T23:59:59";
    await this.setState({
      currentStart:currD+"T00:00:01",
      currentend:currD+"T23:59:59",
      from_date:Scurr,
      to_date:Ecurr,
      load:true
    })
    if(this.userDetails.superAdmin === this.userDetails.Admin === this.userDetails.Master === false){
      this.props.history.push('/dashboard')
    }
    await this.getUserPLData();
  }

  getUserPLData = () => {
    if (this.userDetails.superAdmin) {
      const obj = {
        userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName,
        startDate:this.state.from_date,
        endDate:this.state.to_date
      }
      this.account.superAdminUserPL(obj,(data) => {
        if(this.state.filter_sport==="cricket"){
          if (this.state.filter_order === "asc") {
            this.setState({adminData: data.data.userPL.sort(function(a, b) {
                return a.cricketProfit - b.cricketProfit
              }),filter_sport_pos:'cricket'
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({adminData: data.data.userPL.sort(function(a, b) {
                return b.cricketProfit - a.cricketProfit
              }),filter_sport_pos:'cricket'
            });
          }
        }else if(this.state.filter_sport==="tennis"){
          if (this.state.filter_order === "asc") {
            this.setState({adminData: data.data.userPL.sort(function(a, b) {
                return a.tennisProfit - b.tennisProfit
              }),filter_sport_pos:'tennis'
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({adminData: data.data.userPL.sort(function(a, b) {
                return b.tennisProfit - a.tennisProfit
              }),filter_sport_pos:'tennis'
            });
          }
        }else if(this.state.filter_sport==="soccer"){
          if (this.state.filter_order === "asc") {
            this.setState({adminData: data.data.userPL.sort(function(a, b) {
                return a.soccerProfit - b.soccerProfit
              }),filter_sport_pos:'soccer'
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({adminData: data.data.userPL.sort(function(a, b) {
                return b.soccerProfit - a.soccerProfit
              }),filter_sport_pos:'soccer'
            });
          }
        }else if(this.state.filter_sport==="fancy"){
          if (this.state.filter_order === "asc") {
            this.setState({adminData: data.data.userPL.sort(function(a, b) {
                return a.fancyProfitLoss - b.fancyProfitLoss
              }),filter_sport_pos:'fancy'
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({adminData: data.data.userPL.sort(function(a, b) {
                return b.fancyProfitLoss - a.fancyProfitLoss
              }),filter_sport_pos:'fancy'
            });
          }
        }
      });
    }
    else if (this.userDetails.Admin) {
      const obj = {
        adminName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName,
        startDate:this.state.from_date,
        endDate:this.state.to_date
      }
      this.account.adminUserPL(obj,(data) => {
        if(this.state.filter_sport==="cricket"){
          if (this.state.filter_order === "asc") {
            this.setState({masterData: data.data.userPL.sort(function(a, b) {
                return a.cricketProfit - b.cricketProfit
              })
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({masterData: data.data.userPL.sort(function(a, b) {
                return b.cricketProfit - a.cricketProfit
              })
            });
          }
        }else if(this.state.filter_sport==="tennis"){
          if (this.state.filter_order === "asc") {
            this.setState({masterData: data.data.userPL.sort(function(a, b) {
                return a.tennisProfit - b.tennisProfit
              })
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({masterData: data.data.userPL.sort(function(a, b) {
                return b.tennisProfit - a.tennisProfit
              })
            });
          }
        }else if(this.state.filter_sport==="soccer"){
          if (this.state.filter_order === "asc") {
            this.setState({masterData: data.data.userPL.sort(function(a, b) {
                return a.soccerProfit - b.soccerProfit
              })
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({masterData: data.data.userPL.sort(function(a, b) {
                return b.soccerProfit - a.soccerProfit
              })
            });
          }
        }else if(this.state.filter_sport==="fancy"){
          if (this.state.filter_order === "asc") {
            this.setState({masterData: data.data.userPL.sort(function(a, b) {
                return a.fancyProfitLoss - b.fancyProfitLoss
              })
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({masterData: data.data.userPL.sort(function(a, b) {
                return b.fancyProfitLoss - a.fancyProfitLoss
              })
            });
          }
        }
      });
    }
    else if (this.userDetails.Master) {
      const obj = {
        masterName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName,
        startDate:this.state.from_date,
        endDate:this.state.to_date
      }
      this.account.userPL(obj,(data) => {
        if(this.state.filter_sport==="cricket"){
          if (this.state.filter_order === "asc") {
            this.setState({masterData: data.data.sort(function(a, b) {
                return a.cricketProfit - b.cricketProfit
              })
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({masterData: data.data.sort(function(a, b) {
                return b.cricketProfit - a.cricketProfit
              })
            });
          }
        }else if(this.state.filter_sport==="tennis"){
          if (this.state.filter_order === "asc") {
            this.setState({masterData: data.data.sort(function(a, b) {
                return a.tennisProfit - b.tennisProfit
              })
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({masterData: data.data.sort(function(a, b) {
                return b.tennisProfit - a.tennisProfit
              })
            });
          }
        }else if(this.state.filter_sport==="soccer"){
          if (this.state.filter_order === "asc") {
            this.setState({masterData: data.data.sort(function(a, b) {
                return a.soccerProfit - b.soccerProfit
              })
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({masterData: data.data.sort(function(a, b) {
                return b.soccerProfit - a.soccerProfit
              })
            });
          }
        }else if(this.state.filter_sport==="fancy"){
          if (this.state.filter_order === "asc") {
            this.setState({masterData: data.data.sort(function(a, b) {
                return a.fancyProfitLoss - b.fancyProfitLoss
              })
            });
          } else if (this.state.filter_order === "desc") {
            this.setState({masterData: data.data.sort(function(a, b) {
                return b.fancyProfitLoss - a.fancyProfitLoss
              })
            });
          }
        }
      });
    }
  }

  paginate = (pageNumber) => {
    this.setState({
      currentPage:pageNumber
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]:event.target.value
    })
  }

  handleFilter = async () => {
    await this.setState({
      postsPerPage:this.state.filter_value
    })
    await this.getUserPLData();
  }

  handleTabFilter = (eventType) => {
    if(eventType!==""){
      let betHistoryFilter = this.state.newResData.filter(ele => ele.eventType === eventType )
        this.setState({
          betHistory:betHistoryFilter
          })
        }
    else{
      this.setState({
        betHistory: this.state.newResData
      })
    }
  }

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentStart,
      to_date:this.state.currentend
    }) 
    this.setState({
      load:true
    })
    this.getUserPLData();
  }

  render() {
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentdataPosts = this.state.data?.slice(indexOfFirstPost, indexOfLastPost);
    const currentmasterDataPosts = this.state.masterData?.slice(indexOfFirstPost, indexOfLastPost);
    const currentadminDataPosts = this.state.adminData?.slice(indexOfFirstPost, indexOfLastPost);
    return (
      <div>
        <Navbar />
        <div className="container body">
          <div className="main_container" id="sticky" style={{ width: '100%' }}>
            <div className="right_col" role="main">
              <div className="col-md-12">
                <div className="title_new_at"> User's PL
                  <div className="pull-right">
                    <button className="btn btn-xs btn-primary" style={{ paddingRight: '5px', paddingLeft: '5px', backgroundColor: '#6c1945', marginRight: '2px' }} id="backbutton" onClick={() => { this.props.history.goBack() }}>Back</button>
                  </div>
                </div>
              </div>

              {
                ////////////////////////////// USER PL FORM /////////////////////////////////////
              }
              <div className="col-md-12 col-sm-12 col-xs-12">
                <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="report/userpl" />
                <form className="form-horizontal form-label-left input_mask userpl" id="formSubmit">
                  <div className="clearfix data-background">
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={this.handleChange} name="from_date" value={this.state.from_date} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="From date" autoComplete="off" />
                    </div>
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={this.handleChange} name="to_date" value={this.state.to_date} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="To date" autoComplete="off" />
                    </div>
                    <div className="popup_col_1">
                      <select name="filter_sport" onChange={this.handleChange} className="form-control">
                        <option value="cricket">Cricket</option>
                        <option value="tennis">Tennis</option>
                        <option value="soccer">Soccer</option>
                        <option value="fancy">Fancy</option>
                      </select>
                    </div>
                    <div className="popup_col_1">
                      <select name="filter_order" onChange={this.handleChange} className="form-control">
                        <option value="desc">Top</option>
                        <option value="asc">Bottom</option>
                      </select>
                    </div>
                    <div className="popup_col_1">
                      <select name="filter_value" onChange={this.handleChange} className="form-control">
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="block_2 buttonacount">
                      <button type="button" className="red_button" onClick={this.handleFilter} style={{ marginRight: '5px' }} id="submit_form_button" value="filter">
                        <i className="fa fa-filter" /> Filter
                      </button>
                      <button type="reset" className="red_button" onClick={this.handleClear}>
                        <i className="fa fa-eraser" /> Clear
                      </button>
                    </div>
                  </div>
                  {/*<div className="popup_col_12">
                    <div id="betsalltab" className="tab_bets">
                      <div className="nav nav-pills match-lists">
                        <li><Link to="#" dat-attr="m">Last Month</Link></li>
                        <li><Link to="#" dat-attr="w">Last Week</Link></li>
                        <li><Link to="#" dat-attr="y">Yesterday</Link></li>
                        <li><Link to="#" dat-attr="t">Today</Link></li>
                        <input type="hidden" id="inputFilterDate" name="Filterdate" defaultValue="t" />
                      </div>
                    </div>
                  </div>
                  */}
                </form>
                <div id="divLoading"/>

{
  ////////////////////////////// USER PL TABLE ////////////////////////////////////
}

                <div className="custom-scroll data-background appendAjaxTbl">
                  <table className="table table-striped jambo_table bulk_action full-table-clint">
                    <thead>
                      <tr className="headings" style={{backgroundColor:'#95335c',color:'white'}}>
                        {
                          this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        currentdataPosts.length > 0 ?
                          currentdataPosts.map((item,index) => {
                            return (
                              <tr>
                                <td className="text-center">{index+1}</td>
                                <td className="text-center">{item.userName}</td>
                                <td className="text-center">{this.state.filter_sport_pos==="cricket" ? item.cricketProfit:'0.00'}</td>
                                <td className="text-center">{this.state.filter_sport_pos==="tennis" ? item.tennisProfit:'0.00'}</td>
                                <td className="text-center">{this.state.filter_sport_pos==="soccer" ? item.soccerProfit:'0.00'}</td>
                                <td className="text-center">0.00</td>
                                <td className="text-center">{this.state.filter_sport_pos==="fancy" ? item.fancyProfitLoss:'0.00'}</td>
                              </tr>
                            )
                          }):
                        currentmasterDataPosts.length > 0 ?
                          currentmasterDataPosts.map((item,index) => {
                            return (
                              <tr>
                                <td className="text-center">{index+1}</td>
                                <td className="text-center">{item.userName} ( <b>M:</b>{item.master} )</td>
                                <td className="text-center">{this.state.filter_sport_pos==="cricket" ? item.cricketProfit:'0.00'}</td>
                                <td className="text-center">{this.state.filter_sport_pos==="tennis" ? item.tennisProfit:'0.00'}</td>
                                <td className="text-center">{this.state.filter_sport_pos==="soccer" ? item.soccerProfit:'0.00'}</td>
                                <td className="text-center">0.00</td>
                                <td className="text-center">{this.state.filter_sport_pos==="fancy" ? item.fancyProfitLoss:'0.00'}</td>
                              </tr>
                            );
                          }):
                        currentadminDataPosts.length > 0 ?
                          currentadminDataPosts.map((item,index) => {
                            return (
                              <tr>
                                <td className="text-center">{index}</td>
                                <td className="text-center">{item.userName} ( <b>M:</b>{item.master} ) ( <b>A:</b>{item.admin} )</td>
                                <td className="text-center">{this.state.filter_sport_pos==="cricket" ? item.cricketProfit:'0.00'}</td>
                                <td className="text-center">{this.state.filter_sport_pos==="tennis" ? item.tennisProfit:'0.00'}</td>
                                <td className="text-center">{this.state.filter_sport_pos==="soccer" ? item.soccerProfit:'0.00'}</td>
                                <td className="text-center">0.00</td>
                                <td className="text-center">{this.state.filter_sport_pos==="fancy" ? item.fancyProfitLoss:'0.00'}</td>
                              </tr>
                            )
                          }):
                        <tr>
                          <td colSpan="7" className="text-center">Empty...!</td>
                        </tr>
                      }
                    </tbody>
                    {
                      currentdataPosts.length > 0 ?
                      <tfoot>
                      <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.data.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>  
                    </tfoot>:
                      currentmasterDataPosts.length > 0 ?
                      <tfoot>
                      <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.masterData.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>  
                    </tfoot>:
                      currentadminDataPosts.length > 0 ?
                      <tfoot>
                      <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.adminData.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>  
                    </tfoot>:
                      null
                    }
                  </table>
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