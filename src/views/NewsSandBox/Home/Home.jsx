import React, { useEffect, useState, useRef } from 'react';
import './home.scss';
import { Row, Col, Card, List, Avatar, Drawer } from 'antd';
import {
  EditOutlined,
  EllipsisOutlined,
  PieChartOutlined,
} from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import * as echarts from 'echarts';
import _ from 'lodash';
const { Meta } = Card;
export default function Home() {
  useEffect(() => {
    getMostView();
    getMostStar();
    getChartData();
    return () => {
      window.resize = null;
    };
  }, []);

  const getData = (e) => {
    // . 原生参数的 e 会默认传递过来
    // axios.get('http://localhost:11111/comments', {
    //   params: {
    //     id: 1
    //   }
    // }).then(res => {
    //   console.log('res', res)
    // })
    // - post在restful风格的接口中，默认就是增加
    // axios({
    //   method: 'post',
    //   url: 'http://localhost:11111/posts',
    //   data: {
    //     title: 'title',
    //     body: '111',
    //   }
    // })
    // ! put方法弊端,会把整个对象都传递过去,其他的东西也会被替换掉
    // axios.put('http://localhost:11111/posts/1', {
    //   title: 'title-fix',
    // })
    // + patch方法就只会更改当前的值,其他的不会改变
    // axios.patch('http://localhost:11111/posts/2', {
    //   title: 'title-fix2',
    // })
    // - delete方法就是删除 在comments中 添加一个postId 与posts的id一致,那么删除的时候就会把两个表中的数据都删除掉
    // axios.delete('http://localhost:11111/posts/7')
    //- 关联表查询 通过_embed进行关联查询,在comments中必须以后postId才可进行关联查询
    // axios.get('http://localhost:11111/posts?_embed=comments').then(res=>{
    //   console.log(res.data);
    // })
    //- _expand 是反查用的，必须在每个comments中都得有postId才可以进行反查,少一个就会报错
    axios.get('http://localhost:11111/comments?_expand=post').then((res) => {
      console.log(res.data);
    });
  };
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem('token'));
  const [mostViewData, setMostViewData] = useState([]);
  const [mostStar, setMostStar] = useState([]);
  const [allList, setAllList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [pieChart, setPieChart] = useState(null);
  const categoryBar = useRef(null);
  const pieRef = useRef(null);
  const getMostView = () => {
    axios
      .get(
        'http://localhost:11111/news?publishState=2&_sort=view&_order=desc&_limit=6'
      )
      .then((res) => {
        // console.log('most view', res.data)
        setMostViewData(res.data);
      });
  };
  const getMostStar = () => {
    axios
      .get(
        'http://localhost:11111/news?publishState=2&_sort=star&_order=desc&_limit=6'
      )
      .then((res) => {
        setMostStar(res.data);
      });
  };
  //, 获取柱状图的数据
  const getChartData = () => {
    axios
      .get('http://localhost:11111/news?publishState=2&_expand=category')
      .then((res) => {
        // console.log('resData', res.data);
        // let xData = res.data.map(item => item.category.value);
        // console.log(_.groupBy(res.data, item => item.category.title));
        setAllList(res.data);
        let xData = Object.keys(
          _.groupBy(res.data, (item) => item.category.title)
        );
        let yData = Object.values(
          _.groupBy(res.data, (item) => item.category.title)
        ).map((item) => item.length);
        initChart(xData, yData);
      });
  };
  //, 获取饼图的数据
  const getPieData = async () => {
    //+ 这个异步更新dom,  在setVisible之后 dom还没有更新,所以会报错;所以用async await来解决
    await setVisible(true)
    const currentList = allList.filter(item => item.author === username);
    const groupObj = _.groupBy(currentList, (item) => item.category.title);
    console.log(groupObj);
    const data = []
    for (const key in groupObj) {
      data.push({
        name: key,
        value: groupObj[key].length
      })
    }
    initPieChart(data)
  }
  //, 初始化饼状图
  const initPieChart = (data) => {
    //= 因为这个drawer会多次创建 所以要进行判断一下 避免重复创建
    // getInstanceByDom(pieRef.current).destroy();
    var myChart;
    if (!pieChart) {
      myChart = echarts.init(pieRef.current);
      setPieChart(myChart);
    } else {
      myChart = pieChart;
    }
    let option;
    option = {
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);
  }
  //, drawer 关闭
  const onClose = () => {
    setVisible(false);
  };
  //, 初始化图表
  const initChart = (xData, yData) => {
    const categoryBarChart = echarts.init(categoryBar.current);
    const option = {
      title: {
        text: '新闻分类图示',
      },
      tooltip: {},
      legend: {
        data: ['数量'],
      },
      xAxis: {
        data: xData,
        axisLabel: {
          rotate: 45,
          interval: 0, // +设置interval为0，表示强制所有的标签都显示
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: yData,
        },
      ],
    };
    window.onresize = () => {
      categoryBarChart.resize();
    };
    categoryBarChart.setOption(option);
  };
  return (
    <div className='site-card-wrapper'>
      <Row gutter={16}>
        <Col span={8}>
          <Card title='用户最常浏览' bordered className='my-card-wrapper'>
            <List
              size='small'
              dataSource={mostViewData}
              renderItem={(item) => (
                <List.Item>
                  <NavLink to={`/news-manage/preview/${item.id}`}>
                    {item.title}
                  </NavLink>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title='用户点赞最多' bordered>
            <List
              size='small'
              dataSource={mostStar}
              renderItem={(item) => (
                <List.Item>
                  <NavLink to={`/news-manage/preview/${item.id}`}>
                    {item.title}
                  </NavLink>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt='example'
                src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
              />
            }
            actions={[
              <PieChartOutlined
                key='setting'
                onClick={() => getPieData()}
              />,
              <EditOutlined key='edit' />,
              <EllipsisOutlined key='ellipsis' />,
            ]}
          >
            <Meta
              avatar={<Avatar src='https://joeschmoe.io/api/v1/random' />}
              title={username}
              description={
                <div>
                  <b style={{ marginRight: '10px' }}>
                    {region ? region : '全球'}
                  </b>
                  <span>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        title='个人新闻分类'
        placement='right'
        onClose={onClose}
        visible={visible}
        closable
        width={'30%'}
      >
        <div style={{ width: '100%', height: '400px' }} ref={pieRef}>
        </div>
      </Drawer>
      <div
        style={{ width: '100%', height: '400px', marginTop: '30px' }}
        ref={categoryBar}
      ></div>
    </div>
  );
}
