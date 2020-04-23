import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SelectList from "./SelectList";

class Dropdown extends Component {

    state = {
        showSelect: false,
        chosen: this.props.options[0]
    };

    handleClickOutside = (e) => {
        if (e.target.className.indexOf('select-popup') === -1) {
            this.setState({
                showSelect: false
            })
        }
    };

    margin = {
        marginRight: this.props.marginRight != null ? this.props.marginRight + 'px' : 0
    };

    render() {
        return (
            <span
                className={'dropdown' + (this.props.withButton ? '' : ' hover-text')}
                onClick={() => {if (!this.props.withButton) this.openSelect()}}
                style={this.margin}
            >
                {
                    this.props.withButton
                    ?
                    <div className='dropdown-header'>
                        <label className='no-overflow'>
                            {this.props.header === '' ? this.state.chosen.rusName : this.props.header}
                        </label>
                        <button
                            className='open-select-btn'
                            onClick={() => this.openSelect()}
                        >
                        </button>
                    </div>
                    :
                    <label className='no-overflow hover-text'>
                        {this.props.header === '' ? this.state.chosen.rusName : this.props.header}
                    </label>
                }
                {this.state.showSelect
                    ?
                    <SelectList
                        options={this.props.options}
                        onChoose={this.choose}
                        clickOutside={this.handleClickOutside}
                        left={this.props.left}
                        top={this.props.top}
                        showHint={this.props.showHint}
                        closeHint={this.props.closeHint}
                    />
                    : null
                }
            </span>
        );
    }

    openSelect() {
        this.setState({
            showSelect: !this.state.showSelect
        })
    }

    choose = (option) => {
        this.setState({
            chosen: option,
            showSelect: false
        });
        this.props.onChoose(option);
    }
}

Dropdown.propTypes = {
    header: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    onChoose: PropTypes.func.isRequired,
    withButton: PropTypes.bool.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired,
    left: PropTypes.number,
    top: PropTypes.number,
    marginRight: PropTypes.number
};

export default Dropdown;