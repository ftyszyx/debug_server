export enum ApiPath {
  //auth
  Login = "/api/auth/login",
  LoginOut = "/api/auth/logout",
  //user
  GetUserInfo = "/api/user/getUserInfo",
  GetUserList = "/api/user/getList",
  AddUser = "/api/user/add",
  UpUser = "/api/user/up",
  DelUser = "/api/user/del",
  ChangeMyPass = "/api/user/changeMyPass",
  ChangePass = "/api/user/changePass",

  //role
  GetRoles = "/api/role/getList",
  GetAllRoles = "/api/role/getAll",
  GetRoleById = "/api/role/getByIds",
  UpRole = "/api/role/up",
  DelRole = "/api/role/del",
  AddRole = "/api/role/add",
  UpRolePower = "/api/role/upRolesPower",
  UpRoleMenu = "/api/role/upRolesMenu",
  //menu
  GetMenus = "/api/menu/getList",
  GetAllMenus = "/api/menu/getAll",
  GetMenuById = "/api/menu/getByIds",
  AddMenu = "/api/menu/add",
  UpMenu = "/api/menu/up",
  DelMenu = "/api/menu/del",
  //power
  GetPowers = "/api/power/getList",
  getAllPowers = "/api/power/getAll",
  GetPowerById = "/api/power/getByIds",
  AddPower = "/api/power/add",
  UpPower = "/api/power/up",
  DelPower = "/api/power/del",
}

export enum PagePath {
  Login = "/user/login",
  AdminHome = "/home",
  AdminUser = "/system/useradmin",
  AdminPower = "/system/poweradmin",
  AdminMenu = "/system/menuadmin",
  AdminRole = "/system/roleadmin",
  Err404 = "/404",
  Err401 = "/401",
}
