import { Injectable } from "@angular/core";
import { User } from "../model/user";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map, shareReplay, tap } from "rxjs/operators";
import { json } from "body-parser";
const AUTH_USER = "auth_user";
@Injectable({
  providedIn: "root",
})
export class AuthStore {
  private subject = new BehaviorSubject(null);

  user$: Observable<User> = this.subject.asObservable();
  isLoggedIn$: Observable<boolean>;
  isLoggedOut$: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.isLoggedIn$ = this.user$.pipe(map((user) => !!user));
    this.isLoggedOut$ = this.isLoggedIn$.pipe(map((loggedIn) => !loggedIn));

    const user = localStorage.getItem(AUTH_USER);
    if (user) {
      this.subject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string) {
    return this.http.post("/api/login", { email, password }).pipe(
      tap((user) => {
        this.subject.next(user),
          localStorage.setItem(AUTH_USER, JSON.stringify(user));
      }),
      shareReplay()
    );
  }
  logout() {
    this.subject.next(null);
    localStorage.removeItem(AUTH_USER);
  }
}
