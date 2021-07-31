import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

class FilterByText extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { labelText, filterStr, handleFilterChange } = this.props;
        return (
            <Form>
                <FormGroup>
                    <Label for="filterInput">{labelText}</Label>
                    <Input 
                        type="text" 
                        name="filterInput" 
                        id="filterInput" 
                        placeholder="Filter by text" 
                        value={ filterStr }
                        onChange={ handleFilterChange }
                    />
                </FormGroup>
            </Form>
        )
    }
}
export default FilterByText;