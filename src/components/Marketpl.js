import React, { Component } from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Utilities from './utilities'
import Account from '../Services/account';
import Footer from './footer'


export default class Marketpl extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      tableHead:["Date","Market","Hyper","SuperMaster","Total","Amount","M_comm","S_comm","Net_Amount"],
      data:'',
      masterData:'',
      adminData:'',
      ispl:true,
      showbetData:'',
      from_date:'',
      to_date:'',
      newResData:[],
      currentDate:''
    }
    this.account = new Account();
    this.userDetails = JSON.parse(localStorage.getItem('data')) != undefined?JSON.parse(localStorage.getItem('data')):'';

  }

  getMarketplData = () =>{
    if(this.userDetails.superAdmin){
      const obj = {
        userName:this.props.match.params.username?this.props.match.params.username:JSON.parse(localStorage.getItem('data')).userName
      }
      this.account.superAdminProfitAndLoss(obj,data=>{
        this.setState({
          adminData: data.data,
          newResData:data.data
        });
      });
    }
    else if(this.userDetails.Admin){
      const obj = {
        adminName:this.props.match.params.username?this.props.match.params.username:JSON.parse(localStorage.getItem('data')).userName
      }
      this.account.adminProfitAndLoss(obj,data=>{
        this.setState({
          masterData: data.data,
          newResData:data.data
          });
      }); 
    }
    else if(this.userDetails.Master){
      const obj = {
        masterName:this.props.match.params.username?this.props.match.params.username:JSON.parse(localStorage.getItem('data')).userName
      }
      this.account.masterProfitAndLoss(obj,data=>{
        this.setState({
          data: data.data,
          newResData:data.data,
          ispl: false
        })
      }); 
    }
  }

  componentDidMount(){
    this.getMarketplData();
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

  handleFilter = async () => {
    let fD = await new Date(this.state.from_date);
    let tD = await new Date(this.state.to_date);
    if(fD <= tD){
      if(this.userDetails.superAdmin){
        let dateFilter = this.state.newResData.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
        this.setState({
          adminData:dateFilter
        })
      }
      else if(this.userDetails.Admin){
        let dateFilter = this.state.newResData.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
        this.setState({
          masterData:dateFilter
        })
      }
      else{
        let dateFilter = this.state.newResData.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
        this.setState({
          data:dateFilter
        })
      }
    }
  }

  handleChange = (event) =>{
    this.setState({
      [event.target.name]:[event.target.value]
    })
  }

  handleClear = () =>{
    this.setState({
      from_date: this.state.currentStart,
      to_date: this.state.currentend,
    });
    this.getMarketplData();
  }
       
  render() {
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className="forModal" />      
        <div className="container body">
          <div className="main_container" id="sticky">
            <div className="right_col" role="main">
              <div className="col-md-12">
                <div className="title_new_at">
                  <span>Market PL</span>
                  <button style={{float:'right',paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px'}} onClick={()=>{this.props.history.goBack()}}>Back</button>
                </div>
              </div>
            
              <div className="col-md-12 col-sm-12 col-xs-12">

{
//////////////////////////////// MARKET PL FORM /////////////////////////////////////////
}

                <div className="clearfix data-background">
                  <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="marketpl" />
                  <form className="form-horizontal form-label-left input_mask" id="formSubmit"><input type="hidden" name="compute" defaultValue="fe6602731bf3d65605f0d8f6552a1c9f" /> 		  
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={this.handleChange} name="from_date" value={this.state.from_date} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="From date" autoComplete="off" />
                    </div>
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={this.handleChange} name="to_date" value={this.state.to_date} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="To date" autoComplete="off" />
                    </div>
                    <div className="block_2 buttonacount">
                      <button type="button" id="submit_form_button" onClick={this.handleFilter} className="blue_button" style={{marginRight:'5px'}}>
                        <i className="fa fa-filter" /> Filter
                      </button>
                      <button type="reset" onClick={this.handleClear} className="red_button">
                        <i className="fa fa-eraser" /> Clear
                      </button>
                    </div>
                  </form>	
                </div>   
              
                <div>
                  <div id="divLoading"> </div>
      
{
///////////////////////////////// MARKET PL TABLE /////////////////////////////////////////
}

                  <div className="custom-scroll data-background appendAjaxTbl">
                    <table className="table table-striped jambo_table bulk_action" id="Marketdatatable">
                      <thead>				
                        <tr>
                        {
                          this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                        }
                        </tr>
                      </thead>
                      <tbody>
                        {/* {displaydata}	 */}
                        {
                          this.state.data.length>0 ?
                            this.state.data.map((item)=>{
                              return (  
                                <tr>
                                  <td className="text-center">{item.data[0].createdAt}</td>
                                  <td className="text-center">Cricket/{item.data[0].description}/{item.data[0].marketType}/Winner:{item.data[0].selection}</td>
                                  <td className="text-center">{-item.ProfitLoss}</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">{item.ProfitLoss}</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                </tr>
                              );
                            }):
                          this.state.masterData.length>0  ?
                            this.state.masterData.map((item)=>{
                              return (  
                                <tr>
                                  <td className="text-center">{item.data[0].createdAt}</td>
                                  <td className="text-center">Cricket/{item.data[0].description}/{item.data[0].marketType}/Winner:{item.data[0].selection}</td>
                                  <td className="text-center">{-item.ProfitLoss}</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">{item.ProfitLoss}</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                </tr>
                              );
                            }):
                          this.state.adminData.length>0 ?
                            this.state.adminData.map((item)=>{
                                return (  
                                  <tr>
                                    <td className="text-center">{new Date(item.data[0].createdDate).toLocaleString()}</td>
                                    <td className="text-center">Cricket/{item.data[0].description}/{item.data[0].marketType}/Winner:{item.data[0].selection}</td>
                                    <td className="text-center">{-item.ProfitLoss}</td>
                                    <td className="text-center">0.00</td>
                                    <td className="text-center">{item.ProfitLoss}</td>
                                    <td className="text-center">0.00</td>
                                    <td className="text-center">0.00</td>
                                    <td className="text-center">0.00</td>
                                    <td className="text-center">0.00</td>
                                  </tr>
                                );
                              }):
                          <tr>
                            <td colSpan="9" className="text-center">Empty...!</td>
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

