import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Answer } from '../types/answer.interface';

const initialState: Answer[] = [];

export const answerSlice = createSlice({
  name: 'answers',
  initialState,
  reducers: {
    addAnswer(state: Answer[], action: PayloadAction<Answer>) {
      state.unshift(action.payload);
    },
    clearAnswers(state: Answer[]) {
      state.length = 0;
    },
  },
});

export const { addAnswer, clearAnswers } = answerSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAnswers = (state: any) => state.answers;

export default answerSlice.reducer;
