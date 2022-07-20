import React from 'react'
import { Button } from 'antd';
import axios from 'axios';
export default function Home() {
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
    axios.get('http://localhost:11111/comments?_expand=post').then(res => {
      console.log(res.data);
    })
  }
  return (
    <div>Home
      {/* 要想给函数传递参数，就必须使用箭头函数的形式，如果不传参的话那么直接写上函数名字就行 */}
      {/* <Button type="primary" onClick={() => getData(1)}>Primary</Button> */}
      <Button type="primary" onClick={getData}>Primary</Button>
    </div>
  )
}
