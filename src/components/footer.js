import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import  Inplay from '../images/inplay.png';
import  editstake from '../images/edit-stake.png';
import  bethistory from '../images/history.png';
import  logout from '../images/logout.png';
import  home from '../images/home.png';
// import  mainLogo from '../betfun-logo.png';

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chipName:["500","2000","5000","25000","50000","100000"],
      chipStake:["500","2000","5000","25000","50000"],
    }
  }
  logout(){
		localStorage.clear();
		window.location.href ='/';
  }
  ModalEditStake = () => {
    document.getElementById('ModalEditStake').classList.add("in");
    document.getElementById('ModalEditStake').style.display = 'block';
  }
  closeModalEditStake=()=>{
    document.getElementById('ModalEditStake').style.display = 'none';
    document.getElementById('ModalEditStake').classList.remove("in");
  }
  handleEditStake=(event)=> {
    this.setState({
      [event.target.name]:event.target.value
    })
  }
  handleSubmit = () => {
    let userId = this.userDetails.id
    const obj = {id:userId}
    if(this.state.ChipName1!==""){
      obj.chipName1=this.state.ChipName1
    }
    if(this.state.ChipName2!==""){
      obj.chipName2=this.state.ChipName2
    }
    if(this.state.ChipName3!==""){
      obj.chipName3=this.state.ChipName3
    }
    if(this.state.ChipName4!==""){
      obj.chipName4=this.state.ChipName4
    }
    if(this.state.ChipName5!==""){
      obj.chipName5=this.state.ChipName5
    }
    if(this.state.ChipName6!==""){
      obj.chipName6=this.state.ChipName6
    }
    if(this.state.ChipValue1!==""){
      obj.ChipValue1=this.state.ChipValue1
    }
    if(this.state.ChipName2!==""){
      obj.ChipValue2=this.state.ChipValue2
    }
    if(this.state.ChipValue3!==""){
      obj.ChipValue3=this.state.ChipValue3
    }
    if(this.state.ChipValue4!==""){
      obj.ChipValue4=this.state.ChipValue4
    }
    if(this.state.ChipValue5!==""){
      obj.ChipValue5=this.state.ChipValue5
    }
    if(this.state.ChipValue6!==""){
      obj.ChipValue6=this.state.ChipValue6
    }
    // console.log(obj);
    this.users.updateUserChipsInfo(obj,data=>{
      console.log(data);
    })
  }
  
  render() {
    return(  
        <footer>
          <ul className="menu-links">
            <li className="item">
              <Link to="/dashboard?inplay">
                <img src={Inplay}/>
                <span>Inplay</span>
              </Link>
            </li>
            <li className="item">
              <Link to="#" className="UserChipData" onClick={this.ModalEditStake} data-backdrop="static" data-keyboard="false">
                <img src={editstake} />
                <span>Edit stake</span>
              </Link>
            </li>
            <li className="item">
              <Link to="/dashboard" className="site_title endcooki active">
                <img src={home} />
              </Link>
            </li>
            <li className="item">
              <Link to="/bethistory">
                <img src={bethistory} />
                <span>Bet History</span>
              </Link>
            </li>
            <li className="item">
              <Link to="#" onClick={this.logout}>
                <img src={logout} />
                <span>Logout</span>
              </Link>
            </li>
          </ul>
{
  //////////////////////////// EDIT STAKE MODAL ////////////////////////////////////
}

        <div className="modal fade" id="ModalEditStake" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              {/* <form onSubmit={(e)=>this.handleSubmit(e)} name="myForm"> */}
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel" style={{fontSize:'20px'}}>Chip Setting</h5>
                  <button type="button" className="close" onClick={this.closeModalEditStake} aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div class="modal-body row">
                    <div class="col-md-6">
                      {
                        this.state.chipName.map((item,index)=>{
                          return(
                            <>
                              <label>Chips Name {`${index+1}:`}</label>
                              <input type="text" className="form-control" onChange={(e)=>this.handleEditStake(e)} name={"ChipName"+(index+1)} />
                            </>
                          )
                        })
                      }
                    </div>
                    <div class="col-md-6">
                    {
                      this.state.chipName.map((item,index)=>{
                          return(
                            <>
                              <label>Chips Value {`${index+1}:`}</label>
                              <input type="text" className="form-control" onChange={(e)=>this.handleEditStake(e)} name={"ChipValue"+(index+1)} />
                            </>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={this.handleSubmit} className="btn btn-primary text-center">Update ChipSetting</button>
                </div>
              {/* </form> */}
            </div>
          </div>
        </div>
        
        </footer>
    );
  }
}