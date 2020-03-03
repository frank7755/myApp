import React, { Fragment } from 'react';
import moment from 'moment';
import { formatThousands } from '~js/utils/utils';
import request from '~js/utils/request';
import styles from '~css/Cash/SellSearch.module.less';
import FormSearch from '~js/components/FormSearch/';
import { Pagination, Button, Modal, Form, Input, message, DatePicker, Select, Row, Alert, Col, Table } from 'antd';
import {
  getCurrMonth,
  getCurrWeek,
  getDatePickerValue,
  getLastWeek,
  getToday,
  getLast7Days,
  getYesterday
} from '~js/utils/date-fns';
import serveTable from '~js/components/serveTable';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class GoodsDetails extends React.Component {
  state = {
    visible: false,
    data: []
  };

  columns = [
    {
      title: '商品编号',
      dataIndex: 'sku_id'
    },
    {
      title: '商品名称',
      dataIndex: 'name'
    },
    {
      title: '商品规格',
      dataIndex: 'properties_name_json'
    },
    {
      title: '商品数量',
      dataIndex: 'count',
      align: 'center'
    },
    {
      title: '商品单价',
      dataIndex: 'seling_price',
      render(val) {
        return `￥ ${formatThousands(val)}`;
      }
    },
    {
      title: '实付金额',
      dataIndex: 'price_num',
      render(val) {
        return `￥ ${formatThousands(val)}`;
      }
    },
    {
      title: '操作',
      dataIndex: '退货',
      render: () => {
        return <Button type="red">退货</Button>;
      },
      align: 'center'
    }
  ];

  showModal = () => {
    this.setState({
      visible: true
    });

    request('http://114.67.90.231:8888/order_management/select', {
      method: 'post',
      body: {
        id: this.props.id,
        pur_no: this.props.orderNum,
        type: this.props.type
      }
    }).then(payload => this.setState({ data: payload.pageData.skus }));
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { visible, data } = this.state;

    return (
      <Fragment>
        <Button type="link" onClick={this.showModal}>
          查看详情
        </Button>
        <Modal title="订单详情" width={1200} visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <Table columns={this.columns} dataSource={data}></Table>
        </Modal>
      </Fragment>
    );
  }
}

@serveTable()
class SearchTable extends React.Component {
  columns = [
    {
      title: '订单号',
      dataIndex: 'pur_no'
    },
    {
      title: '订单金额',
      dataIndex: 'pur_sal',
      render(val) {
        return `￥ ${formatThousands(val)}`;
      }
    },
    {
      title: '实付金额',
      dataIndex: 'sal',
      render(val) {
        return `￥ ${formatThousands(val)}`;
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      render(val) {
        return moment(val).format('YYYY-MM-DD');
      }
    },
    {
      title: '订单类型',
      dataIndex: 'status',
      render(val) {
        return val == 0 ? '销售' : '退货';
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      align: 'center',
      render: (val, record) => {
        return <GoodsDetails id={this.props.id} orderNum={record.pur_no} type={2}></GoodsDetails>;
      }
    }
  ];

  handleSearch = ({ dateRange = [], ...rest }) => {
    const [start_time, end_time] = dateRange;

    const { table, id } = this.props;

    table.search({ id, type: 1, start_time, end_time, ...rest }, { ...table.pagination, current: 1 });
  };

  getDateRanges() {
    return {
      今天: getToday(),
      昨天: getYesterday(),
      本周: getCurrWeek(),
      上周: getLastWeek(),
      本月: getCurrMonth()
    };
  }

  refresh = () => {
    this.props.table.search();
  };
  render() {
    const { table, ...restProps } = this.props;

    return (
      <Fragment>
        <h2 className="title">
          <span>销售查询</span>
        </h2>
        <FormSearch onSearch={this.handleSearch} className={styles.search}>
          {({ form }) => {
            const { getFieldDecorator } = form;

            return (
              <Fragment>
                <Row gutter={32} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <span className={styles.rowItem}>
                      <label>订单号：</label>
                      {getFieldDecorator('pur_no')(<Input placeholder="请输入订单号" style={{ width: 'calc(100% - 80px)' }} />)}
                    </span>
                  </Col>
                  <Col span={8}>
                    <span className={styles.rowItem}>
                      <label>订单类型：</label>
                      {getFieldDecorator('status', {
                        initialValue: 0
                      })(
                        <Select style={{ width: 'calc(100% - 80px)' }}>
                          <Option value={0}>销售</Option>
                          <Option value={1}>退货</Option>
                        </Select>
                      )}
                    </span>
                  </Col>
                  <Col span={8}>
                    <span className={styles.rowItem}>
                      <label>选择日期：</label>
                      {getFieldDecorator('dateRange', {
                        initialValue: getLast7Days()
                      })(
                        <RangePicker allowClear={false} style={{ width: 'calc(100% - 80px)' }} ranges={this.getDateRanges()} />
                      )}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <span className={styles.rowItem}>
                      <Button htmlType="submit" type="primary">
                        查询
                      </Button>
                      <Button htmlType="reset">重置</Button>
                    </span>
                  </Col>
                </Row>
              </Fragment>
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
          dataSource={table.getDataSource()}
          loading={table.loading && { delay: 150 }}
        ></Table>
      </Fragment>
    );
  }
}
export default class App extends React.Component {
  render() {
    const { id } = this.props;

    return (
      <div className={styles.sellSearch}>
        <SearchTable id={id} source="http://114.67.90.231:8888/order_management/select"></SearchTable>
      </div>
    );
  }
}
