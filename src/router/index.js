import React from 'react';
import { HashRouter, Redirect, Route, Switch, BrowserRouter } from 'react-router-dom';
import NewsSandBox from '../views/NewsSandBox/NewsSandBox.jsx';
import Login from '../views/Login/Login.jsx';
import News from '../views/News/News.jsx';
import Detail from '../views/News/Detail.jsx';
export default function IndexRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path={'/news'} component={News}></Route>
        <Route path={'/detail/:id'} component={Detail}></Route>
        {/* <Route path='/' component={NewsSandBox} /> */}
        <Route
          path={'/'}
          render={() =>
            localStorage.getItem('token') ? (
              <NewsSandBox></NewsSandBox>
            ) : (
              <Redirect to={'/login'}></Redirect>
            )
          }
        ></Route>
      </Switch>
    </BrowserRouter>
  );
}
