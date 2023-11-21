export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  userName?: string;
  userAvatar?: string;
  email?: string;
  createDate?: string;
  id?: string;
  role: RoleType;
}
