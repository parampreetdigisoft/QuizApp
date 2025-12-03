import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LoginRequestModel, LoginResponseModel } from '../models/auth-model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly _cookieName: string = '__Auth.User__'
  private readonly _cookieUserId: string = '__Auth.User__Id__'
  private readonly _roleCookieName: string = '__Auth.User__Role__'
  constructor(private _httpClient: HttpClient, private _cookieService: CookieService) {

  }

  login(model: LoginRequestModel): Observable<LoginResponseModel> {
    return this._httpClient.post<LoginResponseModel>(`${environment.baseUrl}/${environment.endpoints.login}`, model)
  }

  createAuthCookie(username: string, role: string, id: number) {
    // Remove old cookie (must match path to delete correctly)
    if (this._cookieService.check(this._cookieName)) {
      this._cookieService.delete(this._cookieName, '/');
      this._cookieService.delete(this._roleCookieName, '/');
      this._cookieService.delete(this._cookieUserId, '/');
    }

    // Create new cookie
    this._cookieService.set(
      this._cookieName, // cookie name
      username,            // cookie value
      7,                // expires in 7 days
      '/',              // path
      '',               // domain (current domain)
      true,             // secure (HTTPS only)
      'Strict'          // SameSite
    );

    this._cookieService.set(
      this._roleCookieName, // cookie name
      role,            // cookie value
      7,                // expires in 7 days
      '/',              // path
      '',               // domain (current domain)
      true,             // secure (HTTPS only)
      'Strict'          // SameSite
    );

    this._cookieService.set(
      this._cookieUserId, // cookie name
      `${id}`,            // cookie value
      7,                // expires in 7 days
      '/',              // path
      '',               // domain (current domain)
      true,             // secure (HTTPS only)
      'Strict'          // SameSite
    );
  }

  isUserLoggedIn(): boolean {
    return this._cookieService.check(this._cookieName);
  }

  logOutUser() {
    this._cookieService.delete(this._cookieName, '/');
    this._cookieService.delete(this._roleCookieName, '/');
    this._cookieService.delete(this._cookieUserId, '/');
  }
  getLoggedInUserName(): string {
    return this._cookieService.get(this._cookieName);
  }

  getLoggedInUserId(): string {
    return this._cookieService.get(this._cookieUserId);
  }

  isAdmin(): boolean {
    return this._cookieService.get(this._roleCookieName).toLocaleLowerCase() == "admin"
  }
}
