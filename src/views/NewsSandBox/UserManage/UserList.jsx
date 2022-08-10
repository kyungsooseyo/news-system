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
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [current, setCurrent] = useState(null)
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    1: 'superadmin',
    2: 'admin',
    3: 'editor'
  }
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
      filters: [...regionList.map(item => ({ text: item.title, value: item.value })), {
        text: '全球',
        value: ''
      }],
      onFilter: (value, record) => record.region === value,
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
        return <Switch checked={item.roleState} disabled={item.default} onChange={() => handleSwitchChange(item)}></Switch>
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
    //! 加定时器,为了让其同步更新，仅仅是set完了，但是模态框还没有生成 里面的表单可能拿不到
    setIsUpdateVisible(true)
    setTimeout(() => {
      if (item.roleId === 1) {
        setIsUpdateDisabled(true)
      } else {
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue(item)
    }, 0);
    setCurrent(item)
  }
  const getData = () => {
    axios.get('http://localhost:11111/users?_expand=role').then(res => {
      const list = res.data
      setDataSource(roleObj[roleId] === 'superadmin' ? list : [...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor'), ...list.filter(item => item.username === username)])
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
  //, 点击更新
  const updateFormOk = () => {
    setIsUpdateVisible(false)
    setIsUpdateDisabled(!isUpdateDisabled)
    updateForm.current.validateFields().then(values => {
      axios.patch(`http://localhost:11111/users/${current.id}`, values).then(res => {
        console.log(res.data);
        getData()
      })
    }).catch(err => { console.log(err) })
  }
  //, SwitchChange
  const handleSwitchChange = (item) => {
    console.log('iii', item);
    axios.patch(`http://localhost:11111/users/${item.id}`, {
      'roleState': !item.roleState
    }).then(res => {
      getData()
    })
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
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"

        onCancel={() => { setIsUpdateVisible(false); setIsUpdateDisabled(!isUpdateDisabled) }}
        onOk={() => updateFormOk()}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
