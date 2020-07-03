/**
 * Clear storage if version has been changed
 */
const VERSION_RESETTER = 'v2.0.0';

if (null === localStorage.getItem('VERSION_RESETTER')) {
    localStorage.clear();
    localStorage.setItem('VERSION_RESETTER', VERSION_RESETTER);
} else {
    if (VERSION_RESETTER !== localStorage.getItem('VERSION_RESETTER')) {
        localStorage.clear();
        localStorage.setItem('VERSION_RESETTER', VERSION_RESETTER);
    }
}

// const styleAuthor = "color: rgb(9,9,9); font-size: 15px; min-height:50px; line-height:50px;";
// const styleCode = "background: rgba(30,144,255,.8); color: rgb(9,9,9); font-size: 15px";
// const styleHoch2 = "color: rgb(9,9,9); font-size: 10px; min-heightz:50px; line-height:50px;"; 
// const styleHearth = "color: #FF4459; font-size: 21px; line-height:50px;";
// const styleCoffee = "color: brown; font-size: 32px; line-height:40px;";

// console.info(
//     `%cWritten with %c♥ %cand %c☕%c(x²) %cin Munich for all cool people and you !`, 
//     styleAuthor, 
//     styleHearth, 
//     styleAuthor, 
//     styleCoffee, 
//     styleHoch2,
//     styleAuthor
// );

// console.info(`%cSs      O O    Uu  uU   RrrR     Cccc   Eeee        Cccc    O O    D D      Eeee
//  Ss    O   O   Uu  uU   R   R   C       E          C       O   O   D   D    E
//    Ss  O   O   Uu  uU   R R    C       Eeee       C       O     O  D    D   Eeee
//   Ss   O   O   Uu  uU   R  R    C       E          C       O   O   D   D    E
// Ss s    O O    Uu uuU   R   R    Cccc   Eeee        Cccc    O O    D D      Eeee`, styleCode);

let STORE = {};

/**
 * Geet item from the local storage
 * @param {string} item
 */
const getItem = function (item) {
    var i = localStorage.getItem(item);
    return JSON.parse(i);
};
/**
 * Set item to the local storage
 * @param {string} name
 * @param {any} value
 */
const setItemToLocalStorage = function (name, value) {
    try {
        localStorage.setItem(name, JSON.stringify(value));
    } catch (error) {
        console.info("ERROR - localStorage.setItem: ", error);
        console.info("CLEARING STORAGE");
        localStorage.clear();
    }
};
const getOnlyDomainName = function (url) {
    if (url) {
        return url.split('/')[2];
    }
    return '';
};

if (null === getItem('STORE')) {
    setItemToLocalStorage('STORE', { dummy: '' });
} else {
    STORE = getItem('STORE');
}

var setStructure = function (hostname) {
    STORE = getItem('STORE');

    if (null === getItem('STORE')) {
        setItemToLocalStorage('STORE', { dummy: '' });
    } else {
        STORE = getItem('STORE');
    }

    if (null === STORE) {
        STORE = {};
    }

    /**
     * SET ARRAY AND OBJECT FOR CURRENT LOCATION
     */
    if (undefined === STORE[hostname]) {
        STORE[hostname] = {};
    }

    if (!STORE['HISTORY']) {
        STORE['HISTORY'] = [];
    }

    if (undefined === STORE[hostname]['LOCATION']) {
        STORE[hostname]['LOCATION'] = {};
    }

    if (undefined === STORE[hostname]['TAGS']) {
        STORE[hostname]['TAGS'] = [];
    }

    if (null !== location) {
        STORE[hostname]['LOCATION'] = location;
    }

    try {
        setItemToLocalStorage('STORE', STORE);
    } catch (error) {
        console.info("ERROR - localStorage.setItem: ", error);
        console.info("CLEARING STORAGE");
        localStorage.clear();
    }
}

function onError(error) {
    console.error(`Error: ${error}`);
}
var sendMessageToContentScriptToGetData = async function (tabs, action) {
    return browser.tabs.sendMessage(tabs[0].id, {
        action: action,
        tabId: tabs[0].id
    })
        .then((resp) => {
            return resp
        })
        .catch(onError);
};
var sendMessageToContentScript = function (tabs, type, name) {

    if ('external' == type) {
        browser.tabs.sendMessage(tabs[0].id, {
            action: "generate-source-" + type,
            source: name,
            message: "Getting external source code..."
        })
            .catch(onError);
    } else {
        browser.tabs.sendMessage(tabs[0].id, {
            action: "generate-source-" + type,
            message: "Generating source code of all " + name + " elements...."
        })
            .catch(onError);
    }
};

var sendMessageToContentScriptDefault = function (tabs, tag) {
    browser.tabs.sendMessage(tabs[0].id, {
        action: "generate-default",
        message: "Generating source code of all " + tag + " elements....",
        tag
    })
};

var getTab = function () {
    return browser.tabs.query({
        currentWindow: true, active: true
    })
        .then(function (data) {
            return data;
        })
        .catch(function (error) {
            console.error(`Error: ${error}`);
            return false;
        });
};
function onCreated(tab) {
    console.debug("Created new tab: " + tab.id);
}
function onErrorTab(error) {
    console.debug(error);
}

const returnLocation = () => {
    return new Promise(async (resolve, reject) => {
        await browser.tabs.query({
            currentWindow: true,
            active: true
        })
            .then(async (tabs) => {
                return await sendMessageToContentScriptToGetData(
                    tabs, 'get-location'
                )
                    .then((location) => {
                        resolve({
                            hostname: location && location.hostname ? location.hostname : '',
                            host: location && location.host ? location.host : '',
                            protocol: location && location.protocol ? location.protocol : ''
                        });
                    })
                    .catch(error => {
                        reject(error);
                    })
            })
            .catch(error => {
                reject(error);
            })
    })
}

/**
 * Generate unique key
 */
const customKey = () => {
    return Math.floor((Math.random() * 123456789) + 1) + '9' +
        Math.floor((Math.random() * 123456789) + 1) + '1' +
        Math.floor((Math.random() * 123456789) + 1) + '8' +
        Math.floor((Math.random() * 123456789) + 1);
};

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    STORE = getItem('STORE');

    switch (request.action) {
        case 'check-addons-availablitity': {
            return sendResponse(
                new Promise( resolve => {
                    getTab()
                    .then( async (activeTab) => {
                        const { id } = activeTab[0];
        
                        //@ts-ignore
                        await browser.tabs.sendMessage(id, {
                                action: 'check-addons-availablitity',
                            })
                            .then(() => {
                                resolve(true);
                            })
                            .catch(() => {
                                resolve(false);
                            });
                    })
                    .catch(() => {
                        resolve(false);
                    });
                })
            );
            break;
        }

        case 'close-iframe': {
            browser.tabs.sendMessage(parseInt(request.tabid), {
                action: 'close-iframe',
            });
            return sendResponse(true);
            break;
        };

        case 'set-app-language': {
            const mainLanguages = [
                'de', 'en', 'pl'
            ];

            if (mainLanguages.includes(request.language)) {
                localStorage.setItem('applanguage', request.language);
            }
            else {
                localStorage.setItem('applanguage', 'en');
            }
            return sendResponse(true);
            break;
        }

        case 'get-app-language': {

            if (null == localStorage.getItem('applanguage')) {
                localStorage.setItem('applanguage', 'en');
            }

            return sendResponse(localStorage.getItem('applanguage'));
            break;
        }

        case 'store-code': {
            let CODES = getItem('CODES');

            if (null == CODES) {
                CODES = {};
            }

            CODES[sender.tab.id] = request.data;
            setItemToLocalStorage('CODES', CODES);

            return sendResponse(sender.tab.id);
            break;
        }

        case 'get-code': {
            const CODES = getItem('CODES');

            if (null !== CODES && undefined !== CODES[request.tabid]) {
                return sendResponse(CODES[request.tabid]);
            }

            return sendResponse({});
            break;
        }

        case 'new-tab': {
            browser.tabs.create({
                url: request.url
            })
                .then(onCreated, onError);
            break;
        }

        /**
         * External link
         */
        case 'external': {
            try {
                browser.tabs.create({
                    url: browser.runtime.getURL('Distribution/Dashboard/Dashboard.html') + "#/external?url=" + request.source
                })
                    .then(onCreated, onErrorTab)
                    .catch((error) => {
                        console.error(`Error: ${error}`);
                    })
            }
            catch (error) {
                console.error(`Error: ${error}`);
                return sendResponse({
                    success: false,
                    tabId: null
                });
            }
            break;
        }
        case 'reset-requests': {
            STORE = getItem('STORE');

            if (null === getItem('STORE')) {
                setItemToLocalStorage('STORE', { dummy: '' });
            } else {
                STORE = getItem('STORE');
            }
            /**
             * SET ARRAY AND OBJECT FOR CURRENT LOCATION
             */
            const hostname = request.hostname;

            if (undefined === STORE[hostname]) {
                STORE[hostname] = {};
            }

            setItemToLocalStorage('STORE', STORE);
            break;
        }
        case 'get-client-width': {
            return browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                return browser.tabs.sendMessage(tabs[0].id, {
                    action: 'get-client-width',
                })
                    .then((response) => {
                        if (response && response.width) {
                            return {
                                width: response.width
                            }
                        } else {
                            return undefined;
                        }
                    })
                    .catch(error => {
                        console.error(`Error: ${error}`);
                    })
            })
            break;
        };
        case 'get-location-ui': {
            return browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                return browser.tabs.sendMessage(tabs[0].id, {
                    action: 'get-location-ui',
                })
                    .then((response) => {
                        if (response) {
                            const { hostname, protocol, href } = response.location;
                            const { tags, width } = response;

                            if (STORE[hostname]) {
                                STORE[hostname]['LOCATION'] = { href, hostname, protocol };
                                STORE[hostname]['TAGS'] = tags;
                                setItemToLocalStorage('STORE', STORE);
                                return { href, hostname, protocol, tags, width };
                            } else {
                                return {};
                            }
                        } else {
                            return {};
                        }
                    })
                    .catch(error => {
                        console.error(`Error: ${error}`);
                    })
            })
            break;
        }
        case 'get-requests-tags':
        case 'get-history': {
            return sendResponse(STORE);
            break;
        }

        case 'delete-history-entry': {
            if (null !== STORE && undefined !== STORE['HISTORY']) {
                const newArray = [];

                for (let x = 0; x <= STORE['HISTORY'].length - 1; x++) {
                    if (STORE['HISTORY'][x].uuid != request.uuid) {
                        newArray.push(STORE['HISTORY'][x]);
                    }
                }
                STORE['HISTORY'] = newArray;
                setItemToLocalStorage('STORE', STORE);
                return sendResponse(true);
            }
            else {
                return sendResponse(true);
            }
            break;
        }
        case 'open-new-tab': {
            // @ts-ignore
            browser.tabs.create({
                url: request.url
            });
            return sendResponse(true);
            break;
        }
        case 'save-code':
        case 'save-code-history': {
            try {
                let tabId = sender.tab.id;
                let storageName = "storedCode-" + tabId;

                let code = {
                    tabId: sender.tab.id,
                    href: request.href,
                    grabbetItems: request.grabbetItems,
                    allNodes: request.allNodes,
                    allTagsOfThisType: request.allTagsOfThisType,
                    allAvailableTagsAtAll: request.allAvailableTagsAtAll,
                    tag: request.tag,
                    uuid: customKey()
                };

                const DATE = new Date();
                const year = DATE.getFullYear();
                const month = (DATE.getMonth() + 1) >= 10 ? (DATE.getMonth() + 1) : '0' + (DATE.getMonth() + 1);
                const day = DATE.getDate() >= 10 ? DATE.getDate() : '0' + DATE.getDate()
                const generatedDay = day + '.' + month + '.' + year;

                const entryForyHistoryWebsite = {
                    code: request.code,
                    tabId: sender.tab.id,
                    href: request.href,
                    grabbetItems: request.grabbetItems,
                    allNodes: request.allNodes,
                    allTagsOfThisType: request.allTagsOfThisType,
                    allAvailableTagsAtAll: request.allAvailableTagsAtAll,
                    hostname: request.hostname,
                    date: generatedDay,
                    tag: request.tag,
                    uuid: customKey()
                };

                setItemToLocalStorage(storageName, entryForyHistoryWebsite);

                if (STORE['HISTORY'] && 'save-code-history' !== request.action) {
                    STORE['HISTORY'].push(entryForyHistoryWebsite);
                } else {
                    if ('save-code-history' !== request.action) {
                        STORE['HISTORY'] = [entryForyHistoryWebsite];
                    }
                }

                try {
                    setItemToLocalStorage('STORE', STORE);
                } catch (error) {
                    console.info("ERROR - localStorage.setItem: ", error);
                    console.info("CLEARING STORAGE");
                    localStorage.clear();
                }

                code = JSON.stringify(code);
                var extentionsPrefix = browser.runtime.getURL('Distribution/Dashboard/index.html#/');
                browser.tabs.create({
                    url: extentionsPrefix + "?tab=" + btoa(code)
                })
                    .then(onCreated, onErrorTab)
                    .catch(function (error) {
                        console.error(`Error: ${error}`);
                    });
                return sendResponse({
                    success: true,
                    tabId: tabId
                });
            }
            catch (error) {
                return sendResponse({
                    success: false,
                    tabId: null
                });
            }
            break;
        }
        case 'get-saved-code': {
            var tabId = request.tabId;
            var storageName = "storedCode-" + tabId;
            var storedElements = localStorage.getItem(storageName);

            if (null == storedElements) {
                setItemToLocalStorage(storageName, []);
                return sendResponse([]);
            }

            return sendResponse(storedElements);
        }

        case 'close-iframe': {
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                browser.tabs.sendMessage(tabs[0].id, {
                    action: 'close-iframe'
                })
                    .catch(onError);
            })
                .catch(onError);
            break;
        }

        /**
         * Master elements
         */
        case 'generate-source-html': {
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                sendMessageToContentScript(tabs, 'html', 'websites');
            })
                .catch(onError);
            break;
        }
        case 'generate-source-picker': {
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                sendMessageToContentScript(tabs, 'picker', 'custom picked');
            })
                .catch(onError);
            break;
        }

        case 'generate-source-live-preview': {
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                sendMessageToContentScript(tabs, 'live-preview', 'live preview');
            })
                .catch(onError);
            break;
        }

        /**
         * Single available elements
         */
        case 'generate-source-body': {
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                sendMessageToContentScript(tabs, 'body', 'body');
            })
                .catch(onError);
            break;
        }
        case 'generate-source-head': {
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                sendMessageToContentScript(tabs, 'head', 'head');
            })
                .catch(onError);
            break;
        }
        /**
         * Multiple available elements
         */
        case 'generate-tags-inner-html': {
            browser.tabs.query({
                currentWindow: true,
                active: true
            }).then(function (tabs) {
                sendMessageToContentScriptDefault(tabs, request.tag);
            })
                .catch(onError);
            break;
        }
    }
});
