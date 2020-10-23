import { Component, OnInit, ViewEncapsulation } from '@angular/core';

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
  symbol: string[];
  domain: string[];
  website: string[];



  constructor() { }

  ngOnInit(): void {
  }

  cipher():void{
    var input = <HTMLInputElement>document.getElementById("userField");
    var old:String = input.value
    if(this.lastLeng < old.length){
      //ASCII VALUES NEC.
      //NUMS: 48-53
      //CAPS: 65-90
      //LOWS: 97-122
      var coded:string = "";
      var toCode:number = old.charCodeAt(old.length-1);
      if(toCode <= 53 && toCode >= 48 ){
        toCode += this.shiftBy;
        if(toCode > 53){
          toCode = 48 + (toCode - 54);
        }
        coded = String.fromCharCode(toCode);
      }else if(toCode <= 90 && toCode >= 65){
        toCode += this.shiftBy;
        if(toCode > 90){
          toCode = 65 + (toCode - 91);
        }
        coded = String.fromCharCode(toCode);
      }else if(toCode <= 122 && toCode >= 97){
        toCode += this.shiftBy;
        if(toCode > 122){
          toCode = 97 + (toCode - 123);
        }
        coded = String.fromCharCode(toCode);
      }else{
        coded = old.charAt(old.length-1);
      }
      input.value = old.slice(0,old.length-1).concat(coded);
    }
    this.lastLeng = old.length;
  }

  correctReg(){

  }

  incorrectReg(){

  }

  lockNum(toLock:string){
    document.getElementById(toLock).classList.toggle("open");
  }

  getRandomNumber(){
    var digits = document.getElementsByClassName("open");
    for(var i = 0; i < digits.length; i++){
      (<HTMLInputElement>digits.item(i)).value = Math.floor(Math.random()*9).toString();
    }
  }
}
