import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import SideMenu from '../../components/SendBox/SideMenu'
import TopHeader from '../../components/SendBox/TopHeader';
import Home from './Home/Home';
import UserList from './UserManage/UserList'
import RoleList from './RightManage/RoleList'
import RightList from './RightManage/RightList'
import NoPermission from '../NoPermission/NoPermission'
import { Layout } from "antd";
import './index.scss';
export default function NewsSandBox() {
  const { Content } = Layout;
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className='site-layout'>
        <TopHeader></TopHeader>
        <Content style={{ margin: '20px', background: 'white', padding: '20px', overflow: 'auto' }}>
          <Switch>
            <Route path={'/home'} component={Home}></Route>
            <Route path={'/user-manage/list'} component={UserList}></Route>
            <Route path={'/right-manage/role/list'} component={RoleList}></Route>
            <Route path={'/right-manage/right/list'} component={RightList}></Route>
            {/* ~必须加exact */}
            <Redirect to={'/home'} from='/' exact></Redirect>
            <Route path='*' component={NoPermission}></Route>
          </Switch>
        </Content>
      </Layout>
    </Layout>
  )
}
