import { combineReducers } from '@reduxjs/toolkit';
import answerReducer from './answers.slice';
import extensionReducer from './extension.slice';

export const reducers = combineReducers({
  extension: extensionReducer,
  answers: answerReducer,
});
