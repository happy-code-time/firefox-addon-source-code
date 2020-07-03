import 'babel-polyfill';

import React, { Component } from 'react';

import ReactDOM from 'react-dom';

import * as FileSaver from 'file-saver';

import { BoxBoxes, customKey, Divtriangle, List } from 'react-divcreator';

import { copyToClipBoard } from '../AppFiles/Functions/copyToClipboard';

import '../Sass/iframe.scss';

class App extends Component {

    constructor () {
        super();
        this.intervaller = null;
        this.generateAttributes = this.generateAttributes.bind(this);
        this.getTabIdFromUrl = this.getTabIdFromUrl.bind(this);
        this.getCodeByIntervall = this.getCodeByIntervall.bind(this);
        this.closeIframe = this.closeIframe.bind(this);

        this.state = {
            innerHTML: '',
            outerHTML: '',
            innerText: '',
            tag: '',
            attributes: []
        };
        this.tabid = null;
    }

    componentDidMount() {
        this.getTabIdFromUrl();
        this.getCodeByIntervall();
    }

    getTabIdFromUrl() {
        let search = window.location.href;

        if (search && search.length) {
            search = search.split('?');

            if (2 >= search.length) {
                search = search[1];
                const params = new URLSearchParams(search);

                if (params.has('tabid')) {
                    this.tabid = params.get('tabid');
                    sessionStorage.setItem('tabid', this.tabid.toString());
                }
            }
        }

        if (null == this.tabid) {
            this.tabid = sessionStorage.getItem('tabid');
        }
    }

    saveToFileJsonSingle(singleString) {
        if (singleString.length) {
            try {
                var blob = new Blob([JSON.stringify(singleString)], { type: "application/json;charset=utf-8" });
                FileSaver.saveAs(blob, `JSON_Sourcecode${customKey()}.json`);
            } catch (error) {
                var blob = new Blob([`Error while creating JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                FileSaver.saveAs(blob, `JSON_Sourcecode${customKey()}.json`);
            }
        }
        else {
            var blob = new Blob([''], { type: "application/json;charset=utf-8" });
            FileSaver.saveAs(blob, `JSON_Sourcecode${customKey()}.json`);
        }
    }

    saveToFileJsonSingleRaw(singleString) {
        if (singleString.length) {
            try {
                var blob = new Blob([singleString], { type: "application/json;charset=utf-8" });
                FileSaver.saveAs(blob, `JSON_Sourcecode${customKey()}.json`);
            } catch (error) {
                var blob = new Blob([`Error while creating RAW JSON file. Error message: ${error}.`], { type: "application/json;charset=utf-8" });
                FileSaver.saveAs(blob, `JSON_Sourcecode${customKey()}.json`);
            }
        }
        else {
            var blob = new Blob([''], { type: "application/json;charset=utf-8" });
            FileSaver.saveAs(blob, `JSON_Sourcecode${customKey()}.json`);
        }
    }

    saveToTxtFile(data){
        try {
            var blob = new Blob([data], { type: "application/txt;charset=utf-8" });
            saveAs(blob, `CodeX_${customKey()}.txt`);
        } catch (error) {
            var blob = new Blob([`Error while creating TXT file. Error message: ${error}.`], { type: "application/txt;charset=utf-8" });
            saveAs(blob, `CodeX_${customKey()}.txt`);
        }
    }

    getCodeByIntervall() {
        this.intervaller = setInterval(() => {
            browser.runtime.sendMessage({
                action: 'get-code',
                tabid: this.tabid
            })
                .then((response) => {
                    if (undefined !== response
                        && (
                            response.tag != this.state.tag
                            || response.innerHTML != this.state.innerHTML
                            || response.outerHTML != this.state.outerHTML
                            || response.innerText != this.state.innerText
                            || response.attributes.length != this.state.attributes.length
                        )
                    ) {
                        this.setState({
                            innerHTML: response.innerHTML,
                            outerHTML: response.outerHTML,
                            innerText: response.innerText,
                            tag: response.tag,
                            attributes: response.attributes
                        });
                    }
                })
                .catch((error) => {
 
                })
        }, 1000);
    }

    closeIframe() {
        browser.runtime.sendMessage({
            action: 'close-iframe',
            tabid: this.tabid
        })
    }

    generateAttributes() {
        const attributes = [];

        if (this.state.attributes && this.state.attributes.length) {
            this.state.attributes.map(object => {
                const { name, value } = object;

                attributes.push(
                    {
                        values: [
                            {
                                value: name
                            },
                            {
                                value
                            }
                        ]
                    }
                )
            });
        }


        return (
            <List
                class="keys-for-type-example"
                data={attributes}
                responsive={true}
                responsiveX={1024}
                title={
                    <span>
                        <i className="fas fa-table"></i>
                        Attributes
                    </span>
                }
                header={[ 'Name', 'Value']}
            />
        );
    }

    render() {
        return (
            <div>
                <p
                    onClick={this.closeIframe}
                    className="close">
                        ✖
                </p>
                {
                    '' !== this.state.tag &&
                    <div>
                        <BoxBoxes
                            id="boxes"
                            class="boxes boxes-1"
                            border={true}
                            // Responsive keys
                            responsive={true}
                            responsiveX={1024}
                            // Animation config
                            animation={true}
                            animationTime={500}
                            animationTimeAdder={100}
                            // mount || scroll
                            animationOn={'mount'}
                            // how many elements should be in 1 single row
                            leftBreak={2}
                            leftData={
                                [
                                    {
                                        top: {
                                            title: (
                                                <span>
                                                    <div className="box-text-icon">
                                                        <i className="fas fa-code"></i>
                                                        <h1>
                                                            outerHTML
                                                    </h1>
                                                    </div>
                                                </span>
                                            )
                                        },
                                        content: (
                                            <span className="box-content">
                                                <div className="box-content--div">
                                                    <span className="export-options-single">
                                                        <ul>
                                                            <li>
                                                                <i onClick={(e) => { this.saveToTxtFile(this.state.outerHTML) }} className="fas fa-superscript"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to .txt file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                            {
                                                                document.queryCommandSupported &&
                                                                <li>
                                                                    <i
                                                                        className="fas fa-clipboard"
                                                                        onClick={(e) => copyToClipBoard(e, this.state.outerHTML, document.documentElement.scrollTop)}
                                                                    ></i>
                                                                    <Divtriangle
                                                                        custom={true}
                                                                        direction='up'
                                                                        customDir='left'
                                                                        customLeft={7}
                                                                        customWidthHeight={10}
                                                                        customDifference={0.5}
                                                                        customColorBorder="rgb(69,69,69)"
                                                                        customColor="rgba(69,69,69,0.69)"
                                                                        class="divtriangle"
                                                                        customTopBottom={0}
                                                                        border={true}
                                                                        html={
                                                                            (
                                                                                <p>
                                                                                    Copy to clipboard
                                                                                </p>
                                                                            )
                                                                        }
                                                                    />
                                                                </li>
                                                            }
                                                            <li>
                                                                <i onClick={(e) => { this.saveToFileJsonSingle(this.state.outerHTML) }} className="fas fa-file-code"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to .json file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                            <li>
                                                                <i onClick={(e) => { this.saveToFileJsonSingleRaw(this.state.outerHTML) }} className="fas fa-file-signature"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to RAW .json file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                        </ul>
                                                    </span>
                                                    <span className="textarea-span">
                                                        <textarea
                                                            defaultValue={(this.state.outerHTML && this.state.outerHTML.length ? this.state.outerHTML.replace(/\t/g, ' ') : this.state.outerHTML)}
                                                            readOnly={true}
                                                        />
                                                    </span>
                                                </div>
                                            </span>
                                        )
                                    },
                                    {
                                        top: {
                                            title: (
                                                <span>
                                                    <div className="box-text-icon">
                                                        <i className="fas fa-code"></i>
                                                        <h1>
                                                            innerHTML
                                                        </h1>
                                                    </div>
                                                </span>
                                            )
                                        },
                                        content: (
                                            <span className="box-content">
                                                <div className="box-content--div">
                                                    <span className="export-options-single">
                                                        <ul>
                                                            <li>
                                                                <i onClick={(e) => { this.saveToTxtFile(this.state.innerHTML) }} className="fas fa-superscript"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to .txt file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                            {
                                                                document.queryCommandSupported &&
                                                                <li>
                                                                    <i
                                                                        className="fas fa-clipboard"
                                                                        onClick={(e) => copyToClipBoard(e, this.state.innerHTML, document.documentElement.scrollTop)}
                                                                    ></i>
                                                                    <Divtriangle
                                                                        custom={true}
                                                                        direction='up'
                                                                        customDir='left'
                                                                        customLeft={7}
                                                                        customWidthHeight={10}
                                                                        customDifference={0.5}
                                                                        customColorBorder="rgb(69,69,69)"
                                                                        customColor="rgba(69,69,69,0.69)"
                                                                        class="divtriangle"
                                                                        customTopBottom={0}
                                                                        border={true}
                                                                        html={
                                                                            (
                                                                                <p>
                                                                                    Copy to clipboard
                                                                                </p>
                                                                            )
                                                                        }
                                                                    />
                                                                </li>
                                                            }
                                                            <li>
                                                                <i onClick={(e) => { this.saveToFileJsonSingle(this.state.innerHTML) }} className="fas fa-file-code"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to .json file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                            <li>
                                                                <i onClick={(e) => { this.saveToFileJsonSingleRaw(this.state.innerHTML) }} className="fas fa-file-signature"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to RAW .json file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                        </ul>
                                                    </span>
                                                    <span className="textarea-span">
                                                        <textarea
                                                            defaultValue={(this.state.innerHTML && this.state.innerHTML.length ? this.state.innerHTML.replace(/\t/g, ' ') : this.state.innerHTML)}
                                                            readOnly={true}
                                                        />
                                                    </span>
                                                </div>
                                            </span>
                                        )
                                    },
                                    {
                                        top: {
                                            title: (
                                                <span>
                                                    <div className="box-text-icon">
                                                        <i className="fas fa-code"></i>
                                                        <h1>
                                                            innerText
                                                    </h1>
                                                    </div>
                                                </span>
                                            )
                                        },
                                        content: (
                                            <span className="box-content">
                                                <div className="box-content--div">
                                                    <span className="export-options-single">
                                                        <ul>
                                                            <li>
                                                                <i onClick={(e) => { this.saveToTxtFile(this.state.innerText) }} className="fas fa-superscript"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to .txt file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                            {
                                                                document.queryCommandSupported &&
                                                                <li>
                                                                    <i
                                                                        className="fas fa-clipboard"
                                                                        onClick={(e) => copyToClipBoard(e, this.state.innerText, document.documentElement.scrollTop)}
                                                                    ></i>
                                                                    <Divtriangle
                                                                        custom={true}
                                                                        direction='up'
                                                                        customDir='left'
                                                                        customLeft={7}
                                                                        customWidthHeight={10}
                                                                        customDifference={0.5}
                                                                        customColorBorder="rgb(69,69,69)"
                                                                        customColor="rgba(69,69,69,0.69)"
                                                                        class="divtriangle"
                                                                        customTopBottom={0}
                                                                        border={true}
                                                                        html={
                                                                            (
                                                                                <p>
                                                                                    Copy to clipboard
                                                                                </p>
                                                                            )
                                                                        }
                                                                    />
                                                                </li>
                                                            }
                                                            <li>
                                                                <i onClick={(e) => { this.saveToFileJsonSingle(this.state.innerText) }} className="fas fa-file-code"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to .json file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                            <li>
                                                                <i onClick={(e) => { this.saveToFileJsonSingleRaw(this.state.innerText) }} className="fas fa-file-signature"></i>
                                                                <Divtriangle
                                                                    custom={true}
                                                                    direction='up'
                                                                    customDir='left'
                                                                    customLeft={7}
                                                                    customWidthHeight={10}
                                                                    customDifference={0.5}
                                                                    customColorBorder="rgb(69,69,69)"
                                                                    customColor="rgba(69,69,69,0.69)"
                                                                    class="divtriangle"
                                                                    customTopBottom={0}
                                                                    border={true}
                                                                    html={
                                                                        (
                                                                            <p>
                                                                                Export to RAW .json file
                                                                            </p>
                                                                        )
                                                                    }
                                                                />
                                                            </li>
                                                        </ul>
                                                    </span>
                                                    <span className="textarea-span">
                                                        <textarea
                                                            defaultValue={this.state.innerText}
                                                            readOnly={true}
                                                        />
                                                    </span>
                                                </div>
                                            </span>
                                        )
                                    },
                                    {
                                        top: {
                                            title: (
                                                <span>
                                                    <div className="box-text-icon">
                                                        <i className="fas fa-code"></i>
                                                        <h1>
                                                            attributes
                                                        </h1>
                                                    </div>
                                                </span>
                                            )
                                        },
                                        content: (
                                            <span className="box-content">
                                                <div className="box-content--div">
                                                    <span className="textarea-span">
                                                    {
                                                        this.generateAttributes()
                                                    }
                                                    </span>
                                                </div>
                                            </span>
                                        )
                                    }
                                ]
                            }
                        />
                    </div>
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
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
