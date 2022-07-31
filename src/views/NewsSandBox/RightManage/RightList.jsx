import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios'
const { confirm } = Modal
export default function RightList() {
  
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
      //! 要想传递把参数传递过去,就不要用dataIndex,或者写上dataIndex 那么第二个参数就是该行的数据
      dataIndex: 'operate',
      render: (_, item) => {
        return <div>
          <Button shape="circle" danger icon={<DeleteOutlined></DeleteOutlined>} onClick={() => handleConfirm(_, item)}></Button>
          <Popover content={<div style={{ 'textAlign': 'center' }}>
            <Switch checked={item.pagepermisson} onChange={(checked) => handleSwitch(checked, item)}></Switch>
          </div>} title='页面配置项' trigger={'click'}>
            <Button type="primary" shape="circle" icon={<EditOutlined></EditOutlined>} onClick={() => editClick(item)} ></Button>
          </Popover>
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
    if (item.grade === 1) {
      setDataSource(dataSource.filter(v => v.id !== item.id))
      axios.delete(`http://localhost:11111/rights/${item.id}`).then(res => {
        getData()
      })
    } else {
      let list = dataSource.filter(v => v.id === item.rightId)
      // 通过下面这个操作已经将dataSource里面第二层数据改变了
      list[0].children = list[0].children.filter(v => v.id !== item.id)
      // 这要对dataSource 重新展开一下
      setDataSource([...dataSource])
      axios.delete(`http://localhost:11111/children/${item.id}`).then(res => { getData() })
    }
  }
  //- 开关
  const handleSwitch = (checked, item) => {
    // console.log(checked, item);
    item.pagepermisson = checked ? 1 : 0
    setDataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`http://localhost:11111/rights/${item.id}`, { pagepermisson: item.pagepermisson }).then(res => { getData() })

    } else {
      axios.patch(`http://localhost:11111/children/${item.id}`, { pagepermisson: item.pagepermisson }).then(res => { getData() })

    }
  }
  //- 编辑
  const editClick = (item) => {
    // console.log('edit', item);
  }
  const getData = () => {
    axios.get('http://localhost:11111/rights?_embed=children').then(res => {
      console.log('rights', res.data)
      const list = res.data
      list.forEach((item) => {
        if (item.children.length === 0) {
          item.children = null
        }
      })
      setDataSource(list)
    })
  }
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
