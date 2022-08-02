import React, { useState, useEffect, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios'
import UserForm from '../../../components/UserManage/UserForm';
const { confirm } = Modal
export default function UserList() {

  const [dataSource, setDataSource] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [roleList, setRoleList] = useState([])
  const [regionList, setRegionList] = useState([])
  const addForm = useRef(null)
  useEffect(() => {
    getData()
    getRolesList()
    getRegionList()
  }, [])
  //~ dataIndex 相当于element的prop
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      }
      // key: 'name',
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (_, item) => {
        return <Switch checked={item.roleState} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      //! 要想传递把参数传递过去,就不要用dataIndex,或者写上dataIndex 那么第二个参数就是该行的数据
      dataIndex: 'operate',
      render: (_, item) => {
        return <div>
          <Button shape="circle" danger icon={<DeleteOutlined></DeleteOutlined>} onClick={() => handleConfirm(_, item)} disabled={item.default}></Button>
          <Button type="primary" shape="circle" icon={<EditOutlined></EditOutlined>} onClick={() => editClick(item)} disabled={item.default} ></Button>
        </div>
      }
    },
  ];
  //====== 方法
  //- 确认
  const handleConfirm = (_, item) => {
    confirm({
      title: '确认删除?',
      content: '删除后不可恢复',
      onOk() {
        deleteMethod(_, item)
      },
      onCancel() {
        console.log('Cancel');
      }
    });
  }
  const deleteMethod = (_, item) => {
    console.log('item', _, item);
    axios.delete(`http://localhost:11111/users/${item.id}`).then(res => {
      console.log('deleteRes', res);
      getData()
    })
    //· 不需要set 重新查询就可
    // setDataSource(dataSource.filter(data => data.id !== item.id))
  }
  //- 编辑
  const editClick = (item) => {
    // console.log('edit', item);
  }
  const getData = () => {
    axios.get('http://localhost:11111/users?_expand=role').then(res => {
      const list = res.data
      setDataSource(list)
    })
  }
  const getRegionList = () => {
    axios.get('http://localhost:11111/regions').then(res => {
      const list = res.data
      setRegionList(list)
    })
  }
  const getRolesList = () => {
    axios.get('http://localhost:11111/roles').then(res => {
      const list = res.data
      setRoleList(list)
    })
  }
  //- 点击确定
  const addFormOk = () => {
    addForm.current.validateFields().then(values => {
      console.log(values)
      setIsAddVisible(false)
      addForm.current.resetFields()
      //. post到后端 生成id 再设置到dataSource 方便后续操作
      axios.post('http://localhost:11111/users', {
        ...values,
        'roleState': true,
        'default': false,
      }).then(res => {
        console.log(res.data);
        // setDataSource([...dataSource, res.data])
        getData()
      })
    }).catch(err => { console.log(err) })
  }
  return (
    <div>
      <div className="button-wrapper" style={{ 'marginBottom': '20px' }}>
        <Button type='primary' onClick={() => setIsAddVisible(true)}>添加用户</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={record => record.id}
        pagination={{
          pageSize: 5,
        }}></Table>
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={() => { setIsAddVisible(false) }}
        onOk={() => addFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>
    </div>
  )
}
