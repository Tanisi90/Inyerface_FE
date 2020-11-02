import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { LoggedUser } from '../models/logged-user';
import { User } from '../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  mazeWidth = 30;
  mazeHeight = 30;
  rowPosition = 1;
  colPosition = 1;
  currentCell;
  pointIds:{name:string,color:string,pos:{row:number,col:number}}[] = [
    {name: "username", color:"rgb(0, 38, 255)", pos:{row:0,col:0}},
    {name:"password",color:"rgb(115, 20, 153)",pos:{row:0,col:0}},
    {name:"security",color:"rgb(191, 11, 11)",pos:{row:0,col:0}},
    {name:"email",color:"rgb(216, 66, 227)",pos:{row:0,col:0}},
    {name:"phone",color:"rgb(5, 232, 103)",pos:{row:0,col:0}},
    {name:"color",color:"rgb(234, 255, 0)",pos:{row:0,col:0}}
  ];
  // isolated;
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
  color: string = "blue";
  u: User;
  storedSQuestion: number;

  constructor(private userServ:UserService, private router:Router, public lgdUser:LoggedUser) { }

  ngOnInit(): void {
    console.log(this.lgdUser);
    this.createBlankMaze();
    this.paint();
    this.checkpoints();
    // this.isolated = (document.getElementsByClassName("unoccupied")).length;
    // if(this.isolated > 0){
    //   console.log("Has Things");
    //   this.findUO();
    // }
    // console.log(this.isolated);
    document.onkeydown = (event) => {
      switch (event.keyCode) {
        case 37:
        case 65:
          this.movePos("left");
          break;
        case 38:
        case 87:
          this.movePos("top");
          break;
        case 39:
        case 68:
          this.movePos("right");
          break;
        case 40:
        case 83:
          this.movePos("bottom");
          break;
      }

      if (this.rowPosition == this.mazeHeight && this.colPosition == this.mazeWidth){
        this.update();
      }
      for(var id of this.pointIds){
        if(id.pos.row == this.rowPosition && id.pos.col == this.colPosition){
          this.toggleModal(id.name);
        }
      }
    }

  }

  createBlankMaze() {

    var rowIndex, colIndex;

    var table = document.createElement("table");
    var tbody = document.createElement("tbody");

    for (rowIndex = 1; rowIndex <= this.mazeHeight; rowIndex++) {

      var row = document.createElement("tr");

      for (colIndex = 1; colIndex <= this.mazeWidth; colIndex++) {

        var col = document.createElement("td");
        if (rowIndex == 1 && colIndex == 1) {

          col.style.backgroundColor = "rgb(255, 145, 0)";
          col.setAttribute("type", "start");

        } else if (rowIndex == this.mazeHeight && colIndex == this.mazeWidth) {

          col.style.backgroundColor = "rgb(0,244,0)";
          col.setAttribute("type", "finish");

        } else {
          col.style.backgroundColor = "rgb(0,0,0)";

        }
        if (col.getAttribute("type") == "start") {
          col.classList.add("occupied");
          this.currentCell = col;
        } else {
          col.classList.add("unoccupied");
        }
        col.setAttribute("id", "cell_" + rowIndex + "_" + colIndex);
        row.appendChild(col);

      }

      tbody.appendChild(row);

    }

    table.appendChild(tbody);

    document.getElementById("maze_container").appendChild(table);

  }

  // findUO() {
  //   var islands = document.getElementsByClassName("unoccupied");
  //   for(var i = 0; i < islands.length; i++){
  //     console.log(islands.item(i));
  //   }
  // }

  paint() {

    var startAtRow = 1;
    var startAtCol = 1;

    var currentCell;

    this.addRoute(startAtRow, startAtCol, false);

    for (var n = 1; n < (this.mazeWidth * this.mazeHeight) - 1; n++) {

      currentCell = document.getElementById("cell_" + startAtRow + "_" + startAtCol);

      if (currentCell.classList.contains("occupied")) {

        this.addRoute(startAtRow, startAtCol, true);

      }

      if (startAtCol == this.mazeWidth) {

        startAtRow++;
        startAtCol = 1;

      } else {

        startAtCol++;

      }

    }

  }

  checkpoints(){
    var taken:{row:number,col:number}[] = [
      {row:1,col:1},
      {row:this.mazeHeight,col:this.mazeWidth}
    ]
    var tryAgain = false;
    for(var id of this.pointIds){
      var newest:{row:number,col:number} = {row:0,col:0};
      do{
        tryAgain = false;
        newest.row = Math.floor(Math.random() * this.mazeHeight)+1;
        newest.col = Math.floor(Math.random() * this.mazeWidth)+1;
        if(taken.includes(newest)){
          tryAgain = true;
        }
      }while(tryAgain)
      taken.push(newest);
      var hold = document.getElementById("cell_" + newest.row + "_" + newest.col);
      hold.style.backgroundColor = id.color;
      id.pos = newest;
    }
  }

  addRoute(startAtRow, startAtCol, createDetour) {

    var validExits = ["right", "bottom", "left", "top"];

    var remainingExits = { "right": this.mazeWidth, "bottom": this.mazeHeight, "left": 0, "top": 0 };

    var nextExits = [];

    var lastCells = [];

    var rowIndex = startAtRow;

    var colIndex = startAtCol;

    var currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

    var exit;

    var lastExit;

    var exitIndex;

    var loop = 0;

    var loopFuse = 0;

    var maxLoops = 3 * this.mazeWidth * this.mazeHeight;

    var nextPossibleCell;

    while (loop < ((this.mazeWidth * this.mazeHeight) - 1)) {

      loopFuse++;

      if (loopFuse >= maxLoops) { break; }

      nextExits = [];

      for (var i = 0; i < validExits.length; i++) {

        switch (validExits[i]) {

          case "right":
            nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex + 1));
            break;

          case "left":
            nextPossibleCell = document.getElementById("cell_" + rowIndex + "_" + (colIndex - 1));
            break;

          case "bottom":
            nextPossibleCell = document.getElementById("cell_" + (rowIndex + 1) + "_" + colIndex);
            break;

          case "top":
            nextPossibleCell = document.getElementById("cell_" + (rowIndex - 1) + "_" + colIndex);
            break;

        }

        if (nextPossibleCell != null) {

          if (nextPossibleCell.classList.contains("unoccupied")) {

            for (var t = 0; t < remainingExits[validExits[i]]; t++) {

              nextExits.push(validExits[i]);

            }

          }

        }

      }

      if (nextExits.length == 0) {

        if (createDetour == true) {

          return false;


        } else {

          lastCells.splice(lastCells.length - 1, 1);
          if (lastCells[lastCells.length - 1] == undefined) {
            currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
          }
          else {
            rowIndex = lastCells[lastCells.length - 1][0];
            colIndex = lastCells[lastCells.length - 1][1];
            currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);
          }
          continue;

        }

      }

      exitIndex = Math.floor(Math.random() * Math.floor(nextExits.length));

      exit = nextExits[exitIndex];

      if (createDetour == false) {

        currentCell.style["border-" + exit] = "none";

      } else {

        if (!(exit == "right" && colIndex == this.mazeWidth - 1 && rowIndex == this.mazeHeight) &&
          !(exit == "bottom" && colIndex == this.mazeWidth && rowIndex == this.mazeHeight - 1)) {

          currentCell.style["border-" + exit] = "none";

        }
      }

      switch (exit) {

        case "right":

          colIndex = colIndex + 1;
          remainingExits.left++;
          remainingExits.right--;
          break;

        case "bottom":

          rowIndex = rowIndex + 1;
          remainingExits.top++;
          remainingExits.bottom--;
          break;

        case "left":

          colIndex = colIndex - 1;
          remainingExits.left--;
          remainingExits.right++;
          break;

        case "top":

          rowIndex = rowIndex - 1;
          remainingExits.top--;
          remainingExits.bottom++;
          break;

      }

      lastCells.push([rowIndex, colIndex]);

      currentCell = document.getElementById("cell_" + rowIndex + "_" + colIndex);

      switch (exit) {

        case "right":

          currentCell.style["border-left"] = "none";
          break;

        case "bottom":

          currentCell.style["border-top"] = "none";
          break;

        case "left":

          currentCell.style["border-right"] = "none";
          break;

        case "top":

          currentCell.style["border-bottom"] = "none";
          break;

      }

      if (rowIndex == this.mazeHeight && colIndex == this.mazeWidth) {
        currentCell.classList.add("occupied");
        currentCell.classList.remove("unoccupied");
        break;

      }
      currentCell.classList.add("occupied");
      currentCell.classList.remove("unoccupied");

      lastExit = exit;

      loop++;

    }

  }

  //CONTROL SECTION//
  movePos(direction) {
    var checkpoint = false;
    for(var id of this.pointIds){
      if(id.pos.row == this.rowPosition && id.pos.col == this.colPosition){
        this.currentCell.style.backgroundColor = id.color;
        checkpoint = true;
      }
    }
    if(checkpoint == false){
      this.currentCell.style.backgroundColor = "rgb(0,0,0)";
    }

    switch (direction) {

      case "right":

        if (this.currentCell.style.borderRight != "") {

          this.colPosition++;

        }

        break;

      case "left":

        if (this.currentCell.style.borderLeft != "") {

          this.colPosition--;

        }
        break;

      case "top":

        if (this.currentCell.style.borderTop != "") {

          this.rowPosition--;

        }

        break;

      case "bottom":

        if (this.currentCell.style.borderBottom != "") {

          this.rowPosition++;

        }
        break;

    }

    this.currentCell = document.getElementById("cell_" + this.rowPosition + "_" + this.colPosition);
    this.currentCell.style.backgroundColor = "rgb(255, 145, 0)";
  }

  //MODAL STUFF

  toggleModal(name:string){
    //alert("Put Modal Here!");
    var modal = document.getElementById(name+"modal");
    modal.hidden = !modal.hidden;
  }

  update(){
    alert("Finished");
    
    this.userServ.update(this.lgdUser.user).subscribe(
      (response:any)=>{
        this.lgdUser.user = response;
        alert("Account Updated!");
      }
    );

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

  getRandomColor() {
    var rando = Math.floor(Math.random() * 12);
    for (var i = 0; i < 12; i++) {
      if (i == rando) {
        this.color = this.colorList[i];
      }
    }
  }


}
