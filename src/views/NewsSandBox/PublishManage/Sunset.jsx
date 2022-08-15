import React from 'react'
import NewsPublish from '../../../components/PublishManage/NewsPublish';
import usePublish from '../../../components/PublishManage/usePublish';
import { Button } from 'antd';
export default function Sunset() {
  //= 1 待发布 2 已发布 3 已下线
  const { dataSource, handleDelete } = usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button danger onClick={() => handleDelete(id)}>删除</Button>}></NewsPublish>
    </div>
  )
}
