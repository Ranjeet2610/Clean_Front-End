import React, { Component } from 'react'
import axios from 'axios';
import * as Constants from '../config/config'
export default class Users extends Component {
login(data,cb){
    axios.post(Constants.APIURL+'login', data)
    .then((response) => {
        // console.log(response.status);
        if (response.data.success) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error))
}
getUsersforMaster(username,cb){
    let curruser;
    if(username!=undefined){
        curruser = username;
    }
    else{
        curruser = JSON.parse(localStorage.getItem('data')).userName;
    }
    
    axios.post(Constants.APIURL+'getMasterUsers',{masterName:curruser})
    .then((response) => {
        cb(response); 

    }, this)
    .catch((error) => alert(error))
}
getUserExposure(payload,cb){
    axios.post(Constants.APIURL+'getTotalExposure',payload)
    .then((response) => {
        let arr = [];let expo =0
        if(response.data.length>0){
            response.data.map((item)=>{
            item.runnersData.map(item=>{
             if(item.exposure<0)
             expo += item.exposure;
            arr.push(item)
          });
        })
    }
    // console.log(expo);
    cb(expo);
    }, this)
.catch((error) => console.log(error))
}
getmasterforSupermaster(username,cb){
    let curruser;
    if(username!=undefined){
        curruser = username;
    }
    else{
        curruser = JSON.parse(localStorage.getItem('data')).userName;
    }
    
    axios.post(Constants.APIURL+'getAdminMasters',{adminName:curruser})
    .then((response) => {
        cb(response); 

    }, this)
    .catch((error) => alert(error))
}
getAllusers(cb){
    
    axios.get(Constants.APIURL+'getUsers')
    .then((response) => {
        cb(response); 

    }, this)
    .catch((error) => alert(error))   
}
getMastersforAdmin(cb){
    
    axios.get(Constants.APIURL+'getMasters')
    .then((response) => {
        cb(response); 

    }, this)
    .catch((error) => alert(error))
}
getAllAdmin(cb){
    
    axios.get(Constants.APIURL+'getAdmins')
    .then((response) => {
        cb(response); 

    }, this)
    .catch((error) => alert(error))
}
createUser(data,cb){
    
    axios.post(Constants.APIURL+'createAccount', data)
    .then((response) => {
        if (response.data.success) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error))
}
changePassword(data,cb){
    
    axios.post(Constants.APIURL+'changePassword', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error))   
}
updatePassword(data,cb){
    
    axios.post(Constants.APIURL+'changePasswordByUser', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error))   
}
getCloseUser(URL,cb){
    
    axios.get(Constants.APIURL+ URL)
    .then((response) => {
        cb(response); 

    }, this)
    .catch((error) => alert(error)) 
}

/////////////////////////////////////////////////
getAllBettings(URL,cb){
    axios.get(Constants.APIURL+ URL)
    .then((response) => {
        cb(response); 
    }, this)
    .catch((error) => console.log(error)); 
}
getUserInfo(URL,cb){
    axios.get(Constants.APIURL+ URL)
    .then((response) => {
        cb(response); 
    }, this)
    .catch((error) => console.log(error)); 
}
getBettingBasedOnMaster(URL,cb){
    axios.get(Constants.APIURL+ URL)
    .then((response) => {
        cb(response); 
    }, this)
    .catch((error) => console.log(error)); 
}
//////////////////////////////////////////////////


getclosemasterforAdmin(data,cb){
    
    axios.post(Constants.APIURL+'getAdminClosedMasters', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error))   
}
getclosusersforMaster(data,cb){
    
    axios.post(Constants.APIURL+'getMasterClosedUsers', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error))   
}
lockunlock(data,cb){
    
    axios.post(Constants.APIURL+'lockUser', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error)) 
}
closeuser(data,cb){
    
    axios.post(Constants.APIURL+'closeUser', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error)) 
}
openUser(data,cb){
    
    axios.post(Constants.APIURL+'openUser', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error)) 
}
creditbyUser(data,URL,cb){
    
    axios.post(Constants.APIURL+URL, data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error)) 
}
debitbyUser(data,URL,cb){
    
    axios.post(Constants.APIURL+URL, data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error)) 
}
getMyprofile(data,cb){
    
    axios.post(Constants.APIURL+'getMyprofile', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error)) 
}
lockingUnlockingBetting(data,cb){
    
    axios.post(Constants.APIURL+'lockUnlockBetting', data)
    .then((response) => {
        if (response) {
            cb(response);            
        }
        else{
            cb({error:"error"}) 
        }

    }, this)
    .catch((error) => alert(error))   
}

userSportsInfo(data,cb){
  
    axios.post(Constants.APIURL+'userSportsInfo',
    data)
    .then((response) => {
      cb(response);     
   })
   .catch((error) => console.log(error));

  }
  updateUserSportsInfo(data,cb){
  
    axios.post(Constants.APIURL+'updateUserSportsInfo',
    data)
    .then((response) => {
      cb(response);     
   })
   .catch((error) => console.log(error));

  }
  updateMyprofile(data,cb){
 
    axios.post(Constants.APIURL+'updateMyprofile',
    data)
    .then((response) => {
      cb(response);     
   })
   .catch((error) => console.log(error));

  }

  addFunds(data,cb){
    axios.patch(Constants.APIURL+'adminWalletBalance',data).then((res) => {
        cb(res);
    })
  }

    getNews(cb){
        axios.get(Constants.APIURL+'news').then((res) => {
            cb(res);
        })
    }
    addNews = (data,cb) => {
        let body = {
            newsID:1,//res.data.data.length+1,
            newsTitle:data,
            active:false
        }
        axios.post(Constants.APIURL+'news',body).then((res) => {
            cb(res);
        })
    }
    deleteNews = (id,cb) => {
        axios.delete(Constants.APIURL+'deleteNews',id).then((res) => {
            cb(res);
        })
    }
    updateNews = (body,cb) => {
        axios.put(Constants.APIURL+'updatenews',body).then((res) => {
            cb(res)
        })
    }
    getActiveNews = (cb) => {
        axios.get(Constants.APIURL+'getactiveNews').then((res)=>{
            cb(res);
        })
    }
    activeInactiveNews = (id,data,cb) => {
        axios.put(Constants.APIURL+'activeInactiveNews?id='+id,data).then((res)=>{
            cb(res);
        })
    }

    matchSettlement = (data,cb) => {
        axios.post(Constants.APIURL+'matchOddsBetSettlement',data).then((res)=>{
            cb(res);
        })
    }
    getAllUserBasedOnSuperMaster = (username,cb) => {
        axios.get(Constants.APIURL+'getuserbasedOnAdmin?userName='+username).then((res)=>{
            cb(res);
        })
    }
    getUserInfo = (username, cb) => {
        axios.get(Constants.APIURL+'getUserInfo?userName='+username).then((res)=>{
            cb(res);
        })
    }
    addbetplacetime = (body, cb) => {
        axios.post(Constants.APIURL+'addbetplacetime',body).then((res)=>{
            cb(res);
        })
    }
    getallsports = (cb) => {
        axios.get(Constants.APIURL+'getallsports').then((res)=>{
          cb(res);
        })
      }
    sportEnableDisable  = (body,cb) => {
        axios.put(Constants.APIURL+'sportEnableDisable',body).then((res)=>{
            cb(res);
        })
    }

    getAllFancyStack = (data,cb) =>{
        axios.post(Constants.APIURL+'getAllFancyStack',data).then((res)=>{
            cb(res)
        })
    }

    getLiveMatchOdds = (data,cb) => {
        axios.post(Constants.APIURL+'getLiveMatchOdds',data).then((res)=>{
            cb(res);
        })
    }
    updateManualOdds = (data,cb) => {
        axios.put(Constants.APIURL+'updateManualOdds',data).then((res)=>{
            cb(res);
        })
    }
    addmanualfancy = (data,cb) => {
        axios.put(Constants.APIURL+'addmanualfancy',data).then((res)=>{
            cb(res);
        })
    }
    updateUserChipsInfo = (data,cb) => {
        axios.post(Constants.APIURL+'updateUserChipsInfo',data).then((res)=>{
            cb(res);
        })
    }
    getAllEvents = (name,cb) => {
        axios.get(Constants.APIURL+'getAllEvents?userName='+name).then((res)=>{
            cb(res);
        })
    }
    exposureDistribution = (name,cb) => {
        axios.get(Constants.APIURL+'exposureDistribution?userName='+name).then((res)=>{
            cb(res);
        })
    }
}