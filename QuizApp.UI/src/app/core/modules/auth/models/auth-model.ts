
export interface LoginRequestModel {
  username: string,
  password: string
}

export interface LoginResponseModel {
  user: UserDetailModel
}

export interface UserDetailModel {
  userId: number,
  userName: string,
  email: string,
  role: string,
}

export interface RegisterRequestModel {
  id: number,
  username: string,
  email: string,
  role: string,
  password: string,
  confirmPassword:string
}
