import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

class AdminNavList extends Component {

    render() {
        return (
            <React.Fragment>
                <li>
                    <Link to='/admin'>Админская кнопка 1</Link>
                </li>
                <li>
                    <Link to='/admin/smth'>Админская кнопка 2</Link>
                </li>
                <li>
                    <Link to='/admin/other'>Админская кнопка 3</Link>
                </li>
            </React.Fragment>
        );
    }
}

AdminNavList.propTypes = {};

export default AdminNavList;