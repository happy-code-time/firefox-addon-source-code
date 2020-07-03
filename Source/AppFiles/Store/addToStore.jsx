const addToStore = (errorMessage = '', errorCode) => {
  sessionStorage.setItem('messagesApp', JSON.stringify(
    [
      {
        errorMessage,
        errorCode,
      }
    ]
  ));
};

export default addToStore;
