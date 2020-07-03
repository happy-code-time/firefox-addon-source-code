import errorMessagesGlobals from './errorMessagesGlobal';

const ReadStore = (type) => {
  const { key } = errorMessagesGlobals[type];

  if (sessionStorage.getItem(key) !== null) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  return [];
};

export default ReadStore;
