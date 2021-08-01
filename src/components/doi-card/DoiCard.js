import React, { Component } from 'react';
import './DoiCard.css';

class DoiCard extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { doi } = this.props;
        return (
            <div className="doiContainer">
                <span>Paper doi: </span>
                {doi && <a href={`https://doi.org/${doi}`} target="_blank">{doi}</a>}
            </div>
        )
    }
}
export default DoiCard;