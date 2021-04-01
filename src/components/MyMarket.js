import React from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Users from '../Services/users';

class MyMarket extends React.Component{
  constructor(props){
    super(props);
    this.state={
      data:[]
    }
    this.users = new Users();
  }

  componentDidMount = () => {
    let username = JSON.parse(localStorage.getItem('data')).userName
    this.users.getAllEvents(username,data=>{
      // console.log(data.data.data);
      this.setState({
        data:data.data.data
      })
    })
  }

  render(){
    console.log(this.state.data);
    return (
      <div>
        <Navbar />
        <Sidebar />
        <div className=" body">
        {/* <div className="left-side-menu">
          <div className="panel-group" id="accordion"></div>		
        </div> */}
        <div className="main_container" id="sticky">
          <div className="right_col" role="main">
            <div className="row">
              <div className="col-md-12">
                <div className="title_new_at"> My Market</div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div id="divLoading"> </div>
                {/*Loading class */}
                <div className="table-scroll" id="filterdata" style={{marginTop:"1rem"}}>
                  <table className="table table-striped jambo_table bulk_action">
                    <thead>
                      <tr className="headings" style={{background:"#95335c",color:'white'}}>
                        <th className="text-center">S.No. </th>
                        <th className="text-center">Match Name </th>
                        {/* <th className="text-center">Date</th> */}
                        <th className="text-center">Sport Name</th>
                        <th className="text-center">Match Status </th>
                        <th className="text-center">Team A </th>
                        <th className="text-center">Team B </th>
                        <th className="text-center">Draw </th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        this.state?.data?.length > 0 ?
                        this.state?.data.map((element,index)=>
                        <tr className="headings">
                          <th className="text-center">{index+1}</th>
                          <th className="text-center">{element?.event}</th>
                          {/* <th className="text-center">Date</th> */}
                          {element?.eventType===4?<th className="text-center">Cricket</th>:null}
                          {element?.eventType===2?<th className="text-center">Tennis</th>:null}
                          {element?.eventType===1?<th className="text-center">Soccer</th>:null}
                          <th className="text-center">{element.marketType}</th>
                          <th className="text-center">{element?.current_Position?.runnerNameOne+"("+element?.current_Position?.Teamone+")"}</th>
                          <th className="text-center">{element?.current_Position?.runnerNameTwo+"("+element?.current_Position?.Teamtwo+")"}</th>
                          <th className="text-center">{element?.current_Position?.runnerNameThree?element?.current_Position?.runnerNameThree+"("+element?.current_Position?.Teamthree+")":"---"}</th>
                        </tr>)
                      :
                      <tr><th colSpan={8}>No record found</th></tr>	
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div></div></div>
    )
  }
}

export default MyMarket;