import React, { Component } from 'react';

import customKey from '../Functions/customKey';

import getDerivedStateFromPropsCheck from '../Functions/getDerivedStateFromPropsCheck';

class ModuleSourceCode extends Component {

    constructor(props) {
        super(props);
        this.generateCode = this.generateCode.bind(this);
        this.focusIn = this.focusIn.bind(this);
        this.focusOut = this.focusOut.bind(this);

        this.state = {
            /**
             * App
             */
            searchValue: '',
            plainValue: '',
            lines: [],
            loadingDisplay: true,
            /**
             * User
             */
            defaultClass: (props.defaultClass && typeof '8' == typeof props.defaultClass) ? props.defaultClass : 'rr-sourcecode',
            displayLineNumber: typeof true === typeof props.displayLineNumber ? props.displayLineNumber : false,
            code: (props.code && typeof '8' == typeof props.code) ? props.code : undefined,
            originalCode: (props.code && typeof '8' == typeof props.code) ? props.code : undefined,
            inputActive: typeof true == typeof props.inputActive ? props.inputActive : false,
            inputPlaceholder: (props.inputPlaceholder && typeof '8' == typeof props.inputPlaceholder) ? props.inputPlaceholder : undefined,
            inputCallback: props.inputCallback && 'function' == typeof props.inputCallback ? props.inputCallback : undefined,
            inputNoDataText: props.inputNoDataText ? props.inputNoDataText : '',
            loadingIcon: props.loadingIcon ? props.loadingIcon : '',
            layout: (props.layout && typeof '8' == typeof props.layout && ['dark', 'light'].includes(props.layout)) ? props.layout : undefined
        };

        this.isFocus = false;
    }

    /**
     * Force re-rendering of this component based
     * on keysChangeListners keys
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (getDerivedStateFromPropsCheck(['defaultClass', 'displayLineNumber', 'code', 'inputActive', 'inputPlaceholder', 'inputCallback', 'inputNoDataText', 'loadingIcon', 'layout'], props, state)) {

            return {
                defaultClass: (props.defaultClass && typeof '8' == typeof props.defaultClass) ? props.defaultClass : 'rr-sourcecode',
                displayLineNumber: typeof true === typeof props.displayLineNumber ? props.displayLineNumber : false,
                inputActive: typeof true == typeof props.inputActive ? props.inputActive : false,
                inputPlaceholder: (props.inputPlaceholder && typeof '8' == typeof props.inputPlaceholder) ? props.inputPlaceholder : undefined,
                inputCallback: props.inputCallback && 'function' == typeof props.inputCallback ? props.inputCallback : undefined,
                inputNoDataText: props.inputNoDataText ? props.inputNoDataText : '',
                loadingIcon: props.loadingIcon ? props.loadingIcon : '',
                layout: (props.layout && typeof '8' == typeof props.layout && ['dark', 'light'].includes(props.layout)) ? props.layout : undefined
            };
        }

        return null;
    }

    componentDidMount() {
        this.generateCode();
    }

    inputCallback(e, code) {
        const { inputCallback, searchValue } = this.state;

        if (inputCallback) {
            (inputCallback)(e, searchValue, code);
        }
    }

    focusIn() {
        this.isFocus = true;
    }

    focusOut() {
        this.isFocus = false;
    }

    componentDidUpdate() {
        if (this.isFocus && this.inputNode) {
            this.inputNode.focus();
        }
    }

    /**
     * Set value on change input field
     */
    setValue(e) {
        e.persist();
        const { originalCode } = this.state;
        let value = e.target.value;
        let code = [];

        this.setState({
            searchValue: value,
            loadingDisplay: this.loadingDisplay
        }, () => {

            if ('' == value) {
                code = originalCode
            }

            else {
                const lines = originalCode.split('\n');
                value = value.trim();

                for (let x = 0; x <= lines.length - 1; x++) {
                    if (-1 !== lines[x].indexOf(value)) {
                        code.push(lines[x]);
                    }
                }

                code = code.join('\n');
            }

            /**
             * User inputCallback
             */
            this.inputCallback(e, code);

            this.setState({
                code
            }, this.generateCode);
        });
    }

    generateCode() {
        const { code, inputNoDataText, displayLineNumber } = this.state;

        const generateCodeAsPromise = () => {
            let masterCode = [];

            return new Promise(resolve => {
                const codeViaLine = code.split('\n');
                let singleLineData = [];

                for (let x = 0; x < codeViaLine.length; x++) {
                    singleLineData = [];

                    if ('' !== codeViaLine[x]) {

                        const singleItems = codeViaLine[x].split(' ');
                        let attribute = null;
                        let previusType = '';

                        for (let mrx = 0; mrx < singleItems.length; mrx++) {
                            let characters = '';

                            if ('' !== singleItems[mrx]) {
                                const wordsCharacterSet = singleItems[mrx].split('');
                                characters = '';

                                for (let i = 0; i < wordsCharacterSet.length; i++) {
                                    let nextCharacter = (undefined !== wordsCharacterSet[i + 1]) ? wordsCharacterSet[i + 1] : undefined;

                                    if ('\t' == wordsCharacterSet[i]) {
                                        singleLineData.push(
                                            {
                                                code: '\t',
                                                class: 'tab'
                                            }
                                        );
                                    }
                                    else {
                                        characters += wordsCharacterSet[i];
                                        /**
                                         * Tags matcher
                                         */
                                        const tagMatcher = this.tagsMatcher(characters, singleLineData, nextCharacter);
                                        characters = tagMatcher.characters;
                                        singleLineData = tagMatcher.singleLineData;

                                        /**
                                         * Tags attributes
                                         */
                                        if (characters.length) {
                                            const attributesMatcher = this.attributesMatcher(characters, singleLineData, nextCharacter, attribute);
                                            characters = attributesMatcher.characters;
                                            singleLineData = attributesMatcher.singleLineData;
                                            attribute = attributesMatcher.attribute;
                                        }
                                    }
                                }
                            }

                            /**
                             * No match
                             */
                            if (characters.length) {

                                /**
                                 * PHP dollar character
                                 */
                                if (-1 !== characters.indexOf('$')) {

                                    singleLineData.push(
                                        {
                                            code: characters.substring(0, characters.indexOf('$')),
                                            class: 'no-match php'
                                        }
                                    );

                                    let variable = characters.substring(characters.indexOf('$'), characters.length);
                                    variable = variable.split('');

                                    let items = '$';
                                    let itemsMatch = 0;

                                    for (let x = 1; x <= variable.length - 1; x++) {
                                        if (/^[a-zA-Z]+$/.test(variable[x])) {
                                            items += variable[x];
                                        }
                                        else {
                                            itemsMatch = x;
                                            break;
                                        }
                                    }

                                    if (items.length) {
                                        singleLineData.push(
                                            {
                                                code: items,
                                                class: 'variable-dollar'
                                            }
                                        );
                                    }

                                    if (itemsMatch) {
                                        characters = characters.substring(itemsMatch, variable.length);
                                    }

                                    else {
                                        characters = '';
                                    }

                                    previusType = 'php';
                                }

                                /**
                                 * Functions matcher
                                 */
                                if (-1 !== characters.indexOf('(') && -1 !== characters.indexOf(')')) {
                                    const fnName = characters.substring(0, characters.indexOf('('));

                                    singleLineData.push(
                                        {
                                            code: fnName,
                                            class: 'functionName'
                                        }
                                    );

                                    const attr = characters.substring(fnName.length + 1, characters.indexOf(')'));

                                    singleLineData.push(
                                        {
                                            code: '(',
                                            class: 'bracket bracket-left'
                                        }
                                    );
                                    singleLineData.push(
                                        {
                                            code: attr,
                                            class: 'functionArguments'
                                        }
                                    );

                                    singleLineData.push(
                                        {
                                            code: ')',
                                            class: 'bracket bracket-right'
                                        }
                                    );

                                    characters = characters.substring(fnName.length + 1 + attr.length + 1, characters.length);
                                }

                                if (-1 !== characters.indexOf('(')) {
                                    const fnName = characters.substring(0, characters.indexOf('('));
                                    previusType = 'function';

                                    singleLineData.push(
                                        {
                                            code: fnName,
                                            class: 'functionName'
                                        }
                                    );

                                    const attr = characters.substring(fnName.length + 1, characters.length);

                                    singleLineData.push(
                                        {
                                            code: '(',
                                            class: 'bracket bracket-left'
                                        }
                                    );
                                    singleLineData.push(
                                        {
                                            code: attr,
                                            class: 'functionArguments'
                                        }
                                    );

                                    characters = '';
                                }

                                /**
                                 * Match everything as function arguments to match ")"
                                 */
                                if ('function' == previusType) {

                                    if (-1 !== characters.indexOf('))')) {
                                        singleLineData.push(
                                            {
                                                code: characters.substring(0, characters.indexOf(')') + 1),
                                                class: 'functionArguments'
                                            }
                                        );

                                        singleLineData.push(
                                            {
                                                code: ')',
                                                class: 'bracket bracket-right'
                                            }
                                        );

                                        characters = characters.substring(characters.indexOf(')') + 2, characters.length);
                                        previusType = '';
                                    }

                                    if (-1 !== characters.indexOf(')')) {
                                        singleLineData.push(
                                            {
                                                code: characters.substring(0, characters.indexOf(')')),
                                                class: 'functionArguments'
                                            }
                                        );

                                        singleLineData.push(
                                            {
                                                code: ')',
                                                class: 'bracket bracket-right'
                                            }
                                        );

                                        characters = characters.substring(characters.indexOf(')') + 1, characters.length);
                                        previusType = '';
                                    }
                                    else {
                                        singleLineData.push(
                                            {
                                                code: characters,
                                                class: 'functionArguments'
                                            }
                                        );

                                        characters = '';
                                        previusType = 'function';
                                    }
                                }

                                /**
                                 * Css or objects
                                 */
                                if (-1 !== characters.indexOf('{')) {
                                    const pref = characters.substring(0, characters.indexOf('{'));
                                    characters = characters.substring(pref.length, characters.length);

                                    if (-1 !== pref.indexOf('=')) {

                                        singleLineData.push(
                                            {
                                                code: pref.substring(0, pref.indexOf('=')),
                                                class: 'variableName'
                                            }
                                        );

                                        singleLineData.push(
                                            {
                                                code: '=',
                                                class: 'equal'
                                            }
                                        );
                                    }

                                    if (-1 !== characters.indexOf('{')) {
                                        singleLineData.push(
                                            {
                                                code: characters.substring(0, characters.indexOf('{')),
                                                class: 'no-match'
                                            }
                                        );
                                        singleLineData.push(
                                            {
                                                code: '{',
                                                class: 'bracket bracket-left'
                                            }
                                        );

                                        characters = characters.substring(characters.indexOf('{') + 1, characters.length);
                                        previusType = 'bracketOpen';
                                    }

                                    if (-1 !== characters.indexOf('}') && 'bracketOpen' == previusType) {
                                        singleLineData.push(
                                            {
                                                code: characters.substring(0, characters.indexOf('}')),
                                                class: 'bracketValue'
                                            }
                                        );
                                        singleLineData.push(
                                            {
                                                code: '}',
                                                class: 'bracket bracket-right'
                                            }
                                        );

                                        characters = characters.substring(characters.indexOf('}') + 1, characters.length);
                                        previusType = '';
                                    }
                                }

                                if (-1 !== characters.indexOf('}')) {
                                    singleLineData.push(
                                        {
                                            code: characters.substring(0, characters.indexOf('}')),
                                            class: 'no-match'
                                        }
                                    );
                                    singleLineData.push(
                                        {
                                            code: '}',
                                            class: 'bracket bracket-right'
                                        }
                                    );

                                    characters = characters.substring(characters.indexOf('}') + 1, characters.length);
                                    previusType = '';
                                }

                                if (-1 !== characters.indexOf('=')) {

                                    singleLineData.push(
                                        {
                                            code: characters.substring(0, characters.indexOf('=')),
                                            class: 'variableName'
                                        }
                                    );

                                    singleLineData.push(
                                        {
                                            code: '=',
                                            class: 'equal'
                                        }
                                    );

                                    characters = characters.substring(characters.indexOf('=') + 1, characters.length);
                                }

                                if (')' == characters) {
                                    singleLineData.push(
                                        {
                                            code: ')',
                                            class: 'bracket bracket-right'
                                        }
                                    );
                                    characters = '';
                                    previusType = '';
                                }

                                if (characters.length) {

                                    const lastMatch = [
                                        {
                                            words: ['import', 'from', 'require', 'use', 'return', 'return;', 'var', 'let', 'const', 'export default', 'default', 'extends', 'interface'],
                                            class: 'key'
                                        }
                                    ];

                                    for (let x = 0; x <= lastMatch.length - 1; x++) {
                                        const wordsToCheck = lastMatch[x].words;

                                        for (let i = 0; i <= wordsToCheck.length - 1; i++) {
                                            if (wordsToCheck[i] === characters) {
                                                singleLineData.push(
                                                    {
                                                        code: characters,
                                                        class: lastMatch[x].class
                                                    }
                                                );
                                                characters = '';
                                                break;
                                            }
                                        }
                                    }

                                    if (characters.length) {
                                        singleLineData.push(
                                            {
                                                code: characters,
                                                class: 'no-match'
                                            }
                                        );
                                    }

                                    previusType = '';
                                }
                            }

                            /**
                             * Push the same char as splitted with
                             */
                            singleLineData.push(
                                {
                                    code: ' ',
                                    class: 'space'
                                }
                            );
                        }
                    }
                    /**
                     * Push the same char as splitted with
                     */
                    singleLineData.push(
                        {
                            code: '\n',
                            class: 'enter'
                        }
                    );

                    masterCode.push(singleLineData);
                }

                resolve(masterCode);
            });
        };

        this.setState({
            loadingDisplay: true
        }, async () => {
            if (!code || 0 == code.length) {
                return this.setState({
                    lines: inputNoDataText,
                    loadingDisplay: false
                });
            }

            let masterCode = await generateCodeAsPromise();
            const codeJsx = [];
    
            for (let x = 0; x < masterCode.length; x++) {
                const singleLineArrays = masterCode[x];
                const tempHolder = [];
    
                for (let mrx = 0; mrx < singleLineArrays.length; mrx++) {
                    tempHolder.push(
                        <span key={customKey()} className={singleLineArrays[mrx].class ? singleLineArrays[mrx].class : ''}>
                            {
                                singleLineArrays[mrx].code
                            }
                        </span>
                    );
                }
    
                codeJsx.push(
                    <div
                        key={customKey()}
                        className={displayLineNumber ? 'single-code-line flex' : 'single-code-line'}
                    >
                        {
                            displayLineNumber &&
                            <div className="line-number">
                                {
                                    x + 1
                                }
                            </div>
                        }
                        <div className="line-code">
                            {
                                tempHolder
                            }
                        </div>
                    </div>
                );
            }
    
            this.setState({
                loadingDisplay: false,
                lines: codeJsx,
            });
        })
    }

    tagsMatcher(characters, singleLineData, nextCharacter) {

        /**
         * Unknown tag name check
         * - possible match for </custom-tag-name>
         */
        if (0 === characters.indexOf('</') && '>' == nextCharacter) {
            singleLineData.push(
                {
                    code: '<',
                    class: 'tagStart'
                }
            );
            singleLineData.push(
                {
                    code: '/',
                    class: 'slash'
                }
            );
            singleLineData.push(
                {
                    code: characters.substring(2, characters.length),
                    class: 'tagName'
                }
            );
            characters = '';
        }

        if ('>' == characters.substring(characters.length - 1, characters.length) && !nextCharacter && -1 == characters.indexOf('<')) {

            if ('=' == characters.substring(0, characters.length - 1)) {
                singleLineData.push(
                    {
                        code: '=',
                        class: 'equal'
                    }
                );
                singleLineData.push(
                    {
                        code: '>',
                        class: 'tagEnd'
                    }
                );
            }
            else {
                singleLineData.push(
                    {
                        code: characters.substring(0, characters.length - 1),
                        class: 'tagName'
                    }
                );
                singleLineData.push(
                    {
                        code: '>',
                        class: 'tagEnd'
                    }
                );
            }
            characters = '';
        }

        /**
         * Unknown tag name check
         * - possible match for <custom-tag-name> without attributes
         */
        if ('<' == characters.charAt(0) && !nextCharacter) {
            singleLineData.push(
                {
                    code: '<',
                    class: 'tagStart'
                }
            );

            if ('>' == characters.substring(characters.length - 1, characters.length)) {
                singleLineData.push(
                    {
                        code: characters.substring(1, characters.length - 1),
                        class: 'tagName'
                    }
                );
                singleLineData.push(
                    {
                        code: '>',
                        class: 'tagEnd'
                    }
                );
                characters = '';
            }
            else {
                singleLineData.push(
                    {
                        code: characters.substring(1, characters.length),
                        class: 'tagName'
                    }
                );
                characters = '';
            }
        }

        if ('<' == characters.charAt(0) && '>' == characters.charAt(characters.length - 1)) {
            singleLineData.push(
                {
                    code: '<',
                    class: 'tagStart'
                }
            );
            singleLineData.push(
                {
                    code: characters.substring(1, characters.length - 1),
                    class: 'tagName'
                }
            );
            singleLineData.push(
                {
                    code: '>',
                    class: 'tagEnd'
                }
            );
            characters = '';
        }

        if (-1 !== characters.indexOf('<') && '>' == characters.charAt(characters.length - 1)) {
            const dataToCheck = characters.substring(0, characters.indexOf('<'));

            singleLineData = this.extractNotFiltered(singleLineData, dataToCheck);

            singleLineData.push(
                {
                    code: '<',
                    class: 'tagStart'
                }
            );
            singleLineData.push(
                {
                    code: characters.substring(characters.indexOf('<') + 1, characters.length - 1),
                    class: 'tagName'
                }
            );
            singleLineData.push(
                {
                    code: '>',
                    class: 'tagEnd'
                }
            );
            characters = '';
        }

        if (-1 !== characters.indexOf('</') && '>' == characters.charAt(characters.length - 1)) {
            singleLineData.push(
                {
                    code: characters.substring(0, characters.indexOf('</') + 1),
                    class: 'not-filtered-data'
                }
            );
            singleLineData.push(
                {
                    code: '</',
                    class: 'tagStart'
                }
            );
            singleLineData.push(
                {
                    code: characters.substring(characters.indexOf('</') + 2, characters.length - 1),
                    class: 'tagName'
                }
            );
            singleLineData.push(
                {
                    code: '>',
                    class: 'tagEnd'
                }
            );
            characters = '';
        }

        /**
         * Tag check
         * Check if is closing tag, and the closing tag are pushed previously 
         */
        if ('>' == characters) {
            singleLineData.push(
                {
                    code: '>',
                    class: 'tagEnd'
                }
            );
            characters = '';
        }


        return {
            characters,
            singleLineData
        }
    }

    extractNotFiltered(singleLineData, dataToCheck) {

        if (-1 !== dataToCheck.indexOf('="')) {

            singleLineData.push(
                {
                    code: dataToCheck.substring(0, dataToCheck.indexOf('="')),
                    class: 'attributeName'
                }
            );

            singleLineData.push({
                code: '=',
                class: 'equal attribute-equal'
            });

            singleLineData.push({
                code: '"',
                class: 'quote-double quote-double-start'
            });

            if ('">' == dataToCheck.substring(dataToCheck.length - 2, dataToCheck.length)) {
                singleLineData.push(
                    {
                        code: dataToCheck.substring(dataToCheck.indexOf('="') + 2, dataToCheck.length - 2),
                        class: 'value'
                    }
                );

                singleLineData.push({
                    code: "'",
                    class: 'quote-single quote-single-end'
                });

                singleLineData.push({
                    code: ">",
                    class: 'tagEnd'
                });
            }
            else {
                singleLineData.push(
                    {
                        code: dataToCheck.substring(dataToCheck.indexOf('="'), dataToCheck.length),
                        class: 'value'
                    }
                );
            }

            return singleLineData;
        }

        if (-1 !== dataToCheck.indexOf("='")) {

            singleLineData.push(
                {
                    code: dataToCheck.substring(0, dataToCheck.indexOf("='")),
                    class: 'attributeName'
                }
            );

            singleLineData.push({
                code: '=',
                class: 'equal attribute-equal'
            });

            singleLineData.push({
                code: "'",
                class: 'quote-single quote-single-start'
            });

            if ("'>" == dataToCheck.substring(dataToCheck.length - 2, dataToCheck.length)) {
                singleLineData.push(
                    {
                        code: dataToCheck.substring(dataToCheck.indexOf("='") + 2, dataToCheck.length - 2),
                        class: 'value'
                    }
                );

                singleLineData.push({
                    code: "'",
                    class: 'quote-single quote-single-end'
                });

                singleLineData.push({
                    code: ">",
                    class: 'tagEnd'
                });
            }
            else {
                singleLineData.push(
                    {
                        code: dataToCheck.substring(dataToCheck.indexOf("='"), dataToCheck.length),
                        class: 'value'
                    }
                );
            }

            return singleLineData;
        }

        if (-1 !== dataToCheck.indexOf('>')) {
            singleLineData.push(
                {
                    code: dataToCheck.substring(dataToCheck.indexOf(">"), dataToCheck.length - 1),
                    class: 'value'
                }
            );
            singleLineData.push({
                code: ">",
                class: 'tagEnd'
            });

            return singleLineData;
        }

        if (-1 !== dataToCheck.indexOf('=')) {

            singleLineData.push(
                {
                    code: dataToCheck.substring(0, dataToCheck.indexOf('=')),
                    class: 'variableName'
                }
            );

            singleLineData.push(
                {
                    code: '=',
                    class: 'equal'
                }
            );

            dataToCheck = dataToCheck.substring(dataToCheck.indexOf('=') + 1, dataToCheck.length);
        }

        if (-1 !== dataToCheck.indexOf('{')) {
            singleLineData.push(
                {
                    code: dataToCheck.substring(0, dataToCheck.indexOf('{')),
                    class: 'no-match'
                }
            );
            singleLineData.push(
                {
                    code: '{',
                    class: 'bracket bracket-right'
                }
            );

            dataToCheck = dataToCheck.substring(dataToCheck.indexOf('{') + 1, dataToCheck.length);
        }

        if (dataToCheck.length) {
            singleLineData.push(
                {
                    code: dataToCheck,
                    class: 'not-filtered'
                }
            );
        }

        return singleLineData;
    }

    attributesMatcher(characters, singleLineData, nextCharacter, attribute) {
        /**
         * Check if is attribute or string assigment
         * as variable
         * 
         * (attribute) href="fsdfdsfdfsd"
         * (variable) x="dsadasdsadsa"
         */
        let value = characters.substring(0, characters.indexOf('='));

        if (1 !== characters.indexOf('="') && '"' == nextCharacter && 'start' !== attribute && '' !== value) {
            attribute = 'start';

            singleLineData.push({
                code: value,
                class: 'attributeName'
            });

            singleLineData.push({
                code: '=',
                class: 'equal attribute-equal'
            });

            singleLineData.push({
                code: '"',
                class: 'quote-double quote-double-start'
            });

            characters = '';
        }

        /**
         * Example text: re a bug in some browsers where doing "Select ="" (CTRL+A and CMD+A) s
         * 
         * catching here: "Select ="" <- catching closing last tag
         */
        if ('"' == characters && undefined == nextCharacter) {
            attribute = 'end';

            singleLineData.push({
                code: '"',
                class: 'quote-double quote-double-end'
            });

            characters = '';
        }

        /**
         * If the attribute process started but not finished
         * and is a space between attributes
         */
        if (undefined == nextCharacter && 'start' == attribute && '"' !== characters.substring(characters.length - 1, characters.length)) {

            /**
             * If the value has a quoute on the first place
             * example: <meta name=""viewport" content=""width=device-width, initial-scale=1.0,  maximum-scale=5.0"> 
             * 
             * the: content=" are pushed as parent 
             * 
             * now the value "width=device-width has the 2 quote, we have to ignore this quote
             */
            if ('"' == characters.charAt(0)) {
                characters = characters.substring(1, characters.length);
            }

            singleLineData.push({
                code: characters,
                class: 'attributeValue'
            });

            characters = '';
        }

        /**
         * Catching now values with space
         * 
         * title="David Janitzek"
         * 
         * catching value: Janitzek"
         */
        if ('"' == characters.substring(characters.length - 1, characters.length) && 2 <= characters.length && 'start' == attribute) {
            attribute = 'end';

            if ('"' == characters.charAt(0)) {
                characters = characters.substring(1, characters.length);
            }

            singleLineData.push({
                code: characters.substring(0, characters.length - 1),
                class: 'attributeValue'
            });

            singleLineData.push({
                code: '"',
                class: 'quote-double quote-double-end'
            });

            characters = '';
        }

        return {
            characters,
            singleLineData,
            attribute
        }
    }

    render() {
        const { defaultClass, layout, lines, loadingDisplay, loadingIcon, inputActive, inputPlaceholder, searchValue } = this.state;

        return (
            <div className={`${defaultClass} ${layout}`}>
                {
                    loadingDisplay && loadingIcon
                }
                {
                    inputActive &&
                    <div className="search">
                        <input
                            className="input"
                            type='text'
                            onChange={(e) => this.setValue(e)}
                            value={searchValue}
                            placeholder={inputPlaceholder}
                            onFocus={(e) => this.focusIn()}
                            onBlur={(e) => this.focusOut()}
                            ref={node => this.inputNode = node}
                        />
                    </div>
                }
                <div className='code'>
                    {
                        lines
                    }
                </div>
            </div>
        );
    }
}
export default ModuleSourceCode;
