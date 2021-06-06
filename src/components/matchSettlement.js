import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Navbar from './Navbar';
import Footer from './footer';
import Livevents from '../Services/livevents';
import Users from '../Services/users';

export default class EventMatchOdds extends Component {

  constructor(props) {
    super(props);
    this.state = {
      runnerID: '',
      disabled: false,
      tableHead: ["S.No.", "Market_Id", "Market_Name", "Runner_Name", "Settlement"],
      marketata: '',
      marketDataBookMaker: [],
      liveodds: '',
      runnersdata: [],
      runnersdataBookMaker: [],
      winnerTeam: '',
      selectionOne: '',
      selectionTwo: '',
      selectionThree: '',
      allEventData: [],
      settledisabled: false
    };
    this.events = new Livevents();
    this.users = new Users();
  }

  getMatchOdds = () => {
    let allMdata = [];
    let allrunners = [];
    this.events.getMatchOdds(this.props.match.params.id, data => {

      data.data.data.forEach(item => {
        //console.log(data)
        if (item.marketData.marketName === 'Match Odds') {
          allMdata = item.marketData;
          allrunners = item.runners[0];
        }
      });
      this.setState({
        marketata: allMdata,
        runnersdata: allrunners,
        allEventData: data.data.data
      });
      this.events.ListMarketOdds(allMdata.marketId, async (data) => {
        await this.setState({
          liveodds: data.data.data
        })
      })
    });
    //console.log(this.state)
  }

  getMatchBookMaker() {

  }

  componentDidMount() {
    this.getMatchOdds();
  }

  handleChange = (event) => {
    this.events.lockMatchOdds({ marketId: this.state.marketata.marketId }, data => {
      this.setState({
        marketata: data.data.Data,
      })
    })
  }

  handleSettlement = (selectionId, marketId, winnerTeam, selectionOne, selectionTwo, selectionThree, settlementType) => {
    if (selectionId !== "") {
      const obj = {
        selectionId: selectionId,
        marketId: marketId,
        eventId: this.props.match.params.id,
        winnerTeam: winnerTeam,
        selectionOne: selectionOne,
        selectionTwo: selectionTwo,
        selectionThree: selectionThree,
        marketName:settlementType
      }
      console.log(obj);
      this.users.matchSettlement(obj, (data) => {
        this.getMatchOdds();
      });
    }
    this.setState({
      disabled: true
    })
  }
 /*
  handleBookMakerSettlement = (selectionId, marketId, winnerTeam, selectionOne, selectionTwo, selectionThree, settlementType) => {
    if (selectionId !== "") {
      const obj = {
        selectionId: selectionId,
        marketId: marketId,
        eventId: this.props.match.params.id,
        winnerTeam: winnerTeam,
        selectionOne: selectionOne,
        selectionTwo: selectionTwo,
        selectionThree: selectionThree.marketName,
        marketName:settlementType
      }
      console.log(obj);
     
      if (settlementType === 'Bookmaker') {
        this.users.matchBookMakerSettlement(obj, (data) => {
          this.getMatchOdds();
        })

      } else {
        this.users.matchSettlement(obj, (data) => {
          this.getMatchOdds();
        });
      }

      this.setState({
        disabled: true
      })
    }
  }
*/
  handleMatchSettle = (event) => {
    this.setState({
      [event.target.name]: event.target.value.split("||")[0],
      winnerTeam: event.target.value.split("||")[1],
      selectionOne: event.target.value.split("||")[2],
      selectionTwo: event.target.value.split("||")[3],
      selectionThree: event.target.value.split("||")[4]
    })
  }
  getTeamselection = (sel) => {
    let getTeam;
    let teams = this.props.location.state.eventname.split(" v ");
    if (sel === 2) {
      this.state.runnersdata.length > 0 &&
        this.state.runnersdata.map((item, index) => {
          if (item.runnerName === "The Draw") {
            getTeam = item.selectionId;
          }
        })
    } else {
     // console.log(teams[sel])
      if (teams[sel] !== undefined) {
        let teamsel = teams[sel].split(" ");
        this.state.runnersdata.length > 0 &&
          this.state.runnersdata.map((item, index) => {
            let team1str = item.runnerName.split(" ");
            if (team1str.length >= 1) {
              if (teams[sel] === item.runnerName) {
                getTeam = item.selectionId;
              } else if (teams[sel] === team1str[0] || teams[sel] === team1str[1]) {
                getTeam = item.selectionId;
              } else if ((teamsel[0].slice(0, 1) + ' ' + teamsel[1]) === (team1str[0].slice(0, 1) + ' ' + team1str[1])) {
                getTeam = item.selectionId;
              } else if (item.runnerName.includes(teams[sel])) {
                getTeam = item.selectionId;
              }
              if (getTeam === "" && teamsel.length > 1) {
                if (item.runnerName.includes(teamsel[0])) {
                  getTeam = item.selectionId;
                } else if (item.runnerName.includes(teamsel[1])) {
                  getTeam = item.selectionId;
                }
              }
              if (getTeam === "" && team1str.length > 2) {
                if (teams[sel] === team1str[2]) {
                  getTeam = item.selectionId;
                } else if (teams[sel] === (team1str[0].slice(0, 1) + ' ' + team1str[1] + ' ' + team1str[2]) || teams[sel] === (team1str[0].slice(0, 1) + ' ' + team1str[1].slice(0, 1) + ' ' + team1str[2])) {
                  getTeam = item.selectionId;
                }
              }
            } else {
              getTeam = item.selectionId;
            }
          })
      }
    }

    return getTeam;
  }
  render() {
    //console.log(this.state)
    let team1 = this.getTeamselection(0);
    let team2 = this.getTeamselection(1);
    let team3 = this.getTeamselection(2);
    //console.log(team1, team2, team3)
    let teamselectionsIds;
    let showSettlement = false;
    /*if (this.state.runnersdata.length == 2) {
      if (typeof (team1) !== "undefined" && typeof (team2) !== "undefined") {
        showSettlement = true;
      } else {
        showSettlement = false;
      }
    } else if (this.state.runnersdata.length === 3) {
      if (typeof (team1) !== "undefined" && typeof (team2) !== "undefined" && typeof (team3) !== "undefined") {
        showSettlement = true;
      } else {
        showSettlement = false;
      }
    }*/
    return (
      <div>
        <Navbar />
        <div className="forModal" />
        <div className="container body">
          <div className="main_container" id="sticky" style={{ width: '100%' }}>
            <div className="right_col" role="main">
              <div className="row">
                <div className="col-md-12">
                  <div className="title_new_at">Match Settlement
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
                    {this.state.allEventData.map((item, i) => {
                        let newteamselectionsIds;
                       // console.log(item)
                        return (<>
                          <table className="table table-bordered table-dark table_new_design" id="datatablesss" key={i}>
                            <thead>
                              <tr className="headings">
                                {
                                  this.state.tableHead.map((item, index) => <th className="text-center" key={index}>{item}</th>)
                                }
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">1</td>
                                <td className="text-center">{item.marketData.marketId}</td>
                                <td className="text-center">{item.marketData.marketName}</td>
                                <td className="text-center">
                                  {
                                    item.runners.length > 0 &&
                                    item.runners[0].map((tt, index) => {
                                      newteamselectionsIds = tt.selectionId + '||' + newteamselectionsIds;
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
                                  {
                                    //item.marketData.settlementStatus !== undefined ? <i style={{ fontSize: '25px', fontWeight: '400', color: 'red' }}>Settled!</i> :
                                     // new Date(this.state.marketata.marketStartTime).getTime() < new Date().getTime() && this.state.liveodds.length === 0 ?
                                        <form>
                                            <select name="runnerID" value={item.marketData.settledValue} onChange={this.handleMatchSettle} disabled={item.marketData.settlementStatus === "settled"} style={{ borderColor: 'gray', borderRadius: '3px', width: 'auto' }}>
                                              <option value="">Select Winner</option>
                                              {
                                                item.runners[0].length > 0 &&
                                                item.runners[0].map((dat, index) => {
                                                  return (
                                                    <option key={index} value={dat.selectionId + '||' + dat.runnerName + '||' + newteamselectionsIds}>{dat.runnerName}</option>
                                                  )
                                                }
                                                )
                                              }
                                            </select>
                                            <input type="button" value="Settle" onClick={() => this.handleSettlement(this.state.runnerID, item.marketData.marketId, this.state.winnerTeam, this.state.selectionOne, this.state.selectionTwo, this.state.selectionThree, item.marketData.marketName)} className="SettleButton" disabled={item.marketData.settlementStatus === "settled"} style={item.marketData.settlementStatus === "settled" ? { backgroundColor: 'rgb(149 51 92 / 48%)' } : { backgroundColor: '#95335c' }} />
                                          </form>
                                        //: "In-Play"
                                  }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                        )

                    })}

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