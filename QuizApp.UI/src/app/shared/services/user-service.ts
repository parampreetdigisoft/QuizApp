import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterRequestModel, UserDetailModel } from '../../core/modules/auth/models/auth-model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private _httpClient: HttpClient) {

  }

  createOrUpdate(model: RegisterRequestModel) {
    if (model.id > 0)
      return this.update(model);
    return this.create(model);
  }

  private create(model: RegisterRequestModel): Observable<object> {
    return this._httpClient.post(`${environment.baseUrl}/${environment.endpoints.userEndpoint}/register`, model);
  }
  private update(model: RegisterRequestModel): Observable<object> {
    return this._httpClient.put(`${environment.baseUrl}/${environment.endpoints.userEndpoint}/${model.id}`, model);
  }
  delete(userId: number): Observable<object> {
    return this._httpClient.delete(`${environment.baseUrl}/${environment.endpoints.userEndpoint}/${userId}`);
  }
  getAll(): Observable<UserDetailModel[]> {
    return this._httpClient.get<UserDetailModel[]>(`${environment.baseUrl}/${environment.endpoints.allUsers}`)
  }
}
