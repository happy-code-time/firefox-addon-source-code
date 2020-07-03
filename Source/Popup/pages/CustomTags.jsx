import React, { Component } from 'react';

import customKey from '../../AppFiles/Functions/customKey';

import { getTranslations } from '../../Translations/index';

import NoData from '../../AppFiles/Modules/NoData';

import ModuleFullScreenLoading from '../../AppFiles/Modules/ModuleFullScreenLoading';

class CustomTags extends Component {

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
            officialTags: [
                'html',
                'body',
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
                'br',
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
                'video',
                'header',
                'footer',
                'section'
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
        const { officialTags } = this.state;
        const jsx = [];

        for (let x = 0; x <= this.state.tags.length - 1; x++) {
            const tag = this.state.tags[x].tagName.toLowerCase();

            if(!officialTags.includes(tag)){
                jsx.push(
                    <div 
                        key={customKey()}
                        className='single-tag found-tags single-custom-tag'
                        onClick={(e) => { this.generateCode(this.state.tags[x].tagName) }}
                    >
                        <span className="tag">
                        {
                            this.state.tags[x].tagName
                        }
                        </span>
                        <span className='count'>
                        {
                            this.state.tags[x].count
                        }
                        </span>
                    </div>
                );
            }
        }

        if(0 == jsx.length){
            return <NoData/>
        }

        return (
            <ul className="tags-ul">
            {
                jsx
            }
            </ul>
        );
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
                        this.translations.popupCustomTagsTitle
                    }
                </h1>
                <div className="tags tags-custom" id="tags">
                    {
                        this.generateTagsHtml()
                    }
                </div>
            </div>
        );
    }
}

export default CustomTags;