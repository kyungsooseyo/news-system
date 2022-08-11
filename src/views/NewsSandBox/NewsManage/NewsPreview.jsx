import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions } from 'antd'
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import axios from 'axios'
function NewsPreview(props) {
  // console.log(props)
  const [newsInfo, setNewsInfo] = useState({})
  useEffect(() => {
    axios.get(`http://localhost:11111/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      setNewsInfo(res.data)
    })
  }, [props.match.params.id])
  const auditList = ['未审核', '审核中', '审核通过', '审核不通过']
  const publishList = ['未发布', '待发布', '已上线', '已下线']
  return (
    <div>
      <PageHeader
        onBack={() => window.history.back()}
        title={newsInfo?.title}
        subTitle={newsInfo?.category?.title}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="创建者">{newsInfo?.author}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{moment(newsInfo?.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{newsInfo?.publishTime ? moment(newsInfo?.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
          <Descriptions.Item label="区域">{newsInfo?.region}</Descriptions.Item>
          <Descriptions.Item label="审核状态" >
            <span style={{ color: 'red' }}>{auditList[newsInfo?.auditState]}</span>
          </Descriptions.Item>
          <Descriptions.Item label="发布状态" >
            <span style={{ color: 'red' }}>{publishList[newsInfo?.publishState]}</span>
          </Descriptions.Item>
          <Descriptions.Item label="访问数量">
            <span style={{ color: 'green' }}>{newsInfo?.view}</span>
          </Descriptions.Item>
          <Descriptions.Item label="点赞数量">
            <span style={{ color: 'hotpink' }}>{newsInfo?.star}</span>
          </Descriptions.Item>
          <Descriptions.Item label="评论数量">
            <span style={{ color: 'tomato' }}>0</span>
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
      {/* //! 默认是不能解析html碎片 要想解析必须用这种方式 */}
      <div dangerouslySetInnerHTML={{
        __html: newsInfo?.content
      }} style={{ border: '1px solid #ddd', 'borderRadius': '5px', 'margin': '0 24px' }}>
      </div>
    </div>
  )
}
export default withRouter(NewsPreview)