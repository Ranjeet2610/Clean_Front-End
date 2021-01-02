import React, { Component } from 'react'
import axios from 'axios';
import * as Constants from '../config/config'
export default class Account extends Component {

    getuseraccountstatment(req,cb){
    
      
        // call for cricket
        axios.post(Constants.APIURL+'getAccountStament', {
            "userName":req?req:JSON.parse(localStorage.getItem('data')).userName
        })
          .then((response) => {
            cb(response);
          })
          .catch((error) => console.log(error));    
    }
    getprofitloss(data,cb){
        
        // call for cricket
        axios.post(Constants.APIURL+'getUserSectionProfitAndLoss',data)
          .then((response) => {
            cb(response);
          })
          .catch((error) => console.log(error));
    }
    masterProfitAndLoss(data,cb){
    
    // call for cricket
    axios.post(Constants.APIURL+'masterProfitAndLoss',data)
      .then((response) => {
        cb(response);
      })
      .catch((error) => console.log(error));
    }
    adminProfitAndLoss(data,cb){
    
    // call for cricket
    axios.post(Constants.APIURL+'adminProfitAndLoss',data)
      .then((response) => {
        cb(response);
      })
      .catch((error) => console.log(error)); 
    } 
    superAdminProfitAndLoss(data,cb){
    
    // call for cricket
    axios.post(Constants.APIURL+'superAdminProfitAndLoss',data)
      .then((response) => {
        cb(response);
      })
      .catch((error) => console.log(error)); 
    }
    superAdminUpDown(data,cb){
     
      axios.post(Constants.APIURL+'superAdminUpDown', 
     data)
        .then((response) => {
           cb(response);     
        })
        .catch((error) => console.log(error));
    }
    adminUpDown(data,cb){
     
      axios.post(Constants.APIURL+'adminUpDown', 
     data)
        .then((response) => {
           cb(response);     
        })
        .catch((error) => console.log(error));
    }

    userPL(data,cb){
     
      axios.post(Constants.APIURL+'userPL',
      data)
      .then((response) => {
        cb(response);     
     })
     .catch((error) => console.log(error));
  
    }

    adminUserPL(data,cb){
     
      axios.post(Constants.APIURL+'adminUserPL',
      data)
      .then((response) => {
        cb(response);     
     })
     .catch((error) => console.log(error));
  
    }
    superAdminUserPL(data,cb){
     
      axios.post(Constants.APIURL+'superAdminUserPL',
      data)
      .then((response) => {
        cb(response);     
     })
     .catch((error) => console.log(error));
  
    }
    fetchChipSummary(url,data,cb){
     
      axios.post(Constants.APIURL+url,
      data)
      .then((response) => {
        cb(response);     
     })
     .catch((error) => console.log(error)); 
    }
  }

  
  