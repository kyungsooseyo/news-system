import React from 'react'
import { Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from '@ant-design/icons';
// import Particles from 'react-tsparticles';
import { withRouter } from 'react-router-dom';
import './login.scss'
import axios from 'axios';
function Login(props) {
  const onFinish = (values) => {
    console.log('vv', values)
    axios.get(`http://localhost:11111/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      console.log('logRes', res.data);
      if (res.data.length === 0) {
        message.error('用户名或密码错误')
      } else {
        localStorage.setItem('token',JSON.stringify(res.data[0]))
        props.history.replace('/')
      }
    })
  }
  return (

    <div className='login-wrapper'>
      {/* <Particles height={document.documentElement.clientHeight} /> */}
      <div className="form-wrapper">

        <p className='login-title'>全球新闻发布系统</p>

        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default withRouter(Login)