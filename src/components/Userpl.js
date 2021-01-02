import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar';
import Account from '../Services/account';
import Footer from './footer';

export default class Userpl extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHead:["S.No.","Username","Cricket","Tennis","Soccer","Teenpatti","Fancy"],
      data: '',
      masterData: '',
      adminData: '',
      ispl: false,
      showbetData: '',
      from_date: '',
      to_date: '',
      currentDate: ''
    }
    this.account = new Account();
    this.userDetails = JSON.parse(localStorage.getItem('data'));
  }

  componentDidMount() {
    if (this.userDetails.superAdmin) {
      const obj = {
        userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName
      }
      this.account.superAdminUserPL(obj,(data) => {
        this.setState({
          adminData: data.data.userPL
        });
      });
    }
    else if (this.userDetails.Admin) {
      const obj = {
        adminName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName 
      }
      this.account.adminUserPL(obj,(data) => {
        this.setState({
          masterData: data.data.userPL
        });
      });
    }
    else if (this.userDetails.Master) {
      const obj = {
        masterName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem('data')).userName 
      }
      this.account.userPL(obj,(data) => {
        this.setState({
          data: data.data
        });
      });
    }
    let curr = new Date();
    curr.setDate(curr.getDate());
    let date = curr.toISOString().substr(0, 10);
    this.setState({
      currentDate: date,
      from_date: this.state.currentDate,
      to_date: this.state.currentDate,
    })
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: [event.target.value]
    })
  }

  handleClear = () => {
    this.setState({
      from_date: this.state.currentDate,
      to_date: this.state.currentDate,
    });
  };

  render() {
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
                      <input type="date" onChange={this.handleChange} name="from_date" defaultValue={this.state.currentDate} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="From date" autoComplete="off" />
                    </div>
                    <div className="popup_col_2">
                      <input type="date" onChange={this.handleChange} name="to_date" defaultValue={this.state.currentDate} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="To date" autoComplete="off" />
                    </div>
                    <div className="popup_col_1">
                      <select name="filter_sport" className="form-control">
                        <option value="cricket" active="true">Cricket</option>
                        <option value="tennis">Tennis</option>
                        <option value="soccer">Soccer</option>
                        <option value="teenpatti">Teenpatti</option>
                        <option value="fancy">Fancy</option>
                      </select>
                    </div>
                    <div className="popup_col_1">
                      <select name="filter_order" className="form-control">
                        <option value="desc">Top</option>
                        <option value="asc">Bottom</option>
                      </select>
                    </div>
                    <div className="popup_col_1">
                      <select name="filter_value" className="form-control">
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="block_2 buttonacount">
                      <button type="button" className="red_button" style={{ marginRight: '5px' }} id="submit_form_button" value="filter">
                        <i className="fa fa-filter" /> Filter
                      </button>
                      <button type="reset" className="red_button" onClick={this.handleClear}>
                        <i className="fa fa-eraser" /> Clear
                      </button>
                    </div>
                  </div>
                  <div className="popup_col_12">
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
                </form>

                <div id="divLoading"/>

{
  ////////////////////////////// USER PL TABLE ////////////////////////////////////
}

                <div className="custom-scroll data-background appendAjaxTbl">
                  <table className="table table-striped jambo_table bulk_action full-table-clint">
                    <thead>
                      <tr className="headings">
                        {
                          this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.data.length > 0 ?
                          this.state.data.map((item,index) => {
                            return (
                              <tr>
                                <td className>{index+1}</td>
                                <td className>{item.userName}</td>
                                <td className>{item.ProfitLoss}</td>
                                <td className>0.00</td>
                                <td className>0.00</td>
                                <td className>0.00</td>
                                <td className>{item.fancyProfitLoss}</td>
                              </tr>
                            )
                          }):
                        this.state.masterData.length > 0 ?
                          this.state.masterData.map((item,index) => {
                            return (
                              <tr>
                                <td className>{index+1}</td>
                                <td className>{item.userName} ( <b>M:</b>{item.master} )</td>
                                <td className>{item.ProfitLoss}</td>
                                <td className>0.00</td>
                                <td className>0.00</td>
                                <td className>0.00</td>
                                <td className>{item.fancyProfitLoss}</td>
                              </tr>
                            );
                          }):
                        this.state.adminData.length > 0 ?
                          this.state.adminData.map((item,index) => {
                            return (
                              <tr>
                                <td className>{index}</td>
                                <td className>{item.userName} ( <b>M:</b>{item.master} ) ( <b>A:</b>{item.admin} )</td>
                                <td className>{item.ProfitLoss}</td>
                                <td className>0.00</td>
                                <td className>0.00</td>
                                <td className>0.00</td>
                                <td className>{item.fancyProfitLoss}</td>
                              </tr>
                            )
                            }):
                        <tr>
                          <td colSpan="7" className="text-center">Empty...!</td>
                        </tr>
                      }
                    </tbody>
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