import React, { Component } from 'react';

import customKey from '../../AppFiles/Functions/customKey';

import { getTranslations } from '../../Translations/index';

import ModuleFullScreenLoading from '../../AppFiles/Modules/ModuleFullScreenLoading';

class Tags extends Component {

    constructor () {
        super();
        this.generateCode = this.generateCode.bind(this);
        this.translations = getTranslations();

        this.state = {
            appId: 'root-light',
            hostname: this.translations.error_http,
            href: '',
            protocol: '',
            showLoading: true,
            tags: [],
            error: false,
            width: 700,
            possibleTags: [
                {
                    group: 'a',
                    tags: [
                        'a',
                        'abbr',
                        'address',
                        'area',
                        'article',
                        'aside',
                        'audio',    
                    ],
                    id: customKey(),
                    groupName: 'A - C'
                },
                {
                    group: 'b',
                    tags: [
                        'b',
                        'base',
                        'bdi',
                        'bdo',
                        'blockquote',
                        'body',
                        'button'
                    ],
                    id: customKey()
                },
                {
                    group: 'c',
                    tags: [
                        'canvas',
                        'caption',
                        'cite',
                        'code',
                        'col',
                        'colgroup',   
                    ],
                    id: customKey()
                },
                {
                    group: 'd',
                    tags: [
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
                    ],
                    id: customKey(),
                    groupName: 'D - F'
                },
                {
                    group: 'e',
                    tags: [
                        'em',
                        'embed', 
                    ],
                    id: customKey(),
                },
                {
                    group: 'f',
                    tags: [
                        'fieldset',
                        'figure',
                        'footer',
                        'form', 
                    ],
                    id: customKey()
                },
                {
                    group: 'h',
                    tags: [
                        'h1',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'h6',
                        'head',
                        'header',
                        'hgroup',
                        'hidden',
                        'html'
                    ],
                    id: customKey(),
                    groupName: 'H - K'
                },
                {
                    group: 'i',
                    tags: [
                        'i',
                        'iframe',
                        'img',
                        'input',
                        'ins', 
                    ],
                    id: customKey()
                },
                {
                    group: 'k',
                    tags: [
                        'kbd',
                    ],
                    id: customKey()
                },
                {
                    group: 'l',
                    tags: [
                        'label',
                        'legend',
                        'li',
                        'link',
                    ],
                    id: customKey(),
                    groupName: 'L - N'
                },
                {
                    group: 'm',
                    tags: [
                        'main',
                        'map',
                        'mark',
                        'menu',
                        'menuitem',
                        'meta',
                    ],
                    id: customKey(),
                },
                {
                    group: 'n',
                    tags: [
                        'nav',
                        'noscript',
                    ],
                    id: customKey()
                },
                {
                    group: 'o',
                    tags: [
                        'object',
                        'ol',
                        'optgroup',
                        'option',
                    ],
                    id: customKey(),
                    groupName: 'O - S'
                },
                {
                    group: 'p',
                    tags: [
                        'p',
                        'pre',
                        'progress',
                    ],
                    id: customKey()
                },
                {
                    group: 's',
                    tags: [
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
                        'svg'
                    ],
                    id: customKey()
                },
                {
                    group: 't',
                    tags: [
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
                    ],
                    id: customKey(),
                    groupName: 'T - V'
                },
                {
                    group: 'u',
                    tags: [
                        'u',
                        'ul',
                    ],
                    id: customKey()
                },
                {
                    group: 'v',
                    tags: [
                        'var',
                        'video',
                    ],
                    id: customKey()
                }
            ]
        };
    }

    componentDidMount() {
        browser.runtime.sendMessage({
            action: 'get-location-ui'
        })
            .then((response) => {

                if (undefined !== response && {} !== response) {
                    const { hostname, href, protocol, width } = response;

                    this.setState({
                        hostname, href, protocol, width
                    }, () => {
                        browser.runtime.sendMessage({ action: 'get-requests-tags' })
                            .then((responseRequests) => {
                                if ({} === responseRequests) {
                                    this.setState({
                                        tags: [],
                                        showLoading: false
                                    });
                                } else {
                                    this.setState({
                                        tags: responseRequests[this.state.hostname]['TAGS'],
                                        showLoading: false
                                    });
                                }
                            })
                            .catch(error => {
                                this.setState({
                                    showLoading: false,
                                    requests: [],
                                    tags: [],
                                });
                            });
                    });
                } else {
                    this.setState({
                        showLoading: false,
                        requests: [],
                        tags: [],
                    });
                }
            })
            .catch(error => {
                this.setState({
                    showLoading: false,
                    requests: [],
                    tags: [],
                });
            });
    }

    generateCodeSingle(action){
        browser.runtime.sendMessage({ action })
        .then( () => {
            window.close()
        });
    }
    
    generateCode(action) {
        browser.runtime.sendMessage({
            action: 'generate-tags-inner-html',
            tag: action
        })
        .then( () => {
            window.close()
        });
    }

    generatePicker() {
        browser.runtime.sendMessage({
            action: 'generate-source-picker'
        });
        window.close();
    }

    generateLivePreview(){
        browser.runtime.sendMessage({
            action: 'generate-source-live-preview'
        });
        window.close();
    }

    generateTagsHtml() {
        const jsx = [];

        this.state.possibleTags.map( tagObject => {
            const tagGroup = tagObject.group;
            const tags = tagObject.tags;
            const uuid = tagObject.id;
            let foundMatch = 0;

            const childs = [];

            tags.map( t => {
                foundMatch = 0;
                
                for (let x = 0; x <= this.state.tags.length - 1; x++) {
                    foundMatch = 0;

                    if (t.toLowerCase() === this.state.tags[x].tagName.toLowerCase()) {
                        foundMatch = this.state.tags[x].count;
                        break;
                    }
                }

                if('body' === t){
                    childs.push(
                        <div 
                            key={customKey()}
                            className={`single-tag ${0 !== foundMatch ? ' found-tags' : ''}`}
                            onClick={(e) => { this.generateCodeSingle('generate-source-body') }}
                        >
                            <span className="tag">
                            {
                                t
                            }
                            </span>
                            <span className='count'>
                            {
                                0 !== foundMatch && foundMatch
                            }
                            </span>
                        </div>
                    );
                }

                else if('html' === t){
                    childs.push(
                        <div 
                            key={customKey()}
                            className={`single-tag ${0 !== foundMatch ? ' found-tags' : ''}`}
                            onClick={(e) => { this.generateCodeSingle('generate-source-html') }}
                        >
                            <span className="tag">
                            {
                                t
                            }
                            </span>
                            <span className='count'>
                            {
                                0 !== foundMatch && foundMatch
                            }
                            </span>
                        </div>
                    );
                }

                else if('head' === t){
                    childs.push(
                        <div 
                            key={customKey()}
                            className={`single-tag ${0 !== foundMatch ? ' found-tags' : ''}`}
                            onClick={(e) => { this.generateCodeSingle('generate-source-head') }}
                        >
                            <span className="tag">
                            {
                                t
                            }
                            </span>
                            <span className='count'>
                            {
                                0 !== foundMatch && foundMatch
                            }
                            </span>
                        </div>
                    );
                }

                else {
                    childs.push(
                        <div 
                            key={customKey()}
                            className={`single-tag ${0 !== foundMatch ? ' found-tags' : ''}`}
                            onClick={(e) => { this.generateCode(t) }}
                        >
                            <span className="tag">
                            {
                                t
                            }
                            </span>
                            <span className='count'>
                            {
                                0 !== foundMatch && foundMatch
                            }
                            </span>
                        </div>
                    );
                }
            });

            jsx.push(
                <li 
                    key={customKey()}
                    id={uuid}
                >
                    <div className="tag-group">
                    {
                        tagGroup
                    }
                    </div>
                    {
                        childs
                    }
                </li>
            );
        })

        return (
            <ul className="tags-ul flex flex-column">
            {
                jsx
            }
            </ul>
        );
    }

    navigateToId(id){
        const holder = document.getElementById('tags');
        const target = document.getElementById(id);

        if(holder && target){
            holder.scrollTop = target.offsetTop-holder.getBoundingClientRect().height+200;
        }
    }

    generateGroups(){
        const lis = [];

        this.state.possibleTags.map( tagObject => {
            const groupName = tagObject.groupName;

            if(groupName){
                lis.push(
                    <li
                        key={customKey()}
                        onClick={(e) => this.navigateToId(tagObject.id)}
                    >
                        {
                            groupName
                        }
                    </li>
                );
            }
        });

        return (
            <ul>
                {
                    lis
                }
            </ul>
        )
    }

    render() {
        const { showLoading } = this.state;

        return (
            <div className="ContentBody">
                {
                    showLoading && <ModuleFullScreenLoading/>
                }
                <h1 className="h1 text-center ff-title">
                    {
                        this.translations.popupTagsTitle
                    }
                </h1>
                <div className="tags" id="tags">
                    {
                        this.generateTagsHtml()
                    }
                </div>
                <div className="footer">
                    {
                        this.generateGroups()
                    }
                </div>
            </div>
        );
    }
}

export default Tags;