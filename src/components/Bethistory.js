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
      openSettle:'',
      currentPage:1,
      postsPerPage:10,
      load:false,
      betHistoryTab:["All","Cricket","Tennis","Soccer"],
      betHistoryTableHead:["S.no","Client","Description","Selection","Type","Odds","Stack","Date","P_L","Profit","Liability","BetType","Status","IP","Device","ID"],
      betHistory:[],
      from_date:'',
      to_date:'',
      currentDate:'',
      searchTearm:'',
      color:'lightblue',
      hover:false,
      newResData:[],
      newData:[],
      historyType:'All'
     }
    this.service = new Service();
    this.userDetails = JSON.parse(localStorage.getItem('data'))!=undefined?JSON.parse(localStorage.getItem('data')):'';

  }
  
  componentDidMount() {   
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
    this.getBetData(Scurr,Ecurr);
  }
  
  getBetData = async (Scurr,Ecurr) => {
    let propName = this.props?.location?.state?.betHistory?this.props?.location?.state?.betHistory:undefined
    if(propName===undefined){
      
    if(this.userDetails.superAdmin){
      this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,superAdmin:this.userDetails.userName},'getSuperAdminSectionOpenBetHistory',(data)=>{
        let datafilter = data.filter(e => new Date(Scurr) <= new Date(e.createdDate) && new Date(e.createdDate) <= new Date(Ecurr) )
        // let datafilter = data.filter(ele=>ele.status===this.state.historyType)
        this.setState({
          betHistory:datafilter,
          newResData:data,
          newData:datafilter,
          load:false
        },()=>{
          console.log(this.state.load);
        });      
      });
    }
    else if(this.userDetails.Admin){
      this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,adminName:this.userDetails.userName},'getAdminSectionOpenBetHistory',(data)=>{
        let datafilter = data.filter(e => new Date(Scurr) <= new Date(e.createdDate) && new Date(e.createdDate) <= new Date(Ecurr) )
        // let datafilter = data.filter(ele=>ele.status===this.state.historyType)
        this.setState({
          betHistory:datafilter,
          newResData:data,
          newData:datafilter,
          load:false
        });             
      }); 
    }
    else if(this.userDetails.Master){
      this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,masterName:this.userDetails.userName},'getMasterSectionOpenBetHistory',(data)=>{
        let datafilter = data.filter(e => new Date(Scurr) <= new Date(e.createdDate) && new Date(e.createdDate) <= new Date(Ecurr) )
        // let datafilter = data.filter(ele=>ele.status===this.state.historyType)
        this.setState({
          betHistory:datafilter,
          newResData:data,
          newData:datafilter,
          load:false
        });             
      });
    }
    else{
      this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,userName:this.userDetails.userName},'getUserOpenBetHistory',(data)=>{
        let datafilter = data.filter(e => new Date(Scurr) <= new Date(e.createdDate) && new Date(e.createdDate) <= new Date(Ecurr) )
        // let datafilter = data.filter(ele=>ele.status===this.state.historyType)
        this.setState({
          betHistory:datafilter,
          newResData:data,
          newData:datafilter,
          load:false
        });             
      });
    }
    }
    else{
      this.service.betHistoryAsPerUser({Betstatus:this.state.historyType,userName:propName},'getUserOpenBetHistory',(data)=>{
        let datafilter = data.filter(e => new Date(Scurr) <= new Date(e.createdDate) && new Date(e.createdDate) <= new Date(Ecurr) )
        // let datafilter = data.filter(ele=>ele.status===this.state.historyType)
        this.setState({
          betHistory:datafilter,
          newResData:data,
          newData:datafilter,
          load:false
        });             
      });
    }
  }

//   handleFilter= async () => {
//     let fD = await new Date(this.state.from_date);
//     let tD = await new Date(this.state.to_date);
//     if(fD <= tD){
//       if(this.state.historyType!=="All"){
//         let betHistoryFilter = this.state.newResData.filter(e => fD <= new Date(e.createdDate) && new Date(e.createdDate) <= tD )
//         const updateList = betHistoryFilter.filter(ele => ele.status===this.state.historyType)
//         await this.setState({
//             betHistory:updateList,
//             newData:updateList
//         })
//       }
//       else{
//         let betHistoryFilter = this.state.newResData.filter(e => fD <= new Date(e.createdDate) && new Date(e.createdDate) <= tD )
//         await this.setState({
//             betHistory:betHistoryFilter,
//             newData:betHistoryFilter
//         })
//       }
//     }
//    }

handleFilter= async () => {
  this.setState({
    load:true
  })
  let fD = await new Date(this.state.from_date);
  let tD = await new Date(this.state.to_date);
  if(fD <= tD){
    if(this.state.historyType!=="All"){
      let betHistoryFilter = this.state.newResData.filter(e => fD <= new Date(e.createdDate) && new Date(e.createdDate) <= tD )
      const updateList = betHistoryFilter.filter(ele => ele.status===this.state.historyType)
      await this.setState({
          betHistory:updateList,
          newData:updateList
        })
      }
    else{
      let betHistoryFilter = this.state.newResData.filter(e => fD <= new Date(e.createdDate) && new Date(e.createdDate) <= tD )
      await this.setState({
          betHistory:betHistoryFilter,
          newData:betHistoryFilter
        })
    }
    setTimeout(()=>
      this.setState({
        load:false
      }),2000
    )
  }
   }

  // handleTabFilter = (eventType) => {
  //   let data = [...this.state.newData]
  //   if(eventType!==""){
  //     let betHistoryFilter = data.filter(ele => ele.eventType === eventType )
  //     this.setState({
  //       betHistory:betHistoryFilter
  //     })
  //   }
  //   else{
  //     this.setState({
  //       betHistory:this.state.newResData
  //     })
  //   }
  // }

  handleTabFilter = async (eventType) => {
    await this.setState({
      load:true
    })
    let data = [...this.state.newData]
    if(eventType!==""){
      let betHistoryFilter = data.filter(ele => ele.eventType === eventType )
      this.setState({
        betHistory:betHistoryFilter
      })
    }
    else{
      this.setState({
        betHistory:this.state.newResData
      })
    }
    setTimeout(()=>
      this.setState({
        load:false
      }),2000
    )
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
      [event.target.name]:event.target.value
    })  
  }

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentStart,
      to_date:this.state.currentend,
      searchTearm:"",
      historyType:'All',
      load:true
    })
    this.getBetData(this.state.from_date, this.state.to_date);
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
        {/* { */}
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
                    {/* <div className="popup_col_2">
                      <select className="form-control" name="betStatus">
                        <option value={-1}>Match/Unmatch</option>
                        <option value={1}>Match</option>
                        <option value={0}>Unmatch</option>
                      </select>
                    </div> */}
                    <div className="popup_col_2">
                      <select className="form-control" onChange={this.handleChange}  name="historyType">
                        <option>All</option>
                        <option>open</option>
                        <option>settled</option>
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
                     <li><Link to="#" onClick={()=>this.handleTabFilter('')}>All</Link></li>
                     <li><Link to="#" onClick={()=>this.handleTabFilter(2)}>Tennis</Link></li>
                     <li><Link to="#" onClick={()=>this.handleTabFilter(1)}>Soccer</Link></li>
                     <li><Link to="#" onClick={()=>this.handleTabFilter(4)}>Cricket</Link></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
              <div id="divLoading"/>

{
  //////////////////////// BET HISTORY TABLE /////////////////////////////////////////
}

{
                    this.state.load ?
                      <div className="inRes" style={{height:'100vh', justifyContent:'center', display:'flex',paddingTop:'5rem'}}>
                          <Loader type="Grid" color="#6c1945" height={35} width={35} />
                      </div> :  
                <div className="custom-scroll appendAjaxTbl">
                   <table className="table table-striped jambo_table bulk_action" id="datatables">
                    <thead>
                      <tr className="headings" style={{backgroundColor:'#95335c',color:'white'}}>
                        {
                          this.state.betHistoryTableHead.map((item,index)=><th key={index} className="text-center"><b>{item}</b></th>)
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
                            <td className="text-center">{Utilities.datetime(item.updatedAt)}</td>
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
                      {/* <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.betHistory.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>   */}
                    </tfoot>:
                      null
                     }
                  </table>
                </div>
              }
              </div>
            </div>
          </div>
        </div>
        {/* } */}
      <Footer />
      </div>
    )
}
}
