import React, { Component } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./footer";

class Livegame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchUserName: "",
      from_date: "",
      to_date: "",
      currentDate: "",
    };
  }

  async componentDidMount() {
    let d = new Date();
    let m = d.getMonth() + 1;
    let cDate = "";
    if (m < 10) {
      cDate = `${d.getFullYear()}-0${m}-${d.getDate()}`;
    } else {
      cDate = `${d.getFullYear()}-${m}-${d.getDate()}`;
    }
    await this.setState({
      currentDate: cDate,
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: [event.target.value],
    });
  };

  render() {
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className="forModal" />{" "}
        <div className="container body">
          <div className="main_container" id="sticky">
            <style
              dangerouslySetInnerHTML={{
                __html:
                  "\n    .mark-back:hover{background: #4cebdc !important;}\n    .mark-lay:hover{background: #c6f6f2 !important;}\n    .mark-back{background: #7CC4F7 !important;}\n    .mark-lay{background: #FCA4B7 !important;}\n",
              }}
            />
            <div className="main-content">
              <div className="main-inner">
                <section className="match-content">
                  
                  <div className="table_tittle" 
                    style={{backgroundColor:'purple', 
                    color:'white',
                    padding:'8px',
                    marginRight:'10px',
                    marginBottom:'5px'
                  }}>
                    <span> {" "}CLIENT LIVE GAME BETS REPORT{" "}</span>
                    <button style={{float:'right', backgroundColor:'#5cb0b8', border:'none', borderRadius:'3px'}}
                    onClick={()=>{this.props.history.goBack()}}>Back</button>
                  </div>
                   
                  <div className="col-md-12 col-sm-12 col-xs-12">
                    <div className="clearfix data-background">
                      <input
                        type="hidden"
                        name="ajaxUrl"
                        id="ajaxUrl"
                        defaultValue="gameclientbet"
                      />

                      <form
                        method="get"
                        className="form-horizontal form-label-left input_mask"
                        id="formSubmit"
                      >
                        <input
                          type="hidden"
                          name="user_id"
                          id="user_id"
                          defaultValue={145315}
                        />
                        <div className="col-md-2 col-xs-6">
                          <input
                            type="date"
                            onChange={this.handleChange}
                            name="from_date"
                            defaultValue={this.state.currentDate}
                            id="from_date"
                            className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker"
                            placeholder="From date"
                          />
                        </div>
                        <div className="col-md-2 col-xs-6">
                          <input
                            type="date"
                            onChange={this.handleChange}
                            name="to_date"
                            defaultValue={this.state.currentDate}
                            id="to_date"
                            className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker"
                            placeholder="To date"
                            autoComplete="off"
                          />
                        </div>
                        <div className="col-md-2 col-xs-6">
                          <input
                            type="text"
                            style={{ marginTop: "2px" }}
                            onChange={this.handleChange}
                            name="searchUserName"
                            id="searchUserName"
                            className="form-control"
                            placeholder="Users"
                          />
                        </div>
                        <div className="col-md-2 col-xs-6">
                          <select
                            style={{ color: "black" }}
                            name="searchType"
                            className="form-control"
                          >
                            <option value selected>
                              All Game
                            </option>
                            <option value={56767}>Live Teenpatti</option>
                            <option value={87564}>Andar bahar</option>
                            <option value={67564}>Poker</option>
                            <option value={98789}>7 up &amp; Down</option>
                            <option value={56967}>32 cards casino</option>
                            <option value={56968}>Hi low</option>
                            <option value={67565}>Six player poker</option>
                            <option value={56768}>Teenpatti 20</option>
                            <option value={92037}>MATKA</option>
                          </select>
                        </div>
                        <div className="col-md-2 col-xs-6">
                          <select
                            style={{ color: "black", margin: "auto" }}
                            name="betStatus"
                            className="form-control"
                          >
                            <option value="O">OPEN</option>
                            <option value="S" selected>
                              Settle
                            </option>
                          </select>
                        </div>
                        <div className="col-md-3 col-xs-12">
                          <button
                            type="button"
                            id="submit_form_button"
                            style={{ marginTop: "5px" }}
                            className="btn btn-success"
                            data-attr="submit"
                          >
                            <i className="fa fa-filter" /> Filter
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className>
                      <div id="divLoading"> </div>
                      {/*Loading class */}
                      <div className="custom-scroll data-background appendAjaxTbl">
                        <table className="table table-striped jambo_table bulk_action full-table-clint">
                          <thead>
                            <tr className="headings">
                              <th>Datetime </th>
                              <th>Client</th>
                              <th>Game</th>
                              <th>Round id</th>
                              <th>Bet details</th>
                              <th>Result</th>
                              <th>Type</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td colSpan={6}>No record found.</td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="pull-left">
                          Showing 1 to 0 of 0 entries{" "}
                        </p>
                        <p
                          id="paginateClick"
                          className="pull-right pagination-row dataTables_paginate paging_simple_numbers"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Livegame;
