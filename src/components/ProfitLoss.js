import React, { Component } from "react";
import Pagination from './Pagination';
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Utilities from './utilities'
import Sidebar from "./Sidebar";
import Account from "../Services/account";
import Footer from './footer'
import Loader from 'react-loader-spinner'


export default class ProfitLoss extends Component {

  constructor(props) {
    super(props);
    this.state = {
      load:false,
      currentPage:1,
      postsPerPage:10,
      profitAndLossTableHead:["S.No.","EventName","Market","P_L","Commission","CreatedOn","Action"],
      showBetHistoryTableHead:["S.No.","UserName","Description","selectionName","Type","Odds","Stack","Date","P_L","Profit","Liability","Status","Bet Code"],
      data: [],
      adminData:[],
      masterData:[],
      ispl: false,
      showbetData: '',
      from_date: '',
      to_date: '',
      searchTerm:'',
      currentDate: '',
      color:'lightblue',
      sportid:4
    }
    this.account = new Account();
    this.userDetails = "";
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleFilter = async () => {
    let fD = await new Date(this.state.from_date);
    let tD = await new Date(this.state.to_date);
    if(fD <= tD){
      let  betHistoryFilter = this.state.newResData.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
      let updateList = betHistoryFilter.filter(ele=>ele.eventType===parseInt(this.state.sportid))
      let sortdata = updateList.sort((a,b)=>{
        const adata = new Date(a.data[0].createdDate)
        const bdata = new Date(b.data[0].createdDate)
        return adata - bdata
      })
      await this.setState({
          data:sortdata
        })
      }
  };

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentStart,
      to_date:this.state.currentend,
    })
    this.getprofitlossData(this.state.currentStart,this.state.currentend);
  }

  getprofitlossData = async (Scurr,Ecurr) =>{
    let fD = await new Date(Scurr);
    let tD = await new Date(Ecurr);

    this.userDetails = JSON.parse(localStorage.getItem('data'));
    if(this.props.match.params.username!==undefined&&this.props.match.params.username!=="Fancy"){
      if (this.userDetails.superAdmin) {
        this.account.superAdminProfitAndLoss({ userName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          let datafilter = data.data.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
          this.setState({
            data:datafilter,
            newResData: data.data,
            load:false
          });
        });
      }
      else if (this.userDetails.Admin) {
        this.account.adminProfitAndLoss({ adminName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          let datafilter = data.data.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
          this.setState({
            data: datafilter,
            newResData: data.data,
            load:false
          });
        });
      }
      else if (this.userDetails.Master) {
        this.account.masterProfitAndLoss({ masterName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          let datafilter = data.data.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
          this.setState({
            data: datafilter,
            newResData: data.data,
            load:false
          });
        });
      }
      else {
        this.account.getprofitloss({userName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          let datafilter = data.data.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
          this.setState({
            data: datafilter,
            newResData: data.data,
            load:false
          });
        });
      }
    }
    else{
      if (this.userDetails.superAdmin) {
        this.account.superAdminProfitAndLoss({ userName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          let fancyFilter = data.data.filter(element=>element.data[0].marketType==="Fancy")
          let dataFilter = fancyFilter.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
          this.setState({
            data: dataFilter,
            newResData: data.data,
            load:false
          });
        });
      }
      else if (this.userDetails.Admin) {
        this.account.adminProfitAndLoss({ adminName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          let fancyFilter = data.data.filter(element=>element.data[0].marketType==="Fancy")
          let dataFilter = fancyFilter.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
          this.setState({
            data: dataFilter,
            newResData: data.data,
            load:false
          });
        });
      }
      else if (this.userDetails.Master) {
        this.account.masterProfitAndLoss({ masterName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          let fancyFilter = data.data.filter(element=>element.data[0].marketType==="Fancy")
          let dataFilter = fancyFilter.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
          this.setState({
            data: dataFilter,
            newResData: data.data,
            load:false
          });
        });
      }
      else {
        this.account.getprofitloss({userName: this.props.match.params.username ? this.props.match.params.username : this.userDetails.userName }, data => {
          let fancyFilter = data.data.filter(element=>element.data[0].marketType==="Fancy")
          let dataFilter = fancyFilter.filter(e => fD <= new Date(e.data[0].createdDate) && new Date(e.data[0].createdDate) <= tD )
          this.setState({
            data: dataFilter,
            newResData: data.data,
            load:false
          });
        });
      }
    }
  }
    
    async componentDidMount() {
      let currD = new Date().toISOString().substr(0,10);
      //let currT = Utilities.datetime(new Date()).slice(11,16)
      let Scurr = currD+"T00:00:01"
      let Ecurr = currD+"T23:59:59"
      this.setState({
        currentStart:currD+"T00:00:01",
        currentend:currD+"T23:59:59",
        from_date:Scurr,
        to_date:Ecurr,
        load:true
      }) 
    await this.getprofitlossData(Scurr,Ecurr);
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

  changeBackground = (e,type) =>{
    if(type==='Back'){
      e.target.parentElement.classList.add('blue')
    }
    else{
      e.target.parentElement.classList.add('lightred')
    }
  }

  changeBackColor = (e,type) => {
    if(type==='Back'){
      e.target.parentElement.classList.remove('blue')
    }
    else{
      e.target.parentElement.classList.remove('lightred')
    }
  }

  paginate = (pageNumber) => {
    this.setState({
      currentPage:pageNumber
    })
  }


  render() {
    let color = this.state.color;
    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentdataPosts = this.state.data?.reverse()?.slice(indexOfFirstPost, indexOfLastPost);
    const currentmasterDataPosts = this.state.masterData?.reverse()?.slice(indexOfFirstPost, indexOfLastPost);
    const currentadminDataPosts = this.state.adminData?.reverse()?.slice(indexOfFirstPost, indexOfLastPost);
    let sportType;
    let eventType;
    let mTotal=0;
    let totalPL = 0;
    let totalMC=0;
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
                              if(item.eventType === 4){
                                eventType = "Cricket";
                              }else if(item.eventType === 1){
                                eventType = "Tennis";
                              }else if(item.eventType === 2){
                                eventType = "Soccer";
                              }else{
                                eventType = "Event";
                              }
                              mTotal=mTotal+item.ProfitLoss;
                              let eventName = JSON.parse(item.description);
                              (item.bettype=='Lay') ? (color='#eb8295') : (color='#6ad0f1')
                              return (
                                <tr className="mark-back content_user_table odd" style={{backgroundColor:color}} onMouseOver={(e)=>this.changeBackground(e,item.bettype)} onMouseOut={(e)=>this.changeBackColor(e,item.bettype)} role="row">
                                  <td className="sorting_1">{index+1}</td>
                                  <td className="text-center">{item.clientName}</td>
                                  <td className="text-center">{eventType}&gt;{eventName.name}&gt;{item.marketType}&nbsp;</td>
                                  <td className="text-center">{item.selection}</td>
                                  <td className="text-center">{item.bettype} </td>
                                  <td className="text-center">{item.odds}</td>
                                  <td className="text-center">{item.stack}</td>
                                  <td className="text-center">{new Date(item.createdDate).toLocaleString()}</td>
                                  <td className="text-center">{item.P_L.toFixed(2)}</td>
                                  <td className="text-center">{item.profit.toFixed(2)}</td>
                                  <td className="text-center">{item.liability.toFixed(2)}</td>
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
                    <select name="postsPerPage" onChange={this.handleChange} style={{ color: "black", marginLeft:'2px' }} >
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                    {this.state.data.length>100&&
                      <option>{this.state.data.length}</option>
                    }
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
                        <select className="form-control" name="sportid" onChange={this.handleChange}>
                          <option value={4}>Cricket</option>
                          <option value={2}>Tennis</option>
                          <option value={1}>Soccer</option>
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
                  {
        this.state.load ?
        <div style={{height:'100vh', justifyContent:'center', display:'flex' ,marginTop:'5rem'}}>
            <Loader type="Grid" color="#6c1945" height={100} width={100} />
        </div> :
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
                            if(item.eventType === 4){
                              sportType = "Cricket";
                            }else if(item.eventType === 1){
                              sportType = "Tennis";
                            }else if(item.eventType === 2){
                              sportType = "Soccer";
                            }else{
                              sportType = "Event";
                            }
                            let userPl = parseFloat(item.ProfitLoss);
                            let masterC = parseFloat(item.mCommision);
                            totalMC += masterC;
                            totalPL += userPl;
                            (item.ProfitLoss<0) ? (color='#eb8295') : (color='#6ad0f1')
                              return (
                                <tr style={{backgroundColor:color}}  onMouseOver={(e)=>this.changeBackground(e,item.bettype)} onMouseOut={(e)=>this.changeBackColor(e,item.bettype)}>
                                  <td className="text-center">{index+1}</td>
                                  <td className="text-center">{sportType}/{item.eventName}/Selection:{item.data[0].selection}/Match Odds:{item.marketType}({item.data[0].odds})/Result:{item.data[0].settledValue}</td>
                                  <td className="text-center">{item.marketType.replace(" ","")}</td>
                                  <td className="text-center">{userPl.toFixed(2)}</td>
                                  <td className="text-center">{masterC.toFixed(2)}</td>
                                  <td className="text-center">{new Date(item.data[0].createdDate).toLocaleString().replace(" ","")} </td>
                                  <td className="text-center">
                                    <Link style={{ cursor: "pointer" }} onClick={() => this.showBet(item.data)} >
                                      Show&nbsp;Bet
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
                      {
                      currentdataPosts.length > 0?
                      <tfoot>
                      {/* <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.data.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>   */}
                    </tfoot>:
                      null
                    }
                    </table>
                    
{
  //////////////////////////// 2nd PROFIT LOSS TABLE ////////////////////////////////////////
}

                    <table className="table table-striped jambo_table bulk_action">
                      <thead>
                        <tr style={{backgroundColor:"#95335c",color:'white'}}>
                          <th>(Total P &amp; L ) {totalPL.toFixed(2)}</th>
                          <th>(Total Commition) {totalMC.toFixed(2)}</th>
                        </tr>
                      </thead>
                    </table>
                  </div>
  }
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
