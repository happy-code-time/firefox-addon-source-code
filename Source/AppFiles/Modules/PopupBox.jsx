import * as React from 'react';

import getDerivedStateFromPropsCheck from '../Functions/getDerivedStateFromPropsCheck';

class PopupBox extends React.Component {

    constructor(props) {
        super(props);
        this.fadePopupBoxOut = this.fadePopupBoxOut.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.togglePopupBox = this.togglePopupBox.bind(this);
        this.checkLocation = this.checkLocation.bind(this);

        this.state = {
            /**
             * User
             */
            data: props.data ? props.data : '',
            icon: props.icon ? props.icon : '',
            iconCallback: (props.iconCallback && 'function' == typeof props.iconCallback) ? props.iconCallback : undefined,
            /**
             * App
             */
            displayBox: false,
            displayBoxClassNames: 'popup-box',
        };
    }

    /**
     * Force re-rendering of this component based
     * on keysChangeListners keys
     * @param {object} props 
     * @param {object} state 
     */
    static getDerivedStateFromProps(props, state) {
        if (getDerivedStateFromPropsCheck(['data', 'icon', 'iconCallback'], props, state)) {
            return {
                data: props.data ? props.data : '',
                icon: props.icon ? props.icon : '',
                iconCallback: (props.iconCallback && 'function' == typeof props.iconCallback) ? props.iconCallback : undefined,
            };
        }

        return null;
    }

    componentDidMount() {
        this.oldHref = window.location.href;
        document.addEventListener('mousedown', this.handleMouseDown);
    }

    componentWillUnmount() {
        clearInterval(this.odHrefInterval);
        document.removeEventListener('mousedown', this.handleMouseDown);
    }

    /**
     * Hide data div
     * while user not inside it
     * @param {React.MouseEvent|any} e
     */
    handleMouseDown(e) {
        if (this.nodeData && !this.nodeData.contains(e.target)) {
            this.fadePopupBoxOut();
        }

        this.checkLocation();
    }

    checkLocation() {
        clearInterval(this.odHrefInterval);
        let count = 10;
        this.odHrefInterval = setInterval(() => {

            if (this.oldHref !== window.location.href || 0 > count) {
                this.oldHref = window.location.href;
                clearInterval(this.odHrefInterval);

                this.setState({
                    displayBox: false,
                    displayBoxClassNames: 'popup-box',
                });
            }
        }, 50);
    }

    togglePopupBox() {
        const { iconCallback } = this.state;

        if(iconCallback){
            (iconCallback)();
        }

        if (this.state.displayBox) {
            return this.fadePopupBoxOut();
        }

        this.setState({
            displayBox: true,
            displayBoxClassNames: 'popup-box'
        });
    }

    fadePopupBoxOut() {
        const { displayBoxClassNames } = this.state;

        this.setState(
            {
                displayBoxClassNames: `${displayBoxClassNames} fade-out`,
            },
            () => {
                setTimeout(() => {
                    this.setState({
                        displayBox: false,
                        displayBoxClassNames: 'popup-box',
                    });
                }, 200);
            }
        );
    }

    render() {
        const { displayBoxClassNames, icon, displayBox, data } = this.state;

        return (
            <span ref={node => (this.nodeData = node)} className="rr-popupbox relative popup-box-main">
                <span className="icon" onClick={e => this.togglePopupBox()}>
                    {
                        icon
                    }
                </span>
                {
                    displayBox && 
                    <div className={`${displayBoxClassNames}`}>
                        {
                            data
                        }
                    </div>
                }
            </span>
        );
    }
}

export default PopupBox;
