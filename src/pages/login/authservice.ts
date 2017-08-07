import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

    isLoggedin: boolean;
    AuthToken;
    userData: any;
    //serverUrl = 'http://localhost:3003';
    
    serverDataSet: any;

    constructor(private http: Http) {
        this.http = http;
        this.isLoggedin = false;
        this.AuthToken = null;
        this.userData = {};
        this.serverDataSet = {};
    }
    
    storeUserCredentials(token, userId) {
        window.localStorage.setItem('smartcom-token', token);
        window.localStorage.setItem('smartcom-user', userId);
        this.useCredentials(token, userId);
    }
    
    useCredentials(token, userId) {
        this.isLoggedin = true;
        this.AuthToken = token;
        this.userData['userId'] = userId;
    }
    
    loadUserCredentials() {
        var token = window.localStorage.getItem('smartcom-token');
        var userId = window.localStorage.getItem('smartcom-user');
        this.useCredentials(token, userId);
    }
    
    destroyUserCredentials() {
        this.isLoggedin = false;
        this.AuthToken = null;
        this.userData = {};

        window.localStorage.clear();
    }
    
    authenticate(user) {
        var creds = "userId=" + user.userId + "&password=" + user.password;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        
        return new Promise((resolve, reject ) => {
            this.http.post(this.serverUrl + '/api/authenticate', creds, {headers: headers})
            .map(res => res.json())
            .subscribe(data => {
                if(data.success){
                    this.storeUserCredentials(data.token, user.userId);
                    resolve(data);
                }
                else
                    reject(data);
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });
    }

    getinfo() {
        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.get(this.serverUrl + '/api/user?userId=' + this.userData.userId + '&token=Bearer ' + this.AuthToken)
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.userData = data;
                    resolve(this.userData);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });
    }

    getDisplayinfo() {
        return this.userData;
    }

    logout() {
        this.destroyUserCredentials();
    }

    constructionsitematrix(){
        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.get(this.serverUrl + '/api/loadconstructionsitematrix?userId=' + this.userData.userId + '&token=Bearer ' + this.AuthToken)
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });
    }

    //Set Up Inventory
    getglobalinventoryconfig(){
        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.get(this.serverUrl + '/api/loadglobaliteminventoryconfig?userId=' + this.userData.userId + '&token=Bearer ' + this.AuthToken)
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });
    }

    saveglobalinventoryrequest(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/saveglobalinventoryrequest', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    rejectglobalinventoryrequests(rejectedRequest, notificationData){
        var postData = 'userId=' + this.userData.userId  + '&rejectedRequest=' + JSON.stringify(rejectedRequest) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/rejectglobalinventoryrequests', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    //Update Site Data Once Allocated
    updatesiterequestdetailsallocate(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/updatesiterequestdetailsallocate', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    approveglobalinventoryrequests(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/approveglobalinventoryrequests', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.updatesiterequestdetailsallocate(requestData, notificationData).then(
                        _d =>{
                            this.serverDataSet = data;
                            resolve(this.serverDataSet);
                        }, _e => {
                            reject(data);
                        });
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }    

    //Update Site Data Once Shipped
    updatesiterequestdetailsship(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/updatesiterequestdetailsship', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    shipglobalinventoryrequests(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/shipglobalinventoryrequests', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.updatesiterequestdetailsship(requestData, notificationData).then(
                        _d =>{
                            this.serverDataSet = data;
                            resolve(this.serverDataSet);
                        }, _e => {
                            reject(data);
                        });
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }   

    getinventoryconfig() {
        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.get(this.serverUrl + '/api/loaditeminventoryconfig?userId=' + this.userData.userId + '&token=Bearer ' + this.AuthToken)
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });
    }

    saveinventoryconfig(configData) {
        var postData = 'userId=' + this.userData.userId + '&configData=' + JSON.stringify(configData) +  '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/saveinventoryconfig', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    } 

    //Task Services
    createtask(siteId, taskDetails, notificationData){
       var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskDetails=' + JSON.stringify(taskDetails)  + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/createtask', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });         
    }

    updatetask(taskDetails, siteId, notificationData){
       var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskDetails=' + JSON.stringify(taskDetails)  + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/updatetask', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });         
    }    

    updatetaskstatus(taskDetails, siteId, notificationData){
       var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskDetails=' + JSON.stringify(taskDetails)  + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/updatetaskstatus', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });         
    }   

    //Site Task Mapping Data
    constructionsites(){
        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.get(this.serverUrl + '/api/loadcnstrntsites?userId=' + this.userData.userId + '&token=Bearer ' + this.AuthToken)
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }      

    //Task Inventory Services
    siteinventory(siteId, taskId){
        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.get(this.serverUrl + '/api/loadsiteinventory?userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&token=Bearer ' + this.AuthToken)
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }

    addinventory(newInventory, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&newInventory=' + JSON.stringify(newInventory) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/addinventory', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    addinventoryorder(selectedItem, newOrder, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&selectedItem=' + selectedItem + '&newOrder=' + JSON.stringify(newOrder) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/addinventoryorder', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    deleteinventoryorder(selectedItem, orderData, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&selectedItem=' + selectedItem + '&orderData=' + JSON.stringify(orderData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/deleteinventoryorder', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    completeinventoryorder(selectedItem, orderData, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&selectedItem=' + selectedItem + '&orderData=' + JSON.stringify(orderData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/completeinventoryorder', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    reconsileinventory(siteId, taskId){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/reconsileinventorycostsandpayments', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( _d => {
                resolve(_d);
            });
        }); 
    }

    reconsilelabour(siteId, taskId){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/reconsilelabourbillsandpayments', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( _d => {
                resolve(_d);
            });
        }); 
    }

    approveinventoryorder(selectedItem, orderData, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&selectedItem=' + selectedItem + '&orderData=' + JSON.stringify(orderData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/approveinventoryorder', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.reconsileinventory(siteId, taskId).then(
                        _d =>{
                            this.serverDataSet = data;
                            resolve(this.serverDataSet);
                        });
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    payinventoryorder(selectedItem, orderId, paymentData, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&selectedItem=' + selectedItem + '&orderId=' + orderId + '&paymentData=' + JSON.stringify(paymentData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/payinventoryorder', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.reconsileinventory(siteId, taskId).then(
                        _d =>{
                            this.serverDataSet = data;
                            resolve(this.serverDataSet);
                        });
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    approveinventory(selectedItem, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&selectedItem=' + selectedItem + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/approveinventory', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }

    releaseinventory(selectedItem, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&selectedItem=' + selectedItem + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/releaseinventory', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }    

    cancelinventoryrequest(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/cancelinventoryrequest', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }

    //Acknowledge Receipt - Delete from Global Data
    deleteglobalrequestdetails(requestData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/deleteglobalrequestdetails', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    receiveinventoryrequest(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/receiveinventoryrequest', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.deleteglobalrequestdetails(requestData).then(
                        _d =>{
                            this.serverDataSet = data;
                            resolve(this.serverDataSet);
                        }, _e =>{
                            reject(data);
                        });
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }

    approveinventoryrequest(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/approveinventoryrequest', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    if(!requestData.transfer){
                        //Acquired
                        this.deleteglobalrequestdetails(requestData).then(
                            _d =>{
                                this.reconsileinventory(requestData.siteId, requestData.taskId).then(
                                    _d2 =>{
                                        this.serverDataSet = data;
                                        resolve(this.serverDataSet);
                                    });
                            }, _e =>{
                                reject(data);
                        });                        
                    } else {
                        //Approved
                        this.reconsileinventory(requestData.siteId, requestData.taskId).then(
                            _d =>{
                                this.serverDataSet = data;
                                resolve(this.serverDataSet);
                            });
                    }
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }

    payinventoryrequest(requestData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&requestData=' + JSON.stringify(requestData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/payinventoryrequest', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.reconsileinventory(requestData.siteId, requestData.taskId).then(
                        _d =>{
                            this.serverDataSet = data;
                            resolve(this.serverDataSet);
                        });
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }
                
    //Task Labour Services
    sitelabour(siteId, taskId){
        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.get(this.serverUrl + '/api/loadsitelabour?userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&token=Bearer ' + this.AuthToken)
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });   
    }

    addlabour(newLabour, siteId, taskId, notificationData){
         var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&newLabour=' + JSON.stringify(newLabour) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/addlabour', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    editlabour(labourData, siteId, taskId, notificationData){
         var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&labourData=' + JSON.stringify(labourData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/editlabour', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    if(labourData.approved == true){
                        this.reconsilelabour(siteId, taskId).then(
                            _d =>{
                                this.serverDataSet = data;
                                resolve(this.serverDataSet);
                            });
                    } else {
                        this.serverDataSet = data;
                        resolve(this.serverDataSet);
                    }
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    addlabourbilling(labourId, newBill, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&labourId=' + labourId + '&newBill=' + JSON.stringify(newBill) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/addlabourbilling', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    deletelabourbill(labourId, billId, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&labourId=' + labourId + '&billId=' + billId + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/deletelabourbill', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    editlabourbill(labourId, billData, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&labourId=' + labourId + '&billData=' + JSON.stringify(billData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/editlabourbill', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }    

    approvelabourbill(labourId, billId, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&labourId=' + labourId + '&billId=' + billId + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/approvelabourbill', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.reconsilelabour(siteId, taskId).then(
                        _d =>{
                            this.serverDataSet = data;
                            resolve(this.serverDataSet);
                        });
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    paylabourbill(labourId, billId, paymentData, siteId, taskId, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&labourId=' + labourId + '&billId=' + billId + '&paymentData=' + JSON.stringify(paymentData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/paylabourbill', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.reconsilelabour(siteId, taskId).then(
                        _d =>{
                            this.serverDataSet = data;
                            resolve(this.serverDataSet);
                        });
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        }); 
    }

    consumesiteinventory(siteId, taskId, consumptionData, notificationData){
        var postData = 'userId=' + this.userData.userId + '&siteId=' + siteId + '&taskId=' + taskId + '&consumptionData=' + JSON.stringify(consumptionData) + '&notificationData=' + JSON.stringify(notificationData) + '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/consumesiteinventory', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            }, error => {
                reject({message: 'The Server is not reachable. Please contact Administrator.'});
            });
        });  
    }     
}