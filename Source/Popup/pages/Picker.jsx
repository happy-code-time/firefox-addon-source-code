import React, { Component } from 'react';

import { getTranslations } from '../../Translations/index';

import { addonRoot } from '../../AppFiles/Functions/addonPrefix';

class Picker extends Component {

    constructor () {
        super();
        this.translations = getTranslations();
    }

    generatePicker() {
        browser.runtime.sendMessage({
            action: 'generate-source-picker'
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
                    onClick={(e) => { this.generatePicker() }}
                >
                    <div className="Picker">
                        <h1 className="h1 text-center ff-title">
                            {
                                this.translations.popupPicker
                            }
                        </h1>
                        <h1 
                            className="h1 ff-title font-small"
                            onClick={(e) => { this.generatePicker() }}
                        >
                            {
                                this.translations.box_desc_1
                            }
                        </h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default Picker;