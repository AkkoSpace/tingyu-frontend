import { defineStore } from 'pinia';
import {
  auth as userAuth,
  getUserInfo,
  login as userLogin,
  LoginData,
  logout as userLogout,
  register as userRegister,
  RegisterData,
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
    }, // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      this.setInfo(res.data);
    },

    // auth
    async auth() {
      try {
        const res = await userAuth();
        setToken(res.data);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.toString());
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    async register(registerForm: RegisterData) {
      try {
        const res = await userRegister(registerForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },

    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    }, // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
