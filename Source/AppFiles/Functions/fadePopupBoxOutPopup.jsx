const fadePopupBoxOutPopup=(e, url) => {
    e.preventDefault;

    // @ts-ignore
    return browser.runtime.sendMessage({
        action: 'open-new-tab',
        url
    })
        .then(() => {
            window.close();
        })
        .catch(() => {
            window.close();
        })
}

export default fadePopupBoxOutPopup;