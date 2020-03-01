import React, { Fragment } from 'react';
import styles from '~css/Goods/GoodsAdd/Real.module.less';
import { Form, Input, Select, Upload, Icon, Modal, Button, Table, Row, Col } from 'antd';
// import BraftEditor from 'braft-editor';
// // 引入编辑器样式
// import 'braft-editor/dist/index.css';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  }
};

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: []
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true
    });
  };

  beforeUpload = file => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('请上传jpg，png或gif格式图片');
    }
    const isLt2M = file.size / 1024 / 1024 < 1;
    if (!isLt2M) {
      message.error('图片大小不超过1MB!');
    }
    this.setState({
      fileList: isJpgOrPng && isLt2M ? [...this.state.fileList, file] : []
    });
    return false;
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.beforeUpload}
        >
          {fileList.length >= 15 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

let id = 0;

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
        <a onClick={this.add}>添加规格值</a>
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
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 }
      }
    };
    const { ruleKey } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        {ruleKey.map((k, index) => (
          <Fragment key={k}>
            <FormItem label="商品规格" onChange={this.getData}>
              {getFieldDecorator(`k${k}`)(<Input type="text"></Input>)}
              <a
                onClick={() => this.remove(k)}
                style={{ position: 'absolute', display: 'inline-block', marginLeft: 15, whiteSpace: 'nowrap' }}
              >
                删除
              </a>
            </FormItem>
            <DynamicFieldSet count={k} form={this.props.form} onChage={() => this.getSeconVal(val)}></DynamicFieldSet>
          </Fragment>
        ))}
        <Form.Item {...formItemLayoutWithOutLabel}>
          <Button type="dashed" disabled={ruleKey.length >= 3} onClick={this.add}>
            <Icon type="plus" /> Add field
          </Button>
        </Form.Item>
      </Fragment>
    );
  }
}

@Form.create()
export default class App extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        <Form {...formItemLayout} className={styles.realFrom}>
          <h2 className="title">
            <span>基本信息</span>
          </h2>
          <FormItem label="商品名称">
            {getFieldDecorator('name', {
              rules: [{ required: true, message: '请输入商品名称' }]
            })(<Input placeholder="请输入商品名称" />)}
          </FormItem>
          <FormItem
            label="分享描述"
            help={
              <p>
                微信分享给好友时会显示,建议36个字以内 <a>查看示例</a>
              </p>
            }
          >
            {getFieldDecorator('name')(<Input />)}
          </FormItem>
          <FormItem
            label="商品卖点"
            help={
              <p>
                在商品列表页，详情页标题下面展示卖点信息,建议60字以内 <a>查看示例</a>
              </p>
            }
          >
            {getFieldDecorator('name')(<Input />)}
          </FormItem>
          <FormItem label="商品图" help="建议尺寸800*800，最多上传15张图片">
            {getFieldDecorator('image', {
              rules: [{ required: true, message: '请输入商品名称' }]
            })(<PicturesWall></PicturesWall>)}
          </FormItem>
          <FormItem label="商品分组">
            {getFieldDecorator('group', {
              rules: [{ required: true, message: '请选择商品分组' }]
            })(
              <Select>
                <Option value={1}>衣服</Option>
                <Option value={0}>裤子</Option>
              </Select>
            )}
          </FormItem>
          <h2 className="title">
            <span>价格库存</span>
          </h2>
          <RulesSet></RulesSet>
          <FormItem label="划线价">{getFieldDecorator('origin_price')(<Input type="text"></Input>)}</FormItem>
          <h2 className="title">
            <span>商品详情</span>
          </h2>
          <BraftEditor></BraftEditor>
        </Form>
      </Fragment>
    );
  }
}
