import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private userServ:UserService, private router:Router) { }

  ngOnInit(): void {
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
    alert("Put Modal Here!");
    // var modal = document.getElementById(name);
    // modal.hidden = !modal.hidden;
  }

  update(){
    alert("Finished");
    // this.userServ.update(this.lgdUser.user).subscribe(
    //   (response:any)=>{
    //     this.lgdUser.user = response;
    //     alert("Account Updated!");
    //   }
    // );

  }
}
