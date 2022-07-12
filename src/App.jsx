import { useEffect } from 'react'
import './app.scss'
import Child from './Child'
export default function App() {
  return (
    <div>App
      <p className='desc'>11
        <span>22</span>
      </p>
      <Child></Child>
    </div>
  )
}
