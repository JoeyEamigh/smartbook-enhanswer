import { Answer } from '../types/answer.interface';
import { QuestionType } from '../types/question-type.enum';
import storeCreatorFactory from 'reduxed-chrome-storage';
import { applyMiddleware, createStore } from 'redux';
import { reducers } from '../state/reducers';
import { crashReporter, logger } from '../state/middleware';
import thunk from 'redux-thunk';
import { addAnswer } from '../state/answers.slice';

console.log('Background Script Initialized');

const storeCreator = storeCreatorFactory({ createStore });
let store;

const getStore = async () => {
  if (store) return store;
  store = await storeCreator(reducers, applyMiddleware(logger, crashReporter, thunk));
  return store;
};

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (details.initiator !== 'https://learning.mheducation.com') return;
    getAnswer(details.url);
  },
  {
    urls: ['*://bento.mheducation.com/files/smart-factory/*'],
  }
);

async function getAnswer(url: string) {
  const data = await (await fetch(url)).json();
  if (!data?.hidata?.payload) return;

  const type: QuestionType = data.type;
  const body = deobfuscateAndDecode(data.hidata.payload);

  console.log(type);
  console.log(body);
  const answer = setupAnswer(type, body);
  if (!answer) return;
  console.log(answer);
  addAnswerToState(answer);
}

function setupAnswer(type: QuestionType, body: any): Answer {
  switch (type) {
    case QuestionType.MULTIPLE_CHOICE:
      return handleMultipleChoice(body);
    case QuestionType.MULTIPLE_CHOICE_MULTI_SELECT:
      return handleMultiSelectMultipleChoice(body);
    case QuestionType.TRUE_FALSE:
      return handleTrueFalse(body);
    case QuestionType.FILL_IN_THE_BLANK:
      return handleFillInTheBlank(body);
    case QuestionType.MATCHING:
      return handleMatching(body);
    case QuestionType.ORDERING:
      return handleOrdering(body);
  }
}

function handleOrdering(body: any): Answer {
  const { answers, choices } = body;
  const answer = answers.map((ans) => {
    let potentialAnswer = '';
    choices.forEach((choice) => {
      if (choice.key === ans) potentialAnswer = stripTags(choice.text);
    });
    return potentialAnswer;
  });

  return {
    prompt: stripTags(body.prompt),
    answer,
    type: QuestionType.ORDERING,
    time: new Date().toISOString(),
  };
}

function handleMatching(body: any): Answer {
  const { answers, choices, prompts } = body;
  const answer = answers.map((ans) => {
    let potentialAnswer = { question: '', answer: '' };
    prompts.forEach((prompt) => {
      if (prompt.key === ans.prompt) {
        potentialAnswer.question = stripTags(prompt.content);
      }
    });
    choices.forEach((choice) => {
      if (choice.key === ans.choices[0]) {
        potentialAnswer.answer = stripTags(choice.content);
      }
    });
    return potentialAnswer;
  });

  return {
    prompt: stripTags(body.prompt),
    answer,
    type: QuestionType.MATCHING,
    time: new Date().toISOString(),
  };
}

function handleFillInTheBlank(body: any): Answer {
  const answer = body.answers.map((answer) => {
    return answer.values[0];
  });

  return {
    prompt: stripTags(body.prompt),
    answer,
    type: QuestionType.FILL_IN_THE_BLANK,
    time: new Date().toISOString(),
  };
}

function handleTrueFalse(body: any): Answer {
  return {
    prompt: stripTags(body.prompt),
    answer: body.answer,
    type: QuestionType.TRUE_FALSE,
    time: new Date().toISOString(),
  };
}

function handleMultiSelectMultipleChoice(body: any): Answer {
  let potentialAnswers = [];
  body.answers.forEach((answer) => {
    body.choices.forEach((choice) => {
      if (answer === choice.key) potentialAnswers.push(stripTags(choice.content));
    });
  });

  return {
    prompt: stripTags(body.prompt),
    answer: potentialAnswers,
    type: QuestionType.MULTIPLE_CHOICE_MULTI_SELECT,
    time: new Date().toISOString(),
  };
}

function handleMultipleChoice(body: any): Answer {
  const potentialAnswer = body.choices.reduce((prev, curr) => {
    if (curr.key === body.answer) return curr.content;
    return prev;
  }, '');
  console.log(potentialAnswer);
  if (!potentialAnswer) return;

  const answer = stripTags(potentialAnswer);

  return {
    prompt: stripTags(body.prompt),
    answer,
    type: QuestionType.MULTIPLE_CHOICE,
    time: new Date().toISOString(),
  };
}

function stripTags(html: string) {
  return html.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, '');
}

function deobfuscateAndDecode(hidata: string) {
  const deobfuscated = hidata.replace(/(.)(.)(.)(.)(.)(.)(.)(.)(.)/g, '$2$6$8$1$4$9$3$5$7').replace(/ +$/, '');
  const decoded = Buffer.from(deobfuscated, 'base64').toString('utf8');
  const body = JSON.parse(decodeURIComponent(decoded));
  return body;
}

async function addAnswerToState(answer: Answer) {
  const store = await getStore();
  store.dispatch(addAnswer(answer));
}
