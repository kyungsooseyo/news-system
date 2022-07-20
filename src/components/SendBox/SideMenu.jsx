import React, { useState } from 'react'
import { Layout, Menu } from 'antd';
import './sideMenu.scss'
import { UserOutlined, VideoCameraOutlined, UploadOutlined, QqOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
const { Sider } = Layout;
function SideMenu(props) {
  // console.log('pppp', props);
  const [collapsed, setCollapsed] = useState(false);
  const renderMenu = () => {
    return [
      {
        label: '首页',
        icon: <UserOutlined />,
        key: '/home',
        children: [
          {
            label: '首页2',
            key: '/home2',
            icon: <UserOutlined />
          }
        ]
      },
      {
        label: '视频',
        icon: <VideoCameraOutlined />,
        key: '/video'
      },
      {
        label: '上传',
        icon: <UploadOutlined />,
        key: '/upload'
      },
      {
        key: '/right-manage',
        label: '权限管理',
        icon: <UserOutlined />,
        children: [
          {
            label: '用户列表',
            key: '/right-manage/user/list',
            icon: <QqOutlined />
          },
          {
            label: '角色列表',
            key: '/right-manage/role/list',
            icon: <UserOutlined />
          }
        ]
      }
    ]
  }
  return (
    <Sider trigger={null} collapsible collapsed={collapsed} className='side-menu-container'>
      <div className="logo">new system</div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        //` 函数式编程
        items={renderMenu()}
        onClick={(e) => {
          props.history.push(e.key)
        }}
      />
    </Sider>
  )
}
//= 父级没给传 只能靠withRouter包一下
export default withRouter(SideMenu)