import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Service from '../Services/Service';

export default class sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
        cricketData: '',
        tenisData: '',
        soccerData: '',
        liveEvents:[]
    };
   
}

componentDidMount(){
  var service = new Service();
  service.getdashboardData("4",data=>{
    this.setState({
      cricketData: data
    })
  });
  service.getdashboardData("2",data=>{
    this.setState({
      tenisData: data
    })
  });
  service.getdashboardData("1",data=>{
    this.setState({
      soccerData: data
    })
  });
  let eveodds = [];
  service.getLiveEvents((data) => {
    data.data.Data.map((item) => {
      service.getEventInitialOdds(item.eventId, (data) => {
        eveodds.push({
          events: item,
          odds: data.data,
        });
        this.setState({
          liveEvents: eveodds,
        });
      });
    });
  });
}

openCricket(eid,name,date){
  window.location.href = window.location.protocol+"//"+window.location.host+'/matchodds/'+eid;
  localStorage.setItem("matchname", JSON.stringify({name:name,date:date}));
}

openTenis(eid){
  window.location.href ='matchodds/'+eid
}

openSoccer(eid){
  window.location.href ='matchodds/'+eid
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
                                <Link to="#" title="Events" onClick={() =>this.openCricket(item.events.eventId, item.events.eventName,item.events.OpenDate)}>
                                  <i className="fa fa-angle-double-right" /> {item.events.eventName}
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
                                <Link to="#" title="Match OODS" onClick={()=>this.openTenis(item.event.id)}>
                                  <i className="fa fa-angle-double-right" />{item.event.name}
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
                                <Link to="#" title="Match OODS" onClick={()=>this.openSoccer(item.event.id)}>
                                  <i className="fa fa-angle-double-right" />  {item.event.name}
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
  