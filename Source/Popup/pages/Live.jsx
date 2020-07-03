import React, { Component } from 'react';

import { getTranslations } from '../../Translations/index';

import { addonRoot } from '../../AppFiles/Functions/addonPrefix';

class Live extends Component {

    constructor () {
        super();
        this.translations = getTranslations();
    }

    generateLivePreview() {
        browser.runtime.sendMessage({
            action: 'generate-source-live-preview'
        });
        window.close();
    }

    render() {
        return (
            <div className="ContentBody">
                <img 
                    alt="image" 
                    src={`${addonRoot()}Distribution/Images/code-128.png`}
                />
                <div 
                    className="tags tags-custom" 
                    id="tags"
                    onClick={(e) => { this.generateLivePreview() }}
                >
                    <div className="Live">
                        <h1 className="h1 text-center ff-title">
                            {
                                this.translations.popupLive
                            }
                        </h1>
                        <h1 
                            className="h1 ff-title font-small"
                            onClick={(e) => { this.generateLivePreview() }}
                        >
                            {
                                this.translations.box_desc_2
                            }
                        </h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default Live;