import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { StoreService } from './../../services/store.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  isNavCollapsed = true;

  constructor(
    public store: StoreService,
    private auth: AuthService,
  ) { }

  ngOnInit(): void {
    this.store.getNotes();
    this.isNavCollapsed = JSON.parse(localStorage.getItem('isNavCollapsed'));
    const isDarkTheme = localStorage.getItem('isDarkTheme');

    if (isDarkTheme) {
      this.store.isDarkTheme = JSON.parse(isDarkTheme);
    }
  }

  logout(): void {
    this.auth.signOut();
  }

  collapseNav(): void {
    this.isNavCollapsed = !this.isNavCollapsed;
    localStorage.setItem('isNavCollapsed', JSON.stringify(this.isNavCollapsed));
  }

  closeMobileNav(): void {
    if (this.store.isPhoneScreen || this.store.isTabletScreen) {
      this.store.isNavOpened = false;
    }
  }

  onChangeTheme(event: any): void {
    this.store.isDarkTheme = event.checked;
    localStorage.setItem('isDarkTheme', JSON.stringify(this.store.isDarkTheme));
  }
}
