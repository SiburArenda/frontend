import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SelectList extends Component {

    componentDidMount() {
        document.addEventListener('click', this.props.clickOutside, false);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.props.clickOutside, false);
    }

    pos = {
        left: this.props.left != null ? this.props.left + 'px' : 'auto',
        top: this.props.top != null ? this.props.top + 'px' : 'auto'
    };

    choose = (option) => {
        this.props.closeHint();
        this.props.onChoose(option);
    };

    render() {
        const popup = this.props.options.map((option) => {
            return (
                <p
                    key={option.rusName}
                    className='hover-text select-item'
                    id={option.rusName}
                    onClick={() => {this.choose(option)}}
                    onMouseEnter={e => this.fullNameHint(e, option.rusName)}
                    onMouseLeave={() => this.props.closeHint()}
                >
                    {option.rusName}
                    {option.additional}
                </p>
            );
        });
        return (
            <div className='select-popup' style={this.pos}>
                {popup}
            </div>
        );
    }

    fullNameHint = (e, rusName) => {
        const textLine = document.getElementById(rusName);
        if (textLine.scrollWidth > textLine.clientWidth) {
            this.props.showHint(e, 'fullName&' + rusName)
        }
    }
}

SelectList.propTypes = {
    options: PropTypes.array.isRequired,
    onChoose: PropTypes.func.isRequired,
    clickOutside: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    left: PropTypes.number,
    top: PropTypes.number
};

export default SelectList;