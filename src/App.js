import React, { Component } from 'react';
import {Button,Table} from 'antd'
import './App.css';

const sumReducer = field => {
  return (accumulator,currentValue) => {
    if(field) accumulator += currentValue[field]
    else accumulator += currentValue
    return accumulator
  }
}

class TableExample extends Component {
  state = {
    data: []
  }
  componentDidMount() {
    const me = this
    fetch('./mock.json')
    .then(response => {
      return response.json()
    })
    .then(jsonresp => {
      console.log(jsonresp)
      me.setState({data:jsonresp.map(datum => {
        return Object.assign(datum,{
          children:datum.sales,
          qty:datum.sales.reduce(sumReducer('qty'),0),
          total:datum.sales
            .map(sale => sale.qty * sale.price)
            .reduce(sumReducer(),0)
        })
      })})      
    })
  }
  render() {
    return <Table
    rowKey="id"
    size='small'
    dataSource={this.state.data}
    rowClassName={(record,index) => isNaN(record.id) ? '' : 'data-header'}
    rowSelection={{
      selectedRowKeys:this.props.selectedRows,
      onChange:this.props.onSelectionChange
    }}
    columns={[
      {title:'Product',dataIndex:'product',width:200},
      {title:'Vol.',dataIndex:'vol',width:100},
      {title:'Price',dataIndex:'price',width:100},
      {title:'Qty.',dataIndex:'qty',width:100,
        onCell:record => record.qty > 10 ? {className:'over10'} : null
      },
      {title:'Sub Amount',render:(text,record) => {
          const res = record.qty * record.price
          return isNaN(res) ? '' : res
        },width:100,
        onCell: record => {
          const res = record.qty * record.price
          if(isNaN(res)) return null
          if(res>10000) return {className:'over10000'}
        }
      },
      {title:'Total',dataIndex:'total',width:100}
    ]}
    />
  }
}

class App extends Component {
  state = {
    selectedRows:[]
  }
  onSelectionChange(keys) {
    this.setState({selectedRows:keys})
  }
  render() {
    return (
      <React.Fragment>
        <TableExample
        selectedRows={this.state.selectedRows}
        onSelectionChange={this.onSelectionChange.bind(this)}/>
        {
          this.state.selectedRows.map((row,index) => {
            return <React.Fragment key={index}>{`${index} row: ${JSON.stringify(row)}`} <br/></React.Fragment>
          })
        }
      </React.Fragment>
    );
  }
}

export default App;
