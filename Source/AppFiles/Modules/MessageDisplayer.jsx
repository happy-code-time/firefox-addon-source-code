import * as React from 'react';

import { Link } from 'react-router-dom';

import ClearStore from '../Store/clearStore';

import ReadStore from '../Store/readStore';

import customKey from '../Functions/customKey';

import '../../Sass/shared/globalErrors.scss';

class MessageDisplayer extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            messagesApp: [],
            codeMapping: (props.codeMapping && typeof {} === typeof props.codeMapping) ? props.codeMapping : {}
        };

        this.removeMessage = this.removeMessage.bind(this);
        this.setIntervaller = this.setIntervaller.bind(this);
    }

    componentDidMount() {
        this.setIntervaller();
    }

    componentWillUnmount() {
        clearInterval(this.globalMessagesIntervaller);
    }

    setIntervaller() {
        clearInterval(this.globalMessagesIntervaller);

        this.globalMessagesIntervaller = setInterval(() => {
            let messagesApp = [];

            if (ReadStore('messagesApp').length !== 0) {

                messagesApp = ReadStore('messagesApp');

                ClearStore('messagesApp');

                this.setState({
                    messagesApp
                });
            }

        }, 1000);
    }

    /**
     * Remove single message by index
     */
    removeMessage(listName, i) {
        this.setState({
            [listName]: this.state[listName].filter((item, index) => index !== i),
        });
    }

    render() {
        const { codeMapping, messagesApp } = this.state;
        const mappingKeys = Object.getOwnPropertyNames(codeMapping);

        return (
            <div key={customKey()} className="GlobalErrors flex flex-column">
                {
                    messagesApp.map((obj, index) => {

                        let { errorCode, errorMessage } = obj;
                        errorCode = JSON.stringify(errorCode);

                        if (mappingKeys.includes(errorCode) && undefined !== codeMapping[errorCode]) {
                            const { title, displayErrorCode, text, close, link } = codeMapping[errorCode];
                            let attributesText = {};
                            let attributesLink = {};
                            let attributesClose = {};
                            let useTagLink = true;

                            if (text && typeof {} === typeof text && text.attributes && typeof {} === typeof text.attributes) {
                                attributesText = text.attributes;
                            }

                            if (link && typeof {} === typeof link && link.attributes && typeof {} === typeof link.attributes) {
                                attributesLink = link.attributes;
                            }

                            if (close && typeof {} === typeof close && close.attributes && typeof {} === typeof close.attributes) {
                                attributesClose = close.attributes;
                            }

                            if (link && typeof {} === typeof link && link.useTagLink && typeof 0 === typeof link.useTagLink) {
                                useTagLink = link.useTagLink;
                            }

                            return (
                                <div className="single-error" key={customKey()}>
                                    {
                                        title &&
                                        typeof '000' === typeof title &&
                                        <h1>
                                            {`${title} ${displayErrorCode ? errorCode : ''}`}
                                        </h1>
                                    }
                                    {
                                        title &&
                                        typeof {} === typeof title &&
                                        <h1>
                                            {
                                                title
                                            }
                                            {` ${displayErrorCode ? errorCode : ''}`}
                                        </h1>
                                    }
                                    <div
                                        className="text"
                                        {...attributesText}
                                    >
                                        {`${text.prefix ? `${text.prefix} ` : ''} ${errorMessage ? `${errorMessage} ` : ''} ${text.suffix ? `${text.suffix}` : ''}`}
                                    </div>

                                    <div className="options flex">
                                        <div
                                            onClick={e => this.removeMessage('messagesApp', index)}
                                            className="single-option"
                                            {...attributesClose}
                                        >
                                            {`${close.text ? `${close.text} ` : ''}`}
                                        </div>
                                        {
                                            !useTagLink && link && typeof {} === typeof link && link.text && typeof '000' === typeof link.text &&
                                            <div className="single-option">
                                                <a
                                                    rel="noopener noreferrer"
                                                    href={`${link.href ? link.href : ''}`}
                                                    {...attributesLink}
                                                >
                                                    {
                                                        link.text
                                                    }
                                                </a>
                                            </div>
                                        }
                                        {
                                            useTagLink && link && typeof {} === typeof link && link.text && typeof '000' === typeof link.text &&
                                            <div className="single-option">
                                                <Link
                                                    rel="noopener noreferrer"
                                                    to={`${link.href ? link.href : ''}`}
                                                    {...attributesLink}
                                                >
                                                    {
                                                        link.text
                                                    }
                                                </Link>
                                            </div>
                                        }
                                    </div>
                                </div>
                            );
                        }

                        return null;
                    })
                }
            </div>
        );
    }
}

export default MessageDisplayer;