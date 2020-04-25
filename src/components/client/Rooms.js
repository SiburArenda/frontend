import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Rooms extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.roomArray.map(room => <p>{room.name}</p>)}
            </React.Fragment>
        );
    }
}

Rooms.propTypes = {
    roomArray: PropTypes.array.isRequired
};

export default Rooms;