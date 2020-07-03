import * as React from 'react';

import customKey from '../../AppFiles/Functions/customKey';

import { getTranslations } from '../../Translations/index';

import ModuleFullScreenLoading from '../../AppFiles/Modules/ModuleFullScreenLoading';

import ToTopRocket from '../../AppFiles/Modules/Modules/ToTopRocket';

class History extends React.Component {

    constructor() {
        super();
        this.getCodes = this.getCodes.bind(this);
        this.deleteSingleCode = this.deleteSingleCode.bind(this);

        this.state = {
            code: '',
            originalUrl: '',
            tabId: 0,
            grabbetItems: [],
            allNodes: 0,
            allTagsOfThisType: '',
            allAvailableTagsAtAll: [],
            showLoading: true,
            generatedList: [],
            codeJsx: [],
            entries: []
        };
        this.translations = getTranslations();
        this.mainTimeStart = Date.now();
    }

    componentDidMount() {
        this.getCodes();
    }

    async getCodes() {
        const history = await browser.runtime.sendMessage({ action: 'get-history' });

        if (history && history.HISTORY && history.HISTORY.length) {
            const accordion = {};
            const codeJsx = [];
            let entries = history.HISTORY;

            for (let x = 0; x <= entries.length - 1; x++) {
                if (undefined !== entries[x].date && entries[x].date.length) {
                    if (accordion[entries[x].date]) {
                        accordion[entries[x].date].push(entries[x]);
                    } else {
                        accordion[entries[x].date] = [entries[x]];
                    }
                }
            }

            let orderedElements = [];

            try {
                orderedElements = Object.keys(accordion);

                for (let x = 0; x <= orderedElements.length - 1; x++) {
                    const dateFromKey = orderedElements[x];
                    let childs = [];

                    accordion[dateFromKey].map( object => {
                        const { tag, href } = object;

                        childs.push(
                            <div className='code-box' key={customKey()}>
                                <div className="export-options flex flex-column">
                                    <i title="Generate saved code from localStorage" onClick={(e) => this.generateSingleCode(object)} className="fas fa-code"></i>
                                    <i title="Delete this code from localStorage`s history" onClick={(e) => this.deleteSingleCode(object)} className="fas fa-trash-alt"></i>
                                </div>
                                <div className="value">
                                    {`Tag: ${tag}`}
                                </div>
                                <div className="value">
                                    {`Url: ${href}`}
                                </div>
                            </div>
                        );
                    });

                    codeJsx.push(
                        <div key={customKey()} className="code-box-holder">
                            <h1>
                                {
                                    dateFromKey
                                }
                            </h1>
                            {
                                childs
                            }
                        </div>
                    );
                }

                this.setState({
                    showLoading: false,
                    codeJsx,
                    entries
                });
            } catch (error) {
                this.setState({
                    showLoading: false,
                    entries: [],
                    codeJsx: []
                });
            }
        } else {
            this.setState({
                showLoading: false,
                entries: [],
                codeJsx: []
            });
        }
    }

    deleteSingleCode(object) {
        browser.runtime.sendMessage({
            action: 'delete-history-entry',
            uuid: object.uuid
        })
            .then(() => {
                this.getCodes();
            });
    }

    generateSingleCode(object) {
        const {
            tag, allNodes, tabId, allTagsOfThisType,
            allAvailableTagsAtAll, grabbetItems,
            hostname, href, code
        } = object;

        browser.runtime.sendMessage({
            action: 'save-code-history',
            code, href,
            grabbetItems, allNodes,
            allTagsOfThisType,
            allAvailableTagsAtAll,
            hostname, tabId, tag
        });
    }

    render() {
        const { showLoading, codeJsx, entries } = this.state;

        if (showLoading) {
            return <ModuleFullScreenLoading />;
        }

        if (0 == entries.length) {
            return (
                <div>
                    <i className="fas fa-code no-code-icon"></i>
                    <p className="no-code-text">
                        {
                            this.translations.no_msg_1
                        }
                    </p>
                </div>
            );
        }

        return (
            <div className="website--history">
                {
                    codeJsx
                }
                <ToTopRocket />
            </div>
        );
    }
}

export default History;