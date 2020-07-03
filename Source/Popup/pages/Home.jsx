import * as React from 'react';

import { getTranslations } from '../../Translations/index';

import { addonPrefixDashboard, addonRoot } from '../../AppFiles/Functions/addonPrefix';

import fadePopupBoxOutPopup from '../../AppFiles/Functions/fadePopupBoxOutPopup';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.translations = getTranslations();
    }

    /**
     * Message to the background script
     * @param {string} action 
     */
    generateCodeSingle(action) {
        browser.runtime.sendMessage({ action })
            .then(() => {
                window.close();
            });
    }

    /**
     * Message to the background script
     * @param {string} action 
     */
    generateCode(action) {
        browser.runtime.sendMessage({
            action: 'generate-tags-inner-html',
            tag: action
        })
            .then(() => {
                window.close()
            });
    }

    render() {
        return (
            <div className="ContentBody">
                <img src={`${addonRoot()}Distribution/Images/code-128.png`} />
                <h1 className="main-title">
                    {
                        this.translations.main
                    }
                </h1>
                <div className="boxes">
                    <div className="box" onClick={(e) => this.generateCodeSingle('generate-source-head')}>
                        {`HEAD ${this.translations.getCode}`}
                    </div>
                    <div className="box" onClick={(e) => this.generateCodeSingle('generate-source-body')}>
                        {`BODY ${this.translations.getCode}`}
                    </div>
                    <div className="box" onClick={(e) => this.generateCodeSingle('generate-source-html')}>
                        {`HTML ${this.translations.getCode}`}
                    </div>
                </div>
                <a
                    className="link"
                    onClick={(e) => fadePopupBoxOutPopup(e, `${addonPrefixDashboard()}#`)}
                    href={`${addonPrefixDashboard()}#`}
                >
                    {
                        this.translations.dashbord
                    }
                </a>
                <form style={{
                    display: 'none !important',
                    opacity: 0,
                    position: 'absolute',
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

export default Home;
