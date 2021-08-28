import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setMode } from '../../../state/extension.slice';
import { Mode } from '../../../types/mode.enum';
import './first-launch.scss';

export default function FirstLaunch() {
  const dispatch = useDispatch();

  return (
    <main className="first-launch">
      <section className="header">
        <span>Please configure the extension:</span>
      </section>
      <section className="modes">
        <div className="mode">
          <span className="title">Answers Mode</span>
          <span className="description">
            In this mode, the extension will show you the answers for SmartBook 2.0 questions.
          </span>
          <button onClick={() => dispatch(setMode(Mode.ANSWERS))}>Get started</button>
        </div>
        <div className="mode">
          <span className="title">Broken Mode</span>
          <span className="description">
            In this mode, the extension will automatically answer SmartBook 2.0 questions.
          </span>
          <button disabled onClick={() => dispatch(setMode(Mode.BROKEN))}>
            Coming Soon
          </button>
        </div>
        <div className="mode">
          <span className="title">Really Broken Mode</span>
          <span className="description">
            In this mode, the extension will intercept traffic and instantly complete the assignment.
          </span>
          <button disabled onClick={() => dispatch(setMode(Mode.REALLYBROKEN))}>
            Maybe Eventually
          </button>
        </div>
      </section>
    </main>
  );
}
