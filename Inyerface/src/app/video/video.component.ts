import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class VideoComponent implements OnInit {
  played = false;
  constructor(private router:Router) { }

  ngOnInit(): void {
    if(localStorage.getItem("completed") == null){
      this.router.navigateByUrl("/profile");
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl("");
  }

  profile(){
    localStorage.removeItem("completed");
    this.router.navigateByUrl("/profile");
  }
}
