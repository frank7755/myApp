import React, { Fragment } from 'react';
import request from '~js/utils/request';
import moment from 'moment';
import { formatThousands } from '~js/utils/utils';
import styles from '~css/Cash/OnlineOrder.module.less';
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
import { Link } from 'react-router-dom';
const { Option } = Select;
const { RangePicker } = DatePicker;

const status = {
  '1': '买家发起维权',
  '10': '卖家拒绝退款',
  '20': '卖家已经同意退货，等待买家退货，',
  '30': '买家已经退货，等待卖家确认收货',
  '40': '卖家未收到货,拒绝退款',
  '50': '退款关闭',
  '60': '退款成功'
};

@Form.create()
class SendGoods extends React.Component {
  state = {
    selectedRowKeys: [],
    visible: false
  };

  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({ selectedRowKeys: selectedRowKeys });
    },
    getCheckboxProps: record => ({
      disabled: record.status != null || record.status == '2' // Column configuration not to be checked
    })
  };

  showModal = () => {
    this.setState({
      visible: true,
      selectedRowKeys: []
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  columns = [
    {
      title: '商品',
      dataIndex: 'title',
      render: (title, record) => {
        const skuName = JSON.parse(record.sku_properties_name);

        if (skuName.length > 0) {
          return (
            <Fragment>
              <a style={{ marginBottom: 10, display: 'inline-block' }}>{title}</a>
              <p style={{ margin: 0 }}>
                {skuName.map(item => (
                  <span key={item.k} style={{ marginRight: 10 }}>
                    {item.k + ':' + item.v}
                  </span>
                ))}
              </p>
            </Fragment>
          );
        }
      }
    },
    {
      title: '数量',
      dataIndex: 'num'
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: status => {
        return (
          <Fragment>
            {status == null && <span className="textDelete">未发货</span>}
            {status == '1' && <span className="textSuccess">已发货</span>}
            {status == '2' && <span className="textEdit">维权中</span>}
          </Fragment>
        );
      }
    },
    {
      title: '运单号'
    }
  ];

  handleSend = () => {
    const { selectedRowKeys } = this.state;
    const { onChange } = this.props;

    if (selectedRowKeys.length) {
      request('http://114.67.90.231:8888/order_management/yz_order_confirm', {
        method: 'post',
        body: {
          id: this.props.id,
          tid: this.props.tid,
          oids: selectedRowKeys.join(',')
        }
      })
        .then(payload => {
          message.success('发货成功');
          this.setState({ visible: false, selectedRowKeys: [] });
          onChange && onChange();
        })
        .catch(error => message.error(error.message));
    } else {
      message.error('请选择需要发货的商品');
    }
  };

  render() {
    const { visible } = this.state;

    const { data, disabled, receiver_name, receiver_tel, address } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <Button type="default" disabled={disabled} onClick={this.showModal}>
          发货
        </Button>
        <Modal
          visible={visible}
          title="订单发货"
          onCancel={this.handleCancel}
          width={800}
          className={styles.sendGoodsModal}
          onOk={this.handleSend}
        >
          <Alert
            description={
              <div className={styles.warningText}>
                <p>1.中通、申通、圆通、百世、韵达快递公司已恢复运营支持发货，详情查看经营提醒公告；</p>
                <p>2.同城建议使用达达、蜂鸟配送以保证运力，详情查看同城配送建议公告；</p>
              </div>
            }
            type="warning"
            showIcon
          />
          <h3 className={styles.tableTitle}>选择商品</h3>
          <Table
            dataSource={data}
            columns={this.columns}
            rowKey="oid"
            pagination={false}
            rowSelection={this.rowSelection}
          ></Table>
          <div className={styles.customerInfo}>
            <span>配送信息</span>
            <section>
              <p>
                <span>收货人：</span>
                {receiver_name + ' ' + receiver_tel}
              </p>
              <p>
                <span>收货地址：</span>
                {address}
              </p>
            </section>
          </div>
          {/* <div className={styles.customerInfo}>
            <span>快递</span>
            <section>
              <p>
                <span>物流公司：</span>
                {getFieldDecorator('company')(
                  <Select>
                    <Option value={0}>顺丰</Option>
                    <Option value={1}>中通</Option>
                    <Option value={2}>圆通</Option>
                  </Select>
                )}
              </p>
              <p>
                <span>快递单号：</span>
                {getFieldDecorator('ordernum')(<Input type="text" placeholder="请输入快递单号"></Input>)}
              </p>
            </section>
          </div> */}
        </Modal>
      </Fragment>
    );
  }
}

@Form.create()
class OrderList extends React.Component {
  state = {
    listData: [],
    total: null
  };

  componentDidMount() {
    this.handleSearch();
  }

  getDateRanges() {
    return {
      今天: getToday(),
      昨天: getYesterday(),
      本周: getCurrWeek(),
      上周: getLastWeek(),
      本月: getCurrMonth()
    };
  }

  fetch = (page, pageSize) => {
    this.props.form.validateFields((err, value) => {
      const { dateRange, ...rest } = value;
      const [start_time, end_time] = value.dateRange;

      if (!err) {
        request('http://114.67.90.231:8888/order_management/goods_select', {
          method: 'post',
          body: {
            id: this.props.id,
            type: 1,
            start_time: start_time,
            end_time: end_time,
            page: page || 1,
            pageSize: pageSize || 20,
            ...rest
          }
        }).then(payload => {
          this.setState({ listData: payload.pageData, total: payload.total });
        });
      }
    });
  };

  handleSearch = () => {
    this.fetch();
  };

  handleRest = () => {
    this.props.form.resetFields();
  };

  render() {
    const { listData, total } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <h2 className="title">
          <span>线上商品</span>
        </h2>
        <Form onSubmit={this.handleSearch} onReset={this.handleRest}>
          <Row gutter={32} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <span className={styles.rowItem}>
                <label>订单号：</label>
                {getFieldDecorator('tid')(<Input placeholder="请输入订单号" style={{ width: 'calc(100% - 80px)' }} />)}
              </span>
            </Col>
            <Col span={8}>
              <span className={styles.rowItem}>
                <label>商品名称：</label>
                {getFieldDecorator('title')(<Input placeholder="请输入商品名称" style={{ width: 'calc(100% - 80px)' }} />)}
              </span>
            </Col>
            <Col span={8}>
              <span className={styles.rowItem}>
                <label>选择日期：</label>
                {getFieldDecorator('dateRange', {
                  initialValue: getLast7Days()
                })(<RangePicker allowClear={false} style={{ width: 'calc(100% - 80px)' }} ranges={this.getDateRanges()} />)}
              </span>
            </Col>
          </Row>
          <Row gutter={32} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <span className={styles.rowItem}>
                <label>订单状态：</label>
                {getFieldDecorator('status_str', { initialValue: '' })(
                  <Select style={{ width: 'calc(100% - 80px)' }}>
                    <Option value="">全部</Option>
                    <Option value="待付款">待付款</Option>
                    <Option value="待发货">待发货</Option>
                    <Option value="已发货">已发货</Option>
                    <Option value="已完成">已完成</Option>
                    <Option value="已关闭">已关闭</Option>
                    <Option value="退款中">退款中</Option>
                  </Select>
                )}
              </span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 24 }}>
            <Col span={8}>
              <span className={styles.rowItem}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button type="gray" htmlType="reset">
                  重置
                </Button>
              </span>
            </Col>
          </Row>
        </Form>
        <div className={styles.orderList}>
          <ul className={styles.listHeader}>
            <li className={styles.listHeaderItem}>商品</li>
            <li className={styles.listHeaderItem}>单价(元) / 数量</li>
            <li className={styles.listHeaderItem}>售后</li>
            <li className={styles.listHeaderItem}>买家 / 收货人</li>
            <li className={styles.listHeaderItem}>实收金额(元)</li>
            <li className={styles.listHeaderItem}>订单状态</li>
            <li className={styles.listHeaderItem}>操作</li>
          </ul>
          {listData &&
            listData.map(item => (
              <ListItemTable
                onChange={this.handleSearch}
                item={item}
                address={item.address}
                receiver_name={item.receiver_name}
                receiver_tel={item.receiver_tel}
                key={item.tid}
                data={item.order}
                showHeader={false}
                price={item.discount_price}
                len={item.order.length}
                rowKey={item.tid}
                id={this.props.id}
                tid={item.tid}
              ></ListItemTable>
            ))}
        </div>
        <Pagination
          className={styles.pagination}
          defaultCurrent={1}
          pageSize={20}
          total={100}
          showQuickJumper
          onChange={(page, pageSize) => this.fetch(page, pageSize)}
        ></Pagination>
      </Fragment>
    );
  }
}
class ListItemTable extends React.Component {
  renderContent = (val, record, index) => {
    if (index == 0) {
      return {
        children: this.props.val,
        props: {
          rowSpan: this.props.len
        }
      };
    }
    return {
      children: this.props.price,
      props: {
        rowSpan: 0
      }
    };
  };

  columns = [
    {
      title: '商品',
      dataIndex: 'title',
      width: '40%',
      render: (title, record) => {
        const skuName = JSON.parse(record.sku_properties_name);

        if (skuName.length > 0) {
          return (
            <Fragment>
              <a href={record.goods_url} target="_blank" style={{ marginBottom: 10, display: 'inline-block' }}>
                {title}
              </a>
              <p style={{ margin: 0 }}>
                {skuName.map(item => (
                  <span key={item.k} style={{ marginRight: 10 }}>
                    {item.k + ':' + item.v}
                  </span>
                ))}
              </p>
            </Fragment>
          );
        }
      }
    },
    {
      title: '单价 / 数量',
      dataIndex: 'discount_price',
      width: '10%',
      align: 'center',
      render(discount_price, record) {
        return (
          <Fragment>
            <p>￥{formatThousands(discount_price)}</p>
            <p>{record.num}</p>
          </Fragment>
        );
      }
    },
    {
      title: '售后',
      dataIndex: 'refund_type',
      width: '10%',
      align: 'center',
      render: (val, record, index) => {
        if (val == '1') {
          return <Link to={`/onlineorder/action/${record.refund_id}`}>{status[record.refund_state]}</Link>;
        } else if (val == null) {
          return '';
        }
        return <Link to={`/onlineorder/action/${record.refund_id}`}>{status[60]}</Link>;
      }
    },
    {
      title: '买家/收货人',
      dataIndex: 'receiver_name',
      width: '10%',
      align: 'center',
      render: (val, record, index) => {
        if (index == 0) {
          return {
            children: (
              <Fragment>
                <p>{this.props.receiver_name}</p>
                <p>{this.props.receiver_tel}</p>
              </Fragment>
            ),
            props: {
              rowSpan: this.props.len
            }
          };
        }
        return {
          children: (
            <Fragment>
              <p>{this.props.receiver_name}</p>
              <p>{this.props.receiver_tel}</p>
            </Fragment>
          ),
          props: {
            rowSpan: 0
          }
        };
      }
    },
    {
      title: '实收金额',
      dataIndex: 'price',
      width: '10%',
      align: 'center',
      render: (val, record, index) => {
        if (index == 0) {
          return {
            children: `￥${formatThousands(this.props.price)}`,
            props: {
              rowSpan: this.props.len
            }
          };
        }
        return {
          children: `￥${formatThousands(this.props.price)}`,
          props: {
            rowSpan: 0
          }
        };
      }
    },
    {
      title: '订单状态',
      dataIndex: 'status_str',
      width: '10%',
      align: 'center',
      render: (val, record, index) => {
        if (index == 0) {
          return {
            children: val == '已发货' ? <span className="textSuccess">{val}</span> : <span className="textDelete">{val}</span>,
            props: {
              rowSpan: this.props.len
            }
          };
        }
        return {
          children: val == '已发货' ? <span className="textSuccess">{val}</span> : <span className="textDelete">{val}</span>,
          props: {
            rowSpan: 0
          }
        };
      }
    },
    {
      title: '操作',
      dataIndex: 'options',
      width: '10%',
      align: 'center',
      render: (options, record, index) => {
        if (index == 0) {
          if (record.status_str == '待发货') {
            return {
              children: (
                <SendGoods
                  onChange={this.props.onChange}
                  id={this.props.id}
                  tid={this.props.tid}
                  data={this.props.data}
                  receiver_tel={this.props.receiver_tel}
                  receiver_name={this.props.receiver_name}
                  address={this.props.address}
                ></SendGoods>
              ),
              props: {
                rowSpan: this.props.len
              }
            };
          } else {
            return {
              children: (
                <SendGoods
                  onChange={this.props.onChange}
                  receiver_tel={this.props.receiver_tel}
                  id={this.props.id}
                  tid={this.props.tid}
                  receiver_name={this.props.receiver_name}
                  address={this.props.address}
                  data={this.props.data}
                  disabled
                ></SendGoods>
              ),
              props: {
                rowSpan: this.props.len
              }
            };
          }
        }
        return {
          children: (
            <SendGoods
              id={this.props.id}
              onChange={this.props.onChange}
              tid={this.props.tid}
              receiver_tel={this.props.receiver_tel}
              receiver_name={this.props.receiver_name}
              address={this.props.address}
              data={this.props.data}
              disabled
            ></SendGoods>
          ),
          props: {
            rowSpan: 0
          }
        };
      }
    }
  ];

  render() {
    const { data, item, ...rest } = this.props;

    return (
      <div className={styles.listItem}>
        <div className={styles.listItemTitle}>
          <span>
            订单号：{item.tid} 下单时间：{moment(item.created).format('YYYY-MM-DD')}
          </span>
          <Link to={`/onlineorder/${item.tid}`}>查看详情</Link>
        </div>
        <Table {...rest} pagination={false} columns={this.columns} rowKey="oid" dataSource={data} bordered></Table>
      </div>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <div className={styles.onlineTable}>
        <OrderList id={this.props.id}></OrderList>
      </div>
    );
  }
}
