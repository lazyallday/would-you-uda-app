import React from 'react';
import moment from 'moment';
import { Image, Button, Card, Typography } from 'antd';
import { ANSWERED, UNANSWERED } from '../constants';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Title, Text } = Typography;

const Question = (props) => {
  const navigate = useNavigate()
  const { type, data } = props;
  const users = useSelector(state => state.users.all);

  const question = (type, data) => {
    const { id, author, optionOne, optionTwo, timestamp } = data;
    const user = users && users[author];

    const onClick = () => {
      if (type === UNANSWERED) { navigate(`/questions/${data.id && id}/answers`); }
      else { navigate(`/questions/${data.id && id}/results`); }
    }

    return <>
      <Card
        title={
          <>
            <Title level={4} style={{ float: 'left' }}>
              {user.name} asks:
            </Title>
            <Text type='secondary' style={{ float: 'right' }}>
              Created at: {moment(new Date(timestamp)).format('YYYY-MM-DD hh:mm A')}
            </Text>
          </>
        }

        actions={[
          type === ANSWERED
            ? <Button style={{ minWidth: 150 }} type='primary' shape='round' onClick={onClick}>Results</Button>
            : <Button style={{ minWidth: 150 }} type='primary' shape='round' onClick={onClick}>Answer question</Button>,
        ]}

        style={{
          width: '100%',
          minWidth: 200,

        }}
      >
        <Meta
          avatar={
            <Image
              style={{
                width: '70%',
                minWidth: 50,
              }}
              src={user.avatarURL}
              preview={false}
            />
          }
          title='Would you rather'
          description={
            <>
              <Text italic>{optionOne.text}?</Text>
              <br />
              <Text>OR</Text>
              <br />
              <Text italic>{optionTwo.text}?</Text>
            </>
          }
        />
      </Card>
    </>
  }

  return <>
    {
      type === UNANSWERED
        ? question(UNANSWERED, data)
        : question(ANSWERED, data)
    }
  </>
}

export default Question;