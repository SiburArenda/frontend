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
        top: this.props.top != null ? this.props.top + 'px' : 'auto',
        width: this.props.width != null ? this.props.width + 'px': 'fit-content'
    };

    choose = (option) => {
        this.props.closeHint();
        this.props.onChoose(option);
    };

    render() {
        const popup = this.props.options.map((option) => {
            return (
                <div key={option.rusName} className='flex-no-stretch'>
                    <p
                        className='hover-text select-item'
                        id={option.rusName}
                        onClick={() => {
                            this.choose(option)
                        }}
                        onMouseEnter={e => this.fullNameHint(e, option.rusName)}
                        onMouseLeave={() => this.props.closeHint()}
                    >
                        {option.rusName}
                    </p>
                    {option.additional}
                </div>
            );
        });

        return (
            <div className='select-popup' style={this.pos}>
                {this.props.extraOption}
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
    top: PropTypes.number,
    width: PropTypes.number,
    extraOption: PropTypes.object
};

export default SelectList;