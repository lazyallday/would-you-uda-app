import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Tabs } from 'antd';

import QuestionList from '../components/QuestionList';
import { ANSWERED, UNANSWERED } from '../constants';
import { auth, getUsers } from '../redux/user.slice';
import { useNavigate } from 'react-router-dom';
import { getQuestions } from '../redux/question.slice';

const { Title } = Typography;

const Home = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = props;
  const [type, setType] = useState(UNANSWERED);

  const {
    user: userFromProps,
    questions: questionsFromProps,
    users: usersFromProps,
  } = data;

  const questionsFromState = useSelector((state) => state.questions.all);
  const usersFromState = useSelector((state) => state.users.all);
  const userFromState = useSelector((state) => state.users.current);

  const user = userFromState || userFromProps
  const questions = questionsFromState || questionsFromProps;
  const users = usersFromState || usersFromProps;

  const onTabClick = (type) => setType(type);

  useEffect(() => {
    if (!user) {
      const userID = localStorage.getItem('currentUser');
      if (userID) { dispatch(auth(userID)); }
      else { return navigate('/login') }
    }
    if (!users) { dispatch(getUsers()); }
    if (!questions) { dispatch(getQuestions()); }
  }, [dispatch, navigate, questions, user, users])

  return <Tabs
    defaultActiveKey={UNANSWERED}
    onTabClick={onTabClick}
    items={
      [UNANSWERED, ANSWERED].map((value) => ({
        label: <Title level={2}>{value}</Title>,
        key: value,
        children: <QuestionList type={type} data={{ users, questions, user }} />,
      }))
    }
  />

};

export default Home;