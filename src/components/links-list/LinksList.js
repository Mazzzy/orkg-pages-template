import React, { Component } from 'react';
import './LinksList.css';

class LinksList extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { dataValues, rowId } = this.props;
        return (
            <ul className={'linksList'}>
                {
                    dataValues.map( (linkItem, index) => {
                        const { label } = linkItem;
                        return (
                            <li key={'link_id' + rowId + '_' + index}>
                                <a href={label} target='_blank'>{label}</a>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}
export default LinksList;