import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  login1:number = 1;
  login2:number = 1;
  login3:number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  submit(){
    var username = (<HTMLInputElement>document.getElementById("userField")).value;
    var password = (<HTMLInputElement>document.getElementById("passField")).value;
    var mess = document.getElementById("messages");

    if(username == "oogey" && password == "boogey"){
      mess.innerText = "You did it!!";
    }
    else{
      this.toggleModal();
    }
  }

  loginCount(lock:number,lockId:string){
    console.log(lock);
    var mess = document.getElementById("messages");
    mess.innerText = "";
    if(lock == 7){
      document.getElementById(lockId).hidden = true;
      mess.innerText = "Old tricks won't open new doors!"
    }else{
      switch(lockId){
        case 'login1':
          this.login1++;
          break;
        case 'login2':
          this.login2++;
          break;
        case 'login3':
          this.login3++;
          break;
        default:
          console.log("?????????? HOw did you get here.");
      }
    }
  }

  toggleModal(){
    var modal = document.getElementById("diabolicalmodal");
    modal.hidden = !modal.hidden;
  }

}
