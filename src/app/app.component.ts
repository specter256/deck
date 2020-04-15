import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  title = 'deck';

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.autoLogin();
  }
}
