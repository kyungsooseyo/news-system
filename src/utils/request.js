// 写一个拦截loading的请求
import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import { Spin } from 'antd';
import './loading.scss';
let httpRequestCount = 0;
const showLoading = () => {
  console.log('showLoading');
  if (httpRequestCount === 0) {
    const loadingContainer = document.createElement('div');
    loadingContainer.setAttribute('id', 'axiosLoading');
    document.body.appendChild(loadingContainer);
    ReactDom.render(<Spin tip='加载中...' size='large' />, loadingContainer);
  }
  httpRequestCount++;
};
const hideLoading = () => {
  httpRequestCount--;
  if (httpRequestCount === 0) {
    document
      .querySelector('body')
      .removeChild(document.querySelector('#axiosLoading'));
  }
};
axios.interceptors.request.use(
  (config) => {
    showLoading();
    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);
axios.interceptors.response.use((response) => {
  hideLoading();
  return response;
});
