import React, { Component } from 'react';

import customKey from '../../AppFiles/Functions/customKey';

import { copyToClipBoard } from '../../AppFiles/Functions/copyToClipboard';

import axios from 'axios';

import * as FileSaver from 'file-saver';

import { getTranslations } from '../../Translations/index';

import ModuleSourceCode from '../../AppFiles/Modules/ModuleSourceCode';

import ModuleNoFilteredData from '../../AppFiles/Modules/ModuleNoFilteredData';

import addToStore from '../../AppFiles/Store/addToStore';

import ToTopRocket from '../../AppFiles/Modules/Modules/ToTopRocket';

import LoadingBoxTop from '../../AppFiles/Modules/LoadingBoxTop';

class External extends Component {

    constructor() {
        super();
        this.setInputValue = this.setInputValue.bind(this);
        this.setProtocolValue = this.setProtocolValue.bind(this);
        this.setFocus = this.setFocus.bind(this);
        this.setMethodValue = this.setMethodValue.bind(this);
        this.getExternalSourceCode = this.getExternalSourceCode.bind(this);
        this.translations = getTranslations();

        this.state = {
            appName: 'SourceCode',
            inputValue: '',
            protocolValue: '',
            methodValue: 'get',
            returned: {
                externalCode: '',
                statusText: '',
                status: 0,
                readyState: 0,
                config: {
                    xsrfCookieName: '',
                    xsrfHeaderName: '',
                    url: '',
                    timeout: 0,
                    method: '',
                    headers: {}
                },
                headers: {}
            },
            requestStart: 0,
            requestEnd: 0,
            showLoading: false,
            clipboard: '',
            errorMessage: '',
            head: [],
            codeAvailable: false
        };
    }

    componentDidMount() {
        const currentLocation = window.location.href;

        if (-1 !== currentLocation.indexOf('?url=')) {
            const splitted = currentLocation.split('?url=');

            if (splitted.length && undefined !== splitted[1] && splitted[1].length) {
                this.setState({
                    inputValue: splitted[1]
                }, () => {
                    this.getExternalSourceCode();
                });
            }
        }
    }

    componentDidUpdate() {
        if (this.input) {
            this.input.focus();
        }
    }

    setInputValue(e) {
        this.setState({
            inputValue: e.target.value
        });
    }

    setProtocolValue(e) {
        this.setState({
            protocolValue: e.target.value
        });
    }

    setMethodValue(e) {
        this.setState({
            methodValue: e.target.value
        });
    }

    setFocus() {
        if (this.input) {
            this.input.focus();
        }
    }

    getExternalSourceCode() {
        const { inputValue, methodValue, protocolValue } = this.state;

        if (inputValue.length && methodValue) {

            this.setState({
                showLoading: true,
                errorMessage: '',
                requestStart: 0,
                requestEnd: 0,
                clipboard: '',
                returned: {
                    externalCode: '',
                    statusText: '',
                    status: 0,
                    readyState: 0,
                    config: {
                        xsrfCookieName: '',
                        xsrfHeaderName: '',
                        url: '',
                        timeout: 0,
                        method: '',
                        headers: {}
                    },
                    headers: {}
                },
                codeAvailable: false
            }, () => {
                try {
                    const requestStart = performance.now();
                    axios[methodValue](`${protocolValue}${inputValue}`)
                        .then((externalCode) => {
                            const requestEnd = performance.now() - requestStart;
                            this.setResponse(externalCode, requestEnd);
                            this.stackCode();
                        })
                        .catch((error) => {
                            addToStore(`Error on request with error message: ${error}`, -1);
                            this.setState({ showLoading: false });
                        })
                } catch (error) {
                    addToStore(`Error on request with error message: ${error}`, -1);
                    this.setState({ showLoading: false });
                }
            });
        }
        else {
            addToStore('Please fill the fileds: method and url to make an external request', -1);
        }
    }

    setResponse(externalCode, requestEnd) {
        const { data, request, status, statusText } = externalCode;
        const returned = this.state.returned;
        let headersResponse = externalCode.headers;
        const head = [];

        try {
            headersResponse = Object.keys(headersResponse);
            headersResponse.map(key => {
                head.push({
                    key,
                    value: headersResponse[key]
                });
            });
        } catch (error) { }

        returned.externalCode = data;
        returned.status = status;
        returned.statusText = statusText;
        returned.readyState = request.readyState;

        this.setState({
            returned,
            head,
            requestEnd
        });
    }

    copyToClipBoard(e, data){
        copyToClipBoard(e, data, document.documentElement.scrollTop);
        addToStore(this.translations.copyToClipBoardText, 0);
    }

    getCode() {
        const { externalCode } = this.state.returned;
        const { inputValue, methodValue, protocolValue } = this.state;

        if (0 == externalCode.length) {
            return this.setState({
                showLoading: false,
                codeJsx: <ModuleNoFilteredData />
            });
        }

        const originalCode = externalCode;
        let code = originalCode;

        const changeExportFiles = (event, searchValue, c) => {
            code = c;
        };

        return this.setState({
            codeAvailable: true,
            showLoading: false,
            codeJsx: (
                <div key={customKey()} className="code-box-holder">
                    <h1>
                        {`${methodValue.toUpperCase()} | ${protocolValue}${inputValue}`}
                    </h1>
                    <div className='code-box' key={customKey()}>
                        <div className="export-options flex flex-column">
                            <i title="Export to txt file" onClick={(e) => { this.saveToTxtFile(code) }} className="fas fa-superscript"></i>
                            {
                                document.queryCommandSupported &&
                                <i
                                    title="Copy to clipboard"
                                    className="fas fa-paste"
                                    onClick={(e) => this.copyToClipBoard(e, code)}
                                ></i>
                            }
                            <i title="Export to raw json file" onClick={(e) => { this.saveToFileJsonRaw(code) }} className="fas fa-file-signature"></i>
                        </div>
                        <ModuleSourceCode
                                /*
                                * Code
                                */
                                displayLineNumber={true}
                                code={code}
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
            )
        });
    }

    stackCode() {
        let clipboard = '';

        if (0 !== this.state.returned.externalCode.length) {
            clipboard = this.state.returned.externalCode;
        }

        this.setState({
            clipboard,
        }, this.getCode);
    }

    saveToFileJsonRaw(code = null) {
        const { clipboard, appName } = this.state;

        if (null !== code && '' == code) {
            return addToStore('Selected or filtered code cannot be empty.', -1);
        }

        if (null !== code && '' != code) {
            try {
                var blob = new Blob([code], { type: "application/txt;charset=utf-8" });
                return saveAs(blob, `${appName}_${customKey()}.json`);
            } catch (error) {
                return addToStore(`Error while creating JSON file. Error message: ${error}.`, -1);
            }
        }

        if (clipboard && clipboard.length) {
            try {
                var blob = new Blob([clipboard], { type: "application/json;charset=utf-8" });
                saveAs(blob, `${appName}_${customKey()}.json`);
            } catch (error) {
                addToStore(`Error while creating JSON file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Selected or filtered code cannot be empty.', -1);
        }
    }

    saveToTxtFile(code = null) {
        const { clipboard, appName } = this.state;

        if (null !== code && '' == code) {
            return addToStore('Selected or filtered code cannot be empty.', -1);
        }

        if (null !== code && '' != code) {
            try {
                var blob = new Blob([code], { type: "application/txt;charset=utf-8" });
                return saveAs(blob, `${appName}_${customKey()}.txt`);
            } catch (error) {
                return addToStore(`Error while creating TXT file. Error message: ${error}.`, -1);
            }
        }

        if (clipboard && clipboard.length) {
            try {
                var blob = new Blob([clipboard], { type: "application/txt;charset=utf-8" });
                saveAs(blob, `${appName}_${customKey()}.txt`);
            } catch (error) {
                addToStore(`Error while creating TXT file. Error message: ${error}.`, -1);
            }
        }
        else {
            addToStore('Selected or filtered code cannot be empty.', -1);
        }
    }

    render() {
        const { codeJsx, showLoading, codeAvailable } = this.state;
        
        return (
            <div className="website--request">
                {
                    showLoading && <LoadingBoxTop/>
                }
                <div className="h1-box">
                    <h1 className="h1-title ff-title">
                        {
                            this.translations.main_title
                        }
                    </h1>

                    <div className="inputs">
                        <div key={customKey()} className="code-box-full">
                            <h2>
                                {
                                    this.translations.extern_url
                                }
                            </h2>
                            <input
                                ref={e => this.input = e}
                                onClick={(e) => this.setFocus()}
                                type="text"
                                onChange={(e) => this.setInputValue(e)}
                                onKeyDown={(e) => {
                                    if (13 == e.keyCode) {
                                        this.getExternalSourceCode()
                                    }
                                }}
                                value={this.state.inputValue}
                                placeholder='Url here....'
                            />
                        </div>
                        <div key={customKey()} className="code-box-holder-box">
                            <h2>
                                {
                                    this.translations.extern_method
                                }
                            </h2>
                            <select
                                onChange={(e) => this.setMethodValue(e)}
                                value={this.state.methodValue}
                            >
                                <option value="get">
                                    GET
                                </option>
                                <option value="post">
                                    POST
                                </option>
                            </select>
                        </div>

                        <div key={customKey()} className="code-box-holder-box">
                            <h2>
                                {
                                    this.translations.extern_protocol
                                }
                            </h2>
                            <select
                                onChange={(e) => this.setProtocolValue(e)}
                                value={this.state.protocolValue}
                            >
                                <option value=""></option>
                                <option value="http://">http://</option>
                                <option value="https://">https://</option>
                            </select>
                        </div>

                        <div key={customKey()} className="code-box-holder-box">
                            <h2>
                                {
                                    this.translations.extern_submit
                                }
                            </h2>
                            <div
                                className='send-button'
                                onClick={(e) => this.getExternalSourceCode()}
                            >
                                <span className="holder">
                                    <i className="fas fa-space-shuttle"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    !showLoading && codeAvailable &&
                    <div>
                        {
                            codeJsx
                        }
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
                }
                <ToTopRocket/>
            </div>
        );
    }
}

export default External;