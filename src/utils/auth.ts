import { JSEncrypt } from 'jsencrypt';

const TOKEN_KEY = 'token';
const PUBLIC_KEY =
  'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKY8d1QTXbSGA40WTheIr5mjJG7CmrMSi6K/9RDdctezjVfH2E/xShs6spv7474PeLYhb9PLiEmSU82Ir65rX98CAwEAAQ==';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

const encryptPassword = (password: string) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(PUBLIC_KEY);
  return encrypt.encrypt(password);
};

export { isLogin, getToken, setToken, clearToken, encryptPassword };
