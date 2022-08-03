import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Select, Input } from 'antd'
const { Option } = Select
// ~ 通过forwardRef将组件转换为ref调用 起到了透传的作用
const UserForm = forwardRef((props, ref) => {
  const [isDisabled, setDisabled] = useState(false)
  //` 有点类似watch的作用 监听父组件传递过来的值得变化
  useEffect(() => {
    setDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  const roleChange = (value, ref) => {
    if (value === 1) {
      setDisabled(true)
      ref.current.setFieldsValue({
        region: '',
      })
    } else {
      setDisabled(false)
    }
  }
  return (
    <Form
      layout="vertical"
      ref={ref}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: '请输入用户名',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: '请输入密码',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={isDisabled ? [] : [{ required: true, message: '请选择区域' }]}
      >
        <Select disabled={isDisabled}>
          {props.regionList.map(item => {
            return <Option key={item.id} value={item.value}>{item.title}</Option>
          })}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: '请选择角色',
          },
        ]}
      >
        <Select onChange={(value) => roleChange(value, ref)}>
          {
            props.roleList.map(item => <Option key={item.id} value={item.id}>{item.roleName}</Option>)
          }
        </Select>
      </Form.Item>
    </Form>
  )
})

export default UserForm 