import React, { useState, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Home from '../../views/NewsSandBox/Home/Home';
import UserList from '../../views/NewsSandBox/UserManage/UserList'
import RoleList from '../../views/NewsSandBox/RightManage/RoleList'
import RightList from '../../views/NewsSandBox/RightManage/RightList'
import NoPermission from '../../views/NoPermission/NoPermission'
import NewsAdd from '../../views/NewsSandBox/NewsManage/NewsAdd'
import NewsDraft from '../../views/NewsSandBox/NewsManage/NewsDraft'
import NewsCategory from '../../views/NewsSandBox/NewsManage/NewsCategory'
import Audit from '../../views/NewsSandBox/AuditManage/Audit'
import AuditList from '../../views/NewsSandBox/AuditManage/AuditList'
import Unpublished from '../../views/NewsSandBox/PublishManage/Unpublished'
import Published from '../../views/NewsSandBox/PublishManage/Published'
import Sunset from '../../views/NewsSandBox/PublishManage/Sunset'
import axios from 'axios';
export default function NewsRouter() {
  const [backRouterList, setBackRouterList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:11111/rights'),
      axios.get('http://localhost:11111/children'),
    ]).then(res => {
      setBackRouterList([...res[0].data, ...res[1].data])
      //! 在set完之后 console的话是拿不到最新的数据的
      // console.log('backRouterList', backRouterList)
    })
  }, [])
  const localRouterMap = {
    '/home': Home,
    '/user-manage/list': UserList,
    '/right-manage/role/list': RoleList,
    '/right-manage/right/list': RightList,
    '/news-manage/add': NewsAdd,
    '/news-manage/draft': NewsDraft,
    '/news-manage/category': NewsCategory,
    '/audit-manage/audit': Audit,
    '/audit-manage/list': AuditList,
    '/publish-manage/unpublished': Unpublished,
    '/publish-manage/published': Published,
    '/publish-manage/sunset': Sunset,
  }
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  const checkRoute = (item) => {
    // console.log(item);
    return localRouterMap[item.key] && item.pagepermisson === 1
  }
  const checkUserPermission = (item) => {
    // = 有时候会多了一层checked包裹 所以要多下判断
    return !!rights?.checked ? rights?.checked.includes(item.key) : rights?.includes(item.key)
  }
  return (
    <Switch>
      {/* <Route path={'/home'} component={Home}></Route>
      <Route path={'/user-manage/list'} component={UserList}></Route>
      <Route path={'/right-manage/role/list'} component={RoleList}></Route>
      <Route path={'/right-manage/right/list'} component={RightList}></Route> */}
      {/* 本身路由是模糊匹配的，后端给的数据包含类似/user-manage 这样的一级路由，这样的一级路由本身是没有菜单的，所有要进行精确匹配 */}
      {
        backRouterList.map(item => {
          if (checkRoute(item) && checkUserPermission(item)) {
            return <Route key={item.key} path={item.key} component={localRouterMap[item.key]} exact></Route>
          }
          return null
        })
      }
      {/* ~必须加exact */}
      <Redirect to={'/home'} from='/' exact></Redirect>
      {/* 为了避免初始化直接显示403，加上这样的会白屏一下，但不会显示403 */}
      {
        backRouterList.length > 0 && <Route path='*' component={NoPermission}></Route>
      }
    </Switch>
  )
}
