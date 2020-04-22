import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link, BrowserRouter as Router} from "react-router-dom";

class ClientNavList extends Component {

    render() {
        return (
            <Router>
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
                        onClick={() => this.props.openApplicationForm()}
                        className='hover-text'
                        onMouseEnter={e => this.props.showHint(e, 'openAppFormBtn')}
                        onMouseLeave={() => this.props.closeHint()}
                    >
                        Оформить заявку
                    </button>
                </li>
            </Router>
        );
    }
}

ClientNavList.propTypes = {
    openApplicationForm: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default ClientNavList;