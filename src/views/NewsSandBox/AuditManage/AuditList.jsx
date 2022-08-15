import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button, notification, Table, Tag } from 'antd';
import { NavLink, withRouter } from 'react-router-dom'
function AuditList(props) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['black', 'orange', 'green', 'red']
        return <Tag color={colorList?.[auditState]}>{auditState === 1 ? '审核中' : auditState === 2 ? '审核通过' : '审核不通过'}</Tag>
      }
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (_, item) => {
        return <div>
          {
            item.auditState === 1 && <Button type="primary" danger onClick={() => handleCancel(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button type='primary' ghost onClick={() => handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && <Button type='primary' onClick={() => handleUpdate(item)}>更新</Button>
          }
        </div>
      }
    }

  ]
  useEffect(() => {
    //` _ne是不等于的意思 jsonServer特有的 lte是小于等于的意思
    axios.get(`http://localhost:11111/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
      .then(res => {
        console.log(res.data);
        setDataSource(res.data)
      })
  }, [username])
  // , 撤销
  const handleCancel = (item) => {
    axios.patch(`http://localhost:11111/news/${item.id}`, {
      auditState: 0
    })
      .then(res1 => {
        axios.get(`http://localhost:11111/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`)
          .then(res => {
            setDataSource(res.data)
            notification.success({
              message: '撤销成功',
              description: '您可以到草稿箱里面查看',
              placement: 'bottomRight'
            })
          }).catch(err => {
            console.log(err);
          })
      })
  }
  // ,更新
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }
  // ,发布
  const handlePublish = (item) => {
    axios.patch(`http://localhost:11111/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      props.history.push('/publish-manage/published')
      notification.success({
        message: '发布成功',
        description: '您可以到发布管理里面查看',
        placement: 'bottomRight'
      })
    })
  }
  return (
    <div>
      <Table columns={columns} dataSource={dataSource} pagination={{ pageSize: 10 }} rowKey={record => record.id} />
    </div>
  )
}
export default withRouter(AuditList)