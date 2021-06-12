import React, { Component } from 'react'
import axios from 'axios';
import * as Constants from '../config/config'
export default class Service extends Component {

 getdashboardData(type,callback){

   
    // call for cricket
      axios.post(Constants.APIURL+'getLiveEvents', {
        "EventTypeid":type
    })
      .then((response) => {
        var datatoday = new Date();
        var date = new Date();
        // Add a day
        date.setDate(date.getDate() - 1)
        var sd = date.getTime();
        var datatodays = datatoday.setDate(new Date(datatoday).getDate() + 1);
        var todate = new Date(datatodays);
        var ed = todate.getTime();
          // Create new Date instance
         // console.log(date);
      var fdata = response.data.data.filter(d => {var time = new Date(d.event.openDate).getTime();
                                 return (sd < time && time < ed);
                                }).sort((a,b)=>{
                                  var dateA = new Date(a.event.openDate), dateB = new Date(b.event.openDate);
                                  return dateA - dateB;
                                });
                                if(fdata.length>0)
                                callback(fdata.slice(0,7));
                                else
                                callback(response.data.data.result.slice(0,7));
      }).catch((error) => console.log(error));
 }

getLiveEvents(cb){
  
  axios.get(Constants.APIURL+'LiveEventsForUser')
  .then((response) => {
    cb(response);
  })
  .catch((error) => console.log(error));    
}
getEventInitialOdds(eid,cb){

  axios.post(Constants.APIURL+'getManualOdds', { eventID: eid })
  .then((response) => {
    cb(response);
  })
  .catch((error) => console.log(error));    
}


getlistMarketOdds(mid,cb) {

  axios.post(Constants.APIURL+'listMarketOdds', { marketId: mid })
    .then((response) => {
      cb(response?.data?.data);
    })
    .catch((error) => console.log(error));
}

getLiveCricketScore(cb){
  axios.get(Constants.APIURL+'liveCricketScore')
  .then((response) => {
    cb(response);
  })
  .catch((error) => console.log(error));    
}

getListMarketType(eid,cb){

  // call for cricket
  axios.post(Constants.APIURL+'marketTypeData', { eventId: eid })
    .then((response) => {
      if(response.data.data.length !== 0){
        let mid = response?.data?.data[0]?.marketData?.marketId;
        let isEnabled = response?.data?.data[0]?.marketData?.isEnabled;

          if (response?.data?.data[0]?.runners[0].length > 0) {
            this.getlistMarketOdds(mid,data=>{
              cb({pdata:response?.data?.data[0]?.runners[0],odsData:data,isEnabled:isEnabled},response?.data?.data)
            });
          }
      }else{
        cb({pdata:'',odsData:'',isEnabled:''})
      }
    }).catch((error) => console.log("Error",error));
}
getMarketMatchOdds(eid,cb){

  // call for cricket
  axios.post(Constants.APIURL+'marketTypeData', { eventId: eid })
    .then((response) => {
      if(response.data.data.length !== 0){
        let filterdata = response?.data?.data?.filter(newdata=>{
          return newdata.marketData.marketName==="Match Odds";
        })
        let mid = filterdata[0]?.marketData?.marketId;
        let isEnabled = filterdata[0]?.marketData?.isEnabled;
          if (filterdata[0]?.runners[0].length > 0) {
            this.getlistMarketOdds(mid,data=>{
              cb({pdata:filterdata[0]?.runners[0],odsData:data,isEnabled:isEnabled},response?.data?.data)
            });
          }
      }else{
        cb({pdata:'',odsData:'',isEnabled:''})
      }
    }).catch((error) => console.log("Error",error));
}

placeBet(data,cb){
  
  axios.post(Constants.APIURL+'placeBet', 
 data)
    .then((response) => {
       cb(response);     
    })
    .catch((error) => console.log(error));
}
fancyplaceBet(data,cb){
  
  axios.post(Constants.APIURL+'placeFancyBet', 
 data)
    .then((response) => {
       cb(response);     
    })
    .catch((error) => console.log(error));
}
betHistory(userName,evid,URL,cb){
  let payload ;
  if(evid){
    payload ={userName:userName,eventId:evid}
  }else{
    payload ={userName:userName}
  }
  
  axios.post(Constants.APIURL+URL, 
  payload)
    .then((response) => {
       cb(response.data.data);     
    })
    .catch((error) => console.log(error));
}
betHistoryAsPerUser(payload,URL,cb){
  
  axios.post(Constants.APIURL+URL, 
    payload)
      .then((response) => {
         cb(response.data.data);     
      })
      .catch((error) => console.log(error));
}
settledBethistoryForUser(userName,evid,cb){
  let payload ;
  if(evid){
    payload ={userName:userName,eventId:evid}
  }else{
    payload ={userName:userName}
  }
  
  axios.post(Constants.APIURL+'getUserOpenBetHistory', 
  payload)
    .then((response) => {
       cb(response.data.data);     
    })
    .catch((error) => console.log(error)); 
}
matchOddsfromevent(eid,cb){
  axios.post(Constants.APIURL+'listEventsDataById', 
 {EventId:eid})
    .then((response) => {
       cb(response);     
    })
    .catch((error) => console.log(error));
}
getchipInfo(payload,cb){
  axios.post(Constants.APIURL+'userChipsInfo', 
  payload)
     .then((response) => {
        cb(response);     
     })
     .catch((error) => console.log(error));
}
updateExpo(payload,cb){
  axios.post(Constants.APIURL+'updateExposure', 
  payload)
     .then((response) => {
        cb(response);     
     })
     .catch((error) => console.log(error));  
}
geteventExpo(payload,cb){
  axios.post(Constants.APIURL+'getEventExposure', 
  payload)
     .then((response) => {
        cb(response);     
     })
     .catch((error) => console.log(error));  
}
}