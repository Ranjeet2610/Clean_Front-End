import React, { Component } from 'react'
import Loader from 'react-loader-spinner'
import Pagination from './Pagination'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Service from '../Services/Service';
import Utilities from './utilities'
import Footer from './footer'
import {Link} from 'react-router-dom'

export default class Bethistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage:1,
      postsPerPage:10,
      load:false,
      betHistoryTab:["All","Cricket","Tennis","Soccer","Teenpatti","Fancy"],
      betHistoryTableHead:["S.no","Client","Description","Selection","Type","Odds","Stack","Date","P_L","Profit","Liability","BetType","Status","IP","Device","ID"],
      betHistory:[],
      from_date:'',
      to_date:'',
      currentDate:'',
      searchTearm:'',
      color:'lightblue',
      hover:false,
      newResData:[],
      historyType:'open'
     }
    this.service = new Service();
    this.userDetails = JSON.parse(localStorage.getItem('data'))!=undefined?JSON.parse(localStorage.getItem('data')):'';

  }

  handleFilter = async () => {
    let fD = await new Date(this.state.from_date);
    let tD = await new Date(this.state.to_date);
    if(fD <= tD){
      let betHistoryFilter = this.state.newResData.filter(e => new Date(fD) <= new Date(e.createdDate) && new Date(e.createdDate) <= new Date(tD) )
      await this.setState({
          betHistory:betHistoryFilter
        })
      }
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]:[event.target.value]
    })  
  }

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentDate,
      to_date:this.state.currentDate,
      searchTearm:""
    }) 
    this.setState({
      load:true
    })
    this.getBetData();
  }

  getBetData = () => {
  if(this.userDetails.superAdmin){
    this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,superAdmin:this.userDetails.userName},'getSuperAdminSectionOpenBetHistory',(data)=>{
      // var i = 0;
      this.setState({
        betHistory:data,
        newResData:data,
        load:false
      });            
    });
   }
   else if(this.userDetails.Admin){
    this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,adminName:this.userDetails.userName},'getAdminSectionOpenBetHistory',(data)=>{
      // var i = 0;
      this.setState({
        betHistory:data,
        newResData:data,
        load:false
      });             
    }); 
   }
   else if(this.userDetails.Master){
    this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,masterName:this.userDetails.userName},'getMasterSectionOpenBetHistory',(data)=>{
      // var i = 0;
      this.setState({
        betHistory:data,
        newResData:data,
        load:false
      });             
    });
   }
   else{
    this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,userName:this.userDetails.userName},'getUserOpenBetHistory',(data)=>{
      var i = 0;
      this.setState({
        betHistory:data,
        newResData:data,
        load:false
      });             
    });
   }
}

componentDidMount() {   
  let currD = new Date().toISOString().substr(0,10);
  let currT = Utilities.datetime(new Date()).slice(11,16)
  let curr = currD+"T"+currT
 this.setState({
  currentDate:curr,
    from_date:curr,
    to_date:curr,
   }) 
   this.setState({
     load:true
   })
   this.getBetData();
}

  paginate = (pageNumber) => {
    this.setState({
      currentPage:pageNumber
    })
  }

  render(){
    let color= this.state.color;
    let device;

    const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
    const currentPosts = this.state.betHistory?.reverse().slice(indexOfFirstPost, indexOfLastPost);
    return (
        <div>
          <Navbar />
          <Sidebar />
          <div className="forModal" />
        {
        this.state.load ?
          <div style={{height:'100vh', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
              <Loader type="Grid" color="#6c1945" height={100} width={100} />
          </div> :
          <div className="container body">
            <div className="main_container" id="sticky">
              <div className="right_col" role="main">
                <div className="col-md-12">
                  <div className="title_new_at">
                  <span>Bet History</span>
                  <button style={{float:'right',paddingLeft:'5px',paddingRight:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px'}} onClick={()=>{this.props.history.goBack()}}>Back</button>
                    <select style={{color: 'black'}} name="postsPerPage" onChange={this.handleChange}>
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                      <option>100</option>
                    </select>
                  </div>
                </div>

              <div className="col-md-12 "></div>

{
  ////////////////// FORM ///////////////////////////////////////////////////////////
}

              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="clearfix data-background">
                  <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="betHistory" />
                  <form  id="formSubmit" className="form-horizontal form-label-left input_mask"><input type="hidden" name="compute" defaultValue="fe6602731bf3d65605f0d8f6552a1c9f" /> 
                    <input type="hidden" name="sportId" id="sportId" defaultValue={5} />
                    <input type="hidden" name="perpage" id="perpage" defaultValue={10} />
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={(e)=>this.handleChange(e,'')} name="from_date" value={this.state.from_date} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left" placeholder="From date" autoComplete="off" />
                    </div>
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={(e)=>this.handleChange(e,'')} name="to_date" value={this.state.to_date} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left" placeholder="To date" autoComplete="off" />
                    </div>
                    <div className="popup_col_2">
                      <select className="form-control" name="betStatus">
                        <option value={-1}>Match/Unmatch</option>
                        <option value={1}>Match</option>
                        <option value={0}>Unmatch</option>
                      </select>
                    </div>
                    <div className="popup_col_2">
                      <select className="form-control" onChange={this.handleChange}  name="historyType">
                        <option value="open">Open</option>
                        <option value="settled">Settled</option>
                      </select>
                    </div>
                    <div className="popup_col_3">
                      <button type="button" style={{marginRight:'5px'}} className="blue_button" onClick={this.handleFilter} id="submit_form_button"><i className="fa fa-filter" /> Filter</button>
                      <button type="reset" className="red_button" onClick={this.handleClear}><i className="fa fa-eraser" /> Clear</button>
                    </div>
                  </form>	  
                </div>
              </div>

{
  ////////////////////////// TABS ////////////////////////////////////////////
}
              
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="tab_bets get-mchlist">
                 <ul id="betsalltab" className="nav nav-pills match-lists">
                     {
                       this.state.betHistoryTab.map((item,index)=><li key={index}><Link to="#">{item}</Link></li>)
                     }
                  </ul>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
              <div id="divLoading"/>

{
  //////////////////////// BET HISTORY TABLE /////////////////////////////////////////
}

                <div className="custom-scroll appendAjaxTbl">
                   <table className="table table-striped jambo_table bulk_action" id="datatables">
                    <thead>
                      <tr className="headings">
                        {
                          this.state.betHistoryTableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                        }
                      </tr>
                    </thead>  
                    <tbody>
                      {
                        currentPosts.length > 0 ?
                        currentPosts.map((item,index) => {  
                          (item.bettype=='Lay') ? (color='#eb8295') : (color='#6ad0f1')
                          if(item.device ==2){
                            device = (<i className="fa fa-mobile" aria-hidden="true"></i>); 
                           }
                           else if(item.device ==3){
                            device = (<i className="fa fa-tablet" aria-hidden="true"></i>); 
                           }
                           else{
                            device = (<i className="fa fa-desktop" aria-hidden="true"></i>); 
                           }
                          return(
                          <tr key={index} style={{backgroundColor:color}}  onMouseOver={(e)=>this.changeBackground(e,item.bettype)} onMouseOut={(e)=>this.changeBackColor(e,item.bettype)}>
                            <td className="text-center">{(this.state.betHistory.length+1)-(indexOfFirstPost+index+1)}</td>
                            <td className="text-center">{item.clientName}</td>
                            <td className="text-center">{JSON.parse(item.description).name}</td>
                            <td className="text-center">{item.selection}</td>
                            <td className="text-center">{item.bettype}</td>
                            <td className="text-center">{item.odds}</td>
                            <td className="text-center">{item.stack}</td>
                            <td className="text-center">{Utilities.datetime(item.createdDate)}</td>
                            <td className="text-center">{item.P_L.toFixed(2)}</td>
                            <td className="text-center">{item.profit?item.profit:0.0}</td>
                            <td className="text-center">{item.liability}</td>
                            <td className="text-center">Match</td>
                            <td className="text-center">{item.status}</td>
                            <td className="text-center">{item.IP}</td>
                            <td className="text-center">{device}</td>
                            <td className="text-center">{item.eventID}</td>
                          </tr>)
                          }):
                          <tr>
                            <td colSpan={16} className="text-center">No Records Found...</td>
                          </tr>
                      }
                    </tbody>    
                    {
                      currentPosts.length > 0 ?
                      <tfoot>
                      <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.betHistory.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
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
        }
      <Footer />
      </div>
    )
}
}
