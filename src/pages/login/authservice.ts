import {Injectable} from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

    isLoggedin: boolean;
    AuthToken;
    userData: any;
    serverUrl = 'http://localhost:3003';
    
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
            });
        });
    }

    getDisplayinfo() {
        return this.userData;
    }

    logout() {
        this.destroyUserCredentials();
    }

    //Set Up Inventory
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
            });
        }); 
    } 

    //Upload Items to Inventory
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
            });
        });   
    }   

    siteinventory(siteId){
        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.get(this.serverUrl + '/api/loadsiteinventory?userId=' + this.userData.userId + '&siteId=' + siteId + '&token=Bearer ' + this.AuthToken)
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            });
        });   
    }

    savesiteinventory(siteData) {
        var postData = 'userId=' + this.userData.userId + '&siteData=' + JSON.stringify(siteData) +  '&token=Bearer ' + this.AuthToken;
        
        var headers = new Headers();
        headers.append("Accept", 'application/json');
        headers.append('Content-Type', 'application/x-www-form-urlencoded' );

        return new Promise((resolve, reject ) => {
            this.loadUserCredentials();
            this.http.post(this.serverUrl + '/api/savesiteinventory', postData , {headers: headers})
            .map(res => res.json())
            .subscribe( data => {
                if(data.success){
                    this.serverDataSet = data;
                    resolve(this.serverDataSet);
                } else {
                    reject(data);
                }
            });
        }); 
    }  
}