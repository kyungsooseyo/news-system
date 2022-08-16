import React from 'react'
import { Layout, Dropdown, Menu, Space, Avatar } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, DownOutlined, UserOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
function TopHeader(props) {
  const { Header } = Layout
  const changeCollapsed = () => {
    console.log(props);
    props.changeCollapsed(!props.isCollapsed)
  }
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))
  //, 退出登录
  const logout = () => {
    console.log('logout');
    localStorage.removeItem('token');
    props.history.replace('/login')
  }
  const menu = (
    <Menu
      // ! items中的key要不一样，否则hover的时候都会有背景色
      items={[
        {
          key: '1',
          label: (
            <p style={{ 'color': 'skyblue' }}>{roleName}</p>
          ),
        },
        {
          key: '2',
          label: (
            <span onClick={() => { logout() }}>退出登录</span>
          ),
          danger: true,
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
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div>
        <span className='desc'>欢迎{username}回来</span>
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
const mapStateToProps = (state) => {
  return {
    isCollapsed: state.collapsedReducer.isCollapsed,
  }
}
// const mapDispatchToProps = {
//   changeCollapsed() {
//     return {
//       type: 'CHANGE_COLLAPSED'
//     }
//   }
// }
const mapDispatchToProps = (dispatch) => {
  return {
    changeCollapsed(status) {
      // console.log('status',status);
      dispatch({
        type: 'CHANGE_COLLAPSED',
        payload: status,
      })
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))