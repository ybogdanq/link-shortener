export enum ApiRoutes {
  //USER
  GetUser = "/dev/user/get-user",
  //AUTH
  Login = "/dev/auth/login",
  Logout = "/dev/auth/logout",
  Register = "/dev/auth/register",
  RefreshToken = "/dev/auth/refresh-token",
  //LINKS
  GetLinkById = "/dev/links/get-link/",
  GetAllLinks = "/dev/links/all",
  CreateLink = "/dev/links/create-link",
  DeactivateLink = "/dev/links/deactivate-link/",
  VisitLink = "/dev/links/visit-link/",
  DeleteLink = "/dev/links/delete-link/",
}
