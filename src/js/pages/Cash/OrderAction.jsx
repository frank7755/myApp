import React, { Fragment } from 'react';
import request from '~js/utils/request';
import styles from '~css/Cash/OrderAction.module.less';
import { Icon, Button } from 'antd';

export default class App extends React.Component {
  state = { data: {} };

  componentDidMount() {
    request('http://114.67.90.231:8888/order_management/goods_select', {
      method: 'post',
      body: {
        id: this.props.id,
        type: 3,
        refund_id: this.props.match.params.id
      }
    }).then(payload => this.setState({ data: payload.pageData }));
  }
  render() {
    const { data } = this.state;

    return (
      <div className={styles.orderAction}>
        <div className={styles.actionTop}>
          <div className={styles.info}>
            <h2>售后维权</h2>
            <div>
              <p></p>
            </div>
            <ul>
              <li>
                退款金额：<span className="textHighLight">{data.refund_fee}</span>
              </li>
              <li>
                维权原因：<span className="textHighLight">{data.refund_fee}</span>
              </li>
              <li>
                维权编号：<span className="textHighLight">{data.refund_fee}</span>
              </li>
              <li>
                订单编号：<span className="textHighLight">{data.refund_fee}</span>
              </li>
              <li>
                付款时间：<span className="textHighLight">{data.refund_fee}</span>
              </li>
              <li>
                实付金额：<span className="textHighLight">{data.refund_fee}</span>
              </li>
            </ul>
          </div>
          <div className={styles.action}>
            <Icon type="info-circle" style={{ fontSize: 20, color: '#006acc' }} />
            <div>
              <h2>等待商家处理退款申请</h2>
              <p>收到买家仅退款申请，请尽快处理。</p>
              <p>请在6天23小时43分钟48秒处理本次退款，如逾期未处理，将自动同意退款。</p>
              <div>
                <Button type="primary">同意买家退款</Button>
                <Button type="error">拒绝买家退款</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
