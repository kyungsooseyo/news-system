import React from 'react'
import NewsPublish from '../../../components/PublishManage/NewsPublish';
import usePublish from '../../../components/PublishManage/usePublish';
import { Button } from 'antd';
export default function Unpublished() {
  //= 1 待发布 2 已发布 3 已下线
  //+ 为什么选择传递button组件 而不是传递数值 让子组件进行条件渲染;是因为配合hook
  const { dataSource, handlePublish } = usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource}
        button={(id) => <Button type='primary'
          onClick={() => handlePublish(id)}>发布</Button>}>
      </NewsPublish>
    </div>
  )
}
