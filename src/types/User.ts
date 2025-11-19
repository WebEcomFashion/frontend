export enum UserRole {
  Admin = 1,
  User = 2,
}

export interface UserBase {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  Role: UserRole;
}

export interface UserCreateDto extends UserBase {
  PasswordHash: string;
}

export interface UserUpdateDto extends UserBase {
  Id: number;
  CreatedAt: string;
}

export interface UserReadDto extends UserBase {
  Id: number;
  createdAt: string | number | Date;
}

export type UserList = UserReadDto[];

export interface UserState {
  users: UserReadDto[];
  user: UserReadDto | null;
  loading: boolean;
  error: string | null;
}
