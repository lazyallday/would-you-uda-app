import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HomeOutlined, RiseOutlined, PlusOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Avatar, Col, Menu, Row, Space } from 'antd';
import { getUsers, logout } from '../redux/user.slice';

const Nav = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation()
  const { data } = props;
  const [user, setUser] = useState(data.user);
  const [current, setCurrent] = useState('');
  const userData = useSelector(state => state.users.current);

  const onClickLeft = (e) => {
    if (location.pathname === '/') { setCurrent('/') }
    else { setCurrent(e.key) }
  };
  const onClickRight = (e) => {
    if (e.key.toLowerCase() === 'logout') {
      localStorage.removeItem('currentUser');
      setUser('');
      dispatch(logout())
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!user) {
      dispatch(getUsers());
      setUser(userData);
    }
  }, [data, dispatch, user, userData])

  return <Space direction='vertical' style={{ width: '100%' }}>
    <Row>
      <Col>
        <Menu
          theme='dark'
          onClick={onClickLeft}
          selectedKeys={[current]}
          mode='vertical'
          style={{ width: '200px' }}
          items={user ?
            [{
              label: <Link to='/'>Home</Link>,
              key: 'home',
              icon: <HomeOutlined />,

            }, {
              label: <Link to='/add'>New Question</Link>,
              key: 'new',
              icon: <PlusOutlined />,
            }, {
              label: <Link to='/leaderboard'>Leader Board</Link>,
              key: 'leaderboard',
              icon: <RiseOutlined />
            }] : ''}
        />
      </Col>
    </Row>
    <Row>
      <Col>
        <Menu
          theme='dark'
          mode='vertical'
          onClick={onClickRight}
          style={{ color: '#fff', width: '200px' }}
          items={user ? [
            {
              label: user.name,
              key: 'user',
              icon: user.avatarURL
                ? <Avatar shape='round' size='medium' src={user.avatarURL} />
                : <UserOutlined />,
            }, {
              label: 'Logout',
              key: 'logout',
              icon: <LogoutOutlined />,
              danger: true
            }] : null}
        />
      </Col>
    </Row>
  </Space>
};

export default Nav;