import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, } from 'antd'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal
export default function NewsDraft() {
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
      key: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.title
    },
    {
      title: '操作',
      //! 要想传递把参数传递过去,就不要用dataIndex,或者写上dataIndex 那么第二个参数就是该行的数据
      dataIndex: 'operate',
      key: 'operate',
      render: (_, item) => {
        return <div>
          <Button shape="circle" danger icon={<DeleteOutlined></DeleteOutlined>} onClick={() => handleConfirm(_, item)}></Button>
          <Button type="primary" shape="circle" icon={<EditOutlined></EditOutlined>} onClick={() => editClick(item)} ></Button>
          <Button type="primary" shape="circle" icon={<UploadOutlined></UploadOutlined>} onClick={() => editClick(item)} ></Button>
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
    axios.delete(`http://localhost:11111/news/${item.id}`).then(res => {
      getData()
    })
  }
  //- 编辑
  const editClick = (item) => {
    // console.log('edit', item);
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
          pageSize: 5,
        }}></Table>
    </div>
  )
}
