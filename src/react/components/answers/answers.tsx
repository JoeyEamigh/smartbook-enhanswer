import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAnswers, selectAnswers } from '../../../state/answers.slice';
import { Answer } from '../../../types/answer.interface';
import { QuestionType } from '../../../types/question-type.enum';
import './answers.scss';

export default function Answers() {
  const answers: Answer[] = useSelector(selectAnswers);
  const [url, setUrl] = React.useState('');

  React.useEffect(() => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        const tab = tabs[0];
        const url = tab.url;
        setUrl(url || '');
      }
    );
  }, []);

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
          } else if (
            answer.type === QuestionType.MULTIPLE_CHOICE_MULTI_SELECT ||
            answer.type === QuestionType.FILL_IN_THE_BLANK ||
            answer.type === QuestionType.ORDERING
          ) {
            if (typeof answer.answer !== 'object') return null;
            return (
              <div key={`answer_${index}`}>
                <span>Type: {answer.type}</span>
                <span>Prompt: {answer.prompt}</span>
                <span>Answers:</span>
                <ol>
                  {answer.answer.map((ans, i) => (
                    <li key={`mult_choice_ans_${i}`}>
                      <b>{ans}</b>
                    </li>
                  ))}
                </ol>
              </div>
            );
          } else if (answer.type === QuestionType.MATCHING) {
            if (typeof answer.answer !== 'object') return null;
            return (
              <div key={`answer_${index}`}>
                <span>Type: {answer.type}</span>
                <span>Prompt: {answer.prompt}</span>
                <span>Answers:</span>
                <ol>
                  {answer.answer.map((ans, i) => (
                    <li key={`match_choice_ans_${i}`}>
                      {ans.question} = <b>{ans.answer}</b>
                    </li>
                  ))}
                </ol>
              </div>
            );
          }
          return null;
        })}
      </section>
      {!url.includes('popup.html') && !!url && (
        <div className="buttons">
          <button onClick={openPopup}>Open Popup</button>
        </div>
      )}
    </main>
  );

  function openPopup() {
    chrome.windows.create({ url: 'popup.html', type: 'popup', height: 450, width: 800 }, () => {});
  }
}
