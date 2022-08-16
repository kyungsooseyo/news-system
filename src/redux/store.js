import { legacy_createStore, combineReducers } from 'redux';
import { collapsedReducer } from './reducers/collapsedReducer';
import { loadingReducer } from './reducers/loadingReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
const reducer = combineReducers({ collapsedReducer, loadingReducer });
const persistConfig = {
  key: 'root', // 这个是存在localStorage里的key
  storage,
  blacklist: ['loadingReducer'], //= loadingReducer不会被存储 不需要持久化
};
const persistedReducer = persistReducer(persistConfig, reducer);
const store = legacy_createStore(persistedReducer);
const persistedStore = persistStore(store);
// console.log('store', store);
export { store, persistedStore };
