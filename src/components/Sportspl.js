import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Account from '../Services/account';
import Footer from './footer'


export default class Clientpl extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["Cricket","Tennis","Soccer","Fancy","Total Userpl","Live Teenpatti","Casino","Live Game"],
      data:'',
      masterData:'',
      adminData:'',
      ispl:false,
      showbetData:'',
      from_date:'',
      to_date:'',
      currentDate:''
    }
    this.account = new Account();
    this.userDetails = JSON.parse(localStorage.getItem('data')) != undefined ? JSON.parse(localStorage.getItem('data')) : null;
  }

  componentDidMount(){
    if(this.userDetails.superAdmin){
      const obj = {
        userName:this.props.match.params.username?this.props.match.params.username:JSON.parse(localStorage.getItem('data')).userName
      }
      this.account.superAdminUserPL(obj,data=>{
        this.setState({
          adminData: data.data.adminPL,
          ispl: false
        })
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
    let curr = new Date();
    curr.setDate(curr.getDate());
    let date = curr.toISOString().substr(0,10);
    this.setState({
      currentDate:date,
      from_date:this.state.currentDate,
      to_date:this.state.currentDate,
    })   
  }

  masterData = (data) => {
    const obj = {
      masterName:data
    }
    this.account.userPL(obj,data=>{
      this.setState({
        data: data.data,
        ispl: true
      })
    }); 
  }

  adminData = (data) => {
    const obj = {
      adminName:data
    }
    this.account.adminUserPL(obj,data=>{
      this.setState({
        masterData: data.data.masterPL
      })
    }) 
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]:[event.target.value]
    })
  }

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentDate,
      to_date:this.state.currentDate,
    })
  }

  render() {
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
                        <input type="date" onChange={this.handleChange} name="from_date" defaultValue={this.state.currentDate} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="From date" autoComplete="off" />
                      </div>
                      <div className="popup_col_2">
                        <input type="date" onChange={this.handleChange} name="to_date" defaultValue={this.state.currentDate} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="To date" autoComplete="off" />
                      </div>
                      <div className="block_2 buttonacount">
                        <button type="button" id="submit_form_button" style={{marginRight:'5px'}} className="blue_button">
                          <i className="fa fa-filter"/> Filter
                        </button>
                        <button type="reset" className="red_button" onChange={this.handleClear}>
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
                          <tr className="headings">	
                            <th className="text-center">S.No.</th>		
                            {this.state.ispl ? <th className="text-center">Dealer</th> : <th className="text-center">Master</th>}	
                            {
                              this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                            }
                          </tr>				
                        </thead>
                        <tbody>
                        {
                          this.state.data.length>0 ?
                            this.state.data.map((item,index)=>{
                              return ( 
                                <tr>
                                  <td className>{index+1}</td>
                                  <td className>{item.userName}</td>
                                  <td className style={{cursor:'pointer',color:'green'}}>{item.ProfitLoss}({item.ProfitLoss})</td>
                                  <td className>0.00(0)</td>
                                  <td className>0.00(0)</td>
                                  <td className>0.00(0)</td>
                                  <td className>{item.ProfitLoss}({item.ProfitLoss})</td>
                                  <td className>0.00(0)</td>
                                  <td className>0.00(0)</td>
                                  <td className>0.00(0)</td>
                                </tr>
                              )
                            }):
                          this.state.masterData.length>0 ?
                            this.state.masterData.map((item,index)=>{
                              return (  
                                <tr>
                                  <td className>{index}</td>
                                  <td className>
                                    <Link style={{cursor:'pointer'}} onClick={()=>this.masterData(item.master)}>
                                      {item.master}
                                    </Link>
                                  </td>
                                  <td className>0.00({item.profitLoss})</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>{item.profitLoss}</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                </tr>
                              )
                            }):
                          this.state.adminData.length>0 ?
                            this.state.adminData.map((item)=>{
                              return (  
                                <tr>
                                  <td className><a style={{cursor:'pointer'}} onClick={()=>this.adminData(item.admin)}>{item.admin}</a></td>
                                  <td className>{-item.profitLoss}</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>0.00</td>
                                  <td className>{item.profitLoss}</td>
                                </tr>
                              )
                            }):
                          <tr>
                            <td colSpan="10" className="text-center">Empty...!</td>
                          </tr>
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