// import {  useEffect } from 'react'
// import axios from 'axios'
import IndexRouter from './router/index';
// = 在引入css的时候，保证最外层盒子的className不一样就行，里面的是可以一样的，这样的父与子相同的class 就不会互相影响了
import './app.scss'
// import Child from './Child'
export default function App() {

  // const [count, setCount] = useState(0)
  // const handleClick = (e, i) => {
  //   console.log(e, i);
  //   setCount(count + 1)
  // }
  // useEffect(() => {
  //   axios.get('/api/gateway?cityId=440300&pageNum=1&pageSize=10&type=1&k=1215041').then(res => {
  //     console.log('rr,', res);
  //   })
  // }, [])
  return (
    <IndexRouter></IndexRouter>
  )
}
