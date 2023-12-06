import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface RegisterData {
  userAccount: string;
  userPassword: string;
  checkPassword: string;
}

export interface LoginData {
  userAccount: string;
  userPassword: string;
}

export interface DeleteData {
  id: string;
}

export interface InfoData {
  userName: string;
  userProfile: string;
}

export interface LoginRes {
  token: string;
}

export interface updatePasswordData {
  oldPassword: string;
  newPassword: string;
}

export function register(data: RegisterData) {
  return axios.post<LoginRes>('/api/user/register', data);
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/api/user/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function updatePassword(data: updatePasswordData) {
  return axios.post('/api/user/update/password', data);
}

export function deleteUser(data: DeleteData) {
  return axios.post('/api/user/delete', data);
}

export function auth() {
  return axios.post('/api/user/auth');
}

export function getUserInfo() {
  return axios.get<UserState>('/api/user/info');
}

export function updateUserInfo(data: InfoData) {
  return axios.post('/api/user/update/info', data);
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}
