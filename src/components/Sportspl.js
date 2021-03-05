import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Utilities from './utilities'
import Navbar from './Navbar';
import Account from '../Services/account';
import Footer from './footer'


export default class Clientpl extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["Cricket","Tennis","Soccer","Fancy","Teenpatti","Total Userpl"],
      data:'',
      masterData:'',
      adminData:'',
      ispl:true,
      uspl:false,
      showbetData:'',
      from_date:'',
      to_date:'',
      currentDate: "",
      currentStart:"",
      currentend:""
    }
    this.account = new Account();
    this.userDetails = JSON.parse(localStorage.getItem('data')) != undefined ? JSON.parse(localStorage.getItem('data')) : null;
  }

  getSportsplData = (Scurr,Ecurr) => {
    if(this.userDetails.superAdmin){
      const obj ={
        startDate:"2021-01-02T08:37:21.702Z",
        endDate: "2021-02-28T08:45:21.702Z"
    }
      this.account.superAdminUserPL(obj,data=>{
        this.setState({
          adminData: data.data.adminPL,
          ispl: false
        })
        console.log(data.data);
      })
    }
    else if(this.userDetails.Admin){
      const obj = {
        adminName:this.props.match.params.username?this.props.match.params.username:JSON.parse(localStorage.getItem('data')).userName
      }
      this.account.adminUserPL(obj,data=>{
        this.setState({
          masterData: data.data.masterPL,
          ispl: false
        })
      }); 
    }
    else if(this.userDetails.Master){
      const obj = {
        masterName:this.props.match.params.username?this.props.match.params.username:JSON.parse(localStorage.getItem('data')).userName
      }
      this.account.userPL(obj,data=>{
        this.setState({
          data: data.data
        });
      }); 
    }
  }

  componentDidMount(){
    if(this.userDetails.superAdmin === false){
      this.props.history.push('/dashboard')
    }
    let currD = new Date().toISOString().substr(0,10);
    //let currT = Utilities.datetime(new Date()).slice(11,16)
    let Scurr = currD+"T00:00:01"
    let Ecurr = currD+"T23:59:59"
    this.getSportsplData(Scurr,Ecurr);
    this.setState({
      currentStart:currD+"T00:00:01",
      currentend:currD+"T23:59:59",
      from_date:Scurr,
      to_date:Ecurr,
    }) 
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
            adminData: data.data.adminPL,
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
            masterData: data.data.masterPL,
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
            data: data.data,
            ispl: false,
            uspl: false
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
        data: data.data,
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
        masterData: data.data.masterPL,
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
    let tTotal=0;
    let sTotal=0;
    let fTotal=0;
    let subTotal=0;
    let finalTotal=0;
    return (
          <div>
            <Navbar />
          <div className="forModal" />      
          <div className="container body">
            <div className="main_container" id="sticky" style={{width:'100%'}}>
              <div className="right_col" role="main">
                <div className="col-md-12">
                  <div className="title_new_at">  	
                    <span>Sports PL</span>
                    <button style={{float:'right',paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px'}} onClick={()=>{this.props.history.goBack()}}>Back</button>			
                  </div>
                </div>

    {
      ////////////////////////////// SPORTS PL FORM //////////////////////////////////////
    }

                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div className="clearfix data-background">
                    <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="sportpl" />
                    <form className="form-horizontal form-label-left input_mask" id="formSubmit">
                      <input type="hidden" name="user_id" id="user_id" />
                      <div className="popup_col_2">
                        <input type="datetime-local" onChange={this.handleChange} name="from_date" value={this.state.from_date} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="From date" autoComplete="off" />
                      </div>
                      <div className="popup_col_2">
                        <input type="datetime-local" onChange={this.handleChange} name="to_date" value={this.state.to_date} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="To date" autoComplete="off" />
                      </div>
                      <div className="block_2 buttonacount">
                        <button type="button" id="submit_form_button" onClick={this.handleFilter} style={{marginRight:'5px'}} className="blue_button">
                          <i className="fa fa-filter"/> Filter
                        </button>
                        <button type="button" className="red_button" onChange={this.handleClear}>
                          <i className="fa fa-eraser"/>Clear
                        </button>
                      </div>
                    </form>
                  </div> 

                  <div>
                    <div id="divLoading"/>

    {
      ////////////////////////////// SPORTS PL TABLE ///////////////////////////////////////////
    }

                    <div className="custom-scroll data-background appendAjaxTbl">
                      <table className="table table-striped jambo_table bulk_action full-table-clint" id="datatable">
                        <thead>	
                          <tr className="headings" style={{backgroundColor:'#95335c',color:'white'}}>	
                            <th className="text-center">S.No.</th>
                            <th className="text-center"></th>
                            {/*this.state.ispl ? <th className="text-center">S Master</th> : <th className="text-center">Master</th>*/}	
                            {
                              this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                            }
                          </tr>				
                        </thead>
                        <tbody>
                        {
                          this.state.data.length>0 ?
                            this.state.data.map((item,index)=>{
                            let userPl = (parseFloat(item.fancyProfitLoss)+parseFloat(item.ProfitLoss));
                            cTotal=cTotal+item.cricketProfit;
                            tTotal=tTotal+item.tennisProfit;
                            sTotal=sTotal+item.soccerProfit;
                            fTotal=fTotal+item.fancyProfitLoss;
                            subTotal=subTotal+userPl;
                            return ( 
                                <tr>
                                  <td className="text-center">{index+1}</td>
                                  <td className="text-center">{item.userName}</td>
                                  <td class={item.cricketProfit>0?"text-center color_red":"text-center inplay_txt"}>{item.cricketProfit>0?"-"+item.cricketProfit:-parseFloat(item.cricketProfit)}</td>
                                  <td class={item.tennisProfit>0?"text-center color_red":"text-center inplay_txt"}>{item.tennisProfit>0?"-"+item.tennisProfit:-parseFloat(item.tennisProfit)}</td>
                                  <td class={item.soccerProfit>0?"text-center color_red":"text-center inplay_txt"}>{item.soccerProfit>0?"-"+item.soccerProfit:-parseFloat(item.soccerProfit)}</td>
                                  <td class={item.fancyProfitLoss>0?"text-center color_red":"text-center inplay_txt"}>{item.fancyProfitLoss>0?"-"+item.fancyProfitLoss:-parseFloat(item.fancyProfitLoss)}</td>
                                  <td className="text-center inplay_txt">0.00</td>
                                  <td class={userPl>0?"text-center inplay_txt":"text-center color_red"}>{userPl}</td>
                                </tr>
                              )
                            }):
                          this.state.masterData.length>0 ?
                            this.state.masterData.map((item,index)=>{
                              let userPl = (parseFloat(item.fancyprofitLoss)+parseFloat(item.profitLoss)+parseFloat(item.mCommision));
                              cTotal=cTotal+item.cricketPL;
                              tTotal=tTotal+item.tennisPL;
                              sTotal=sTotal+item.soccerPL;
                              fTotal=fTotal+item.fancyprofitLoss;
                              subTotal=subTotal+userPl;
                              return (  
                                <tr>
                                  <td className="text-center">{index+1}</td>
                                  <td className="text-center">
                                    <Link style={{cursor:'pointer'}} onClick={()=>this.masterData(item.master)}>
                                      {item.master}
                                    </Link>
                                  </td>
                                  <td class={item.cricketPL>0?"text-center color_red":"text-center inplay_txt"}>{item.cricketPL>0?"-"+item.cricketPL:-parseFloat(item.cricketPL)}</td>
                                  <td class={item.tennisPL>0?"text-center color_red":"text-center inplay_txt"}>{item.tennisPL>0?"-"+item.tennisPL:-parseFloat(item.tennisPL)}</td>
                                  <td class={item.soccerPL>0?"text-center color_red":"text-center inplay_txt"}>{item.soccerPL>0?"-"+item.soccerPL:-parseFloat(item.soccerPL)}</td>
                                  <td class={item.fancyprofitLoss>0?"text-center color_red":"text-center inplay_txt"}>{item.fancyprofitLoss>0?"-"+item.fancyprofitLoss:-parseFloat(item.fancyprofitLoss)}</td>
                                  <td className="text-center inplay_txt">0.00</td>
                                  <td class={userPl>0?"text-center inplay_txt":"text-center color_red"}>{userPl}</td>
                                </tr>
                              )
                            }):
                          this.state.adminData.length>0 ?
                            this.state.adminData.map((item,index)=>{
                              let userPl = (parseFloat(item.fancyprofitLoss)+parseFloat(item.profitLoss)+parseFloat(item.mCommision));
                              cTotal=cTotal+item.cricketPL;
                              tTotal=tTotal+item.tennisPL;
                              sTotal=sTotal+item.soccerPL;
                              fTotal=fTotal+item.fancyprofitLoss;
                              subTotal=subTotal+userPl;
                              return (  
                                <tr>
                                  <td className="text-center">{index+1}</td>
                                  <td className="text-center"><a style={{cursor:'pointer'}} onClick={()=>this.adminData(item.admin)}>{item.admin}</a></td>
                                  <td class={item.cricketPL>0?"text-center color_red":"text-center inplay_txt"}>{item.cricketPL>0?"-"+item.cricketPL:-parseFloat(item.cricketPL)}</td>
                                  <td class={item.tennisPL>0?"text-center color_red":"text-center inplay_txt"}>{item.tennisPL>0?"-"+item.tennisPL:-parseFloat(item.tennisPL)}</td>
                                  <td class={item.soccerPL>0?"text-center color_red":"text-center inplay_txt"}>{item.soccerPL>0?"-"+item.soccerPL:-parseFloat(item.soccerPL)}</td>
                                  <td class={item.fancyprofitLoss>0?"text-center color_red":"text-center inplay_txt"}>{item.fancyprofitLoss>0?"-"+item.fancyprofitLoss:-parseFloat(item.fancyprofitLoss)}</td>
                                  <td className="text-center inplay_txt">0.00</td>
                                  <td class={userPl>0?"text-center inplay_txt":"text-center color_red"}>{userPl}</td>
                                </tr>
                              )
                            }):
                          <tr>
                            <td colSpan="10" className="text-center">No data available in table!</td>
                          </tr>
                        }
                        {
                           this.state.data.length > 0 ?
                            <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                            <td colSpan="2" className="text-center">Total</td>
                            <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal>0?"-"+cTotal:-parseFloat(cTotal)}</td>
                            <td class={tTotal>0?"text-center color_red":"text-center inplay_txt"}>{tTotal>0?"-"+tTotal:-parseFloat(tTotal)}</td>
                            <td class={sTotal>0?"text-center color_red":"text-center inplay_txt"}>{sTotal>0?"-"+sTotal:-parseFloat(sTotal)}</td>
                            <td class={fTotal>0?"text-center color_red":"text-center inplay_txt"}>{fTotal>0?"-"+cTotal:-parseFloat(fTotal)}</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td class={subTotal>0?"text-center inplay_txt":"text-center color_red"}>{subTotal}</td>
                          </tr>:
                          this.state.masterData.length > 0 ?
                          <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                          <td colSpan="2" className="text-center">Total</td>
                          <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal>0?"-"+cTotal:-parseFloat(cTotal)}</td>
                          <td class={tTotal>0?"text-center color_red":"text-center inplay_txt"}>{tTotal>0?"-"+tTotal:-parseFloat(tTotal)}</td>
                          <td class={sTotal>0?"text-center color_red":"text-center inplay_txt"}>{sTotal>0?"-"+sTotal:-parseFloat(sTotal)}</td>
                          <td class={fTotal>0?"text-center color_red":"text-center inplay_txt"}>{fTotal>0?"-"+cTotal:-parseFloat(fTotal)}</td>
                          <td className="text-center inplay_txt">0.00</td>
                          <td class={subTotal>0?"text-center inplay_txt":"text-center color_red"}>{subTotal}</td>
                        </tr>                          :
                          this.state.adminData.length > 0 ?
                          <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                          <td colSpan="2" className="text-center">Total</td>
                          <td class={cTotal>0?"text-center color_red":"text-center inplay_txt"}>{cTotal>0?"-"+cTotal:-parseFloat(cTotal)}</td>
                          <td class={tTotal>0?"text-center color_red":"text-center inplay_txt"}>{tTotal>0?"-"+tTotal:-parseFloat(tTotal)}</td>
                          <td class={sTotal>0?"text-center color_red":"text-center inplay_txt"}>{sTotal>0?"-"+sTotal:-parseFloat(sTotal)}</td>
                          <td class={fTotal>0?"text-center color_red":"text-center inplay_txt"}>{fTotal>0?"-"+cTotal:-parseFloat(fTotal)}</td>
                          <td className="text-center inplay_txt">0.00</td>
                          <td class={subTotal>0?"text-center inplay_txt":"text-center color_red"}>{subTotal}</td>
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
          <Footer/>
        </div>
      )
    }
  }