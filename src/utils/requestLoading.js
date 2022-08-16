import axios from 'axios';
import { store } from '../redux/store';
axios.interceptors.request.use(
  (config) => {
    // 显示loading
    store.dispatch({
      type: 'CHANGE_LOADING',
      payload: true,
    });
    return config;
  },
  (error) => {
    // 发生错误时隐藏loading
    store.dispatch({
      type: 'CHANGE_LOADING',
      payload: false,
    });
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  (response) => {
    // 关闭loading
    store.dispatch({
      type: 'CHANGE_LOADING',
      payload: false,
    });
    return response;
  },
  (error) => {
    // 关闭loading
    store.dispatch({
      type: 'CHANGE_LOADING',
      payload: false,
    });
    return Promise.reject(error);
  }
);
