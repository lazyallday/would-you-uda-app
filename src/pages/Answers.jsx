import React, { useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Typography, Image, Row, Col, Form, Radio, message } from 'antd';
import { getQuestions, saveQuestionAnswer } from '../redux/question.slice';
import { auth, getUsers } from '../redux/user.slice';

const { Title, Text } = Typography;

const Answers = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const params = useParams();
  const questionId = params.id;

  const {
    user: userFromProps,
    questions: questionsFromProps,
    users: usersFromProps,
  } = props;

  const questionsFromState = useSelector((state) => state.questions.all);
  const usersFromState = useSelector((state) => state.users.all);
  const userFromState = useSelector((state) => state.users.current);

  const questions = questionsFromState || questionsFromProps;
  const users = usersFromState || usersFromProps;
  const user = userFromState || userFromProps;
  const question = questions ? questions[questionId] : '';
  const author = users && question && question.author ? users[question.author] : '';

  const onFinish = ({ option }) => {
    if (!option) {
      message.warn('Please select one option');
    } else {
      if (!user) { dispatch(getUsers()); }
      else {
        dispatch(saveQuestionAnswer({ authedUser: user.id, qid: questionId, answer: option }));

        message
          .loading('Please wait a while...', 1)
          .then(() => {
            message.success('Submit answer successfully!', 1)
            navigate(`/questions/${questionId}/results`);
          })
      }
    }
  };

  useEffect(() => {
    if (!user) {
      const userID = localStorage.getItem('currentUser');
      if (userID) { dispatch(auth(userID)); }
      else { return navigate('/login') }
    }
    if (!users) { dispatch(getUsers()); }
    if (!questions) { dispatch(getQuestions()); }
  }, [dispatch, navigate, questions, user, users])

  return <>
    {author && question ?
      <Row align='top'>
        <Card
          title={
            <>
              <Title level={4} style={{ float: 'left' }}>
                Asked by {author.name}:
              </Title>
              <Text type='secondary' style={{ float: 'right' }}>
                Created at: {moment(new Date(question.timestamp)).format('YYYY-MM-DD hh:mm A')}
              </Text>
            </>
          }

          style={{
            width: '100%',
            minWidth: 300,
            maxWidth: 600
          }}
        >
          <Row align='top'>
            <Col flex={1}>
              <Image
                style={{
                  padding: 20
                }}
                width='50%'
                src={author.avatarURL}
                preview={false}
              />
            </Col>
            <Col flex={4}>
              <Title level={3} type='secondary' >
                Would you rather
              </Title>
              <Form
                name='answer-question'
                onFinish={onFinish}
                autoComplete='off'
              >
                <Form.Item 
                  name='option'
                  rules={[
                    {
                      required: true,
                      message: 'Please select one option!',
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio key='1' value='optionOne' >
                      {question.optionOne.text}
                    </Radio><br />

                    <Radio key='2' value='optionTwo' >
                      {question.optionTwo.text}
                    </Radio><br />
                  </Radio.Group>
                </Form.Item>


                <Form.Item>
                  <Button type='primary' htmlType='submit' style={{}}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>

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
      </Row> : ''}
  </>
};

export default Answers;