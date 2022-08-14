import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Table, Button, Tooltip, notification } from 'antd'
import { NavLink } from 'react-router-dom'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
export default function Audit() {
  const [dataSource, setDataSource] = useState([])
  const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))
  const roleObj = {
    1: 'superadmin',
    2: 'admin',
    3: 'editor'
  }
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        //~ 虽然这个写在column里面;但是每个item是那一行代表的数据
        // console.log('标题',item);
        return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (_, item) => {
        return <div>
          <Tooltip title='通过'>
            <Button type='primary'
              shape='circle'
              icon={<CheckOutlined />}
              style={{ 'marginRight': '10px' }}
              onClick={() => handlePass(item)}></Button>
          </Tooltip>
          <Tooltip title='不通过'>
            <Button type='primary'
              danger shape='circle'
              icon={<CloseOutlined />}
              onClick={() => handleNotPass(item)}>
            </Button>
          </Tooltip>
        </div>
      }
    }
  ]
  useEffect(() => {
    getData()
  }, [roleId, region, username])
  const getData = () => {
    axios.get('http://localhost:11111/news?auditState=1&_expand=category').then(res => {
      const list = res.data
      setDataSource(roleObj[roleId] === 'superadmin' ? list : [...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor'), ...list.filter(item => item.author === username)])
    })
  }
  //, 通过
  const handlePass = (item) => {
    axios.patch(`http://localhost:11111/news/${item.id}`, { auditState: 2, publishState: 1 }).then(res => {
      getData()
      notification.success({
        message: '通过成功',
        description: '您可以到【审核管理/审核列表】中查看您的审核状态',
        placement: 'bottomRight'
      })
    })
  }
  //, 不通过
  const handleNotPass = (item) => {
    axios.patch(`http://localhost:11111/news/${item.id}`, { auditState: 3, publishState: 0 }).then(res => {
      getData()
    })
  }
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={record => record.id}
        pagination={{
          pageSize: 5,
        }}></Table>
    </div>
  )
}
