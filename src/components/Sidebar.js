import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Service from '../Services/Service';
import LivEvents from '../Services/livevents'

export default class sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cricketData: '',
        tenisData: '',
        soccerData: '',
        liveEvents:[]
    };
    this.service = new Service();
}

componentDidMount(){
  this.setState({
    load:true
  })
this.service.getLiveEvents(data=>{
  const dataFFilter = data.data.Data.filter((ele)=>ele.eventType===1)
  const dataTFilter = data.data.Data.filter((ele)=>ele.eventType===2)
  const dataCFilter = data.data.Data.filter((ele)=>ele.eventType===4)
  this.setState({
    soccerData:dataFFilter,
    tenisData:dataTFilter, 
    cricketData:dataCFilter,
    load: false
  })
});
}

openCricket(eid,name,date){
  window.location.href = window.location.protocol+"//"+window.location.host+'/matchodds/'+eid;
  localStorage.setItem("matchname", JSON.stringify({name:name,date:date}));
}

openTenis(eid,name,date){
  // window.location.href ='matchodds/'+eid
  window.location.href = window.location.protocol+"//"+window.location.host+'/matchodds/'+eid;
  localStorage.setItem("matchname", JSON.stringify({name:name,date:date}));
}

openSoccer(eid,name,date){
  // window.location.href ='matchodds/'+eid
  window.location.href = window.location.protocol+"//"+window.location.host+'/matchodds/'+eid;
  localStorage.setItem("matchname", JSON.stringify({name:name,date:date}));
}

  render() {
    if (window.location.pathname === '/'){
      return null;
    } 
    return (
        <div className="left-side-menu">

{
  //////////////////////////// FOR INPLAY ///////////////////////////////////////////
}

            <div className="panel-group" id="accordion">
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">
                    <Link to="/dashboard?inplay">In-Play</Link>
                  </h4>
                </div>
              </div>

{
  //////////////////////////// FOR CRICKET ///////////////////////////////////////////
}

              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">
                    <Link data-toggle="collapse" data-parent="#accordion" to="#collapseOne">Cricket <span className="extender" /></Link>
                  </h4>
                </div>
                <div id="collapseOne" className="panel-collapse collapse">
                  <div className="panel-body">
                    <ul id="cricket_child_menu">
                      {
                        this.state.liveEvents.length>0 ?
                          this.state.liveEvents.map((item,index)=>{
                            if(item.odds){
                              return ( 
                              <li key={index}>
                                <Link to="#" title="Events" onClick={() =>this.openCricket(item.eventId, item.eventName,item.OpenDate)}>
                                  <i className="fa fa-angle-double-right" /> {item.eventName}
                                </Link>
                                <ul id="list_of29894585" />
                              </li>
                              );
                            }
                          }):
                        <li className="text-center">No Match...</li>
                      }
                    </ul>
                  </div>
                </div>
              </div>
              
{
  ///////////////////////////// FOR TENNIS ////////////////////////////////////////////
}
    
              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">
                    <Link data-toggle="collapse" data-parent="#accordion" to="#collapseTwo">Tennis <span className="extender" /></Link>
                  </h4>
                </div>
                <div id="collapseTwo" className="panel-collapse collapse">
                  <div className="panel-body">
                    <ul id="tennis_child_menu">
                      {
                        this.state.tenisData.length>0 ?
                          this.state.tenisData.map((item,index)=>{
                            return ( 
                              <li key={index}>
                                <Link to="#" title="Match OODS" onClick={()=>this.openTenis(item.eventId, item.eventName,item.OpenDate)}>
                                  <i className="fa fa-angle-double-right" />{item.eventName}
                                </Link>
                                <ul id="list_of29894585" />
                              </li>
                            );
                          }):
                        <li className="text-center">No Match...</li>
                      }
                    </ul>
                  </div>
                </div>
              </div>

{
  //////////////////////////// FOR SOCCER ////////////////////////////////////////////
}

              <div className="panel panel-default">
                <div className="panel-heading">
                  <h4 className="panel-title">
                    <Link data-toggle="collapse" data-parent="#accordion" to="javascript:void(0) #collapsethree">Soccer <span className="extender" /></Link>
                  </h4>
                </div>
                <div id="collapsethree" className="panel-collapse collapse">
                  <div className="panel-body">
                    <ul id="soccer_child_menu">
                      {
                        this.state.soccerData.length>0 ?
                          this.state.soccerData.map((item,index)=>{
                            return ( 
                              <li key={index}>
                                <Link to="#" title="Match OODS" onClick={()=>this.openSoccer(item.eventId, item.eventName,item.OpenDate)}>
                                  <i className="fa fa-angle-double-right" />  {item.eventName}
                                </Link>
                                <ul id="list_of29894585" />
                              </li>
                            );
                          }):
                        <li className="text-center">No Match...</li>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>		
          </div>
    )
}
}
  