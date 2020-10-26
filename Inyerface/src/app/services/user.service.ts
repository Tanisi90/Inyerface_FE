import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl:string = "http://localhost:8080/inya/user"
  constructor(private http: HttpClient) { }

  login(username:string, password:string){
    let creds = {
      username: username,
      password: password
    };
    return this.http.post<User>(this.baseUrl + "/login", creds) as Observable<User>;
  }

  register(user:User){
    return this.http.post<User>(this.baseUrl + "/new", user) as Observable<User>;
  }

  update(user:User){
    return this.http.put<User>(this.baseUrl + "/update",user) as Observable<User>;
  }
}
