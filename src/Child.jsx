import React from 'react'
import style from './child.module.scss'
// -这个style 是在scss里面写的嵌套样式，但是暴露出来的对象仍然是一层结构
console.log(style);
export default function Child() {
  return (
    <div>Child
      <p className={style.desc}>ccc
        <span className={style.gg}>123123</span>
      </p>

    </div>
  )
}
