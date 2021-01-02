import React from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const BlockMarket = () => {
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
                  <button className="btn btn-xs btn-primary" onclick="goBack()">Back</button>
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
                    <tbody>	
                      {/*Criecket */}			
                      <tr>
                        <td scope="row">1</td>
                        <td><a href="#"><img src="http://park9.bet/assets/images/cricket-icon.png" alt="..." /> Cricket</a></td>
                        <td>
                          {/*img src="http://park9.bet/assets/images/pause_icon.png" style="margin-top:0px;"
							 onclick="saveSeries(4, '145315', '0', '0', '0', '2', '0');" / */}	
                          <label className="toggle-label">
                            <input type="checkbox" onclick="blockMarket(4, '145315', '0', '0', '0', '2', '0');" className="ng-pristine ng-valid ng-touched" />
                            <span className="back">
                              <span className="toggle" />
                              <span className="label off">OFF</span> 
                              <span className="label on">ON</span>											
                            </span>
                          </label> 
                        </td>	 
                      </tr>
                      <tr>
                        <td scope="row">2</td>
                        <td>   <a href="#"><img src="http://park9.bet/assets/images/tenish-icon.png" alt="..." /> Tennis</a></td>
                        <td>
                          {/*img src="" style="margin-top:0px;"
							 onclick="saveSeries(2, '', '0', '0', '0', '', '');" / */}	
                          <label className="toggle-label">
                            <input type="checkbox" onclick="blockMarket(2, '145315', '0', '0', '0', '2', '0');" className="ng-pristine ng-valid ng-touched" />
                            <span className="back">
                              <span className="toggle" />
                              <span className="label off">OFF</span> 
                              <span className="label on">ON</span>											
                            </span>
                          </label> 
                        </td>	 
                      </tr>
                      <tr>
                        <td scope="row">3</td>
                        <td><a href="#"><img src="http://park9.bet/assets/images/soccer-icon.png" alt="..." />  Soccer</a></td>
                        <td> 
                          <label className="toggle-label">
                            <input type="checkbox" onclick="blockMarket(1, '145315', '0', '0', '0', '2', '0');" className="ng-pristine ng-valid ng-touched" />
                            <span className="back">
                              <span className="toggle" />
                              <span className="label off">OFF</span> 
                              <span className="label on">ON</span>											
                            </span>
                          </label> 
                        </td>	 
                      </tr>
                      <tr>
                        <td scope="row">4</td>
                        <td><a href="#"><img src="http://park9.bet/assets/images/soccer-icon.png" alt="..." />  Teenpatti</a></td>
                        <td> 
                          <label className="toggle-label">
                            <input type="checkbox" onclick="blockMarket(9, '145315', '0', '0', '0', '2', '0');" className="ng-pristine ng-valid ng-touched" />
                            <span className="back">
                              <span className="toggle" />
                              <span className="label off">OFF</span> 
                              <span className="label on">ON</span>											
                            </span>
                          </label> 
                        </td>	 
                      </tr>
                      <tr>
                        <td scope="row">4</td>
                        <td>Live Teenpatti</td>
                        <td> 
                          <label className="toggle-label">
                            <input type="checkbox" onclick="blockMarket(11, '145315', '0', '0', '0', '2', '0');" className="ng-pristine ng-valid ng-touched" />
                            <span className="back">
                              <span className="toggle" />
                              <span className="label off">OFF</span> 
                              <span className="label on">ON</span>											
                            </span>
                          </label> 
                        </td>	 
                      </tr>
                      <tr>
                        <td scope="row">4</td>
                        <td>Live Casino</td>
                        <td> 
                          <label className="toggle-label">
                            <input type="checkbox" onclick="blockMarket(12, '145315', '0', '0', '0', '2', '0');" className="ng-pristine ng-valid ng-touched" />
                            <span className="back">
                              <span className="toggle" />
                              <span className="label off">OFF</span> 
                              <span className="label on">ON</span>											
                            </span>
                          </label> 
                        </td>	 
                      </tr>
                      <tr>
                        <td scope="row">4</td>
                        <td>Live Game</td>
                        <td> 
                          <label className="toggle-label">
                            <input type="checkbox" onclick="blockMarket(13, '145315', '0', '0', '0', '2', '0');" className="ng-pristine ng-valid ng-touched" />
                            <span className="back">
                              <span className="toggle" />
                              <span className="label off">OFF</span> 
                              <span className="label on">ON</span>											
                            </span>
                          </label> 
                        </td>	 
                      </tr> 	     
                    </tbody>		
                  </table>	     
                </div>
              </div>
            </div>
          </div></div></div>
    )
}

export default BlockMarket;