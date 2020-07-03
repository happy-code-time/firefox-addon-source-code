import React, { Component } from 'react';

import customKey from '../../AppFiles/Functions/customKey';

import { exctractCode } from '../../AppFiles/Functions/exctractCode';

import { copyToClipBoard } from '../../AppFiles/Functions/copyToClipboard';

import { getTranslations } from '../../Translations/index';

import addToStore from '../../AppFiles/Store/addToStore';

import * as FileSaver from 'file-saver';

import ModuleSourceCode from '../../AppFiles/Modules/ModuleSourceCode';

import ModuleNoFilteredData from '../../AppFiles/Modules/ModuleNoFilteredData';

import { addonRoot } from '../../AppFiles/Functions/addonPrefix';

import ToTopRocket from '../../AppFiles/Modules/Modules/ToTopRocket';

import LoadingBoxTop from '../../AppFiles/Modules/LoadingBoxTop';

class LastCode extends Component {

    constructor() {
        super();
        this.saveToFileJson = this.saveToFileJson.bind(this);
        this.saveToTxtFile = this.saveToTxtFile.bind(this);
        this.getCode = this.getCode.bind(this);
        this.toggleTint = this.toggleTint.bind(this);
        this.translations = getTranslations();

        this.state = {
            originalCode: [],
            code: '',
            originalUrl: '',
            tabId: 0,
            grabbetItems: [],
            showLoading: true,
            clipboard: '',
            jsonData: {
                data: []
            },
            rawTxtData: '',
            jsonDataRaw: '',


            codeAvailable: false,
            scrollToTop: false,
            codeJsx: [],
            layout: this.getLayout(),
        };
        this.mainTimeStart = Date.now();
    }

    componentDidMount() {
        let mainCode = sessionStorage.getItem('CODE');
        const jsonData = [];
        let rawTxtData = '';
        let jsonDataRaw = '';

        if (mainCode) {

            this.setState({
                codeAvailable: true,
            });

            const { code, originalUrl, tabId, grabbetItems } = exctractCode(mainCode);
            let clipboard = '';

            if (code.length) {
                code.map((object, count) => {
                    const { html } = object;

                    clipboard += `
                        ${html}
                    `;

                    jsonData.push({
                        node: count,
                        code: `${object.html}`
                    });

                    rawTxtData += object.html;
                    jsonDataRaw += object.html;
                });
            }

            this.setState({
                originalCode: code,
                code,
                originalUrl,
                tabId,
                grabbetItems,
                clipboard,
                jsonData,
                rawTxtData,
                jsonDataRaw
            }, this.getCode);
        } else {
            this.setState({
                showLoading: false
            });
        }
    }

    getLayout() {
        const allowedTints = ['light', 'dark'];
        const tint = localStorage.getItem('tint');

        if (!tint || !allowedTints.includes(tint)) {
            localStorage.setItem('tint', 'light');
            return 'light';
        }

        return tint;
    }

    toggleTint() {
        const tint = localStorage.getItem('tint');

        if ('dark' == tint) {
            localStorage.setItem('tint', 'light');
            return this.setState({ layout: 'light' }, this.getCode);
        }

        localStorage.setItem('tint', 'dark');
        return this.setState({ layout: 'dark' }, this.getCode);
    }

    copyToClipBoard(e, data) {
        copyToClipBoard(e, data, document.documentElement.scrollTop);
        addToStore(this.translations.copyToClipBoardText, 0);
    }

    getCode() {
        const { code, layout } = this.state;
        const codeJsx = [];

        if (0 !== code.length) {
            code.map((o, i) => {

                const changeExportFiles = (event, searchValue, c) => {
                    code[i].html = c;
                };

                codeJsx.push(
                    <div key={customKey()} className="code-box-holder">
                        <h1>
                            {`Node - ${i + 1}`}
                        </h1>
                        <div className='code-box' key={customKey()}>
                            <div className="export-options flex flex-column">
                                <i title="Export to txt file" onClick={(e) => { this.saveToTxtFile(code[i].html) }} className="fas fa-superscript"></i>
                                {
                                    document.queryCommandSupported &&
                                    <i
                                        title="Copy to clipboard"
                                        className="fas fa-paste"
                                        onClick={(e) => this.copyToClipBoard(e, code[i].html)}
                                    ></i>
                                }
                                <i title="Export to stringified json file" onClick={(e) => { this.saveToFileJsonSingle(code[i].html) }} className="fas fa-clipboard"></i>
                                <i title="Export to raw json file" onClick={(e) => { this.saveToFileJsonSingleRaw(code[i].html) }} className="fas fa-file-signature"></i>
                                <i
                                    title={this.translations.changeCodeTint}
                                    className="fas fa-tint"
                                    onClick={(e) => this.toggleTint()}>
                                </i>
                            </div>
                            <ModuleSourceCode
                                /*
                                * Code
                                */
                                displayLineNumber={true}
                                code={code[i].html}
                                layout={layout}
                                /*
                                * Input 
                                */
                                inputActive={true}
                                inputPlaceholder={this.translations.codeSearch}
                                inputCallback={changeExportFiles}
                                /*
                                * Loading
                                */
                                displayLoading={true}
                                loadingIcon={<LoadingBoxTop/>}
                                inputNoDataText={<ModuleNoFilteredData />}
                            />
                        </div>
                    </div>
                );
            });

            this.setState({
                showLoading: false,
                codeJsx
            });
        }
        else{
            this.setState({
                showLoading: false,
                codeJsx
            });
        }
    }

    saveToFileJsonSingle(singleString) {
        if (singleString.length) {
            try {
                var blob = new Blob([JSON.stringify(singleString)], { type: "application/json;charset=utf-8" });
                saveAs(blob, `Code_X${customKey()}.json`);
            } catch (error) {
                var blob = new Blob([`Error while creating JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                saveAs(blob, `CodeX_${customKey()}.json`);
                addToStore(`Error while creating JSON file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Selected or filtered code cannot be empty.', -1);
        }
    }

    saveToFileJsonSingleRaw(singleString) {
        if (singleString.length) {
            try {
                var blob = new Blob([singleString], { type: "application/json;charset=utf-8" });
                saveAs(blob, `Code_X${customKey()}.json`);
            } catch (error) {
                var blob = new Blob([`Error while creating RAW JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                saveAs(blob, `CodeX_${customKey()}.json`);
                addToStore(`Error while creating RAW JSON file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Selected or filtered code cannot be empty.', -1);
        }
    }

    saveToFileJson() {
        if (this.state.jsonData.length) {
            try {
                var blob = new Blob([JSON.stringify(this.state.jsonData)], { type: "application/json;charset=utf-8" });
                saveAs(blob, `CodeX_${customKey()}.json`);
            } catch (error) {
                var blob = new Blob([`Error while creating JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                saveAs(blob, `CodeX_${customKey()}.json`);
                addToStore(`Error while creating JSON file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Selected or filtered code cannot be empty.', -1);
        }
    }

    saveToFileJsonRaw() {
        if (this.state.jsonDataRaw.length) {
            try {
                var blob = new Blob([this.state.jsonDataRaw], { type: "application/json;charset=utf-8" });
                saveAs(blob, `CodeX_${customKey()}.json`);
            } catch (error) {
                var blob = new Blob([`Error while creating RAW JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                saveAs(blob, `CodeX_${customKey()}.json`);
                addToStore(`Error while creating RAW JSON file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Selected or filtered code cannot be empty.', -1);
        }
    }

    saveToTxtFile(data = null) {

        if (null !== data) {
            if (data.length) {
                try {
                    var blob = new Blob([data], { type: "application/txt;charset=utf-8" });
                    saveAs(blob, `CodeX_${customKey()}.txt`);
                } catch (error) {
                    var blob = new Blob([`Error while creating TXT file. Error message: ${error}.`], { type: "application/txt;charset=utf-8" });
                    saveAs(blob, `CodeX_${customKey()}.txt`);
                    addToStore(`Error while creating TXT file. Error message: ${error}.`, -1);
                }
            }
            else {
                addToStore('Selected or filtered code cannot be empty.', -1);
            }
        }

        else {
            const { rawTxtData } = this.state;

            if (rawTxtData.length) {
                try {
                    var blob = new Blob([rawTxtData], { type: "application/txt;charset=utf-8" });
                    saveAs(blob, `CodeX_${customKey()}.txt`);
                } catch (error) {
                    var blob = new Blob([`Error while creating TXT file. Error message: ${error}.`], { type: "application/txt;charset=utf-8" });
                    saveAs(blob, `CodeX_${customKey()}.txt`);
                    addToStore(`Error while creating TXT file. Error message: ${error}.`, -1);
                }
            }
            else {
                addToStore('Selected or filtered code cannot be empty.', -1);
            }
        }
    }

    render() {
        const { codeAvailable, codeJsx, showLoading } = this.state;

        if (!codeAvailable) {
            return (
                <div className="website--last">
                    <i className="fas fa-code no-code-icon"></i>
                    <p className="no-code-text">
                        {
                            this.translations.no_last_code
                        }
                    </p>
                </div>
            );
        }

        return (
            <div className="website--last">
                {
                    showLoading && <LoadingBoxTop/>
                }
                {
                    codeJsx
                }
                <ToTopRocket />
                <form style={{
                    display: 'none !important',
                    opacity: 0,
                    position: 'absolute',
                    zIndex: '-1',
                    width: 0,
                    height: 0,
                    overflow: 'hidden'
                }}>
                    <textarea
                        id="copy-to-clipboard"
                        value=''
                        readOnly={true}
                    />
                </form>
            </div>
        );
    }
}

export default LastCode;