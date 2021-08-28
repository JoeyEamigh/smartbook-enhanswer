import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './App.scss';
import Answers from './components/answers/answers';
import FirstLaunch from './components/first-launch/first-launch';
import { selectMode } from '../state/extension.slice';
import { Mode } from '../types/mode.enum';

function App() {
  const mode = useSelector(selectMode);
  const [url, setUrl] = useState('');

  useEffect(() => {
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
    <main className="app">
      <section className="header">
        <span>
          SmartBook EnhAnswer <code>beta</code>
        </span>
      </section>
      {renderContent()}
    </main>
  );

  function renderContent() {
    if (url.includes('learning.mheducation.com') || url.includes('popup.html') || !url) {
      switch (mode) {
        case Mode.ANSWERS:
          return <Answers />;
        case Mode.NONE:
          return <FirstLaunch />;
      }
    } else if (url.includes('newconnect.mheducation.com')) {
      return (
        <section className="instruction">
          <span>
            To get started, click on a SmartBook 2.0 assignment. These are denoted by an "SB" to the left of the arrow.
          </span>
        </section>
      );
    } else {
      return (
        <section className="error">
          <span className="message">
            This extension only works on SmartBook <br />
            (learning.mheducation.com)
          </span>
          <br />
          <span className="error-code">
            Error Code: <code>Ur dumb</code>
          </span>
          <div className="go-there">
            <button onClick={() => chrome.tabs.create({ url: 'https://newconnect.mheducation.com/' })}>
              Go There Now
            </button>
          </div>
        </section>
      );
    }
  }
}

export default App;
