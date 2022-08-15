import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tooltip, notification } from 'antd'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { NavLink, withRouter } from 'react-router-dom'
import axios from 'axios'
const { confirm } = Modal
function NewsDraft(props) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    getData()
  }, [])

  //~ dataIndex 相当于element的prop
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        // console.log('ttt',title)
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
      render: (category) => {
        //! 只有一个参数 且dataIndex对应的上 那么category就是该行整条数据
        // console.log('cacaca', category)
        return category.title
      }
    },
    {
      title: '操作',
      //! 要想传递把参数传递过去,就不要用dataIndex,或者写上dataIndex 那么第二个参数就是该行的数据
      dataIndex: 'operate',
      render: (_, item) => {
        return <div>
          <Button shape="circle" danger icon={<DeleteOutlined></DeleteOutlined>} onClick={() => handleConfirm(_, item)}></Button>
          <Tooltip title='更新'>
            <Button type="primary" shape="circle" icon={<EditOutlined></EditOutlined>} onClick={() => editClick(item)} ></Button>
          </Tooltip>
          <Tooltip title='审核'>
            <Button type="primary" shape="circle" icon={<UploadOutlined></UploadOutlined>} onClick={() => handleCheck(item)} ></Button>
          </Tooltip>
        </div>
      }
    },
  ];
  //====== 方法
  //, 确认
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
    axios.delete(`http://localhost:11111/news/${item.id}`).then(res => {
      getData()
    })
  }
  //, 编辑
  const editClick = (item) => {
    // console.log('edit', item);
    props.history.push(`/news-manage/update/${item.id}`)
  }
  //, 审核
  const handleCheck = (item) => {
    console.log('check', item);
    axios.patch(`http://localhost:11111/news/${item.id}`, {
      auditState: 1
    }).then(res => {
      notification.success({
        message: '通知',
        description: '您可以到审核列表查看审核结果',
        placement: 'bottomRight'
      })
      props.history.push('/audit-manage/list')
    })
  }
  const getData = () => {
    axios.get(`http://localhost:11111/news?author=${username}&auditState=0&_expand=category`).then(res => {
      const list = res.data
      setDataSource(list)
    })
  }
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={record => record.id}
        pagination={{
          pageSize: 10,
        }}></Table>
    </div>
  )
}
export default withRouter(NewsDraft)