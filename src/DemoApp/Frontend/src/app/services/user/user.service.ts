import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  url = 'http://127.0.0.1:3000/users';
  token: any;
  user: any;

  allRecords = [];
  allDevRecords = [];

  postMember(member) {
    return this.http.post(this.url + '/member', member, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  postLogin(member) {
    return this.http.post(this.url + '/login', member, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  postEditedProfile(profile) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url + '/editedprofile', profile, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', this.token)
    });
  }

  postPasswordRequest(member) {
    return this.http.post(this.url + '/forgotpassword', member, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  resetPasswordRequest(password) {
    return this.http.post(this.url + '/resetpassword', password, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  resetPasswordRequest1(password) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url + '/resetpassword1', password, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', this.token)
    });
  }

  resetSecurityCredentials(securityCredentials) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url + '/resetSecurityCredentials', securityCredentials, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', this.token)
    });
  }

  auth(data) {
    localStorage.setItem('id_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.token = data.token;
    this.user = data.user;
  }

  setUser(model) {
    localStorage.setItem('user', JSON.stringify(model.user));
    this.user = model.user;
  }

  getUser() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getToken() {
    if (!!localStorage.getItem('id_token')) {
      const token = localStorage.getItem('id_token');
      return this.checkExpiryDate(token);
    } else {
      return false;
    }
  }

  checkExpiryDate(token) {
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    return !isExpired;
  }

  checkUser() {
    this.getUser();
    if (this.user) {
      if (this.user.email !== 'admin@admin.com') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  logout() {
    localStorage.clear();
    this.token = null;
    this.user = null;
  }

  postPassword(model) {
    this.token = localStorage.getItem('id_token');
    return this.http.post(this.url + '/checkPassword', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', this.token)
    });
  }

  uploadFile(model) {
    return this.http.post(this.url + '/upload', model);
  }

  startAcquisition(model) {
    return this.http.post(this.url + '/signalAcquisition', model, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getUserRecords() {
    return this.http.post(this.url + '/userrecords', {_id: this.user._id}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getDevRecords() {
    return this.http.post(this.url + '/devrecords', {_id: this.user._id}, {
      observe: 'body',
      headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
  }

  getAllRecords() {
    return this.http.get(this.url + '/allrecords');
  }

  getAllDevRecords() {
    return this.http.get(this.url + '/alldevrecords');
  }

}
