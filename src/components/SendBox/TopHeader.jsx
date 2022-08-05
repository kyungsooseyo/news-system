import React, { useState } from 'react'
import { Layout, Dropdown, Menu, Space, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, SmileOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
function TopHeader(props) {
  const { Header } = Layout
  const [collapsed, setCollapsed] = useState(false)
  const changeCollapsed = () => {
    setCollapsed(!collapsed)
  }
  //, 退出登录
  const logout = () => {
    console.log('logout');
    localStorage.removeItem('token');
    props.history.replace('/login')
  }
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
            <p onClick={() => { logout() }}>退出登录</p>
          ),
        },
        {
          key: '2',
          label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
              2nd menu item (disabled)
            </a>
          ),
          icon: <SmileOutlined />,
          disabled: true,
        },
      ]}
    />
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        paddingLeft: '25px',
      }}
    >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })} */}
      {
        collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div>
        <span className='desc'>欢迎回来</span>
        <Dropdown overlay={menu}>
          <Space>
            <Avatar size={25} icon={<UserOutlined />} />
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
    </Header>
  )
}
export default withRouter(TopHeader)