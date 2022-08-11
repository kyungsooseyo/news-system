import React, { useState, useEffect, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select } from 'antd'
import '../../../assets/style/newAdd/index.scss'
import axios from 'axios';
import NewsEditor from '../../../components/NewsManage/NewsEditor';
const { Step } = Steps
const { Option } = Select
export default function NewsAdd() {
  useEffect(() => {
    axios.get('http://localhost:11111/categories').then(res => {
      console.log('categories', res.data);
      setCategoryList(res.data)
    })
  }, [])
  const newsForm = useRef(null)
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  //, 下一步
  const handleNext = () => {
    if (current === 0) {
      newsForm.current.validateFields().then(values => {
        console.log('values', values)
        setCurrent(current + 1)
      }).catch(err => {
        console.log(err);
      })
    } else {
      setCurrent(current + 1)
    }
  }
  //, 上一步
  const handlePrev = () => {
    setCurrent(current - 1)
  }
  return (
    <div className='new-add-container'>
      <PageHeader title="撰写新闻" />
      <Steps current={0}>
        <Step title="基本信息" description="新闻标题、新闻分类" />
        <Step title="新闻内容" subTitle="" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      {/* //` 这么写的原因是为了不让组件销毁，我们要记录曾经填过什么、这样仅仅通过样式来进行展示的话，数据会仍然保留的，如果采用jsx三目运算的话，那么组件就会被销毁，这也是vue中 v-show 和v-if的区别 */}
      <div className='news-content'>
        <div className={current === 0 ? '' : 'hidden'}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 20 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            ref={newsForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入新闻标题!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择新闻分类!' }]}
            >
              <Select placeholder="请选择分类">
                {
                  categoryList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.value}</Option>
                  })
                }
              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : 'hidden'}>
          {/* //+ 子给父级传递数据 提前留一个回调函数 让子通过prop.getContent() 把数据传递过来 这边进行接收 */}
          <NewsEditor getContent={(value) => { console.log(value) }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : 'hidden'}>
          333
        </div>
      </div>
      <div className='btn-container'>
        {
          current === 2 && <div style={{ 'display': 'inline-block' }}><Button type='primary'>保存草稿箱</Button><Button danger>提交审核</Button></div>
        }
        {
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button onClick={handlePrev}>上一步</Button>
        }
      </div>
    </div>
  )
}
