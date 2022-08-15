import React from 'react'
import NewsPublish from '../../../components/PublishManage/NewsPublish';
import usePublish from '../../../components/PublishManage/usePublish';
import { Button } from 'antd';
export default function Published() {
  //= 1 待发布 2 已发布 3 已下线
  const { dataSource, handleSunset } = usePublish(2)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={() => handleSunset(id)}>下线</Button>}></NewsPublish>
    </div>
  )
}
