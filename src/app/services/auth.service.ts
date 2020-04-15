import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any = {};

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
  ) { }

  setUserData(user: any): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
    };
    this.userData = userData;

    return userRef.set(userData, {
      merge: true
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.setUserData(result.user);
      localStorage.setItem('user', JSON.stringify(this.userData));
    } catch (error) {
      throw (error);
    }
  }

  async signOut(): Promise<void> {
    await this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

  autoLogin(): void {
    if (this.isLoggedIn()) {
      this.userData = JSON.parse(localStorage.getItem('user'));
    }
  }

  isLoggedIn(): boolean {
    let user = localStorage.getItem('user');

    if (user)
      user = JSON.parse(user);

    return user ? true : false;
  }
}
