export type AuthRole = "User" | "Admin" | "Moderator";

export type AuthUser = {
  id: string;          // Guid
  email: string;
  roles: AuthRole[];
};
