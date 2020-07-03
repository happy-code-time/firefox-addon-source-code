import * as React from 'react';

import { getTranslations } from '../../Translations/index';

import { addonRoot } from '../Functions/addonPrefix';

class NoData extends React.Component 
{
    render(){
        const translations = getTranslations();

        return (
            <div className="NoData">
                <img alt="image" src={`${addonRoot()}Distribution/Images/code-128.png`} />
                <h1 className="h1-title">
                    {
                        translations.no_data_available
                    }
                </h1>
            </div>
        );
    }
};

export default NoData;