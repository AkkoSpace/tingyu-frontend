import { defineStore } from 'pinia';
import {
  auth as userAuth,
  DeleteData,
  deleteUser,
  getUserInfo,
  InfoData,
  login as userLogin,
  LoginData,
  logout as userLogout,
  register as userRegister,
  RegisterData,
  updateUserInfo,
  updatePasswordData,
  updatePassword,
} from '@/api/user';
import { clearToken, setToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: undefined,
    userAccount: undefined,
    userName: undefined,
    userAvatar: undefined,
    createDate: undefined,
    userRole: '',
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.userRole = this.userRole === 'user' ? 'admin' : 'user';
        resolve(this.userRole);
      });
    },

    // 注册(Register)
    async register(registerForm: RegisterData) {
      try {
        const res = await userRegister(registerForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // 登录(Login)
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.toString());
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // 登出(Logout)
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },

    // 更新密码(Update password)
    async updatePassword(passwordForm: updatePasswordData) {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await updatePassword(passwordForm);
        if (res.data) {
          this.logoutCallBack();
        }
      } catch (err) {
        throw err;
      }
    },

    // 注销(Delete)
    async delete(id: DeleteData) {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await deleteUser(id);
        if (res.data) {
          this.logoutCallBack();
        }
      } catch (err) {
        throw err;
      }
    },

    // 验证(Auth)
    async auth() {
      try {
        const res = await userAuth();
        setToken(res.data);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // 获取用户信息(Info)
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    // 设置用户信息(Set user's information)
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // 重置用户信息(Reset user's information)
    resetInfo() {
      this.$reset();
    },

    // 更新用户信息(Update user's information)
    async updateInfo(infoForm: InfoData) {
      const res = await updateUserInfo(infoForm);
      this.setInfo(res.data);
    },

    // 登出回调函数(Logout callback function)
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
  },
});

export default useUserStore;
