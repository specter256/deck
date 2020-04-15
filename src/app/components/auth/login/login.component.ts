import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isLoading = false;
  form: FormGroup;
  public loginInvalid: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  async onSubmit() {
    this.isLoading = true;
    this.loginInvalid = false;

    if (!this.form.valid) {
      return;
    }

    try {
      const username = this.form.get('username').value;
      const password = this.form.get('password').value;
      await this.authService.signIn(username, password);
      this.router.navigate(['/']);
    } catch (err) {
      this.loginInvalid = true;
    }

    this.isLoading = false;
  }
}
