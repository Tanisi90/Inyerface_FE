import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DriverProvider } from 'protractor/built/driverProviders';
import { stringify } from 'querystring';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { timer } from 'rxjs';

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
      qString: "Pick a security question",
      qNum: 0
    },
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
  alive: number = 12;
  u: User;
  storedSQuestion: number;
  gameon = false;
  registering = false;


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
    console.log("ENTERS CR" + this.registering);
    // this piece allow me to have a popup if the user email is not valid/ null
    if(this.registering == true){
      return;
    }
    this.registering = true;
    let fullemail = this.varifier();
    if (fullemail == null) {
      alert("You have entered an invalid email." +
        "\nValid symbols: @" +
        "\nValid websites: gmail, hotmail, yahoo, aol" +
        "\nValid domains: .com");
        this.registering = false;
      return;
    }
    let username = (<HTMLInputElement>document.getElementById("userField")).value;
    let password = (<HTMLInputElement>document.getElementById("password")).value;
    // need to make if statement for security answer as well as make a id value for the answer created. 
    let securityAns: string;
    if (this.storedSQuestion == 2) {
      securityAns = (<HTMLSelectElement>document.getElementById("aSelections")).value;
      if(securityAns != "Newton"){
        alert("Answer Incorrect!");
        this.registering = false;
        return;
      }
    } else if (this.storedSQuestion == 3) {
      alert("You cannot pick a question that you must answer!!!!");
      this.registering = false;
      return;
    } else {
      securityAns = (<HTMLInputElement>document.getElementById("answBox")).value;
    }
    if (this.colorSelected == "") {
      alert("You must select a favorite color! (Hint: Color only stores if you win.");
      this.registering = false;
      return;
    }
    let phone = this.getPhone();
    let user = new User(0, username, password, fullemail, phone, this.storedSQuestion, securityAns, this.colorSelected);
    this.userInfo.register(user).subscribe((response: any) => {
      alert("Submitted!");
      this.registering = false;
      this.router.navigateByUrl("");
    }, (error:any) =>{
      alert("Submission failed :(");
      this.registering = false;
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
    this.storedSQuestion = <number>(<unknown>check);
    console.log(this.storedSQuestion);
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

      drop.addEventListener("change", (e: MouseEvent) => this.newtonImg());
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

  newtonImg() {
    //var answ4 = document.createElement("option");
    let img = <HTMLSelectElement>document.getElementById("aSelections");
    if (img.options[img.selectedIndex].innerText == "Newton") {
      document.getElementById("Newt").hidden = true;
      console.log("yo what?")
    } else {
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
              if (password.toLowerCase().includes(color)) {
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
      var num;
      do {
        num = Math.floor(Math.random() * 10).toString();
      } while (num == "10")

      (<HTMLInputElement>digits.item(i)).value = num;
    }
    this.getPhone();
  }

  selectColor(color: string) {
    this.colorSelected = color;
    this.imgFileName = "../../assets/TheBois/" + color + "Boi.png";
    this.toggleModal();
    this.setImposter();

    const source = timer(5000, 5000);
    const abc = source.subscribe(val => {
      if (this.gameon == false) {
        abc.unsubscribe()
      } else {
        this.killCM();
        this.alive--;
        if (this.alive == 2) {
          if (this.imposter == (this.colorSelected + "boi")) {
            this.toggleModal();
            alert("You Won! You were the imposter! (how could you have done this?)");
          } else {
            alert("Defeat!");
            this.colorSelected = "";
            this.toggleModal();
          }
          abc.unsubscribe();
        }
      }
    });
  }

  killCM() {
    var dead = false;
    var reg = /Dead/;
    do {
      let rando = Math.floor(Math.random() * 12);
      if (this.colorList[rando] == this.colorSelected) {
        this.toggleModal();
        alert("You Died, Try Again!");
        this.colorSelected = "";
        return;
      }
      var id = this.colorList[rando] + "boi";
      if (id != this.imposter) {
        var body = <HTMLImageElement>document.getElementById(id)
        console.log(body.src);
        if (body.parentElement.hidden == false && reg.test(body.src) == false) {
          body.src = body.src.replace("Boi.png", "Dead.png");
          dead = true;
        }
      }
    } while (dead == false)
  }

  toggleModal() {
    var modal = document.getElementById("amongusmodal");
    modal.hidden = !modal.hidden;
    this.gameon = !modal.hidden;
  }

  setImposter() {
    if (this.imposter != "") {
      var reg = /Dead/;
      var bois = document.getElementsByClassName("au");
      var mini = document.getElementById("mini");
      mini.parentElement.hidden = false;
      for (var i = 0; i < 12; i++) {
        var revive = <HTMLImageElement>bois.item(i);
        if (reg.test(revive.src)) {
          revive.src = revive.src.replace("Dead.png", "Boi.png");
        }
      }
      this.alive = 12;
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
    this.imposter = this.colorList[rando] + "boi";
    console.log(this.imposter);
  }

  imposterOrNah(chosen: string) {
    var check = document.getElementById(chosen);
    var checkSrc = (<HTMLImageElement>check).src; 
    var reg = /Dead/;
    if(reg.test(checkSrc)){
      alert("He's dead Jim");
      return;
    }
    var you = <HTMLImageElement>document.getElementById("mini");
    var ejected = document.getElementById("ejected");
    var makeFly = document.createElement("span");
    makeFly.classList.add("flier");
    check.parentElement.hidden = true;
    var copy = check.cloneNode(true);
    makeFly.appendChild(copy);
    ejected.appendChild(makeFly);
    if (checkSrc == you.src) {
      you.parentElement.hidden = true;
      var minCop = you.cloneNode(true);
      var ejected = document.getElementById("ejected");
      var minFly = document.createElement("span");
      minFly.classList.add("flier");
      minFly.appendChild(minCop);
      var time = timer(2000, 2000);
      var wait = time.subscribe(val => {
        ejected.appendChild(minFly);
        wait.unsubscribe();
      })
    }
    if (chosen == this.imposter) {
      this.toggleModal();
      if (checkSrc == you.src) {
        alert("You Were the Imposter! You lose, try again!");
        this.colorSelected = "";
      } else {
        alert("You found the Imposter! Congrats!");
      }
    }else{
      if(checkSrc == you.src){
        this.toggleModal();
        alert("You Were Not An Imposter :( You lose, try again!");
        this.colorSelected = "";
      }else{
        alert("They were Not An Imposter. 1 Imposter remaining.");
      }
    }
  }
}
