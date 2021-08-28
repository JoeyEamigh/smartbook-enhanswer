// @ts-nocheck

export const logger = store => next => action => {
  let result = next(action);
  console.log('next state', store.getState());

  return result;
};

export const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error('Caught an exception!', err);
    throw err;
  }
};
