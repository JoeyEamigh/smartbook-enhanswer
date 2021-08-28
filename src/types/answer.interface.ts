import { QuestionType } from './question-type.enum';

export interface Answer {
  type: QuestionType;
  prompt: string;
  answer: string | string[] | { question: string; answer: string }[];
  time: string;
}
