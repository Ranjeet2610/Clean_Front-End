import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Utilities from './utilities'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './footer'
import Users from '../Services/users';


class FancyStack extends Component{
  constructor(props){
    super(props);
    this.state = {
      from_date:'',
      to_date:'',
      currentDate:'',
      fancyStakeData:[]
    }

    this.users =new Users();
  }

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentStart,
      to_date:this.state.currentend,
    })
    this.getAllFancyStack(this.state.currentStart,this.state.currentend);
  }

  handleFilter = async () => {
    let fD = await new Date(this.state.from_date).toISOString();
    let tD = await new Date(this.state.to_date).toISOString();
    const obj ={
      startDate:fD,
      endDate: tD
    }
      if(fD<=tD){
        this.users.getAllFancyStack(obj, (data)=>{
        this.setState({
          fancyStakeData:data.data.data
        })
      })
      console.log(fD,'---',tD);
    }
    }

  getAllFancyStack = (Scurr,Ecurr) => {
    let fromDate = new Date(Scurr).toISOString();
    let toDate =  new Date(Ecurr).toISOString();
    const obj ={
      startDate:fromDate,
      endDate: toDate
    }
    this.users.getAllFancyStack(obj, (data)=>{
      this.setState({
        fancyStakeData:data.data.data
      })
    })
  }

  componentDidMount(){
    let infoDetails = JSON.parse(localStorage.getItem('data'));
    if(infoDetails.superAdmin === infoDetails.Admin === infoDetails.Master === false){
      this.props.history.push('/dashboard')
    }
    let currD = new Date().toISOString().substr(0,10);
    //let currT = Utilities.datetime(new Date()).slice(11,16)
    let Scurr = currD+"T00:00:01"
    let Ecurr = currD+"T23:59:59"
    this.getAllFancyStack(Scurr,Ecurr);
    this.setState({
      currentStart:currD+"T00:00:01",
      currentend:currD+"T23:59:59",
      from_date:Scurr,
      to_date:Ecurr,
    })
    console.log(Scurr,Ecurr);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]:[event.target.value]
    })
  }

  render(){
    return (
      <div>
      <Navbar />
      <Sidebar />     
        <div className="container body">
          <div className="main_container" id="sticky">
            <div className="right_col" role="main">
              <div className="col-md-12">
                <div className="title_new_at">Fancy Stack   
                  <div className="pull-right">
                    <button type="button" className="btn_common" id="backbutton" onClick={() => this.props.history.goBack()}>Back</button>
                  </div>
                </div>
              </div>

{
//////////////////////////////// FANCY STACK FORM //////////////////////////////////
}

              <div className="col-md-12 col-sm-12 col-xs-12">
                <div className="clearfix data-background">
                  <input type="hidden" name="ajaxUrl" id="ajaxUrl" defaultValue="report/fancystack" />
                  <form className="form-horizontal form-label-left input_mask" id="formSubmit">
                    <input type="hidden" name="typeRE" id="typeRE" defaultValue />
                    <input type="hidden" name="parentId" id="parentId" defaultValue={145315} /> 		  
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={this.handleChange} name="from_date" value={this.state.from_date} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="From date" autoComplete="off" />
                    </div>
                    <div className="popup_col_2">
                      <input type="datetime-local" onChange={this.handleChange} name="to_date" value={this.state.to_date} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="To date" autoComplete="off" />
                    </div>
                    <div className="block_4 buttonacount">
                      <button type="button" className="blue_button" onClick={this.handleFilter} style={{marginRight:'5px'}} id="submit_form_button">
                        <i className="fa fa-filter"/> Filter
                      </button>
                      <button type="reset" onClick={this.handleClear} className="red_button" style={{marginRight:'5px'}}>
                        <i className="fa fa-eraser"/> Clear
                      </button>
                      <Link to="#" className="blue_button" style={{textDecoration:'none',color:'white'}}>View Match Bets</Link>
                    </div>
                  </form>	
                </div>
              </div>

              <div id="divLoading"/>

{
//////////////////////////////// FANCY STACK TABLE /////////////////////////////////
}

              <div className="col-md-12">
                <div className="custom-scroll appendAjaxTbl">
                  <table className="table table-striped jambo_table bulk_action" id="datatables">
                    <thead>
                      <tr className="headings" style={{background:'#95335c',color:'white'}}>
                        <th className="text-center">S.No.</th>
                        <th className="text-center">Master</th>
                        <th className="text-center">Total Bet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state.fancyStakeData.length > 0 ?
                        this.state.fancyStakeData.map((ele,index)=>
                          <tr>
                            <td className="text-center">{index+1}</td>
                            <td className="text-center">{ele.clientName}</td>
                            <td className="text-center">{ele.stack}</td>
                          </tr>
                          )
                        :<tr>
                        <th colSpan={3} className="text-center">No Data...!</th>
                      </tr>	}
                    </tbody>
                  </table>
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

export default FancyStack;