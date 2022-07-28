import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import axios from 'axios'
export default function RightList() {

  useEffect(() => {
    axios.get('http://localhost:11111/rights').then(res => {
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
      // key: 'name',
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
    },
  ];

  return (
    <div>
      <Table dataSource={dataSource} columns={columns}></Table>

    </div>
  )
}
