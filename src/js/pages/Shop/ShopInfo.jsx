import React, { Fragment } from "react";
import request from "~js/utils/request";
import styles from "~css/Shop/ShopInfo.module.less";
import { getProvince } from "~js/utils/address.js";
import { Upload, Icon, Modal, Empty, Button, Form, Cascader } from "antd";

getProvince();

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
    previewImage: "",
    fileList: [
      {
        uid: "-1",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        uid: "-2",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        uid: "-3",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        uid: "-4",
        name: "image.png",
        status: "done",
        url:
          "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      },
      {
        uid: "-5",
        name: "image.png",
        status: "error"
      }
    ]
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

  handleChange = ({ fileList }) => this.setState({ fileList });

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    return (
      <div className={`${styles.upload} clearfix`}>
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

@Form.create()
class AddShop extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Fragment>
        <Button icon="plus-circle" type="primary">
          我要开店
        </Button>
        <Modal
          title="我要开店"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="门店名称">
              {getFieldDecorator("shop_name", {
                rules: [{ required: true, message: "请输入门店名称!" }]
              })(<Input placeholder="请输入门店名称" />)}
            </Form.Item>
            <Form.Item label="简称">
              {getFieldDecorator("shop_jc", {
                rules: [{ required: true, message: "请输入门店简称!" }]
              })(<Input placeholder="请输入门店简称" />)}
            </Form.Item>
            <Form.Item label="门店地址">
              {getFieldDecorator("shop_jc", {
                rules: [{ required: true, message: "请输入门店简称!" }]
              })(<Input placeholder="请输入门店简称" />)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default class App extends React.Component {
  state = {
    userInfo: null
  };

  componentDidMount() {
    request(`http://114.67.90.231:8888/select_shop`, {
      method: "POST",
      body: {
        id: this.props.id
      }
    }).then(payload => this.setState({ userInfo: payload }));
  }
  render() {
    const { userInfo } = this.state;

    return (
      <div className={styles.shop}>
        {userInfo ? (
          <Fragment>
            <h2>门店信息</h2>
            <ul className={styles.userInfo}>
              <li>门店名称：{userInfo.shop_name}</li>
              <li>门店简称：{userInfo.shop_jc}</li>
              <li className={styles.full}>门店地址：{userInfo.address}</li>
              <li className={styles.full}>
                门店logo：<PicturesWall></PicturesWall>
                <p></p>
              </li>
            </ul>
          </Fragment>
        ) : (
          <div className={styles.noData}>
            <h2>
              <Button icon="plus-circle" type="primary">
                我要开店
              </Button>
            </h2>
            <div className={styles.empty}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无店铺信息"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
