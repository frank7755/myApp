import React, { Fragment } from 'react';
import request from '~js/utils/request';
import moment from 'moment';
import { formatThousands } from '~js/utils/utils';
import styles from '~css/Cash/OnlineOrder.module.less';
import {
  Popconfirm,
  Icon,
  Divider,
  Pagination,
  Button,
  Modal,
  Form,
  Input,
  message,
  DatePicker,
  Select,
  Row,
  Alert,
  Col,
  Table
} from 'antd';
import FormSearch from '~js/components/FormSearch/';
import serveTable from '~js/components/serveTable';
import {
  getCurrMonth,
  getCurrWeek,
  getDatePickerValue,
  getLastWeek,
  getToday,
  getLast7Days,
  getYesterday
} from '~js/utils/date-fns';
const { Option } = Select;
const { RangePicker } = DatePicker;

const status = {
  '1': '买家已经申请退款，等待卖家同意',
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
      disabled: record.status != null // Column configuration not to be checked
    })
  };

  showModal = () => {
    this.setState({
      visible: true
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
        return status == null ? <span className="textDelete">未发货</span> : <span className="textSuccess">已发货</span>;
      }
    },
    {
      title: '运单号'
    }
  ];

  handleSend = () => {
    const { selectedRowKeys } = this.state;
    const { onChange } = this.props;

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
        onChange && onChange();
      })
      .catch(error => message.error(error.message));
  };

  render() {
    const { visible, selectedRowKeys } = this.state;

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

class OrderList extends React.Component {
  state = {
    listData: []
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

  handleSearch = ({ dateRange = [], ...rest }) => {
    const [start_time, end_time] = dateRange;

    request('http://114.67.90.231:8888/order_management/goods_select', {
      method: 'post',
      body: {
        id: this.props.id,
        type: 1,
        start_time: start_time,
        end_time: end_time,
        page: 1,
        pageSize: 10,
        ...rest
      }
    }).then(payload => {
      this.setState({ listData: payload.pageData });
    });
  };

  render() {
    const { listData } = this.state;

    return (
      <FormSearch onSearch={this.handleSearch}>
        {({ form }) => {
          const { getFieldDecorator } = form;

          return (
            <Fragment>
              <Row gutter={32} style={{ marginBottom: 24 }}>
                <Col span={8}>
                  <span className={styles.rowItem}>
                    <label>订单号：</label>
                    {getFieldDecorator('tid')(<Input placeholder="请输入订单号" style={{ width: 'calc(100% - 80px)' }} />)}
                  </span>
                </Col>
                <Col span={8}>
                  <span className={styles.rowItem}>
                    <label>订单类型：</label>
                    {getFieldDecorator('a', { initialValue: 0 })(
                      <Select style={{ width: 'calc(100% - 80px)' }}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>正常</Option>
                        <Option value={2}>作废</Option>
                      </Select>
                    )}
                  </span>
                </Col>
                <Col span={8}>
                  <span className={styles.rowItem}>
                    <label>维权状态：</label>
                    {getFieldDecorator('b', { initialValue: 0 })(
                      <Select style={{ width: 'calc(100% - 80px)' }}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>正常</Option>
                        <Option value={2}>作废</Option>
                      </Select>
                    )}
                  </span>
                </Col>
              </Row>
              <Row gutter={32} style={{ marginBottom: 24 }}>
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
                <Col span={8}>
                  <span className={styles.rowItem}>
                    <label>订单状态：</label>
                    {getFieldDecorator('b', { initialValue: 0 })(
                      <Select style={{ width: 'calc(100% - 80px)' }}>
                        <Option value={0}>全部</Option>
                        <Option value={1}>正常</Option>
                        <Option value={2}>作废</Option>
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
            </Fragment>
          );
        }}
      </FormSearch>
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
          return <a href={`#/onlineorder/action/${record.refund_id}`}>{status[record.refund_state]}</a>;
        } else if (val == null) {
          return '';
        }
        return <a href={`#/onlineorder/action/${record.refund_id}`}>{status[60]}</a>;
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
            children: this.props.price,
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
          <a href={`#/onlineorder/${item.tid}`}>查看详情</a>
        </div>
        <Table {...rest} pagination={false} columns={this.columns} dataSource={data} bordered></Table>
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
