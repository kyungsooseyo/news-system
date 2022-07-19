import React, { useState } from 'react'
import { Layout, Menu } from 'antd';
import './sideMenu.scss'
import { UserOutlined, VideoCameraOutlined, UploadOutlined } from '@ant-design/icons';
const { Sider } = Layout;
export default function SideMenu() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className='side-menu-container'>
      <div className="logo" >new system</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <UserOutlined />,
            label: '首页',
            children: [
              {
                key: '1-1',
                label: '首页2',
                to: '/home3',
                icon: <VideoCameraOutlined />,
              }
            ]
          },
          {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: 'nav 2',
          },
          {
            key: '3',
            icon: <UploadOutlined />,
            label: 'nav 3',
          },
        ]}

      />
    </Sider>
  )
}
