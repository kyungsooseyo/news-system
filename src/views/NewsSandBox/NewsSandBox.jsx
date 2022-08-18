import React, { useEffect } from 'react'
import SideMenu from '../../components/SendBox/SideMenu'
import TopHeader from '../../components/SendBox/TopHeader';
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Layout } from "antd";
import './index.scss';
import NewsRouter from '../../components/SendBox/NewsRouter';
const { Content } = Layout;
export default function NewsSandBox() {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className='site-layout'>
        <TopHeader></TopHeader>
        <Content style={{ margin: '20px', background: 'white', padding: '20px', overflow: 'auto' }}>
          <NewsRouter></NewsRouter>
        </Content>
      </Layout>
    </Layout>
  )
}
