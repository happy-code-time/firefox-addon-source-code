export const copyToClipBoard = (event, dataToCopy, currentX) => {
    const persistsPosition = setInterval(() => {
        document.documentElement.scrollTop = currentX;
    }, 1);

    try {
        event.preventDefault();
        event.persist();

        if (null !== document.getElementById('copy-to-clipboard')) {
            document.getElementById('copy-to-clipboard').value = dataToCopy;
            document.getElementById('copy-to-clipboard').select();
            document.execCommand('copy');
            document.getElementById('copy-to-clipboard').focus();
            event.target.classList.add('copied');

            setTimeout(() => {
                event.target.classList.add('copied-remove');

                setTimeout(() => {
                    event.target.classList.remove('copied');
                    event.target.classList.remove('copied-remove');
                    clearInterval(persistsPosition);
                }, 300);
            }, 200);
        }
    } catch (error) {
        console.info(`Error while copy to clipboard. Message: ${error}`);
        clearInterval(persistsPosition);
    }
}