import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Select, Typography, Image, message, Avatar, Space, Row } from 'antd';

import { auth, getUsers } from '../redux/user.slice';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const { Title } = Typography;

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [users, setUsers] = useState(props.data.users || '');

  const usersData = useSelector(state => state.users.all);

  useEffect(() => {
    if (!usersData) { dispatch(getUsers()); }
    if (!users) { setUsers(usersData); }
  }, [dispatch, users, usersData, props])

  const onFinish = (values) => {
    const { user } = values;
    if (!user) {
      message.error('Something wrong when logging!')
    } else {
      message
        .loading('Please wait a while...', 1.5)
        .then(() => {
          dispatch(auth(user));

          message.success('Login sucessfully!', 1)
          navigate('/');
        })
    }
  };

  return <>
    <div style={{ textAlign: 'center', padding: '0px 30px' }}>
      <Title>Welcome to Would You Rather app!</Title>
      <Title level={3} type='secondary'>Please login to continue</Title>
    </div>
    <br />
    <Row justify='center' align='top'>
      <Form
        name='normal_login'
        className='login-form'
        onFinish={onFinish}
      >
        <Form.Item
          style={{
            width: '100%',
            minWidth: 200,
            maxWidth: 700
          }}
          name='user'
          rules={[
            {
              required: true,
              message: 'Please select one user!',
            },
          ]}
        >
          <Select
            placeholder='Select an user to continue'
          >
            {
              users
              && Object.values(users).map(
                user => <Option key={user.id} value={user.id}>
                  <Space>
                    <Avatar shape='round' size='small' src={user.avatarURL} /> {user.name}
                  </Space>
                </Option>
              )
            }
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            style={{

            }}
            type='primary'
            htmlType='submit'
            className='login-form-button'
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </Row >
  </>
}

export default LoginPage;