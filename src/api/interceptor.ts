import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken } from '@/utils/auth';

export interface HttpResponse<T = unknown> {
  status: number;
  message: string;
  code: number;
  data: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

let tokenFlag = false;

axios.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // let each request carry token
    // this project(TingYu) using the JWT token
    // Authorization is a custom headers key
    const token = getToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
      if (!tokenFlag) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // access token 有效期不足一分钟或已过期时，重新获取 access token
        if (payload.exp * 1000 - 1000 * 60 < Date.now()) {
          tokenFlag = true;
          const userStore = useUserStore();
          userStore.auth().then(() => {
            tokenFlag = false;
          });
          // await useUserStore().logout();
        }
      }
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse> | any) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message.error({
        content: res.message || 'Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (
        [50008, 50012, 50014].includes(res.code) &&
        response.config.url !== '/api/user/info'
      ) {
        Modal.error({
          title: 'Confirm logout',
          content:
            'You have been logged out, you can cancel to stay on this page, or log in again',
          okText: 'Re-Login',
          async onOk() {
            const userStore = useUserStore();
            await userStore.logout();
            window.location.reload();
          },
        });
      }
      return Promise.reject(new Error(res.message || 'Error'));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);
