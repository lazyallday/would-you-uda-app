import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user.slice';
import questionReducer from './question.slice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    questions: questionReducer,
  },
});
