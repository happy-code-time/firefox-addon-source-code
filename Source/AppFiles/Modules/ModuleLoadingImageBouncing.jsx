import * as React from 'react';

import getDerivedStateFromPropsCheck from '../Functions/getDerivedStateFromPropsCheck';

class ModuleLoadingImageBouncing extends React.Component 
{
    constructor(props){
        super(props);

        this.state = {
            src: (props.src && typeof '8' == typeof props.src) ? props.src : '',
            alt: (props.alt && typeof '8' == typeof props.alt) ? props.alt : '',
            text: (props.text && typeof '8' == typeof props.text) ? props.text : ''
        }
    }

    /**
     * Force re-rendering of this component based
     * on keysChangeListners keys
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (getDerivedStateFromPropsCheck(['src', 'alt', 'text'], props, state)) {
            return {
                src: (props.src && typeof '8' == typeof props.src) ? props.src : '',
                alt: (props.alt && typeof '8' == typeof props.alt) ? props.alt : '',
                text: (props.text && typeof '8' == typeof props.text) ? props.text : ''
            };
        }

        return null;
    }


    render(){
        const { src, alt, text } = this.state;

        return (
            <div className="ModuleLoadingImageBouncing">
                <img 
                    alt={alt} 
                    src={src} 
                />
                {
                    text &&
                    <h1 className="h1-title">
                    {
                        text
                    }
                </h1>
                }
            </div>
        );
    }
};

export default ModuleLoadingImageBouncing;