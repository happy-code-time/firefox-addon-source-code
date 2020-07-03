import React from 'react';

import { customKey } from 'react-divcreator';

const changeAppsLanguage = (language) => {
    localStorage.setItem('applanguage', language);

    browser.runtime.sendMessage({
        action: 'set-app-language',
        language
    })
    .then( () => {
        window.location.reload();
    })
};

export const generateLanguages = () => {
    const parents = [];
    const languages = [
        {
            region: 'North America',
            languages: [
                {
                    key: 'en',
                    display: 'USA'
                }
            ]
        },
        {
            region: 'Europe',
            languages: [
                {
                    key: 'de',
                    display: 'Deutschland'
                },
                {
                    key: 'pl',
                    display: 'Polska'
                }
            ]
        }
    ];

    languages.map( object => {
        const childs = [];

        object.languages.map( lang => {
            childs.push(
                <div
                    className="single-language"
                    key={customKey()}
                    onClick={(e) => changeAppsLanguage(lang.key)}
                >
                    {
                        lang.display
                    }
                </div>
            );
        })

        parents.push(
            <div 
                key={customKey()}
                className="languages"
            >
                <h1>
                    {
                        object.region 
                    }
                </h1>
                {
                    childs
                }
            </div>
        );
    });

    return (
        <div className="box-1">                
        {
            parents
        }
        </div>
    );
}  