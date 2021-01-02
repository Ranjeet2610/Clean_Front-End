import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './footer'


class FancyStack extends Component{
  constructor(props){
    super(props);
    this.state = {
      from_date:'',
      to_date:'',
      currentDate:''
    }
  }

  handleClear = () =>{
    this.setState({
      from_date:this.state.currentDate,
      to_date:this.state.currentDate,
    })
  }

  async componentDidMount(){
    let curr = new Date();
    curr.setDate(curr.getDate());
    let date = curr.toISOString().substr(0,10);
    await this.setState({
      currentDate:date,
      from_date:this.state.currentDate,
      to_date:this.state.currentDate,
    })
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
                      <input type="date" onChange={this.handleChange} name="from_date" defaultValue={this.state.currentDate} id="from-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="From date" autoComplete="off" />
                    </div>
                    <div className="popup_col_2">
                      <input type="date" onChange={this.handleChange} name="to_date" defaultValue={this.state.currentDate} id="to-date" className="form-control col-md-7 col-xs-12 has-feedback-left datetimepicker" placeholder="To date" autoComplete="off" />
                    </div>
                    <div className="block_4 buttonacount">
                      <button type="button" className="blue_button" style={{marginRight:'5px'}} id="submit_form_button">
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
                      <tr className="headings">
                        <th className="text-center">S.No.</th>
                        <th className="text-center">Master</th>
                        <th className="text-center">Total Bet</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th colSpan={3} className="text-center">No Data...!</th>
                      </tr>	
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