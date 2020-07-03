import * as React from 'react';

class ToTopRocket extends React.Component {
    constructor(props) {
        super(props);
        this.scrollEvent = this.scrollEvent.bind(this);

        this.state = {
            backToTopClassNames: 'back-to-top'
        };

        this.scrollToTop = false;
    }

    componentDidMount() {
        document.addEventListener('scroll', this.scrollEvent);
    }
    componentWillUnmount() {
        document.removeEventListener('scroll', this.scrollEvent);
    }

    /**
     * On scroll events
     * @param e any
     */
    scrollEvent(e) {
        if (document.documentElement.scrollTop >= 150) {
            if (false == this.scrollToTop) {
                this.scrollToTop = true;
                this.setState({
                    scrollToTop: this.scrollToTop,
                    backToTopClassNames: 'back-to-top'
                });
            }
        }
        else {
            if (true == this.scrollToTop) {
                this.scrollToTop = false;
                this.setState({
                    scrollToTop: this.scrollToTop,
                    backToTopClassNames: 'back-to-top'
                });
            }
        }
    }

    top() {
        if (document.documentElement) {
            this.setState({
                backToTopClassNames: 'back-to-top fire'
            }, () => {

                this.navigationToTopOfWebpage(500);

                setTimeout(() => {
                    document.documentElement.removeAttribute('style');
                }, 500);
            })
        }
    }

    navigationToTopOfWebpage(time){
        let userOnXPosition = document.documentElement.scrollTop;
        let timer = parseInt(time, 10);
        let pxToAdd = userOnXPosition / timer*4;
        //
        let xTop = setInterval( () => {
            document.documentElement.scrollTop = userOnXPosition;
            userOnXPosition -= (pxToAdd);

            if(-10 >= userOnXPosition){
                clearInterval(xTop);
            }
        }, 1 );
    }

    render() {
        const { backToTopClassNames } = this.state;

        if (!this.scrollToTop) {
            return null;
        }

        return (
            <div
                className={backToTopClassNames}
                onClick={(e) => this.top()}
            >
                <span className="holder">
                    <i className="fas fa-space-shuttle"></i>
                    {
                        -1 !== backToTopClassNames.indexOf('fire') &&
                        <div className="container">
                            <div className="red flame"></div>
                            <div className="orange flame"></div>
                            <div className="yellow flame"></div>
                            <div className="white flame"></div>
                        </div>
                    }
                </span>
            </div>
        );
    }
}

export default ToTopRocket;
