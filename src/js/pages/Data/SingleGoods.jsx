import React, { Fragment } from 'react';
import request from '~js/utils/request';
import { formatThousands, debounce } from '~js/utils/utils';
import styles from '~css/Data/SingleGoods.module.less';
import moment from 'moment';
import { Table, Row, Col, DatePicker, Button, Form, AutoComplete, Input, Icon } from 'antd';
import {
  getCurrMonth,
  getCurrWeek,
  getDatePickerValue,
  getLastWeek,
  getToday,
  getLast7Days,
  getYesterday
} from '~js/utils/date-fns';

const { Option } = AutoComplete;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@Form.create()
export default class App extends React.Component {
  state = {
    GoodsSource: [],
    staff_id: ''
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

  @debounce(150)
  handleSearch = value => {
    const { id } = this.props;

    value
      ? request('http://114.67.90.231:8888/local_order_management/goods_select', {
          method: 'post',
          body: { id: id, name: value }
        }).then(payload => this.setState({ GoodsSource: payload.pageData }))
      : [];
  };

  renderOption = item => {
    return (
      <Option key={item.item_id}>
        <div className="global-search-item">{'商品名称' + item.name + ' ' + '商品编号' + item.item_id}</div>
      </Option>
    );
  };

  onSelect = value => {
    const { GuideSource } = this.state;
    const GuideInfo = GuideSource.filter(item => item.staff_id == value)[0];
    this.setState({ item_id: GuideInfo.item_id });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { GoodsSource } = this.state;

    return (
      <div className={styles.singleGoods}>
        <h2 className="title">
          <span>单品销售查询</span>
        </h2>
        <Form onSubmit={this.handleSubmit}>
          <Row gutter={32}>
            <Col span={8}>
              <span className={styles.rowItem}>
                <label>模糊查询：</label>
                <AutoComplete
                  className="global-search"
                  style={{ width: 'calc(100% - 80px)' }}
                  dataSource={GoodsSource.map(this.renderOption)}
                  onSelect={this.onSelect}
                  onSearch={this.handleSearch}
                  placeholder="条码/自编码/名称/首字母/价格"
                  optionLabelProp="text"
                >
                  <Input suffix={<Icon type="search" />} />
                </AutoComplete>
              </span>
            </Col>
            <Col span={8}>
              <span className={styles.rowItem}>
                <label>选择时间：</label>
                {getFieldDecorator('dateRange', {
                  initialValue: getLast7Days()
                })(<RangePicker style={{ width: 'calc(100% - 80px)' }} allowClear={false} ranges={this.getDateRanges()} />)}
              </span>
            </Col>
          </Row>
          <Row gutter={32} style={{ marginTop: 24, marginBottom: 24 }}>
            <Col span={8}>
              <span className={styles.rowItem}>
                <Button htmlType="submit" type="primary" style={{ marginRight: 10 }}>
                  查询
                </Button>
                <Button htmlType="reset">重置</Button>
              </span>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
