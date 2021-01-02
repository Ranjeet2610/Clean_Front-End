import React, { Component } from 'react'
import axios from 'axios';
import * as Constants from '../config/config'
export default class Livevents extends Component {

    getLiveEvents(req,cb){
    
        
        // call for cricket
        axios.post(Constants.APIURL+'getDbliveEvents', {
            //"userName":JSON.parse(localStorage.getItem('data')).userName
            //"userName":'nakul'
        })
          .then((response) => {
            cb(response);
          })
          .catch((error) => console.log(error));    
    }

    UpdateEventFlag(eid,cb){
        
        // call for cricket
        axios.post(Constants.APIURL+'ActiveLiveEvents', {
            "eventId":eid
        })
          .then((response) => {
            cb(response);
          })
          .catch((error) => console.log(error));    
    }

    getMatchOdds(eid,cb){
        
        axios.post(Constants.APIURL+'marketTypeData',{
            "eventId":eid
        }).then((response)=>{
            cb(response);
        }).catch((error)=>console.log(error));
    }
   async  getFancyMarketType(eid,cb){

      axios.post(Constants.APIURL+'fancyMarketTypeData',{
          "eventId":eid
      }).then((response)=>{      
      cb({fancymarket:response.data.data});
       }).catch((error)=>console.log(error));
  }
  async  getFancyMarket(eid,cb){

    axios.post(Constants.APIURL+'fancyMarketTypeData',{
        "eventId":eid
    }).then((response)=>{
      let newData = response.data.data.filter(item => item.marketData.isVisible);
      let fdata = newData.map((item)=>{
        let runners = item.runners.filter(item=>item.isRunnersVisible==true);
        let mData = item.marketData;
        return {marketData:mData,runners:runners}
      })
     // console.log(fdata)
      let promises = fdata.map((item)=>{
        if(item.runners.length>0){
          return  new Promise((resolve)=>{
            this.ListMarketOdds(item.marketData.marketId,data=>{
              resolve(data.data.data[0].result)
            });
           
          });
        }
  
     })
     Promise.all(promises)
     .then(results => {
  //console.log(results);
    cb({fodds:results,fancymarket:fdata});
     })
     .catch(e => {
       console.error(e);
     })
        
    }).catch((error)=>console.log(error));
}

    ListMarketOdds(mid,cb){
      
        axios.post(Constants.APIURL+'listMarketOdds',{
            marketId:mid
        }).then((response)=>{
            cb(response);
        }).catch((error)=>console.log(error));
    }

    updateInitialOdds(odds,cb){
       
        //console.log(odds);
        axios.post(Constants.APIURL+'setManualOdds',odds).then((response)=>{
            cb(response);         

        }).catch((error)=>console.log(error));
    }
    lockMatchOdds(data,cb){
       
        axios.post(Constants.APIURL+'lockMatchOdds', 
       data)
          .then((response) => {
             cb(response);     
          })
          .catch((error) => console.log(error));
      }
enableFancyOdds(data,cb){
       
        axios.post(Constants.APIURL+'enableFancyOdds', 
       data)
          .then((response) => {
             cb(response);     
          })
          .catch((error) => console.log(error));
}

storeMarketType(data,cb){
       
        axios.post(Constants.APIURL+'storeMarketType', 
       data)
          .then((response) => {
             cb(response);     
          })
          .catch((error) => console.log(error));
      }
// 

// 
 storeLiveEvents(data,cb){
  axios.post(Constants.APIURL+'storeLiveEvents',
  data).then((response)=>{
   console.log('stored',response)
    this.storeMarketType( data=>{
        cb(data);   
    })
    cb(response); 
  }).catch((error)=>console.log(error));
}
visiableFancyOdds(data,cb){       
  axios.post(Constants.APIURL+'visibleFancyOdds', 
 data)
    .then((response) => {
       cb(response);     
    })
    .catch((error) => console.log(error));
}
visiableFancyRunners(data,cb){       
  axios.post(Constants.APIURL+'visibleFancyRunners', 
 data)
    .then((response) => {
       cb(response);     
    })
    .catch((error) => console.log(error));
}
}