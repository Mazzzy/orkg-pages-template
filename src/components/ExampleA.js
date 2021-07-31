import React, { Component } from 'react';
import './visWidgetConfig.css';
import { Table } from 'reactstrap';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getComparisonById } from 'network/networkRequests';
import FilterByText from './filter-bytext/FilterByText';
import LinksList from './links-list/LinksList';
class ExampleA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            requestedData: null,
            filterStr: ''
        };
    }

    componentDidMount() {
        // fetch data
        this.getData();
    }

    getData = () => {
        getComparisonById('R44930').then(dataFrame => {
            this.setState({ requestedData: dataFrame, loading: false });
        });
    };

    handleFilterChange = e => {
        const filterStr = e.target.value.trim().toLowerCase()
        this.setState({
          filterStr: filterStr,
        })
    }

    renderData = () => {
        const { requestedData, filterStr } = this.state;
        // create an authors array;
        const authorStatements = requestedData.statementsData.content.filter(item => item.predicate.id === 'P27');

        if (!requestedData) {
            return <div>Some error</div>;
        } else {
            return (
                <div>
                    <div>
                        Title: <b>{requestedData.resourceMetaData.label}</b>; Number of contributions:{' '}
                        <b>{requestedData.comparisonData.contributions.length}</b>
                    </div>
                    <div>
                        Authors:{' '}
                        {authorStatements.map(item => {
                            return item.object.label + '; ';
                        })}
                    </div>
                    <div className="my-3">
                        <FilterByText 
                            labelText="Filter by text for columns apart from Contribution and Same as"
                            filterStr={ filterStr }
                            handleFilterChange={ this.handleFilterChange }
                        />
                    </div>
                    <div>Comparison Data:</div>
                    {this.renderComparisonTable()}
                </div>
            );
        }
    };

    renderComparisonTable = () => {
        const { requestedData } = this.state;
        const dataFrame = requestedData.comparisonData;
        return (
            <Table striped bordered responsive>
                {/*  define headers*/}
                <thead>
                    <tr>
                        <th
                            style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                padding: '3px'
                            }}
                        >
                            Contribution
                        </th>
                        {dataFrame.properties
                            .filter(property => property.active === true)
                            .map(property => {
                                return (
                                    <th
                                        key={property.label}
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            padding: '3px'
                                        }}
                                    >
                                        {property.label}
                                    </th>
                                );
                            })}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(dataFrame.data).map((data, id) => {
                        return (
                            <tr key={'tr_id' + id} >
                                <td
                                    key={'td_id_' + id}
                                    style={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        padding: '3px',
                                        maxWidth: '200px'
                                    }}
                                >
                                    {dataFrame.contributions[id].contributionLabel +
                                        '(' +
                                        dataFrame.contributions[id].id +
                                        '/' +
                                        dataFrame.contributions[id].paperId +
                                        ')'}
                                </td>
                                {this.createRows(id)}
                            </tr>
                        );
                    })}
                </tbody>
            {/* </table> */}
            </Table>
        );
    };

    createRows = rowId => {
        const { requestedData, filterStr } = this.state;
        // property filtering
        const dataFrame = requestedData.comparisonData;
        const activeProperties = dataFrame.properties.filter(property => property.active === true);
        return activeProperties.map(property => {
            const propId = property.id;
            const dataValues = dataFrame.data[propId][rowId];
            return (
                <td
                    key={'td_id' + rowId + '_' + propId}
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        padding: '3px',
                        maxWidth: '200px'
                    }}
                >
                    {
                        (propId === 'SAME_AS') ? <LinksList dataValues dataValues={dataValues} rowId={rowId} /> :
                        (filterStr.length > 0) ? this.getFilteredVals(dataValues, filterStr) :
                        dataValues.map(val => {
                            return val.label + ' ';
                        })
                    }
                </td>
            );
        });
    };

    getFilteredVals (dataValues, filterStr) {
        return dataValues.map(val => {
            const filered = val.label ? val.label.toLowerCase().indexOf(filterStr) != -1 : false;
            return filered ? val.label + ' ' : ' ';
        });
    }

    /** Component Rendering Function **/
    render() {
        const { loading } = this.state;
        return (
            <div>
                <div className={'headerStyle'}>
                    Example A: Comparisons{' '}
                    <a style={{ color: '#e86161' }} href="https://www.orkg.org/orkg/comparison/R44930">
                        COVID-19 Reproductive Number Estimates
                    </a>
                </div>
                <div className={'bodyStyle'}>
                    {loading && (
                        <h2 className="h5">
                            <span>
                                <Icon icon={faSpinner} spin />
                            </span>{' '}
                            Loading ...
                        </h2>
                    )}
                    {!loading && this.renderData()}
                </div>
            </div>
        );
    }
}

export default ExampleA;
