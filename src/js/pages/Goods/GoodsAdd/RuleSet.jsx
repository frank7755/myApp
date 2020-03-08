import React, { Fragment } from 'react';
import { Form, Input, Icon, Button, Row, Col } from 'antd';
import styles from '~css/Goods/GoodsAdd/RuleSet.module.less';

const FormItem = Form.Item;

let id = 0;

@Form.create()
class DynamicFieldSet extends React.Component {
  remove = k => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { keys, names } = values;
        console.log('Received values of form: ', values);
        console.log(
          'Merged values:',
          keys.map(key => names[key])
        );
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');

    return (
      <Fragment>
        {keys.map((k, index) => (
          <Fragment>
            <Form.Item
              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              label={index === 0 ? 'Passengers' : ''}
              required={false}
              key={k}
            >
              {getFieldDecorator(`names[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: "Please input passenger's name or delete this field."
                  }
                ]
              })(<Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />)}
              {keys.length > 1 ? (
                <Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k)} />
              ) : null}
            </Form.Item>
          </Fragment>
        ))}
        <a onClick={this.add} style={{ marginBottom: 16, display: 'inline-block', marginTop: 16, marginLeft: 80 }}>
          添加规格值
        </a>
      </Fragment>
    );
  }
}

let rKey = 0;
@Form.create()
class RulesSet extends React.Component {
  state = {
    ruleKey: [],
    skus: []
  };

  add = () => {
    this.setState({ ruleKey: this.state.ruleKey.concat(++rKey) });
  };

  remove = k => {
    const { ruleKey } = this.state;
    --rKey;
    console.log(rKey, ruleKey);
    this.setState({ ruleKey: ruleKey.filter(key => key != k) });
  };

  getData = () => {
    this.props.form.validateFields((err, value) => {
      if (!err) {
        console.log(value);
      }
    });
  };

  getSeconVal = val => {
    // {`v${rKey}`:val}
    // this.setState({ skus: this.state.skus.concat() });
  };

  render() {
    const { ruleKey } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        {ruleKey.map((k, index) => (
          <Fragment key={k}>
            <Row>
              <Col span={8} offset={4} className={styles.addRuleName}>
                <label>规格名:</label>
                {getFieldDecorator(`k${k}`)(<Input type="text" style={{ width: 'calc(100% - 120px)' }}></Input>)}
                <a onClick={() => this.remove(k)} style={{ marginLeft: 10 }}>
                  删除
                </a>
              </Col>
            </Row>
            <Row>
              <Col span={8} offset={4}>
                <DynamicFieldSet count={k} form={this.props.form} onChage={() => this.getSeconVal(val)}></DynamicFieldSet>
              </Col>
            </Row>
          </Fragment>
        ))}
        <Row gutter={12} style={{ marginBottom: 24 }}>
          <Col span={8} offset={4}>
            <Button type="dashed" disabled={ruleKey.length >= 3} onClick={this.add} style={{ marginLeft: 80 }}>
              <Icon type="plus" /> 添加规格
            </Button>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default class App extends React.Component {
  render() {
    return (
      <div className={styles.ruleSet}>
        <h2 className="title">
          <span>添加规格</span>
        </h2>
        <RulesSet></RulesSet>
      </div>
    );
  }
}
