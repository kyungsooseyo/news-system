
import IndexRouter from './router/index';
import { Provider } from 'react-redux'
// = 在引入css的时候，保证最外层盒子的className不一样就行，里面的是可以一样的，这样的父与子相同的class 就不会互相影响了
import './app.scss'
import { store,persistedStore } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'
// import Child from './Child'
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>
  )
}
