import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthData } from "./auth-data.model"

@Injectable({providedIn: "root"})

export class AuthService {
  //i'm going to call the server so creating the construtor
  constructor(private http: HttpClient) {}
  createUser(email: string, password: string) {
    console.log("Begining of AuthService.createUser()");
    const authData: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/api/user/signup", authData)
      .subscribe(response => {
        console.log("response from server", response);
      }, error => {
        console.log(error);
      })
  }
}
