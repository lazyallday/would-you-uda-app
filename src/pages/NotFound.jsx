import React, { useEffect, useState } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotFound = (props) => {
  const navigate = useNavigate();
  const { data } = props;
  const { user: userFromProps } = data;
  const userFromState = useSelector(state => state.users.current);
  const [user, setUser] = useState(userFromProps || userFromState);

  const onBackToHome = () => {
    if (user) { navigate('/') }
    else { navigate('/login') }
  }

  useEffect(() => {
    const userID = localStorage.getItem('currentUser');
    if (userID) { setUser(userID) }
  }, [user])

  return <Result
    status='404'
    title='404'
    subTitle={`Sorry, the page you visited does not exist. Please go to ${user ? 'Home' : 'Login'}.`}
    extra={<Button type='primary' onClick={onBackToHome}>{user ? 'Home' : 'Back to Login'}</Button>}
  />
};

export default NotFound;

