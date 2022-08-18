import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PageHeader, Row, Col, Card, List } from 'antd';
import { groupBy } from 'lodash';
import { NavLink } from 'react-router-dom'
export default function News() {
  const [list, setList] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:11111/news?publishState=2&_expand=category').then(res => {
      // console.log(Object.entries(groupBy(res.data, item => item.category.title)));
      setList(Object.entries(groupBy(res.data, item => item.category.title)));
    })
    return () => {
    }
  }, [])

  return (
    <div className='news-wrapper' style={{ width: '100%', height: '100%', backgroundColor: 'white', margin: '0 auto' }}>
      <div style={{ width: '95%', height: '100%', backgroundColor: 'white', margin: '0 auto' }}>
        <PageHeader
          className="site-page-header"
          title="全球大新闻"
          subTitle="查看新闻"
        />
        <div className="site-card-wrapper">
          {/* //~通过写一个数组控制上下和左右的间距 */}
          <Row gutter={[16, 16]}>
            {
              list.map(item => {
                return (
                  <Col span={8} key={item[0]}>
                    <Card title={item[0]} bordered hoverable
                      headStyle={{ color: 'tomato', fontWeight: 'bold' }}
                      bodyStyle={{ height: '250px' }}>
                      <List
                        size="small"
                        bordered
                        dataSource={item[1]}
                        pagination={{ pageSize: 3 }}
                        renderItem={data => <List.Item>
                          <NavLink to={`/detail/${data.id}`}>{data.title}</NavLink>
                        </List.Item>}
                      />
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        </div>
      </div>
    </div>
  )
}
