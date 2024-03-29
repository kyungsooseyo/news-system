import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd';
import './sideMenu.scss'
import { UserOutlined, VideoCameraOutlined, UploadOutlined, QqOutlined, TableOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import axios from 'axios';
const { Sider } = Layout;
function SideMenu(props) {
  // console.log('pppp', props);
  const [menu, setMenu] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:11111/rights?_embed=children').then(res => {
      console.log('sideMenu', res.data)
      setMenu(res.data)
    })
    return () => {
    }
  }, [])
  const iconList = {
    '/home': <UserOutlined />,
    '/right-manage': <VideoCameraOutlined />,
    '/user-manage': <UploadOutlined />,
    '/news-manage': <QqOutlined />,
    '/audit-manage': <TableOutlined />,
  }
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  const TreeDataSource = (arr) => {
    if (!Array.isArray(arr)) {
      return;
    }
    //` 不需要完全复制,只需要一些关键key label 就行
    return arr.filter(item => item?.pagepermisson === 1 && !!rights?.checked ? rights?.checked?.includes(item?.key) : rights?.includes(item?.key)).map((v, i) => {
      //+ 如果有children 并且children的length为0 那么在渲染菜单的时候是没法点击进行路由跳转的 所以不能用v.children这么判断;因为v.children 会被当为true
      if (v.children?.length > 0) {
        return {
          // ...v,
          id: v.id,
          key: v.key,
          label: v.title,
          grade: v.grade,
          icon: iconList[v.key],
          children: TreeDataSource(v.children.filter(item => item?.pagepermisson === 1)),
        };
      } else {
        return {
          // ...v,
          id: v.id,
          key: v.key,
          icon: iconList[v.key],
          grade: v.grade,
          label: v.title,
        };
      }
    });
  }
  const renderMenu = () => {
    // return [
    //   {
    //     label: '首页',
    //     icon: <UserOutlined />,
    //     key: '/home',
    //     children: [
    //       {
    //         label: '首页2',
    //         key: '/home2',
    //         icon: <UserOutlined />
    //       }
    //     ]
    //   },
    //   {
    //     label: '视频',
    //     icon: <VideoCameraOutlined />,
    //     key: '/video'
    //   },
    //   {
    //     label: '上传',
    //     icon: <UploadOutlined />,
    //     key: '/upload'
    //   },
    //   {
    //     key: '/right-manage',
    //     label: '权限管理',
    //     icon: <UserOutlined />,
    //     children: [
    //       {
    //         label: '用户列表',
    //         key: '/right-manage/user/list',
    //         icon: <QqOutlined />
    //       },
    //       {
    //         label: '角色列表',
    //         key: '/right-manage/role/list',
    //         icon: <UserOutlined />
    //       }
    //     ]
    //   }
    // ]
    return TreeDataSource(menu)
  }
  // console.log(props); //~ 通过withRouter包装的组件,props中有history,location,match
  const selectMenu = props.location.pathname
  const openKeys = props.location.pathname.split('/')[1]
  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} className='side-menu-container'>

      <div className="menu-wrapper">
        <div className="logo">new system</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectMenu]}
          defaultOpenKeys={[`/${openKeys}`]}
          //` 函数式编程
          items={renderMenu()}
          onClick={(e) => {
            props.history.push(e.key)
          }}
        />
      </div>
    </Sider>
  )
}
const mapStateToProps = (state) => {
  return {
    isCollapsed: state.collapsedReducer.isCollapsed,
  }
}
//= 父级没给传 只能靠withRouter包一下
export default connect(mapStateToProps)(withRouter(SideMenu))