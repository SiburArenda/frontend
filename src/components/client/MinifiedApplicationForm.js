import React, {Component} from 'react';
import PropTypes from 'prop-types';

class MinifiedApplicationForm extends Component {

    state = {
        offsetX: 0,
        offsetY: 0,
        dragged: false
    };

    pos = {
        top: this.props.posY,
        left: this.props.posX
    };

    render() {
        return (
            <div
                id='minimized-app-form'
                style={this.pos}
                onMouseDown={e => this.startFormDrag(e)}
                onMouseMove={e => this.dragForm(e)}
                onMouseUp={() => this.stopDrag()}
                onMouseLeave={() => this.stopDrag()}
            >
                <button
                    onClick={() => {
                        this.props.closeHint();
                        this.props.closeAppWindow()
                    }}
                    onMouseEnter={e => this.props.showHint(e, 'closeAppFormBtn')}
                    onMouseLeave={() => this.props.closeHint()}
                    className='close-btn'
                >
                </button>
                <button
                    id='expand-btn'
                    onClick={() => this.props.expand()}
                    onMouseEnter={e => this.props.showHint(e, 'expAppFormBtn')}
                    onMouseLeave={() => this.props.closeHint()}
                >
                </button>
            </div>
        );
    }

    startFormDrag = (e) => {
        if (e.target.id === 'minimized-app-form') {
            const movedObj = document.getElementById('minimized-app-form');
            const mouseX = +e.screenX;
            const mouseY = +e.screenY;

            const formXpx = movedObj.style.left;
            const formX = +formXpx.substr(0, formXpx.length - 2);

            const formYpx = movedObj.style.top;
            const formY = +formYpx.substr(0, formYpx.length - 2);

            const offsetX = mouseX - formX;
            const offsetY = mouseY - formY;

            this.setState({
                offsetX: offsetX,
                offsetY: offsetY,
                dragged: true
            })

        }
    };

    dragForm = (e) => {
        if (this.state.dragged) {
            const movedObj = document.getElementById('minimized-app-form');
            movedObj.style.top = (+e.screenY - this.state.offsetY) + 'px';
            movedObj.style.left = (+e.screenX - this.state.offsetX) + 'px';
        }
    };

    stopDrag = () => {
        if (this.state.dragged) {
            this.setState({
                dragged: false
            })
        }
    };
}

MinifiedApplicationForm.propTypes = {
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    closeAppWindow: PropTypes.func.isRequired,
    expand: PropTypes.func.isRequired,
    posX: PropTypes.number.isRequired,
    posY: PropTypes.number.isRequired
};

export default MinifiedApplicationForm;