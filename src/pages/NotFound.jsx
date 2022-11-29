import React, { useEffect, useState } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotFound = (props) => {
  const navigate = useNavigate();
  let isBackToHome = false;
  const { data } = props;
  const { user: userFromProps } = data;
  const userFromState = useSelector(state => state.users.current);
  const [user, setUser] = useState(userFromProps || userFromState);

  const onBackToHome = () => {
    isBackToHome = true;
    if (user) { navigate('/') }
    else { navigate('/login') }
  }

  useEffect(() => {
    const userID = localStorage.getItem('currentUser');
    if (userID) { setUser(userID) }

    if (!isBackToHome) {
      let url;
      if (user) { url = '/' }
      else { url = '/login'; }
      setTimeout(() => {
        navigate(url)
      }, 5000);
    }
  }, [isBackToHome, navigate, user])

  return <Result
    status='404'
    title='404'
    subTitle={`Sorry, the page you visited does not exist. This page will be redirected to ${user ? 'Home' : 'Login'} after 5 seconds`}
    extra={<Button type='primary' onClick={onBackToHome}>{user ? 'Home' : 'Login'}</Button>}
  />

};

export default NotFound;

