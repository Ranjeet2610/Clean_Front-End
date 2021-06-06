import React, { Component } from 'react'
import Pagination from './Pagination'
import Loader from 'react-loader-spinner'
import Utilities from './utilities'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Account from '../Services/account';
import Footer from './footer'

export default class Cacstatement extends Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage:1,
      postsPerPage:10,
      load:false,
      tableHead:["S.No","Date","Description","Credit","Debit","Balance"],
      filteredTab:["AllTransaction","FreeChips","Settlement","Profit&Loss","Statement"],
      resdata:'',
      from_date:"",
      to_date:"",
      currentStart:'',
      currentend:'',
      newResData:[]
    };
    this.account= new Account();
}

getAccountStatement = () =>{
  this.setState({
    load:true
  })
  this.account.getuseraccountstatment(this.props.match.params.username, data=>{
    let depositamount= data.data.data.depositTransaction;
    let withdrawamount = data.data.data.withdrawTransaction;
    let allTransaction = [...depositamount,...withdrawamount];
    allTransaction.sort(function(a, b) {
      var dateA = new Date(a.createdDate), 
          dateB = new Date(b.createdDate);
      return dateB - dateA;
    });
    this.setState({
      resdata:allTransaction,
      newResData:allTransaction,
      load:false
    })
  });
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
    }) 
  this.getAccountStatement();
}

convertDatePickerTimeToMySQLTime(str) {
  var month, day, year, hours, minutes, seconds;
  var date = new Date(str),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
  hours = ("0" + date.getHours()).slice(-2);
  minutes = ("0" + date.getMinutes()).slice(-2);
  seconds = ("0" + date.getSeconds()).slice(-2);

  var mySQLDate = [date.getFullYear(), month, day].join("-");
  var mySQLTime = [hours, minutes, seconds].join(":");
  return [mySQLDate, mySQLTime].join(" ");
}

handleChange = (event) =>{
  this.setState({
    [event.target.name]:event.target.value
  })
}

handleClear = () =>{
  this.setState({
    from_date:this.state.currentStart,
    to_date:this.state.currentend,
  })
  this.getAccountStatement();
}

handleFilter = async () => {
  let fD = await new Date(this.state.from_date);
  let tD = await new Date(this.state.to_date);
  if(fD <= tD){
      let dateFilter = this.state.newResData.filter(e => fD <= new Date(e.createdDate) && new Date(e.createdDate) <= tD )
    await this.setState({
      resdata:dateFilter
    })
  }
}

paginate = (pageNumber) => {
  this.setState({
    currentPage:pageNumber
  })
}

render(){
  console.log(this.state.resdata);
  const indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
  const indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
  const currentPosts = this.state.resdata?.slice(indexOfFirstPost, indexOfLastPost);
  let statements; 
  let deposited; 
  let withdraw; 
  let trantype; 
  let dwuserby;
  if(currentPosts.length>0){
    statements = this.state.resdata.map((item,index) => {
      console.log('item are --------------',item)
      if(item.hasOwnProperty('depositedBy')){
        deposited = item.amount>0?item.amount:0;
        trantype = "Received From";
        dwuserby = item.depositedByName;
      }else{
        deposited = 0;
        withdraw = item.amount;
      }
      if(item.hasOwnProperty('withdrawIn')||item.amount<0){
        withdraw = item.amount;
        trantype = "Deposit In";
        dwuserby = item.withdrawInName;
      }else{
        withdraw = 0;
        deposited = item.amount;
      }
      // return (
      //   <tr key={index}>
      //     <td className="text-center">{(this.state.resdata.length+1)-(indexOfFirstPost+index+1)}</td>
      //     <td className="text-center">{this.convertDatePickerTimeToMySQLTime(item.createdDate)} </td>
      //     <td className="text-center">{item.userName} {trantype}  {dwuserby}</td>
      //     <td className="text-center">{deposited.toFixed(2)} </td>
      //     <td className="text-center">{withdraw.toFixed(2)} </td> 					   
      //     <td className="text-center">{item.balance.toFixed(2)} </td>
      //   </tr>
      //   )
      return (
        <tr key={index}>
          <td className="text-center">{(this.state.resdata.length + 1) - (indexOfFirstPost + index + 1)}</td>
          <td className="text-center">{this.convertDatePickerTimeToMySQLTime(item.createdDate)} </td>
          <td className="text-center">{

            item.description ?
            <p>{` ${JSON.parse(item.description.message).name} / ${item.description.bettype}  / ${item.description.marketType}/ ${item.description.marketName}`} </p>
            : item.userName
          }</td>
          <td className="text-center">{deposited.toFixed(2)} </td>
          <td className="text-center">{withdraw.toFixed(2)} </td>
          <td className="text-center">{item.balance.toFixed(2)} </td>
        </tr>
      )
    })
  }
  else{
    statements=<tr><td colSpan={6} className="text-center">No Records Found...</td></tr>
  }

    return (
        <div>
        <Navbar />
        <Sidebar />
        <div className="forModal" /> 
      {
        this.state.load ?
        <div style={{opacity:"0.5", height:'100vh', justifyContent:'center', display:'flex' ,alignItems:'center'}}>
            <Loader type="Grid" color="#6c1945" height={100} width={100} />
        </div> :
        <div className="container body">
          <div className="main_container" id="sticky">
            <div className="right_col" role="main">
              <div className="row">
                <div className="col-md-12">
                  <div className="title_new_at">Account Statement    
                    <div className="pull-right">
                      {
                        ////////////////////////// BACK BUTTTON ////////////////////////////////////////// 
                      }
                      <button className="btn_common" onClick={() => {this.props.history.goBack()}}>Back</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-12"/>
                <div className="col-md-12">
                  <div className="filter_page  data-background">
                    <form id="formSubmit" style={{color: '#000'}}>
                      <input type="hidden" name="compute" defaultValue="fe6602731bf3d65605f0d8f6552a1c9f" />
                      {
                        //////////////////////// FILTERED TAB CHECKBOX  /////////////////////////////////////////
                      }
                      {/* <div className="col-md-12 custom-check">
                        <input type="hidden" name="user_id" id="user_id" defaultValue={145315} />
                        <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="CacStatement" />
                        {
                          this.state.filteredTab.map((item,index)=>
                          <div key={index} className="form-group">
                            <input name="fltrselct" defaultValue={index}  type="radio" id={item} />
                            <label htmlFor={item}><span>{item}</span></label>
                          </div>
                          )
                        }
                      </div> */}
                      <div className="block_2">            
                        <input type="datetime-local" onChange={this.handleChange} name="from_date" id="fdate" value={this.state.from_date} className="form-control" placeholder="From Date" autoComplete="off" />
                      </div>
                      <div className="block_2">            
                        <input type="datetime-local" onChange={this.handleChange} name="to_date" id="tdate" value={this.state.to_date} className="form-control" placeholder="To Date" autoComplete="off" />
                      </div>

                      {
                        ////////////////////// FILTER AND CLEAR BUTTON /////////////////////////////////////////
                      }

                      <div className="block_2 buttonacount">
                        <button type="button" onClick={this.handleFilter} id="submit_form_button" className="blue_button" style={{marginRight:'5px'}} >Filter</button>
                        <button type="reset" className="red_button" onClick={this.handleClear}>Clear</button>
                      </div>
                    </form>
                  </div>
                </div>

                {
                  /////////////////////////////// TABLE OF ACCOUNT STATEMENT //////////////////////////////////
                }

                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading"/>
                  <div className="custom-scroll appendAjaxTbl" id="filterdata">
                    <table className="table table-bordered table-dark table_new_design" id="datatablesss">
                      <thead>
                        <tr style={{backgroundColor:'#95335c',color:'white'}}>
                          {
                            this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {statements}
                      </tbody>
                      <tfoot>
                      {/* <tr>
                        <td colSpan={16}>
                            <Pagination postsPerPage={this.state.postsPerPage} totalPosts={this.state.resdata.length} paginate={(pageNumber) => this.paginate(pageNumber)}/>
                        </td>  
                      </tr>   */}
                    </tfoot>
                    </table>
                  </div>
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