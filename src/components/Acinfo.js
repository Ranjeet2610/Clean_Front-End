import React, { Component } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./footer";
import Account from "../Services/account";
export default class Acinfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHead:["Chips","Free Chips","Liability","Wallet","Up","Down"],
      data: "",
      userDetails: "",
      upsDownDetails: "",
    };
    this.account = new Account();
  }

  componentDidMount() {
    this.setState({
      userDetails: JSON.parse(localStorage.getItem("data")),
    });
    if (JSON.parse(localStorage.getItem("data")).superAdmin) {
      const obj={
        userName: JSON.parse(localStorage.getItem("data")).userName 
      }
      this.account.superAdminUpDown(obj,(data) => {
          this.setState({
            upsDownDetails: data.data,
          });
        }
      );
    }
    else if (JSON.parse(localStorage.getItem("data")).Admin) {
      const obj={
        adminName: JSON.parse(localStorage.getItem("data")).userName 
      }
      this.account.adminUpDown(obj,(data) => {
          this.setState({
            upsDownDetails: data.data,
          });
        }
      );
    }
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
              <div className="row">
                <div className="col-md-12">
                  <div className="title_new_at"> 
                    <span>Account Info</span>
                    {
                      ////////////////////// BACK BUTTON ////////////////////////////////
                    }
                    <button style={{float:'right', paddingRight:'5px',paddingLeft:'5px', backgroundColor:'#6c1945', border:'none', borderRadius:'3px'}} onClick={()=> {this.props.history.goBack()}}>Back</button>
                  </div>
                </div>
                <div className="col-md-12"></div>
                <div className="col-md-12 col-sm-12 col-xs-12">
                  <div id="divLoading"> </div>
                  <div className="table-scroll">

                    {
                      /////////////////// TABLE OF ACCOUNT INFO /////////////////////////////////
                    }

                    <table className="table table-striped jambo_table bulk_action" id=" " >
                      <thead>
                        <tr className="headings">
                          {
                            this.state.tableHead.map((item,index)=><th key={index} className="text-center">{item}</th>)
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (this.state.userDetails.Admin || this.state.userDetails.superAdmin) ?
                          <tr>
                            <td className="text-center">{this.state.userDetails.profitLossChips}</td>
                            <td className="text-center">{this.state.userDetails.freeChips}</td>
                            <td className="text-center">{this.state.userDetails.down}</td>
                            <td className="text-center">{this.state.userDetails.walletBalance}</td>
                            <td className="text-center">{this.state.upsDownDetails.up} </td>
                            <td className="text-center">{this.state.upsDownDetails.down} </td>
                          </tr>:
                          <tr>
                          <td className="text-center">{this.state.userDetails.profitLossChips}</td>
                          <td className="text-center">{this.state.userDetails.freeChips}</td>
                          <td className="text-center">{this.state.userDetails.exposure}</td>
                          <td className="text-center">{this.state.userDetails.walletBalance}</td>
                          <td className="text-center">0.00</td>
                          <td className="text-center">0.00</td>
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
        <Footer />
      </div>
    );
  }
}
