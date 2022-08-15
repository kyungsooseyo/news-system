import { notification } from 'antd';
import axios from 'axios';
import { useState, useEffect } from 'react';
function usePublish(type) {
  const { username } = JSON.parse(localStorage.getItem('token'));
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    getData();
  }, [username, type]);
  //, 获取数据
  const getData = () => {
    axios
      .get(
        `http://localhost:11111/news?author=${username}&publishState=${type}&_expand=category`
      )
      .then((res) => {
        setDataSource(res.data);
      });
  };
  //, 删除
  const handleDelete = (id) => {
    axios
    .delete(`http://localhost:11111/news/${id}`)
    .then((res) => {
      getData();
      notification.success({
        message: '删除成功',
        description: '您已经删除了已下线的新闻',
        placement: 'bottomRight',
      });
    });
  };
  //, 发布
  const handlePublish = (id) => {
    axios
      .patch(`http://localhost:11111/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        getData();
        notification.success({
          message: '发布成功',
          description: '您可以到【发布管理/已发布】中查看您的新闻',
          placement: 'bottomRight',
        });
      });
  };
  //, 下线
  const handleSunset = (id) => {
    axios
      .patch(`http://localhost:11111/news/${id}`, {
        publishState: 3,
      })
      .then((res) => {
        getData();
        notification.success({
          message: '下线成功',
          description: '您可以到【发布管理/已下线】中查看您的新闻',
          placement: 'bottomRight',
        });
      });
  };
  return {
    dataSource,
    handleDelete,
    handlePublish,
    handleSunset,
  };
}
export default usePublish;
