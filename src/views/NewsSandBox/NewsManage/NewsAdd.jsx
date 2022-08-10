import React, { useState } from 'react'
import { Button, PageHeader, Steps } from 'antd'
import '../../../assets/style/newAdd/index.scss'
const { Step } = Steps
export default function NewsAdd() {
  const [current, setCurrent] = useState(0)
  const handleNext = () => {
    setCurrent(current + 1)
  }
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
          1111
          <input type="text" />
        </div>
        <div className={current === 1 ? '' : 'hidden'}>
          222
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
