import React, { useEffect } from 'react';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Card,
  Typography,
  Image,
  Row,
  Col,
  Progress,
  Tag
} from 'antd';
import { auth, getUsers } from '../redux/user.slice';
import { getQuestions } from '../redux/question.slice';

const { Title, Text } = Typography;

const Results = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const params = useParams();
  const questionId = params.id;

  const questions = useSelector((state) => state.questions.all);
  const users = useSelector((state) => state.users.all);
  const user = useSelector((state) => state.users.current);

  useEffect(() => {
    if (!users) { dispatch(getUsers()); }
    if (!questions) { dispatch(getQuestions()); }
    if (!user) {
      const userID = localStorage.getItem('currentUser');
      if (userID) { dispatch(auth(userID)); }
      else { return navigate('/login') }
    }
  }, [dispatch, navigate, questions, user, users])

  const question = questions ? questions[questionId] : '';
  const authorData = (users && question && question.author) ? users[question.author] : '';
  const nVoteOne = (question && question.optionOne) ? question.optionOne.votes.length : 0;
  const nVoteTwo = (question && question.optionTwo) ? question.optionTwo.votes.length : 0;
  const totalVote = nVoteOne + nVoteTwo;

  let percentOne = nVoteOne / totalVote * 100;
  percentOne = percentOne.toFixed(0);
  let percentTwo = 100 - Number(percentOne);
  if (nVoteOne === 0 && nVoteTwo === 0) {
    percentOne = 0;
    percentTwo = 0;
  }

  return <Row justify='center' align='top'>
    <Card
      title={
        <>
          <Title level={4} style={{ float: 'left' }}>
            Asked by {authorData.name}:
          </Title>
          <Text type='secondary' style={{ float: 'right' }}>
            Created at: {moment(new Date(question && question.timestamp)).format('YYYY-MM-DD hh:mm A')}
          </Text>
        </>
      }

      style={{
        width: '100%',
        minWidth: 300,
        maxWidth: 700
      }}
    >
      <Row justify='center' align='top'>
        <Col flex={1}>
          <Image
            style={{
              padding: 20
            }}
            width='50%'
            src={authorData.avatarURL}
            preview={false}
          />
        </Col>
        <Col flex={4}>
          <Title level={3} style={{ textAlign: 'left' }}>Results:</Title>
          <Title level={4} type='secondary' style={{ textAlign: 'left' }}>
            Would you rather ...
          </Title>
          <Card
            title={<Row>
              <Col flex={4} style={{ textAlign: 'left' }}>
                <Text >{question && question.optionOne ? question.optionOne.text : ''}</Text>
              </Col>
              <Col flex={1}>
                {question && question.optionOne && question.optionOne.votes.includes(user.id) ? <Tag color='green'>Your voted</Tag> : ''}
              </Col>
            </Row>}
          >
            <Progress
              strokeColor={{ from: '#108ee9', to: '#87d068' }}
              percent={percentOne}
            />
            <Text>{nVoteOne} out of {totalVote} votes</Text>
          </Card>
          <br />
          <Card
            title={<Row>
              <Col flex='auto' style={{ textAlign: 'left' }}>
                <Text >{question && question.optionTwo ? question.optionTwo.text : ''}</Text>
              </Col>
              <Col flex='100px'>
                {question && question.optionTwo && question.optionTwo.votes.includes(user.id) ? <Tag color='green'>Your voted</Tag> : ''}
              </Col>
            </Row>}
          >
            <Progress
              strokeColor={{ from: '#108ee9', to: '#87d068' }}
              percent={percentTwo}
            />
            <Text>{nVoteTwo} out of {totalVote} votes</Text>
          </Card>
          <br />
          <Button
            onClick={() => navigate('/')}
            style={{ float: 'right' }}
            type='primary'
          >
            Back to Home
          </Button>
        </Col>
      </Row>
    </Card>
  </Row>
};

export default Results;