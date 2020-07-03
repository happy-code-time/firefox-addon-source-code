import * as React from 'react';

import { getTranslations } from '../../Translations';

import { addonRoot, addonPrefixDashboard } from '../Functions/addonPrefix';

import fadePopupBoxOutPopup from '../Functions/fadePopupBoxOutPopup';

class AddonNotAvailable extends React.Component
{
    render(){
        const translations = getTranslations();

        return (
            <div className="AddonNotAvailable">
                <img alt="image" src={`${addonRoot()}Distribution/Images/code-128.png`} />
                <h1 className="h1-title ff-title text-center">
                    {
                        translations.addon_not_available
                    }
                </h1>
                <a
                    className="dashboard-link"
                    onClick={(e) => fadePopupBoxOutPopup(e, `${addonPrefixDashboard()}#`)}
                    href={`${addonPrefixDashboard()}#`}
                >
                    {
                        translations.dashbord
                    }
                </a>
            </div>
        );
    }
};

export default AddonNotAvailable;