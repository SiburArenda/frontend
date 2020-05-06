import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Hint extends Component {

    position = {
        top: (+this.props.y + this.props.hintVPos) + 'px',
        left: (+this.props.x + this.props.hintHPos) + 'px'
    };

    render() {
        return (
            <div className='hint' style={this.position} dangerouslySetInnerHTML={{__html: this.props.hintText}}>
            </div>
        );
    }
}

Hint.propTypes = {
    hintText: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    hintHPos: PropTypes.number.isRequired,
    hintVPos: PropTypes.number.isRequired
};

export default Hint;