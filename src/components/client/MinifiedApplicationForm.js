import React, {Component} from 'react';
import PropTypes from 'prop-types';

class MinifiedApplicationForm extends Component {

    handleResize = () => {

        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const {x, y} = this.state;

        if (x + 50 > screenW) {
            this.setState({
                x: 380
            });
        }

        if (y + 50 > screenH){
            this.setState({
                y: 40
            });
        }

    };


    componentDidMount() {
        window.addEventListener('resize', this.handleResize, false)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize, false)
    }

    constructor(props) {
        super(props);

        const coords = sessionStorage.getItem('minAppForm');
        if (coords != null) {
            const parsedCoords = JSON.parse(coords);
            this.state.x = parsedCoords.x;
            this.state.y = parsedCoords.y;
        }
    }

    state = {
        offsetX: 0,
        offsetY: 0,
        dragged: false,
        grabbed: null,
        x: this.props.posX,
        y: this.props.posY
    };

    render() {
        return (
            <div
                id='minimized-app-form'
                style={{top: this.state.y, left: this.state.x}}
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
                    onClick={() => this.props.expand(this.state.x, this.state.y)}
                    onMouseEnter={e => this.props.showHint(e, 'expAppFormBtn')}
                    onMouseLeave={() => this.props.closeHint()}
                >
                </button>
            </div>
        );
    }

    startFormDrag = (e) => {
        if (e.target.id === 'minimized-app-form') {

            e.target.style.cursor = 'grab';

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
                dragged: true,
                grabbed: e.target
            })

        }
    };

    dragForm = (e) => {
        if (this.state.dragged) {
            this.setState({
                x: +e.screenX - this.state.offsetX,
                y: +e.screenY - this.state.offsetY
            });
        }
    };

    stopDrag = () => {
        if (this.state.dragged) {
            const grabbed = this.state.grabbed;
            grabbed.style.cursor = 'default';
            this.setState({
                dragged: false,
                grabbed: null
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