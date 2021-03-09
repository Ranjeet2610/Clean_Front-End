import React, { Component } from "react";
import {Link} from 'react-router-dom'
import Navbar from "./Navbar";
import Utilities from './utilities'
import Account from "../Services/account";
import Footer from "./footer";

export default class Clientpl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead:["Super Master","Master","Total","Amount","M-comm","S-comm","Net-Amount","User PL"],
      data: [],
      masterData: [],
      adminData: [],
      ispl: true,
      showbetData: "",
      from_date: "",
      to_date: "",
      currentDate: "",
      currentStart:"",
      currentend:""
      };
    this.account = new Account();
    this.userDetails = JSON.parse(localStorage.getItem("data")) != undefined ? JSON.parse(localStorage.getItem("data")) : "";
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
  if(this.userDetails.superAdmin === false){
    this.props.history.push('/dashboard')
  }
  await this.getUserPLData();
}

getUserPLData = () => {
  if (this.userDetails.superAdmin) {
    const obj = {
      userName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem("data")).userName,
      startDate:this.state.from_date,
      endDate:this.state.to_date
  }
    this.account.superAdminUserPL(obj,(data) => {
        this.setState({
          adminData: data.data.adminPL.reverse(),
        });
      }
    );
  } 
  else if (this.userDetails.Admin) {
    const obj = {
      adminName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem("data")).userName,
      startDate:this.state.from_date,
      endDate:this.state.to_date
  }
    this.account.adminUserPL(obj,(data) => {
        this.setState({
          masterData: data.data.masterPL.reverse(),
          ispl: false,
        });
      }
    );
  } 
  else if (this.userDetails.Master) {
    const obj = {
      masterName: this.props.match.params.username ? this.props.match.params.username : JSON.parse(localStorage.getItem("data")).userName,
      startDate:this.state.from_date,
      endDate:this.state.to_date
  }
    this.account.userPL(obj,(data) => {
        this.setState({
          data: data.data.reverse(),
          ispl: false,
        })
      }
    );
  }
}

  masterData =  async (data) => {
    const obj = { 
      masterName: data,
      startDate:this.state.from_date,
      endDate:this.state.to_date
    }
    await this.account.userPL(obj,(data) => {
      this.setState({
        data: data.data.reverse(),
        ispl: false,
      })
    });
  }

  adminData =  async (data) =>  {
    const obj = { 
      adminName: data,
      startDate:this.state.from_date,
      endDate:this.state.to_date
    }
    await this.account.adminUserPL(obj,(data) => {
      this.setState({
        masterData: data.data.masterPL.reverse(),
        ispl: false,
      });
    });
  }

  handleFilter = async () => {
    await this.setState({
      masterData:'',
      data:'',
      ispl: true
    });
    await this.getUserPLData();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleClear = async () => {
    await this.setState({
      from_date: this.state.currentStart,
      to_date: this.state.currentend,
      adminData:'',
      masterData:'',
      data:'',
      ispl: true
    });
    await this.getUserPLData();
  };

  render() {
    let cTotal=0;
    let uTotal=0;
    return (
      <div>
        <Navbar />
        <div className="forModal" />
        <div className="container body">
          <div className="main_container" id="sticky" style={{ width: "100%" }}>
            <div className="right_col" role="main">
              <div className="col-md-12">
                <div className="title_new_at"> 
                  <span>Client PL</span>
                  <button style={{float:'right',paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px'}} onClick={()=>{this.props.history.goBack()}}>Back</button>
                </div>
              </div>

{
  //////////////////////////// CLIENT PL FORM ///////////////////////////////////////
}

              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="clearfix data-background">
                  <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="clientpl" />
                  <form className="form-horizontal form-label-left input_mask" id="formSubmit" >
                    <input type="hidden" name="compute" defaultValue="fe6602731bf3d65605f0d8f6552a1c9f" />
                    <input type="hidden" name="user_id" id="user_id" defaultValue={145315} />
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={this.handleChange} name="from_date" value={this.state.from_date} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="From date" autoComplete="off" />
                    </div>
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={this.handleChange} name="to_date" value={this.state.to_date} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="To date" autoComplete="off" />
                    </div>
                    <div className="block_2 buttonacount">
                      <button type="button" id="submit_form_button" onClick={this.handleFilter} className="blue_button" data-attr="submit" style={{ marginRight: "5px" }} >
                        <i className="fa fa-filter" /> Filter
                      </button>
                      <button type="button" className="red_button" onClick={this.handleClear} >
                        <i className="fa fa-eraser" /> Clear
                      </button>
                    </div>
                  </form>
                </div>

                <div>
                  <div id="divLoading"> </div>

{
  /////////////////////////////// CLIENT PL TABLE ///////////////////////////////////
}

                  <div className="custom-scroll data-background appendAjaxTbl">
                    <table className="table table-striped jambo_table bulk_action full-table-clint" id="datatable" >
                      <thead>
                        <tr className="headings" style={{backgroundColor:'#95335c',color:'white'}}>
                          <th className="text-center">Username</th>
                          {this.state.ispl ? <th className="text-center">admin</th> : null}
                          {
                            this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                      {/*Medy555	39.00	0.00	39.00 - But user loss (-39)
                      Roshan2	-585.00	0.00	-585.00 - But user win (585)*/}
                        {
                          this.state.data.length > 0 ?
                            this.state.data.map((item) => {
                              let clientPl = parseFloat(item.fancyProfitLoss)+parseFloat(item.ProfitLoss)+parseFloat(item.mCommision);
                              let userPl = parseFloat(item.fancyProfitLoss)+parseFloat(item.ProfitLoss);
                              cTotal=cTotal+clientPl;
                              uTotal=uTotal+userPl;
                              return (
                                <tr>
                                  <td className="text-center">{item.userName}</td>
                                  <td class={clientPl>0?"text-center color_red":"text-center inplay_txt"}>{clientPl > 0? "-"+ clientPl.toFixed(2) : Math.abs(clientPl).toFixed(2)}</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td class={clientPl>0?"text-center color_red":"text-center inplay_txt"}>{clientPl > 0? "-"+ clientPl.toFixed(2) : Math.abs(clientPl).toFixed(2)}</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td className="text-center" style={{color:'green'}}>{item.Commission}.00</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td class={userPl>0?"text-center inplay_txt":"text-center color_red"}>{userPl.toFixed(2)}</td>
                                </tr>
                              );
                            }):
                          this.state.masterData.length > 0 ?
                            this.state.masterData.map((item) => {
                              let clientPl = parseFloat(item.fancyprofitLoss)+parseFloat(item.profitLoss)+parseFloat(item.mCommision);
                              let userPl = parseFloat(item.fancyprofitLoss)+parseFloat(item.profitLoss);
                              cTotal=cTotal+clientPl;
                              uTotal=uTotal+userPl;
                              return (
                                <tr>
                                  <td className="text-center">
                                    <Link style={{ cursor: "pointer" }} onClick={() => this.masterData(item.master)} >
                                      {item.master}
                                    </Link>
                                  </td>
                                  <td class={clientPl>0?"text-center color_red":"text-center inplay_txt"}>{clientPl > 0? "-"+ clientPl.toFixed(2) : Math.abs(clientPl).toFixed(2)}</td>
                                  <td className="text-center">0.00</td>
                                  <td class={clientPl>0?"text-center color_red":"text-center inplay_txt"}>{clientPl > 0? "-"+ clientPl.toFixed(2) : Math.abs(clientPl).toFixed(2)}</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td class={userPl>0?"text-center inplay_txt":"text-center color_red"}>{userPl.toFixed(2)}</td>
                                </tr>
                              );
                            }):
                          this.state.adminData.length > 0 ?
                            this.state.adminData.map((item) => {
                              let clientPl = parseFloat(item.fancyprofitLoss)+parseFloat(item.profitLoss)+parseFloat(item.mCommision);
                              let userPl = parseFloat(item.fancyprofitLoss)+parseFloat(item.profitLoss);
                              cTotal=cTotal+clientPl;
                              uTotal=uTotal+userPl;
                              return (
                                <tr>
                                  <td className="text-center">
                                    <Link style={{ cursor: "pointer" }} onClick={() => this.adminData(item.admin)} >
                                      {item.admin}
                                    </Link>
                                  </td>
                                  <td class={clientPl>0?"text-center color_red":"text-center inplay_txt"}>{clientPl > 0? "-"+ clientPl.toFixed(2) : Math.abs(clientPl).toFixed(2)}</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td class={clientPl>0?"text-center color_red":"text-center inplay_txt"}>{clientPl > 0? "-"+ clientPl.toFixed(2) : Math.abs(clientPl).toFixed(2)}</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td className="text-center" style={{color:'green'}}>0.00</td>
                                  <td class={userPl>0?"text-center inplay_txt":"text-center color_red"}>{userPl.toFixed(2)}</td>
                                </tr>
                              );
                            }):
                          <tr>
                            <td colSpan="10" className="text-center">No data available in table!</td>
                          </tr>
                         }
                         {
                           this.state.data.length > 0 ?
                            <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                            <td className="text-center">Total</td>
                            <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal > 0? "-"+ cTotal.toFixed(2) : Math.abs(cTotal).toFixed(2)}</td>
                            <td className="text-center" style={{color:'green'}}>0.00</td>
                            <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal > 0? "-"+ cTotal.toFixed(2) : Math.abs(cTotal).toFixed(2)}</td>
                            <td className="text-center" style={{color:'green'}}>0.00</td>
                            <td className="text-center" style={{color:'green'}}>0.00</td>
                            <td className="text-center" style={{color:'green'}}>0.00</td>
                            <td className="text-center" style={{color:'green'}}>0.00</td>
                            <td class={uTotal>0?"text-center inplay_txt":"text-center color_red"}>{uTotal.toFixed(2)}</td>
                          </tr>:
                          this.state.masterData.length > 0 ?
                          <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                          <td className="text-center">Total</td>
                          <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal > 0? "-"+ cTotal.toFixed(2) : Math.abs(cTotal).toFixed(2)}</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal > 0? "-"+ cTotal.toFixed(2) : Math.abs(cTotal).toFixed(2)}</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td class={uTotal>0?"text-center inplay_txt":"text-center color_red"}>{uTotal.toFixed(2)}</td>
                        </tr>:
                          this.state.adminData.length > 0 ?
                          <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                          <td className="text-center">Total</td>
                          <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal > 0? "-"+ cTotal.toFixed(2) : Math.abs(cTotal).toFixed(2)}</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal > 0? "-"+ cTotal.toFixed(2) : Math.abs(cTotal).toFixed(2)}</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td className="text-center" style={{color:'green'}}>0.00</td>
                          <td class={uTotal>0?"text-center inplay_txt":"text-center color_red"}>{uTotal.toFixed(2)}</td>
                        </tr>:null
                         }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
