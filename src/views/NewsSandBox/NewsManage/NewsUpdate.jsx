import React, { useState, useEffect, useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input, Select, message, notification } from 'antd'
import '../../../assets/style/newAdd/index.scss'
import axios from 'axios';
import NewsEditor from '../../../components/NewsManage/NewsEditor';
import { withRouter } from 'react-router-dom';
const { Step } = Steps
const { Option } = Select
function NewsUpdate(props) {
  useEffect(() => {
    axios.get('http://localhost:11111/categories').then(res => {
      console.log('categories', res.data);
      setCategoryList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`http://localhost:11111/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
      const { title, categoryId, content } = res.data
      newsForm.current.setFieldsValue({
        title,
        categoryId
      })
      setContent(content)
    })
  }, [props.match.params.id])

  const newsForm = useRef(null)
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('')
  // const user = JSON.parse(localStorage.getItem('token'))
  //, 下一步
  const handleNext = () => {
    if (current === 0) {
      newsForm.current.validateFields().then(values => {
        // console.log('values', values)
        setFormInfo(values)
        setCurrent(current + 1)
      }).catch(err => {
        console.log(err);
      })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('请输入内容!')
      } else {
        setCurrent(current + 1)
      }
    }
  }
  //, 上一步
  const handlePrev = () => {
    setCurrent(current - 1)
  }
  //, 保存草稿箱
  const saveDraftBox = (state) => {
    // =0 草稿箱 1 待审核 2 审核通过 3 审核不通过
    //~ 更新的时候用patch
    axios.patch(`http://localhost:11111/news/${props.match.params.id}`, {
      ...formInfo,
      content,
      // region: user.region ? user.region : '全球',
      // author: user.username,
      // roleId: user.roleId,
      auditState: state,
      // publishState: 0,
      // createTime: new Date().getTime(), // Date.now() 这俩都是获取当前时间的毫秒数,
      // star: 0,
      // view: 0,
      //publishTime: 0
    }).then(res => {
      notification.success({
        message: '保存成功',
        description: `您可以到${state === 0 ? '草稿箱' : '审核列表'}中查看`,
        placement: 'bottomRight'
      })
      state === 0 ? props.history.push('/news-manage/draft') : props.history.push('/audit-manage/audit')
    })
  }
  return (
    <div className='new-add-container'>
      <PageHeader title="更新新闻" onBack={() => props.history.goBack()} />
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
          <NewsEditor getContent={(value) => { setContent(value) }} content={content}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : 'hidden'}>
        </div>
      </div>
      <div className='btn-container'>
        {
          current === 2 &&
          <div style={{ 'display': 'inline-block' }}>
            <Button type='primary' onClick={() => saveDraftBox(0)}>保存草稿箱</Button>
            <Button danger onClick={() => saveDraftBox(1)}>提交审核</Button>
          </div>
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
export default withRouter(NewsUpdate)
