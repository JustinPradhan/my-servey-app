export const MAX_DATE_APP_USER = "MaxDateAppUser";
export const MAX_DATE_APP_DEPARTMENT = "MaxDateAppDepartment";
export const ACCESS_TOKEN = "AccessToken";
export const REFRESH_TOKEN = "RefreshToken";
export const IS_LOGIN = "isLogin";
export const USER_ID = "UserId";
export const LOGIN_INFO = "LoginInfo";
export const COMP_CODE = "CompCode";
//#region  - Get LocalStorage
export function getLocalStorage(key:string) {

    return localStorage.getItem(key);
  }




export const GET_STORED_ACCESS_TOKEN = getLocalStorage(ACCESS_TOKEN);


export function clearLocalStorage() {
  window.localStorage.clear();
  window.location.replace("/signin");
}

export function clearLocalStorageForRefresh() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}



export function setLocalStorageIsLogin(
  isLogin:any,
  userId:string
) {
  localStorage.setItem(IS_LOGIN, isLogin);
  localStorage.setItem(USER_ID,userId)
}


export function getLocalStorageUserInfo() {
  const userInfo : any = localStorage.getItem(LOGIN_INFO);
  const parsedData = JSON.parse(userInfo);
  return parsedData;
}

export function setLocalStorageTokenAndLoginInfo(
  accessToken:string,
  refreshToken:string,
  data:any
) {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
  if(data){
    localStorage.setItem(LOGIN_INFO, JSON.stringify(data))
  }

}
export function setLocalStorageLoginInfo(
  data:any
) {

  if(data){
    localStorage.setItem(LOGIN_INFO, JSON.stringify(data))
  }

}


export function setLocalStorageCompCode(
  compCode:string
) {
  localStorage.setItem(COMP_CODE, compCode);
}

export const GET_USER_ID = getLocalStorage(USER_ID);
export const GET_MAX_DATE_APP_USER = getLocalStorage(MAX_DATE_APP_USER);
export const GET_MAX_DATE_APP_DEPARTMNET = getLocalStorage(MAX_DATE_APP_DEPARTMENT);