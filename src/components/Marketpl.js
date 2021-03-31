import React, { Component } from 'react'
import Pagination from './Pagination'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Utilities from './utilities'
import Account from '../Services/account';
import Footer from './footer'


export default class Marketpl extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      currentPage:1,
      postsPerPage:10,
      tableHead:["Date","Market","Admin","SuperMaster","Total","Amount","M_comm","S_comm","Net_Amount"],
      data:[],
      masterData:[],
      adminData:[],
      ispl:true,
      showbetData:'',
      from_date:'',
      to_date:'',
      newResData:[],
      currentDate:'',
      currentStart:"",
      currentend:""
    }
    this.account = new Account();
    this.userDetails = JSON.parse(localStorage.getItem('data')) != undefined?JSON.parse(localStorage.getItem('data')):'';

  }

  getMarketplData = () =>   {
    if(this.userDetails.superAdmin === false){
      this.props.history.push('/dashboard')
    }
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
    this.getMarketplData();
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

  paginate = (pageNumber) => {
    this.setState({
      currentPage:pageNumber
    })
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
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentdataPosts = this.state.data?.reverse().slice(indexOfFirstPost, indexOfLastPost);
    const currentmasterDataPosts = this.state.masterData?.reverse().slice(indexOfFirstPost, indexOfLastPost);
    const currentadminDataPosts = this.state.adminData?.reverse().slice(indexOfFirstPost, indexOfLastPost);
    let sportType;
    let mTotal=0;
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
                        <tr style={{backgroundColor:'#95335c',color:'white'}}>
                        {
                          this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                        }
                        </tr>
                      </thead>
                      <tbody>
                        {/* {displaydata}	 */}
                        {
                          currentdataPosts.length>0 ?
                            currentdataPosts.map((item)=>{
                              if(item.data[0].eventType === 4){
                                sportType = "Cricket";
                              }else if(item.data[0].eventType === 1){
                                sportType = "Tennis";
                              }else if(item.data[0].eventType === 2){
                                sportType = "Soccer";
                              }else{
                                sportType = "Event";
                              }
                              let eventName = JSON.parse(item.data[0].description);
                              //item.data[0].marketType=match odds //Fancy
                              let userPl;
                              if(item.ProfitLoss>0 && item.data[0].marketType=="match odds"){
                                userPl = (parseFloat(item.ProfitLoss)-(parseFloat(item.ProfitLoss)*item.Commission/100));
                              }else{
                                userPl = parseFloat(item.ProfitLoss);
                              }
                              mTotal=mTotal+userPl;
                              return (
                                <tr>
                                  <td className="text-center">{item.data[0].createdAt}</td>
                                  <td className="text-center">{sportType}/{eventName.name}/Selection:{item.data[0].selection}/Match Odds:{item.data[0].marketType}({item.data[0].odds})/Result:{item.data[0].settledValue}</td>
                                  {/*<td class={item.ProfitLoss>0?"text-center inplay_txt":"text-center color_red"}>{item.ProfitLoss}</td>*/}
                                  <td class={userPl>0?"text-center color_red":"text-center inplay_txt"}>{userPl>0?"-"+userPl.toFixed(2):Math.abs(userPl).toFixed(2)}</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                </tr>
                              );
                            }):
                          currentmasterDataPosts.length>0  ?
                            currentmasterDataPosts.map((item)=>{
                              if(item.data[0].eventType === 4){
                                sportType = "Cricket";
                              }else if(item.data[0].eventType === 1){
                                sportType = "Tennis";
                              }else if(item.data[0].eventType === 2){
                                sportType = "Soccer";
                              }else{
                                sportType = "Event";
                              }
                              let eventName = JSON.parse(item.data[0].description);
                              //item.data[0].marketType=match odds //Fancy
                              let userPl;
                              if(item.ProfitLoss>0 && item.data[0].marketType=="match odds"){
                                userPl = (parseFloat(item.ProfitLoss)-(parseFloat(item.ProfitLoss)*item.Commission/100));
                              }else{
                                userPl = parseFloat(item.ProfitLoss);
                              }
                              mTotal=mTotal+userPl;
                              return (
                                <tr>
                                  <td className="text-center">{item.data[0].createdAt}</td>
                                  <td className="text-center">{sportType}/{eventName.name}/Selection:{item.data[0].selection}/Match Odds:{item.data[0].marketType}({item.data[0].odds})/Result:{item.data[0].settledValue}</td>
                                  {/*<td class={item.ProfitLoss>0?"text-center inplay_txt":"text-center color_red"}>{item.ProfitLoss}</td>*/}
                                  <td class={userPl>0?"text-center color_red":"text-center inplay_txt"}>{userPl>0?"-"+userPl.toFixed(2):Math.abs(userPl).toFixed(2)}</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                  <td className="text-center">0.00</td>
                                </tr>
                              );
                            }):
                          currentadminDataPosts.length>0 ?
                            currentadminDataPosts.map((item)=>{
                                if(item.data[0].eventType === 4){
                                  sportType = "Cricket";
                                }else if(item.data[0].eventType === 1){
                                  sportType = "Tennis";
                                }else if(item.data[0].eventType === 2){
                                  sportType = "Soccer";
                                }else{
                                  sportType = "Event";
                                }
                                let eventName = JSON.parse(item.data[0].description);
                                //item.data[0].marketType=match odds //Fancy
                                let userPl;
                                if(item.ProfitLoss>0 && item.data[0].marketType=="match odds"){
                                  userPl = (parseFloat(item.ProfitLoss)-(parseFloat(item.ProfitLoss)*item.Commission/100));
                                }else{
                                  userPl = parseFloat(item.ProfitLoss);
                                }
                                mTotal=mTotal+userPl;
                                return (  
                                  <tr>
                                    <td className="text-center">{new Date(item.data[0].createdDate).toLocaleString()}</td>
                                    <td className="text-center">{sportType}/{eventName.name}/Selection:{item.data[0].selection}/Match Odds:{item.data[0].marketType}({item.data[0].odds})/Result:{item.data[0].settledValue}</td>
                                    {/*<td class={item.ProfitLoss>0?"text-center inplay_txt":"text-center color_red"}>{item.ProfitLoss}</td>*/}
                                    <td class={userPl>0?"text-center color_red":"text-center inplay_txt"}>{userPl>0?"-"+userPl.toFixed(2):Math.abs(userPl).toFixed(2)}</td>
                                    <td className="text-center inplay_txt">0.00</td>
                                    <td className="text-center inplay_txt">0.00</td>
                                    <td className="text-center inplay_txt">0.00</td>
                                    <td className="text-center inplay_txt">0.00</td>
                                    <td className="text-center inplay_txt">0.00</td>
                                    <td className="text-center inplay_txt">0.00</td>
                                  </tr>
                                );
                              }):
                          <tr>
                            <td colSpan="9" className="text-center">No data available in table!</td>
                          </tr>
                        }
                        {
                           this.state.data.length > 0 ?
                            <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                            <td colSpan="2" className="text-center">Total</td>
                            <td class={mTotal>0?"text-center color_red":"text-center inplay_txt"}>{mTotal>0?"-"+mTotal.toFixed(2):Math.abs(mTotal).toFixed(2)}</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                          </tr>:
                          this.state.masterData.length > 0 ?
                          <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                            <td colSpan="2" className="text-center">Total</td>
                            <td class={mTotal>0?"text-center color_red":"text-center inplay_txt"}>{mTotal>0?"-"+mTotal.toFixed(2):Math.abs(mTotal).toFixed(2)}</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                          </tr>:
                            this.state.adminData.length > 0 ?
                            <tr style={{backgroundColor:'rgb(232 190 208)',fontWeight:'bold'}}>
                            <td colSpan="2" className="text-center">Total</td>
                            <td class={mTotal>0?"text-center color_red":"text-center inplay_txt"}>{mTotal>0?"-"+mTotal.toFixed(2):Math.abs(mTotal).toFixed(2)}</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                            <td className="text-center inplay_txt">0.00</td>
                        </tr>:null
                         }
                      </tbody>
                      {
                      currentdataPosts.length > 0?
                      <tfoot>
                      {/* <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.data.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>   */}
                    </tfoot>:
                      currentmasterDataPosts.length > 0?
                      <tfoot>
                      {/* <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.masterData.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>   */}
                    </tfoot>:
                      currentadminDataPosts.length > 0?
                      <tfoot>
                      {/* <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.adminData.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>   */}
                    </tfoot>:
                      null
                    }
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

