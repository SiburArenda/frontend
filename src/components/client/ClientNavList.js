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
                        onClick={() => this.props.openApplicationForm()}
                        className='hover-text'
                    >
                        Оформить заявку
                    </button>
                </li>
            </React.Fragment>
        );
    }
}

ClientNavList.propTypes = {
    openApplicationForm: PropTypes.func.isRequired
};

export default ClientNavList;