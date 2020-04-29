import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

class ClientNavList extends Component {

    render() {
        return (
            <React.Fragment>
                <li>
                    <Link to='/' className='hover-text'>О сервисе</Link>
                </li>
                <li>
                    <Link to='/rooms' className='hover-text'>Помещения</Link>
                </li>
                <li>
                    <Link to='/contacts' className='hover-text'>Контакты</Link>
                </li>
                <li>
                    <Link to='/signup' className='hover-text'>Регистрация</Link>
                </li>
                <li>
                    <button
                        onClick={() => this.appClick()}
                        className='hover-text'
                        onMouseEnter={e => this.props.showHint(e, 'openAppFormBtn')}
                        onMouseLeave={() => this.props.closeHint()}
                    >
                        Оформить заявку
                    </button>
                </li>
            </React.Fragment>
        );
    }

    appClick = () => {
        const appF = this.props.appFormRef.current;
        if (appF == null) {
            this.props.openApplicationForm();
        } else {
            if (appF.state.minimized || appF.state.minimized === 'true') {
                appF.setState({
                    minimized: false
                })
            }
        }
    }
}

ClientNavList.propTypes = {
    openApplicationForm: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    appFormRef: PropTypes.object.isRequired
};

export default ClientNavList;