var eventsAttached = false;

class SourceCode {
    constructor() {
        const self = this;
        self.displayErrors = true;
        self.sourceCodeHolder = [];
        self.availableTags = [
            'a',
            'abbr',
            'address',
            'area',
            'article',
            'aside',
            'audio',
            'b',
            'base',
            'bdi',
            'bdo',
            'blockquote',
            'body',
            'button',
            'canvas',
            'caption',
            'cite',
            'code',
            'col',
            'colgroup',
            'data',
            'datalist',
            'dd',
            'del',
            'details',
            'dfn',
            'dialog',
            'div',
            'dl',
            'dom-module',
            'dom-repeat',
            'dt',
            'em',
            'embed',
            'fieldset',
            'figure',
            'footer',
            'form',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'head',
            'hgroup',
            'hidden',
            'html',
            'i',
            'iframe',
            'img',
            'input',
            'ins',
            'kbd',
            'label',
            'legend',
            'li',
            'link',
            'main',
            'map',
            'mark',
            'menu',
            'menuitem',
            'meta',
            'nav',
            'noscript',
            'object',
            'ol',
            'optgroup',
            'option',
            'p',
            'pre',
            'progress',
            's',
            'script',
            'section',
            'select',
            'small',
            'source',
            'span',
            'strong',
            'style',
            'sub',
            'summary',
            'sup',
            'svg',
            'table',
            'tbody',
            'td',
            'template',
            'template',
            'template',
            'textarea',
            'tfoot',
            'th',
            'time',
            'title',
            'tr',
            'track',
            'u',
            'ul',
            'var',
            'video'
        ];

        self.availableTagsLiveCode = [
            'a',
            'abbr',
            'address',
            'area',
            'article',
            'aside',
            'audio',
            'b',
            'base',
            'bdi',
            'bdo',
            'blockquote',
            'body',
            'button',
            'canvas',
            'caption',
            'cite',
            'code',
            'col',
            'colgroup',
            'data',
            'datalist',
            'dd',
            'del',
            'details',
            'dfn',
            'dialog',
            'div',
            'dl',
            'dom-module',
            'dom-repeat',
            'dt',
            'em',
            'embed',
            'fieldset',
            'figure',
            'footer',
            'form',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'head',
            'hgroup',
            'hidden',
            'html',
            'i',
            'iframe',
            'img',
            'input',
            'ins',
            'kbd',
            'label',
            'legend',
            'li',
            'link',
            'main',
            'map',
            'mark',
            'menu',
            'menuitem',
            'meta',
            'nav',
            'noscript',
            'object',
            'ol',
            'optgroup',
            'option',
            'p',
            'pre',
            'progress',
            's',
            'script',
            'section',
            'select',
            'small',
            'source',
            'span',
            'strong',
            'style',
            'sub',
            'summary',
            'sup',
            'svg',
            'table',
            'tbody',
            'td',
            'template',
            'template',
            'template',
            'textarea',
            'tfoot',
            'th',
            'time',
            'title',
            'tr',
            'track',
            'u',
            'ul',
            'var',
            'video'
        ];

        /**
         * Catch all messages from background comes from Popup script
         */
        browser.runtime.onMessage.addListener(function (e) {
            const { hostname, href, protocol } = window.location;

            switch (e.action) {
                case 'check-addons-availablitity': {
                    return Promise.resolve(true);
                    break;
                }
                case 'get-location-ui': {
                    return Promise.resolve({
                        location: { hostname, href, protocol },
                        tags: self.generateCaluclationOfAllAvailableTags(),
                        width: document.documentElement.getBoundingClientRect().width
                    });
                    break;
                }
                case 'get-client-width': {
                    return Promise.resolve({
                        width: document.documentElement.getBoundingClientRect().width
                    });
                    break;
                }

                case 'close-iframe': {
                    self.closeLivePreview();
                    return Promise.resolve(true);
                    break;
                }

                default: {
                    self.action = e.action;
                    self.doc = document;
                    let found = false;

                    var check = setInterval(() => {
                        if (!found) {
                            found = true;

                            if ('generate-source-picker' == self.action) {
                                return self.generatePicker();
                            }

                            else if ('generate-source-live-preview' == self.action) {
                                return self.generateLivePreview();
                            }

                            else {
                                self.displayOptions(self.action, e.tag);
                            }

                            clearInterval(check);
                            return Promise.resolve(true);
                        }
                    }, 500);
                    break;
                }
            }
        });
    }

    // /**
    //  * Show or hide Loading icon
    //  * @param message 
    //  * @param showOrHide 
    //  */
    // loadingIconFn(message, showOrHide) {
    //     const loadingIcon = document.getElementById(this.loadingId);
    //     const loadingIconP = document.querySelector(`#${this.loadingId} p`);

    //     if (loadingIcon && loadingIconP) {

    //         if (showOrHide) {
    //             loadingIconP.innerHTML = message;
    //             loadingIcon.style.display = 'flex';

    //         } else {
    //             loadingIconP.innerHTML = '';
    //             loadingIcon.style.display = 'none';
    //         }
    //     }
    // }

    // /**
    //  * Create loading icon
    //  */
    // createLoadingMessager() {
    //     const element = document.getElementById(this.loadingId);

    //     if (null === element) {
    //         let div = document.createElement('DIV');
    //         div.id = this.loadingId;
    //         div.style.position = 'fixed';
    //         div.style.width = '100vW';
    //         div.style.height = '100vH';
    //         div.style.backgroundColor = 'rgba(255,255,255,0.85)';
    //         div.style.left = '0';
    //         div.style.top = '0';
    //         div.style.zIndex = '999999999999999999999';
    //         div.style.display = 'flex';
    //         div.style.flexDirection = 'column';
    //         div.style.justifyContent = 'space-evenly';

    //         let loadingIcon = document.createElement('IMG');
    //         loadingIcon.setAttribute('src', browser.extension.getURL('/Distribution/Images/loading.gif'));
    //         loadingIcon.style.width = '68px';
    //         loadingIcon.style.height = '68px';
    //         loadingIcon.style.margin = 'auto';
    //         div.appendChild(loadingIcon);

    //         let pTag = document.createElement('P');
    //         pTag.style.margin = '-20vH auto 30vH auto';
    //         pTag.style.fontSize = '21px';
    //         pTag.style.color = 'rgba(69,69,69,1)';
    //         pTag.style.width = '90vW';
    //         pTag.style.textAlign = 'center';
    //         div.appendChild(pTag);
    //         document.body.appendChild(div);
    //     }
    // }
    /**
     * Inner Html of modal has to be reseted each Popup script call
     */
    resetModalsInnerHtml() {
        this.sourceCodeHolder = [];
    }

    /**
     * Display options
     * @param option 
     */
    displayOptions(option, tag = '') {
        this.elements = [];
        this.sourceCodeHolder = [];

        try {
            this.resetModalsInnerHtml();
            switch (option) {

                case 'generate-source-html': {
                    this.elements = this.doc.documentElement.innerHTML;
                    return this.generateElementsWholeWebsite(this.elements, 'html');
                }

                case 'generate-source-head': {
                    const items = this.doc.getElementsByTagName('HEAD')[0];
                    return this.generateElements(items, true, 'head');
                }

                case 'generate-source-body': {
                    const items = this.doc.getElementsByTagName('BODY')[0];
                    return this.generateElements(items, true, 'body');
                }

                case 'generate-default': {
                    if (tag) {

                        if ('html' === tag || 'HTML' === tag) {
                            this.elements = this.doc.documentElement.innerHTML;
                            return this.generateElementsWholeWebsite(this.elements, 'html');
                        }

                        if ('head' === tag || 'HEAD' === tag) {
                            const items = this.doc.getElementsByTagName('HEAD')[0];
                            return this.generateElements(items, true, 'head');
                        }

                        if ('body' === tag || 'BODY' === tag) {
                            const items = this.doc.getElementsByTagName('BODY')[0];
                            return this.generateElements(items, true, 'body');
                        }

                        tag = tag.toLowerCase();
                        this.elements = this.doc.querySelectorAll(tag);
                        return this.generateElements(this.elements, false, tag);
                    }
                    break;
                }
            }

        } catch (error) {
            if (this.displayErrors) {
                console.debug(error);
            }
        }
    }

    customKey() {
        return Math.floor((Math.random() * 123456789) + 1) + '9' +
            Math.floor((Math.random() * 123456789) + 1) + '1' +
            Math.floor((Math.random() * 123456789) + 1) + '8' +
            Math.floor((Math.random() * 123456789) + 1);
    }

    /**
     * Extract attributes from NameNodeMap
     */
    extractAttributes(NodesAttributes) {
        const attributes = [];

        if (NodesAttributes && NodesAttributes.length) {
            for (let x = 0; x <= NodesAttributes.length - 1; x++) {
                attributes.push({
                    name: NodesAttributes[x].name,
                    value: NodesAttributes[x].value
                });
            }
        }

        return attributes;
    }

    /**
     * Show code preview box
     */
    showLivePreviewBox(object) {
        const self = this;
        const iframeId = 'source-code-live-preview';

        try {
            let iframe = document.getElementById(iframeId);

            if (null != iframe) {
                iframe.parentElement.removeChild(iframe);
                iframe.remove();
            }

            browser.runtime.sendMessage({
                action: 'store-code',
                data: {
                    tag: object.tagName,
                    innerHTML: object.innerHTML,
                    innerText: object.innerText,
                    outerHTML: object.outerHTML,
                    attributes: self.extractAttributes(object.attributes)
                }
            })
                .then((tabid) => {
                    iframe = document.getElementById(iframeId);
                    document.body.style.overflow = 'hidden';
                    document.documentElement.style.overflow = 'hidden';

                    if (null == iframe) {
                        iframe = document.createElement('IFRAME');
                        iframe.setAttribute('src', browser.runtime.getURL('Distribution/Iframes/index.html?tabid=' + tabid));
                        iframe.setAttribute('style', 'position:fixed; width: 102vw; height: 101vh; top: -10px; left:-10px; z-index:999999999999999999; overflow: hidden;');
                        iframe.id = iframeId;

                        if (document.documentElement) {
                            document.documentElement.appendChild(iframe);
                        }

                        if (!document.documentElement && document.body) {
                            document.body.appendChild(iframe);
                        }
                    }
                })
                .catch((error) => {

                })
        } catch (error) {

        }
    }

    closeLivePreview() {
        const iframeId = 'source-code-live-preview';
        let iframe = document.getElementById(iframeId);

        if (null != iframe) {
            document.body.style.overflow = 'inherit';
            document.documentElement.style.overflow = 'inherit';
            iframe.parentElement.removeChild(iframe);
            iframe.remove();
        }
    }

    /**
     * Live preview source code
     */
    generateLivePreview() {
        const self = this;
        const currentNodes = document.all;
        const allNodes = [];

        try {
            self.availableTagsLiveCode.map(t => {
                const newNodes = document.querySelectorAll(t);

                if (newNodes && newNodes.length) {
                    for (let x = 0; x <= newNodes.length - 1; x++) {
                        allNodes.push(newNodes[x]);
                    }
                }
            });

            setTimeout(() => {
                // self grabbed nodes

                for (let a = 0; a <= allNodes.length - 1; a++) {

                    if (allNodes[a].id != 'source-code-displayer-root' && allNodes[a].id != 'loading-screen-source-code') {

                        allNodes[a].addEventListener('click', (event) => {
                            const target = event.target;
                            self.showLivePreviewBox(target);
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                            event.preventDefault();
                        });
                    }
                }

                // current nodes
                for (let a = 0; a <= currentNodes.length - 1; a++) {

                    if (currentNodes[a].id != 'source-code-displayer-root' && currentNodes[a].id != 'loading-screen-source-code') {

                        currentNodes[a].addEventListener('click', (event) => {
                            const target = event.target;
                            self.showLivePreviewBox(target);
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                            event.preventDefault();
                        });
                    }
                }
            }, 2000);

        } catch (error) {
            if (this.displayErrors) {
                console.debug(error);
            }
        }
    }

    /**
     * Generate pickers functionality
     */
    generatePicker() {
        const nodes = document.all;

        try {
            setTimeout(() => {
                for (let a = 0; a <= nodes.length - 1; a++) {

                    if (nodes[a].id != 'source-code-displayer-root' && nodes[a].id != 'loading-screen-source-code') {

                        nodes[a].addEventListener('dblclick', (event) => {
                            event.stopImmediatePropagation();
                            event.stopPropagation();

                            return setTimeout(() => {
                                this.resetModalsInnerHtml();
                                const nodeName = (event.target && event.target.nodeName) ? event.target.nodeName : '';
                                this.generateElements([event.target], false, nodeName);
                            }, 1000);
                        });

                        nodes[a].addEventListener('click', (event) => {
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                            return false;
                        });
                    }
                }

                const aElements = document.querySelectorAll('a');

                for (let x = 0; x <= aElements.length - 1; x++) {
                    let element = aElements[x];

                    if (element.hasAttribute('href')) {
                        element.setAttribute('origin-href', element.getAttribute('href'));
                        element.removeAttribute('href');
                        element.setAttribute('href', 'javascript:void(0)');
                    }
                    if (element.hasAttribute('target')) {
                        element.setAttribute('origin-target', element.getAttribute('target'));
                        element.removeAttribute('target');
                    }
                }
            }, 2000);

        } catch (error) {
            if (this.displayErrors) {
                console.debug(error);
            }
        }
    }

    generateCaluclationOfAllAvailableTags() {
        const all = [];
        const availableTags = this.availableTags;

        /**
         * Grab all custom tags
         */
        if (document && 0 !== document.all.length) {
            for (let x = 0; x <= document.all.length - 1; x++) {
                if (document.all[x] && document.all[x].tagName) {
                    const tagNameFromDocumentAll = document.all[x].tagName.toLowerCase();

                    if (!availableTags.includes(tagNameFromDocumentAll)) {
                        availableTags.push(tagNameFromDocumentAll);
                    }
                }
            }
        }

        availableTags.sort();

        this.availableTags.map(tagName => {
            const array = document.querySelectorAll(tagName);

            if (array && array.length) {
                all.push({
                    tagName,
                    count: array.length
                });
            }
        });

        return all;
    }

    sendCodeToBackgroundStorage(tagName = '') {
        browser.runtime.sendMessage({
            action: 'save-code',
            code: this.sourceCodeHolder,
            href: window.location.href,
            grabbetItems: this.sourceCodeHolder.length,
            allNodes: document.all.length,
            allTagsOfThisType: document.querySelectorAll(tagName).length,
            allAvailableTagsAtAll: this.generateCaluclationOfAllAvailableTags(),
            hostname: window.location.hostname,
            tag: tagName
        });
    }

    /**
     * Display other HTMLElements
     * @param elements 
     */
    generateElements(elements, isSelectedFirstItem = false, tagName = '') {
        try {
            if (elements.length && !isSelectedFirstItem) {
                for (let x = 0; x <= elements.length - 1; x++) {
                    if (elements[x].outerHTML) {
                        const object = {
                            html: elements[x].outerHTML,
                            tag: tagName ? tagName : elements[x].nodeName
                        };
                        this.sourceCodeHolder.push(object);
                    }
                }
            }
            else {
                if (elements.outerHTML) {
                    const object = {
                        html: elements.outerHTML,
                        tag: tagName
                    };
                    this.sourceCodeHolder.push(object);
                }
            }
            this.sendCodeToBackgroundStorage(tagName);
        } catch (error) {
            if (this.displayErrors) {
                console.debug(error);
            }
            this.sendCodeToBackgroundStorage('');
        }
    }

    /**
     * Display whole websites HTMLCollection
     * @param elements 
     */
    generateElementsWholeWebsite(elements, tagName = '') {
        try {
            if (elements.length) {
                const object = {
                    html: elements,
                    tag: tagName ? tagName : 'html'
                };
                this.sourceCodeHolder.push(object);
                this.sendCodeToBackgroundStorage(tagName);
            }
        } catch (error) {
            if (this.displayErrors) {
                console.debug(error);
            }
            this.sendCodeToBackgroundStorage('');
        }
    }
}

new SourceCode();

browser.runtime.sendMessage({ action: 'reset-requests', hostname: window.location.hostname });