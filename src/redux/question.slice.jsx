import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as API from '../api';
import { getUsers } from './user.slice';

const getQuestions = createAsyncThunk(
  'questions/get-questions',
  async () => {
    const questions = await API.getQuestions();

    return questions;
  }
);

const saveQuestionAnswer = createAsyncThunk(
  'questions/save-question-answer',
  async (answer, APIThunk) => {
    const data = await API.saveQuestionAnswer(answer);
    await APIThunk.dispatch(getUsers());

    return data;
  }
);

const saveQuestion = createAsyncThunk(
  'questions/save-question',
  async (question, APIThunk) => {
    const data = await API.saveQuestion(question);
    await APIThunk.dispatch(getUsers());

    return data;
  }
);

const initialState = {
  all: '',
  loading: false,
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getQuestions.pending, (state, _action) => {
      state.loading = true;
    });
    builder.addCase(getQuestions.fulfilled, (state, action) => {
      state.all = action.payload;
      state.loading = false;
    });
    builder.addCase(saveQuestionAnswer.fulfilled, (state, action) => {
      const { authedUser, qid, answer } = action.meta.arg;
      state.all = {
        ...state.all,
        [qid]: {
          ...state.all[qid],
          [answer]: {
            ...state.all[qid][answer],
            votes: state.all[qid][answer].votes.concat([authedUser]),
          },
        },
      };
    });
    builder.addCase(saveQuestion.fulfilled, (state, action) => {
      state.all = {
        ...state.all,
        [action.payload.id]: action.payload,
      };
    });
  },
});

const reducer = questionSlice.reducer;
export {
  getQuestions,
  saveQuestionAnswer,
  saveQuestion
};

export default reducer;
