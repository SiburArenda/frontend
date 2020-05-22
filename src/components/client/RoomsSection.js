import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route} from "react-router-dom";
import Rooms from "./Rooms";
import EachRoom from "./EachRoom";

class RoomsSection extends Component {

    componentDidMount() {
        sessionStorage.removeItem('SignUp');
    }

    render() {

        const {
            roomArray,
            showHint,
            closeHint
        } = this.props;

        return (
            <React.Fragment>

                <Route
                    path='/rooms'
                    exact
                    render={
                        props => (
                            <Rooms
                                {...props}
                                roomArray={roomArray}
                                showHint={showHint}
                                closeHint={closeHint}/>
                        )
                    }
                />

                <Route
                    path='/rooms/:roomId'
                    render={
                        props => (
                            <EachRoom
                                {...props}
                                roomArray={roomArray}
                                showHint={showHint}
                                closeHint={closeHint}
                            />
                        )
                    }
                />

            </React.Fragment>
        );
    }
}

RoomsSection.propTypes = {
    roomArray: PropTypes.array.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default RoomsSection;