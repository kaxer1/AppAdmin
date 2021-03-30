import React, { Component } from "react";
import PropTypes from "prop-types";

class Task extends Component {

    StyleCompleted() {
        return {
            fontSize: '20px',
            color: this.props.e.done ? 'gray' : 'black',
            textDecoration: this.props.e.done ? 'line-through' : 'none'
        }
    }

    render() {
        const { e } = this.props
        return <p style={this.StyleCompleted()}>
            {e.id} - 
            {e.title} - 
            {e.description} - 
            {e.done}
            <input type="checkbox"/>
            <button style={btnDelete}>
                X
            </button>
        </p>
    }
}

Task.propTypes = {
    task: PropTypes.object.isRequired
}

const btnDelete = {
    fontSize: '18px',
    background: '#ea2027',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '50%',
    cursor: 'pointer'
}

export default Task