import React from 'react'
import Loader from 'react-loader-spinner'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Users from '../Services/users';
import {Link} from 'react-router-dom'
export default class BlockMarket extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      data:[],      
    }
    this.users =new Users();
    this.userDetails = JSON.parse(localStorage.getItem('data')) != undefined?JSON.parse(localStorage.getItem('data')):'';

  }

  getallsports = async() => {
    await this.setState({
      load: true
    })
    await this.users.getallsports(data=>{
      this.setState({ 
        data:data.data.data 
      })
      this.setState({
        load: false
      })
      // console.log(data.data.data);
    })
  }

  componentDidMount = () => {
    if(this.userDetails.userName!=="lords11"&&this.userDetails.userName!=="AdminO222"){
      this.props.history.push('/dashboard')
    }
    else{
      this.getallsports();
    }
  }

  handleBlockMarket = (eventType) => {
    const obj = {eventType}
    this.users.sportEnableDisable(obj,data=>{
      this.getallsports();
    })
    document.getElementById("sidebarRefresh").onclick();
  }
  render(){
    return (
        <div>
          <Navbar />
          <Sidebar />
        <div className="forModal" />      <div className="container body">
          <div className="main_container" id="sticky">
            <div className="right_col" role="main">
              <div className="col-md-12">
                <div className="title_new_at">
                  <span className="lable-user-name">
                    Sport Listing
                  </span>
                  <button className="btn btn-xs btn-primary" style={{float:'right'}} onClick={()=>this.props.history.goBack()}>Back</button>
                </div>
              </div>
              <div className="col-md-12">
                <div className="clearfix" />
                <div className="table table-striped jambo_table bulk_action" id="contentreplace">
                  <table className="table tabelcolor tabelborder">
                    <thead>
                      <tr>
                        <th scope="col">So.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Action</th> 		 
                      </tr>
                    </thead>
                    {
                      this.state.load ?
                        <div style={{height:'100vh',width:'408%', justifyContent:'center', display:'flex',marginTop:'5rem'}}>
                            <Loader type="Grid" color="#6c1945" height={35} width={35} />
                        </div> :
                    <tbody>	
                      {
                        this.state.data.length > 0 ?
                        this.state.data.map((ele,ind)=>{
                          return(
                          <tr>
                            <td scope="row">{ind+1}</td>
                            <td><Link to={{pathname:'/sportsevent', state:{eventType:ele.eventType,name:ele.name}}}>{ele.name}</Link></td>
                            <td>
                              <label className="toggle-label">
                                <input type="checkbox" checked={ele.status ? true : false} onClick={()=>this.handleBlockMarket(ele.eventType)} className="ng-pristine ng-valid ng-touched" />
                                <span className="back">
                                  <span className="toggle" />
                                  <span className="label off">OFF</span> 
                                  <span className="label on">ON</span>											
                                </span>
                              </label> 
                            </td>	 
                          </tr>
                          )
                        }):null
                      }
		
                  
                    </tbody>		
                    }
                  </table>	     
                </div>
              </div>
            </div>
          </div></div></div>
    )
}
}