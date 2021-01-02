import React from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MyMarket = () => {
    return (
      <div>
        <Navbar />
    <Sidebar />
        <div className=" body">
        <div className="left-side-menu">
          <div className="panel-group" id="accordion">
          </div>		
        </div>
        <div className="main_container" id="sticky">
          <div className="right_col" role="main">
            <div className="row">
              <div className="col-md-12">
                <div className="title_new_at"> My Market</div>
              </div>
              <div className="col-md-12 col-sm-12 col-xs-12">
                <div id="divLoading"> </div>
                {/*Loading class */}
                <div className="table-scroll" id="filterdata">
                  <table className="table table-striped jambo_table bulk_action">
                    <thead>
                      <tr className="headings">
                        <th>S.No. </th>
                        <th>Match Name </th>
                        <th>Date</th>
                        <th>Sport Name</th>
                        <th>Match Status </th>
                        <th>Team A </th>
                        <th>Team B </th>
                        <th>Draw </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><th colSpan={6}>No record found</th></tr>	
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div></div></div>
    )
}

export default MyMarket;