import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DriverProvider } from 'protractor/built/driverProviders';
import { stringify } from 'querystring';
import { User } from '../models/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class RegistrationComponent implements OnInit {

  lastLeng: number = 0;
  shiftBy: number = 3;
  securityQ = [
    {
      qString: "What is your favorite Security Question?",
      qNum: 1
    },
    {
      qString: "Who decided to put letters in math????",
      qNum: 2
    },
    {
      qString: "What is your Favorite Color?",
      qNum: 3
    },
    {
      qString: "If there's four houses, five aliens, twelve pieces of bologne,\n and a pineapple, how many pizzas are falling from the sky?",
      qNum: 4
    },
    {
      qString: "What is the airspeed velocity of an unladen swallow?",
      qNum: 5
    },
    {
      qString: "Why is a raven like a writing desk?",
      qNum: 6
    },
    {
      qString: "Do you like waffles?",
      qNum: 7
    },
  ];
  formFields: string[] = ["userField", "password", "confirmpassword", "securityQ", "email", "website", "domain", "symbol", "colorPick",
    "numbers", "numbers1", "numbers2", "numbers3", "numbers4", "numbers5", "numbers6", "numbers7", "numbers8", "numbers9",];
  feedback: string[] = ["qAnswer", "passMess"];
  failedPass: string[] = [];
  passValid: boolean = false;
  colorList: string[] = ["red", "orange", "yellow", "green", "lime", "cyan", "blue", "pink", "purple", "white", "brown", "black"];
  symbol: string[] = ['a', '!', '🎃', '%', '&', '|', '🐺', ')', '%', '👁', '💌', '@', '~', ',', '>', '?', '🔑', '🗡'];
  domain: string[] = ['.aws', 'com', 'net', '.ged', '.gov', '.web', '.uwu', '.owo', '.007', '.>:)', '.edu', '.com',];
  website: string[] = ['hotmess', 'hotseat', 'hotchoc', 'hotmail', 'horseman', 'gangrene', 'gmale', 'gman', 'geyser', 'grimlock', 'gmail', 'yoohoo', 'yahoo', 'awol', 'aol'];
  colorSelected: string;
  imgFileName: string;
  imposter: string = "";
  u: User;
  

  constructor(private router: Router, private userInfo: UserService) { }

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
    // this piece allow me to have a popup if the user email is not valid/ null
    let fullemail = this.varifier();
    if(fullemail == null){
      alert("You have entered an invalid email");
    }
    let user = new User(username, password, fullemail, phone,  security, securityAns , this.colorSelected);
    let username = (<HTMLInputElement>document.getElementById("userField")).value;
    let password = (<HTMLInputElement>document.getElementById("password")).value;
    let security = (<HTMLSelectElement>document.getElementById("securityQ")).value;
    let securityAns = <HTMLInputElement>document.getElementById("...")).value; // need to make if statement for security answer as well as make a id value for the answer created. 
    let phone = this.getPhone();
    
    this.userInfo.register(user).subscribe((response:any) => {
      this.u = response;
      this.router.navigateByUrl("/login");

    });

  }

  incorrectReg() {
    this.failedPass = [];
    for (var field of this.formFields) {
      var element = document.getElementById(field);
      if (element.tagName != 'SELECT') {
        (<HTMLInputElement>element).value = "";
      }
      else {
        (<HTMLSelectElement>element).selectedIndex = 0;
      }
    }
    for (var message of this.feedback) {
      document.getElementById(message).innerHTML = "";
    }
  }

  showAnswer() {
    var change = document.getElementById("qAnswer");
    change.innerHTML = "";
    var check = (<HTMLInputElement>document.getElementById("securityQ")).value;
    if (check == '2') {
      var drop = document.createElement("select");
      var answ0 = document.createElement("option");
      var answ1 = document.createElement("option");
      var answ2 = document.createElement("option");
      var answ3 = document.createElement("option");
      var answ4 = document.createElement("option");
      var answ5 = document.createElement("option");
      var answ6 = document.createElement("option");
      var answ7 = document.createElement("option");

      answ1.value = "Viète";
      answ1.innerText = "Viète";
      answ2.value = "Aristotle";
      answ2.innerText = "Aristotle";
      answ3.value = "Plato";
      answ3.innerText = "Plato";
      answ4.value = "Newton";
      answ4.innerText = "Newton";
      answ5.value = "Gattie";
      answ5.innerText = "Gattie";
      answ6.value = "Einstein";
      answ6.innerText = "Einstein";
      answ7.value = "Euripides";
      answ7.innerText = "Euripides";
     
      drop.id = 'aSelections';
      drop.appendChild(answ0);
      drop.appendChild(answ1);
      drop.appendChild(answ2);
      drop.appendChild(answ3);
      drop.appendChild(answ4);
      drop.appendChild(answ5);
      drop.appendChild(answ6);
      drop.appendChild(answ7);
      change.appendChild(drop);

      drop.addEventListener("change", (e:MouseEvent) => this.newtonImg());
    }
    else if (check == '3') {
      change.innerText = "You can't choose this, it's already a question";
    }
    else {
      var answBox = document.createElement("input");
      answBox.id = 'answBox';
      answBox.type = 'text';
      answBox.placeholder = 'Answer Here'
      change.appendChild(answBox);
    }
  }

  newtonImg(){
    //var answ4 = document.createElement("option");
    let img = <HTMLSelectElement> document.getElementById("aSelections");
    if(img.options[img.selectedIndex].innerText == "Newton"){
      document.getElementById("Newt").hidden = true;
      console.log("yo what?")
    }else{
      document.getElementById("Newt").hidden = false;
      console.log("well yeah now you should work!")
      console.log(img.options[img.selectedIndex].innerText);
    }
  }



  checkRules() {
    var password = (<HTMLInputElement>document.getElementById("password")).value;
    var rule1 = /(\W|_)+[A-Za-z0-9]+(\W|_)+[A-Za-z0-9]+(\W|_)+/;
    var rule3 = /.*[A-Z].*/;
    this.passValid = false;
    if (password != null) {
      var message = document.getElementById("passMess");
      message.innerText = "";
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
          for (var i = 0; i < phonNum.length; i++) {
            if (password.includes(phonNum.charAt(i))) {
              console.log("Includes Right Num");
              hasNum = true;
              break;
            }
          }
          if (hasNum == true) {
            var hasCol = false;
            console.log("Checking Colors");
            for (var color of this.colorList) {
              console.log(color);
              if (password.includes(color)) {
                console.log('passes');
                hasCol = true;
                break;
              }
            }
            if (hasCol == true) {
              this.passValid = true;
            }
          }
        }
        if (this.passValid == false) {
          message.innerText = "Your password is not within guidelines.";
        }
      }
    }
  }

  getPhone(): string {
    var digits = document.getElementsByClassName("numberbox");
    console.log(digits.length);
    var number: string[] = [];
    for (var i = 0; i < digits.length; i++) {
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

  // concat the symbols together to varify valid email. 
  varifier() {
    if ((<HTMLInputElement>document.getElementById("symbol")).value == "@") {
      let validator: string = "";
      let website = ["hotmail", "gmail", "aol", "yahoo"];
      if (website.includes((<HTMLInputElement>document.getElementById("website")).value)) {
        if ((<HTMLInputElement>document.getElementById("domain")).value == ".com") {
          return validator.concat((<HTMLInputElement>document.getElementById("email")).value,
            (<HTMLInputElement>document.getElementById("symbol")).value,
            (<HTMLInputElement>document.getElementById("website")).value,
            (<HTMLInputElement>document.getElementById("domain")).value)
        }
      }
    } 
    return null;
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

  selectColor(color: string) {
    this.colorSelected = color;
    this.imgFileName = "../../assets/TheBois/" + color + "Boi.png";
    this.toggleModal();
    this.setImposter();
  }

  toggleModal() {
    var modal = document.getElementById("amongusmodal");
    modal.hidden = !modal.hidden;
  }

  setImposter() {
    if (this.imposter != "") {
      document.getElementById("ejected").innerHTML = "";
      for (var i = 0; i < 12; i++) {
        var unhide = document.getElementById(this.colorList[i] + 'boi');
        console.log(unhide);
        if (unhide.parentElement.hidden == true) {
          unhide.parentElement.hidden = false;
        }
      }
    }
    var rando = Math.floor(Math.random() * 12);
    for (var i = 0; i < 12; i++) {
      if (i == rando) {
        this.imposter = this.colorList[i] + "boi";
      }
    }
  }

  imposterOrNah(chosen: string) {
    var check = document.getElementById(chosen);
    var ejected = document.getElementById("ejected");
    var makeFly = document.createElement("span");
    makeFly.classList.add("flier");
    check.parentElement.hidden = true;
    var copy = check.cloneNode(true);
    makeFly.appendChild(copy);
    ejected.appendChild(makeFly);
    if (chosen == this.imposter) {
      this.toggleModal();
    }
  }
}
