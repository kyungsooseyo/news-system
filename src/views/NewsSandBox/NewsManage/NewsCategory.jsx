import React, { useState, useEffect, useRef, useContext } from 'react'
import { Button, Table, Form, Input } from 'antd';
import axios from 'axios'
import { DeleteOutlined } from '@ant-design/icons';
import confirm from 'antd/lib/modal/confirm';

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([])
  const EditableContext = React.createContext(null);
  useEffect(() => {
    getData()
  }, [])
  const getData = () => {
    axios.get('http://localhost:11111/categories').then(res => {
      setDataSource(res.data)
    })
  }
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      // console.log('save中的',record)
      //~ record 是当前行的数据 是自动传递过来的 不需要参数来接
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const handleSave = (row) => {
    console.log('handleSave中的', row);
    //+ 只有内容改变的时候才会触发
    if (!dataSource.some(record => record.title === row.title)) {
      setDataSource(dataSource.map(item => {
        if (item.id === row.id) {
          return {
            id: item.id,
            title: row.title,
            value: row.title
          }
        }
        return item
      }))
      axios.patch(`http://localhost:11111/categories/${row.id}`, {
        title: row.title,
        value: row.title
      }).then(res => {

      })
    }
  }
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      // editable: true,
      onCell: (record) => ({
        record,
        dataIndex: 'title',
        title: '栏目名称',
        editable: true,
        handleSave: handleSave,
      })
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (_, item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
        </div>
      }
    }
  ]
  //, 删除
  const confirmMethod = (item) => {
    confirm({
      title: '确认删除?',
      content: '删除后不可恢复',
      icon: <DeleteOutlined />,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        handleDelete(item)
      },
      onCancel() { },
    })
  }
  const handleDelete = (item) => {
    axios.delete(`http://localhost:11111/categories/${item.id}`).then(res => {
      getData()
    })
  }
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        components={components}
        rowKey={item => item.id}
        pagination={{ pageSize: 10 }} />
    </div>
  )
}
