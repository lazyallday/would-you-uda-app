import React from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { Typography, Row } from 'antd';
import LeaderBoardCard from '../components/LeaderBoardCard';

const { Title } = Typography;

const LeaderBoard = () => {
  const allUsers = useSelector((state) => state.users.all);
  let users = Object.values(allUsers);
  users = users.map((user) => {
    const numOfAnswers = Object.keys(user.answers).length;
    const numOfQuestions = user.questions.length
    const total = numOfAnswers + numOfQuestions;

    return {
      total,
      numOfAnswers,
      numOfQuestions,
      name: user.name,
      avatarURL: user.avatarURL,
    }
  });
  users = _.orderBy(users, ['total'], ['desc']);

  return <>
    <Title style={{ textAlign: 'center', padding: '0px 30px' }}>Leader Board</Title>
    <Row justify='center' align='top'>
      {
        users
        && Object.values(users).length
        && Object.values(users).map(
          (user, index) => {
            const nth = index + 1;
            return <LeaderBoardCard key={index} nth={nth} data={user} />
          })
      }
    </Row>
  </>;
};

export default LeaderBoard;