import { Layout } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

import Nav from './components/Nav';
import { auth, getUsers } from './redux/user.slice';

import Answers from './pages/Answers';
import Home from './pages/Home';
import LeaderBoard from './pages/LeaderBoard';
import LoginPage from './pages/Login';
import NewQuestion from './pages/NewQuestions';
import NotFound from './pages/NotFound';
import Results from './pages/Results';
import { getQuestions } from './redux/question.slice';

const { Content, Footer, Sider } = Layout;

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const users = useSelector((state) => state.users.all);
  const user = users ? users.current : '';
  const questions = useSelector((state) => state.questions.all);
  useEffect(() => {
    if (!users) { dispatch(getUsers()); }
    if (!questions) { dispatch(getQuestions()); }
    if (!user) {
      const userID = localStorage.getItem('currentUser');
      if (userID) {
        dispatch(auth(userID));
      }
    }
  }, [dispatch, location.pathname, navigate, questions, user, users]);

  return <Layout>
    {localStorage.getItem('currentUser') ?
      <Sider>
        <Nav data={{ users, questions, user }} />
      </Sider> : null
    }
    <Layout>
      <Content style={{ padding: '20px 50px' }}>
        <div className='site-layout-content'>
          <Routes>
            <Route exact path='/' element={<Home data={{ users, questions, user }} />} />
            <Route exact path='/add' element={<NewQuestion />} />
            <Route exact path='/leaderboard' element={<LeaderBoard />} />
            <Route exact path='/questions/:id/answers' element={<Answers data={{ users, questions, user }} />} />
            <Route exact path='/questions/:id/results' element={<Results data={{ users, questions, user }} />} />
            <Route exact path='/login' element={<LoginPage data={{ users }} />} />
            <Route path='*' element={<NotFound data={{ user }} />} />
          </Routes>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Created by lazyallday (Gia Khoa Tran)</Footer>
    </Layout>
  </Layout>;
}

export default App;