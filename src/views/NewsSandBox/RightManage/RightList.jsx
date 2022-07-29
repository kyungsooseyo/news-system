import React, { useState, useEffect } from 'react'
import { Table, Tag, Button } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios'
export default function RightList() {

  useEffect(() => {
    axios.get('http://localhost:11111/rights?_embed=children').then(res => {
      console.log('rights', res.data)
      setDataSource(res.data)
    })
  }, [])
  const [dataSource, setDataSource] = useState([])
  //~ dataIndex 相当于element的prop
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
      // key: 'name',
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => <Tag color="cyan">{key}</Tag>
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: () => {
        return <div>
          <Button shape="circle" danger icon={<DeleteOutlined></DeleteOutlined>}></Button>
          <Button type="primary" shape="circle" icon={<EditOutlined></EditOutlined>}></Button>
        </div>
      }
    },
  ];

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}></Table>
    </div>
  )
}
