import React, { Fragment } from 'react';
import request from '~js/utils/request';
import { formatThousands, debounce } from '~js/utils/utils';
import styles from '~css/Property/PropertyDetails.module.less';
import FormSearch from '~js/components/FormSearch/';
import moment from 'moment';
import serveTable from '~js/components/serveTable';
import { Statistic, Row, Col, Button, Table, DatePicker, Pagination, Popconfirm, message } from 'antd';

const { MonthPicker } = DatePicker;

@serveTable()
class RecordTable extends React.Component {
  state = {
    mode: ['month', 'month'],
    value: []
  };

  handleSearch = value => {
    const { table, id } = this.props;

    table.search({ id, start_time: value.start_time, end_time: value.end_time, type: 5 }, { ...table.pagination, current: 1 });
  };

  refresh = () => {
    this.props.table.search();
  };

  columns = [
    {
      title: '日期',
      dataIndex: 'date',
      render(val) {
        return moment(val).format('YYYY-MM');
      }
    },
    {
      title: '销售额',
      dataIndex: 'Sales_volume',
      render: val => {
        return `￥${formatThousands(val)}`;
      }
    },
    {
      title: '销售数量',
      dataIndex: 'salces_count',
      render: val => {
        return `￥${formatThousands(val)}`;
      }
    }
  ];

  state = {
    mode: ['month', 'month'],
    value: []
  };

  handlePanelChange = (value, mode) => {
    this.setState({
      value,
      mode: [mode[0] === 'date' ? 'month' : mode[0], mode[1] === 'date' ? 'month' : mode[1]]
    });
  };

  handleChange = value => {
    this.setState({ value });
  };

  render() {
    const { table, ...restProps } = this.props;
    const { mode, value } = this.state;

    return (
      <Fragment>
        <h2 className="title">
          <span>业绩分析</span>
        </h2>
        <div className={styles.details}>
          <FormSearch onSearch={this.handleSearch} className={styles.search}>
            {({ form }) => {
              const { getFieldDecorator } = form;

              return (
                <Row gutter={32} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <span className={styles.rowItem}>
                      <label>开始月份：</label>
                      {getFieldDecorator('start_time', {
                        initialValue: moment().startOf('month')
                      })(<MonthPicker></MonthPicker>)}
                    </span>
                    <span className={styles.rowItem}>
                      <label>结束月份：</label>
                      {getFieldDecorator('end_time', {
                        initialValue: moment().endOf('month')
                      })(<MonthPicker></MonthPicker>)}
                    </span>
                  </Col>
                  <Col span={8}>
                    <span className={styles.rowItem}>
                      <Button htmlType="submit" type="primary">
                        查询
                      </Button>
                      <Button htmlType="reset">重置</Button>
                    </span>
                  </Col>
                </Row>
              );
            }}
          </FormSearch>
          <Table
            {...restProps}
            rowKey={table.rowKey}
            columns={this.columns}
            onChange={table.onChange}
            pagination={table.pagination}
            bodyStyle={{ overflowX: 'auto' }}
            response={table.response}
            dataSource={table.getDataSource()}
            loading={table.loading && { delay: 150 }}
          ></Table>
        </div>
      </Fragment>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <div className={styles.propetyDetails}>
        <RecordTable id={this.props.id} source="http://114.67.90.231:8888/BI/select"></RecordTable>
      </div>
    );
  }
}
