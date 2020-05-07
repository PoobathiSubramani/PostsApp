import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component ({
  templateUrl: './signup.component.html',
  selector: 'app-signup',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  isLoading = false;

  constructor(public authService: AuthService){}

  onSignup (form: NgForm) {
    if(form.invalid) {
      return;
    } else {
      console.log("invoking AuthService.createUser");
      this.authService.createUser(form.value.email, form.value.password);
    }
  }
}
