import React, { Fragment } from 'react';
import { Form, Input, Icon, Button, Row, Col } from 'antd';
import styles from '~css/Goods/GoodsAdd/RuleSet.module.less';

const FormItem = Form.Item;

class DynamicFieldSet extends React.Component {
  state = {
    id: 0,
    mapKey: [],
    skus: []
  };

  add = () => {
    this.setState({ id: ++this.state.id }, () => {
      this.setState({ mapKey: this.state.mapKey.concat(this.state.id) });
    });
  };

  remove = key => {
    const { mapKey } = this.state;
    this.setState({
      mapKey: mapKey.filter(item => item != key)
    });
  };

  render() {
    const { mapKey } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { count } = this.props;

    return (
      <div className={styles.addRule} onChange={this.handleChange}>
        <label style={{ width: 80 }}>规格值:</label>
        <section className={styles.mapName}>
          {mapKey.map(key => (
            <span key={key}>
              {getFieldDecorator(`v${count}_${key}`, {
                rules: [{ required: true, message: '请填写规格值' }]
              })(<Input type="text" style={{ width: 120 }}></Input>)}
              <Icon type="minus-circle" style={{ marginRight: 10 }} onClick={() => this.remove(key)} />
            </span>
          ))}
          <a onClick={this.add}>添加规格值</a>
        </section>
      </div>
    );
  }
}

class RulesSet extends React.Component {
  state = {
    val: {}
  };

  getData = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        const { val } = this.state;
        const itemValue = this.props.form.getFieldsValue();
        this.setState({
          val: itemValue
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { k } = this.props;

    return (
      <div className={styles.ruleSetBox}>
        <Row>
          <Col span={20} offset={4} className={styles.addRuleName}>
            <label>规格名:</label>
            {getFieldDecorator(`k${k}`)(<Input type="text" style={{ width: 'calc(100% - 120px)' }}></Input>)}
          </Col>
        </Row>
        <Row style={{ marginTop: 24 }}>
          <Col span={20} offset={4}>
            <DynamicFieldSet count={k} form={this.props.form}></DynamicFieldSet>
          </Col>
        </Row>
      </div>
    );
  }
}

let rKey = 0;
@Form.create()
export default class App extends React.Component {
  state = {
    ruleKey: [],
    skus: []
  };

  add = () => {
    const { ruleKey } = this.state;

    this.setState({ ruleKey: ruleKey.concat(++rKey) });
  };

  remove = k => {
    --rKey;
    const { ruleKey } = this.state;

    this.setState({ ruleKey: ruleKey.filter(key => key != k) });
  };

  // getAllValues = val => {
  //   const { skus } = this.state;
  //   this.setState({
  //     skus: skus.concat(val)
  //   });
  // };
  handleSubmit = e => {
    e.preventDefault();

    const value = this.props.form.getFieldsValue();
    console.log('11');
    console.log(value);
  };

  render() {
    const { ruleKey, skus } = this.state;

    return (
      <div className={styles.ruleSet}>
        <h2 className="title">
          <span>添加规格</span>
        </h2>
        <Form>
          {ruleKey.map((k, index) => (
            <div key={k} className={styles.ruleBox}>
              <RulesSet form={this.props.form} k={k}></RulesSet>
              <a onClick={() => this.remove(k)} style={{ marginLeft: 10 }}>
                删除
              </a>
            </div>
          ))}
          <Row gutter={12} style={{ marginBottom: 24 }}>
            <Col span={6} offset={4}>
              <Button type="dashed" disabled={ruleKey.length >= 3} onClick={this.add} style={{ marginLeft: 80 }}>
                <Icon type="plus" /> 添加规格
              </Button>
              <Button type="primary" onClick={this.handleSubmit} style={{ marginLeft: 10 }}>
                确定
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
