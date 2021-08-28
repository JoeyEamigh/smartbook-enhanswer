import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAnswers, selectAnswers } from '../../../state/answers.slice';
import { Answer } from '../../../types/answer.interface';
import { QuestionType } from '../../../types/question-type.enum';
import './answers.scss';

export default function Answers() {
  const answers: Answer[] = useSelector(selectAnswers);
  const dispatch = useDispatch();

  return (
    <main className="answers">
      <section className="header">
        <span>Answers Mode</span>
      </section>
      <section className="instructions">
        <span>Begin your SmartBook assignment. Answers to questions will be displayed below.</span>
      </section>
      <hr />
      <section className="answers">
        {answers.map((answer, index) => {
          if (index >= 1) return null;
          if (answer.type === QuestionType.MULTIPLE_CHOICE || answer.type === QuestionType.TRUE_FALSE) {
            return (
              <div key={`answer_${index}`}>
                <span>Type: {answer.type}</span>
                <span>Prompt: {answer.prompt}</span>
                <span>
                  Answer: <b>{answer.answer}</b>
                </span>
              </div>
            );
          } else if (answer.type === QuestionType.MULTIPLE_CHOICE_MULTI_SELECT) {
            if (typeof answer.answer !== 'object') return null;
            return (
              <div key={`answer_${index}`}>
                <span>Type: {answer.type}</span>
                <span>Prompt: {answer.prompt}</span>
                <span>Answers:</span>
                {answer.answer.map((ans, i) => (
                  <span key={`mult_choice_ans_${i}`}>
                    <b>{ans}</b>
                  </span>
                ))}
              </div>
            );
          }
          return null;
        })}
      </section>
      <button onClick={() => dispatch(clearAnswers())}>Clear Answers</button>
    </main>
  );
}
