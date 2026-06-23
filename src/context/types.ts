export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  username(username: any, password: string): unknown
  email: any
  password: any
  rememberMe?: any
}

export type UserDataType = {
  
  // id: number
  // role: string
  email: any

  // fullName: string
  // username: string
  password: any

  avatar?: any

}

export type AuthValuesType = {
  loading: boolean;
  logout: () => void;
  user: UserDataType | null;
  setLoading: (value: boolean) => void;
  setUser: (value: UserDataType | null) => void;
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void;
};
