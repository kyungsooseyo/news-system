import React from 'react'
import { Table, Button } from 'antd'
import { NavLink } from 'react-router-dom'
export default function NewsPublish(props) {
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        console.log('ttt', title)
        //~ 虽然这个写在column里面;但是每个item是那一行代表的数据
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
          {props.button(item.id)}
        </div>
      }
    }
  ]
  return (
    <div>
      <Table columns={columns} dataSource={props.dataSource} pagination={{ pageSize: 10 }} rowKey={item => item.id}></Table>
    </div>
  )
}
