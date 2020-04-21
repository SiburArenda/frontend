import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Hint extends Component {

    position = {
        top: (+this.props.y + 8) + 'px',
        left: (+this.props.x + 8) + 'px'
    };

    render() {
        return (
            <div className='hint' style={this.position}>
                {this.props.hintText}
            </div>
        );
    }
}

Hint.propTypes = {
    hintText: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
};

export default Hint;