import { Button, Table, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react'
import axios from 'axios'
const { confirm } = Modal
export default function RoleList() {
  //` table 的数据源
  const [dataSource, setDataSource] = useState([])
  //` 权限数据
  const [rightList, setRightList] = useState([])
  //` 用于判断当前点了哪个
  const [currentId, setCurrentId] = useState(0)
  const [isModalVisible, setModalVisible] = useState(false)
  const [currentRights, setCurrentRights] = useState([])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (_, item) => {
        return <div>
          <Button onClick={() => handleConfirm(_, item)} danger shape='circle' icon={<DeleteOutlined></DeleteOutlined>} ></Button>
          <Button onClick={() => editClick(item)} icon={<EditOutlined></EditOutlined>} shape='circle' type='primary'></Button>
        </div>
      }
    }
  ]
  useEffect(() => {
    axios.get('http://localhost:11111/roles').then(res => {
      // console.log('roles', res.data);
      setDataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:11111/rights?_embed=children').then(res => {
      setRightList(res.data)
    })
    return () => {
    }
  }, [])

  const handleConfirm = (_, item) => {
    confirm({
      title: '确认删除?',
      content: '删除后不可恢复',
      icon: <DeleteOutlined></DeleteOutlined>,
      onOk() {
        deleteMethod(_, item)
      },
      onCancel() { }
    })
  }
  const editClick = (item) => {
    setModalVisible(true)
    setCurrentRights(item.rights)
    setCurrentId(item.id)
  }
  //- 删除
  const deleteMethod = (_, item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`http://localhost:11111/roles/${item.id}`).then(res => { })
  }
  //- modal 方法
  const handleOk = () => {
    setModalVisible(false)
    setDataSource(dataSource.map(item => {
      if (item.id === currentId) {
        return {
          // . 其他的不动 只替换rights
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:11111/roles/${currentId}`, {
      rights: currentRights
    })
  }
  // - 取消
  const handleCancel = () => {
    setModalVisible(false)
  }
  // - tree check 方法
  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys)
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
      <Modal title='权限分配' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {/* checkStrictly 为true时 取消强关联 */}
        <Tree checkable treeData={rightList} checkedKeys={currentRights} checkStrictly onCheck={onCheck}></Tree>
      </Modal>
    </div>
  )
}
