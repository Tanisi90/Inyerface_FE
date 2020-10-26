import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationComponent implements OnInit {

  lastLeng: number = 0;
  shiftBy: number = 3;
  securityQ: string[];
  failedPass: string[] = [];
  passValid: boolean = false;
  colorList: string[] = [""];
  symbol: string[] = ['a', '!', '🎃', '%', '&', '|', '🐺', ')', '%', '👁', '💌', '@', '~', ',', '>', '?', '🔑', '🗡'];
  domain: string[] = ['.aws', 'com', 'net', '.ged', '.gov', '.web', '.uwu', '.owo', '.007', '.>:)', '.edu', '.com',];
  website: string[] = ['hotmess', 'hotseat', 'hotchoc', 'hotmail', 'horseman', 'gangrene', 'gmale', 'gman', 'geyser', 'grimlock', 'gmail', 'yoohoo', 'yahoo', 'awol', 'aol'];



  constructor() { }

  ngOnInit(): void {
  }

  cipher(): void {
    var input = <HTMLInputElement>document.getElementById("userField");
    var old: String = input.value
    if (this.lastLeng < old.length) {
      //ASCII VALUES NEC.
      //NUMS: 48-53
      //CAPS: 65-90
      //LOWS: 97-122
      var coded: string = "";
      var toCode: number = old.charCodeAt(old.length - 1);
      if (toCode <= 53 && toCode >= 48) {
        toCode += this.shiftBy;
        if (toCode > 53) {
          toCode = 48 + (toCode - 54);
        }
        coded = String.fromCharCode(toCode);
      } else if (toCode <= 90 && toCode >= 65) {
        toCode += this.shiftBy;
        if (toCode > 90) {
          toCode = 65 + (toCode - 91);
        }
        coded = String.fromCharCode(toCode);
      } else if (toCode <= 122 && toCode >= 97) {
        toCode += this.shiftBy;
        if (toCode > 122) {
          toCode = 97 + (toCode - 123);
        }
        coded = String.fromCharCode(toCode);
      } else {
        coded = old.charAt(old.length - 1);
      }
      input.value = old.slice(0, old.length - 1).concat(coded);
    }
    this.lastLeng = old.length;
  }

  correctReg() {

  }

  incorrectReg() {

  }

  checkRules() {
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var rule1 = /(\W|_)+[A-Za-z0-9]+(\W|_)+[A-Za-z0-9]+(\W|_)+/;
    var rule3 = /.*[A-Z].*/;
    this.passValid = false;
    if (password != null) {
      var message = document.getElementById("passMess");
      if (this.failedPass.includes(password)) {
        (<HTMLInputElement>document.getElementById("password")).value = "";
        alert("For security reasons you can no longer use this password, please type something else.");
      } else {
        var check1 = password.match(rule1);
        var check2 = password.match(rule3);
        console.log(check1);
        console.log(check2);
        if (check1 != null && check2 != null) {
          var phonNum = this.getPhone();
          var hasNum = false;
          console.log(phonNum);
          for(var i=0; i < phonNum.length; i++){
            if(password.includes(phonNum.charAt(i))){
              console.log("Includes Right Num");
              hasNum = true;
              break;
            }
          }
          if(hasNum == true){
            var hasCol = false;
            console.log("Checking Colors");
            for(var color of this.colorList){
              if(password.includes(color)){
                hasCol = true;
                break;
              }
            }
            if(hasCol == true){
              this.passValid = true;
            }
          }
        }
        if(this.passValid == false) {
          message.innerText = "Your password is not within guidelines.";
        }
      }
    }
  }

  getPhone():string{
    var digits = document.getElementsByClassName("numberbox");
    console.log(digits.length);
    var number:string[] = [];
    for(var i = 0; i < digits.length; i++){
      number.push((<HTMLInputElement>digits.item(i)).value);
    }
    return number.join("");
  }

  matchPass() {
    if (this.passValid == true) {
      var toCheck = <HTMLInputElement>document.getElementById("confirmpassword");
      var checkAgainst = <HTMLInputElement>document.getElementById("password");
      var message = document.getElementById("passMess");
      if (toCheck.value != checkAgainst.value) {
        this.failedPass.push(checkAgainst.value);
        checkAgainst.value = "";
        this.passValid = false;
        alert("Passwords don't match. For security, you must use a different password.");
      } else {
        message.innerText = "Passwords match!";
      }
    }
  }

  lockNum(toLock: string) {
    document.getElementById(toLock).classList.toggle("open");
  }

  getRandomNumber() {
    var digits = document.getElementsByClassName("open");
    for (var i = 0; i < digits.length; i++) {
      (<HTMLInputElement>digits.item(i)).value = Math.floor(Math.random() * 9).toString();
    }
    this.getPhone();
  }
}
