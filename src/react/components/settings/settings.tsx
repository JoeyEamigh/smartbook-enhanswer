import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAnswers, selectAnswers } from '../../../state/answers.slice';
import { setMode } from '../../../state/extension.slice';
import { Answer } from '../../../types/answer.interface';
import { Mode } from '../../../types/mode.enum';
import './settings.scss';

export default function Settings() {
  const answers: Answer[] = useSelector(selectAnswers);
  const dispatch = useDispatch();

  return (
    <main className="answers">
      <section className="header">
        <span>Settings</span>
      </section>
      <section className="instructions">
        <span>Edit any settings for the extension.</span>
      </section>
      <hr />
      <section className="settings">
        <div>
          <button onClick={copyToClipboard}>Export Questions To Study (JSON)</button>
        </div>
        <div>
          <button onClick={() => dispatch(setMode(Mode.NONE))}>Change Extension Mode</button>
        </div>
      </section>
    </main>
  );

  function copyToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(answers));
    dispatch(clearAnswers());
  }
}
