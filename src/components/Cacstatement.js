import React, { Component } from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Account from '../Services/account';
import Footer from './footer'

export default class Cacstatement extends Component {
  constructor(props){
    super(props);
    this.state = {
      tableHead:["S.No.","Date","Description","Credit","Debit","Balance"],
      filteredTab:["AllTransaction","FreeChips","Settlement","Profit&Loss","Statement"],
      resdata:'',
      from_date:"",
      to_date:"",
      currentDate:'',
      newResData:[]
    };
    this.account= new Account();
}

getAccountStatement = () =>{
  this.account.getuseraccountstatment(this.props.match.params.username,data=>{
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
      newResData:allTransaction
    })
  });
}

componentDidMount() {
  this.getAccountStatement();
  let curr = new Date();
  curr.setDate(curr.getDate());
  let date = curr.toISOString().substr(0,10);
  this.setState({
    currentDate:date,
    from_date:this.state.currentDate,
    to_date:this.state.currentDate,
  })
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
    from_date:this.state.currentDate,
    to_date:this.state.currentDate,
  })
  this.getAccountStatement();
}

handleFilter = async () => {
  if(this.state.from_date && this.state.to_date){
  let fD = await new Date(this.state.from_date).getTime()
  let tD = await new Date(this.state.to_date).getTime();
  if(fD <= tD){
    let dateFilter = this.state.newResData.filter(ele => {
      let dataDate = new Date(ele.createdAt).getTime()
        return dataDate>=fD && dataDate<=tD
      })
      this.setState({
        resdata:dateFilter
      })
    }
  }
}

render(){
  let statements; 
  let deposited; 
  let withdraw; 
  let trantype; 
  let dwuserby;
  if(this.state.resdata.length>0){
    statements = this.state.resdata.map((item,index) => {
     if(item.hasOwnProperty('depositedBy')){
        deposited = item.amount;
        trantype = "Received From";
        dwuserby = item.depositedByName;
      }else{
        deposited = 0;
      }
      if(item.hasOwnProperty('withdrawIn')){
        withdraw = item.amount;
        trantype = "Deposit In";
        dwuserby = item.withdrawInName;
      }else{
        withdraw = 0;
      }
      return (
        <tr key={index}>
          <td className="text-center">{index+1}</td>
          <td className="text-center">{this.convertDatePickerTimeToMySQLTime(item.createdDate)} </td>
          <td className="text-center">{item.userName} {trantype}  {dwuserby}</td>
          <td className="text-center">{deposited} </td>
          <td className="text-center">{withdraw} </td> 					   
          <td className="text-center">{item.balance} </td>
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

                      <div className="col-md-12 custom-check">
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
                      </div>
                      <div className="block_2">            
                        <input type="date" onChange={this.handleChange} name="from_date" id="fdate" defaultValue={this.state.currentDate} className="form-control" placeholder="From Date" autoComplete="off" />
                      </div>
                      <div className="block_2">            
                        <input type="date" onChange={this.handleChange} name="to_date" id="tdate" defaultValue={this.state.currentDate} className="form-control" placeholder="To Date" autoComplete="off" />
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
                        <tr>
                          {
                            this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {statements}
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
    )
}
}