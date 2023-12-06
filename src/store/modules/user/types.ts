export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  id?: string;
  userAccount?: string;
  userName?: string;
  userAvatar?: string;
  userRole: RoleType;
  createDate?: string;
  userProfile?: string;
}
