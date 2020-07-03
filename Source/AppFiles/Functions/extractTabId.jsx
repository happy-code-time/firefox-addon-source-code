export const extractTabId = (href) => {
    try {
        if ('string' == typeof href && 10 < href.length) {
            let string = href.split('?tab=');

            if (string[1] && 'string' == typeof string[1] && string[1].length) {
                return extractHref(string);
            } else {
                return false;
            }
        }
    } catch (error) {
        return false;
    }  
}


const extractHref = (string) => {
    sessionStorage.setItem('CODE_HREF', string);
    string = string[1].replace('#/', '');
    string = atob(string);

    try {
        const object = JSON.parse(string);
        return {
            tabId: object.tabId,
            originalHref: object.href,
            grabbetItems: object.grabbetItems,
            allNodes: object.allNodes,
            allTagsOfThisType: object.allTagsOfThisType,
            allAvailableTagsAtAll: object.allAvailableTagsAtAll
        };
    } catch (error) {
        return false
    }
}