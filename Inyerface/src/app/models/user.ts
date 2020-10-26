import { stringify } from 'querystring';

export class User {
    userId:number;
    username:string;
    password:string;
    email:string;
    phoneNum:string;
    secQuest:number;
    secAnsw:string;
    favColor:string;

    public User(userId:number,username:string,password:string,email:string,
        phoneNum:string,secQuest:number,secAnsw:string,favColor:string,){
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.phoneNum = phoneNum;
        this.secQuest = secQuest;
        this.secAnsw = secAnsw;
        this.favColor = favColor;
    }
}
