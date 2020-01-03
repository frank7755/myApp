import React, { Fragment } from "react";
import request from "~js/utils/request";
import styles from "~css/Shop/ShopInfo.module.less";
import {
  Upload,
  Icon,
  Modal,
  Empty,
  Button,
  Form,
  message,
  Select,
  Input,
  Spin
} from "antd";

const { Option } = Select;

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

class Address extends React.Component {
  state = {
    province: [],
    city: [],
    area: [],
    value: this.props.value
      ? this.props.value
      : { province: -1, city: -1, area: -1, address: "" }
  };

  componentDidMount() {
    this.getProvince();

    const { value } = this.props;

    if (value) {
      this.getCity(value.province);
      this.getArea(value.city);
    }
  }

  componentDidUpdate({ value: prevValue }) {
    const { value } = this.props;

    if (value) {
      //   console.log(prevValue.province, value.province);
      (!prevValue || prevValue.province !== value.province) &&
        this.getCity(value.province);
      (!prevValue || prevValue.city !== value.city) && this.getArea(value.city);
    }
  }

  getProvince = () => {
    request("http://114.67.90.231:8888/province", {
      method: "post",
      body: { id: this.props.id }
    }).then(payload => {
      this.setState({ province: payload });
    });
  };

  getCity = provinceCode => {
    provinceCode &&
      provinceCode != -1 &&
      request("http://114.67.90.231:8888/city", {
        method: "post",
        body: { provincecode: provinceCode }
      }).then(payload => this.setState({ city: payload }));
  };

  getArea = cityCode => {
    cityCode &&
      cityCode != -1 &&
      request("http://114.67.90.231:8888/area", {
        method: "post",
        body: { citycode: cityCode }
      }).then(payload => this.setState({ area: payload }));
  };

  handleProvinceChange = province => {
    const { value } = this.state;
    const nextValue = { ...value, province, city: -1, area: -1 };

    this.getCity(province);
    this.setState({ value: nextValue, city: [], area: [] });
    province !== value.province && this.triggerChange(nextValue);
  };

  handleCityChange = city => {
    const { value } = this.state;
    const nextValue = { ...value, city, area: -1 };

    this.getArea(city);
    this.setState({ value: nextValue, area: [] });
    city !== value.city && this.triggerChange(nextValue);
  };

  handleAreaChange = area => {
    const { value } = this.state;
    const nextValue = { ...value, area };

    this.setState({ value: nextValue });
    area !== value.area && this.triggerChange(nextValue);
  };

  handleaddress = e => {
    const { value } = this.state;
    const address = e.target.value;

    this.setState({ value: { ...value, address } });
    this.triggerChange({ address });
  };

  triggerChange = value => {
    const { onChange } = this.props;

    onChange && onChange(value);
  };

  render() {
    const { province, city, area, value } = this.state;

    return (
      <div>
        <span className={styles.location}>
          <Select
            value={value.province}
            placeholder="省"
            onChange={this.handleProvinceChange}
          >
            <Option value={-1}>请选择</Option>
            {province &&
              province.map(item => (
                <Option key={item.provincecode} value={item.provincecode}>
                  {item.name}
                </Option>
              ))}
          </Select>
          <Select
            value={value.city}
            placeholder="市"
            onChange={this.handleCityChange}
          >
            <Option value={-1}>请选择</Option>
            {city &&
              city.map(item => (
                <Option key={item.citycode} value={item.citycode}>
                  {item.name}
                </Option>
              ))}
          </Select>
          <Select
            value={value.area}
            placeholder="区"
            onChange={this.handleAreaChange}
          >
            <Option value={-1}>请选择</Option>
            {area &&
              area.map(item => (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              ))}
          </Select>
        </span>
        <p>
          <Input
            onChange={this.handleaddress}
            type="text"
            value={value.address}
            placeholder="请输入详细地址"
          ></Input>
        </p>
      </div>
    );
  }
}

@Form.create()
class ShopManage extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleAddOk = e => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        const { location, ...rest } = values;

        request("http://114.67.90.231:8888/create_shop", {
          method: "post",
          body: { ...rest, ...location, id: this.props.id }
        }).then(payload => {
          this.setState({
            visible: false
          });
          this.props.refresh();
        });
      }
    });
  };

  handleEditOk = e => {
    this.props.form.validateFields((error, values) => {
      console.log(values);
      if (!error) {
        const { location, ...rest } = values;

        request("http://114.67.90.231:8888/update_shop", {
          method: "post",
          body: { ...rest, ...location, id: this.props.id }
        })
          .then(payload => {
            this.setState({
              visible: false
            });
            this.props.refresh();
          })
          .catch(err => message.error(err.message));
      }
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { id, type, data } = this.props;

    return (
      <Fragment>
        {type == "add" ? (
          <Button icon="plus" type="primary" onClick={this.showModal}>
            我要开店
          </Button>
        ) : (
          <Button icon="edit" type="primary" onClick={this.showModal}>
            编辑
          </Button>
        )}
        <Modal
          title={type == "add" ? "我要开店" : "编辑"}
          visible={this.state.visible}
          onOk={type == "add" ? this.handleAddOk : this.handleEditOk}
          onCancel={this.handleCancel}
          okText="确定"
          cancelText="取消"
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="门店名称">
              {getFieldDecorator("shop_name", {
                initialValue: data && data.shop_name,
                rules: [{ required: true, message: "请输入门店名称!" }]
              })(<Input placeholder="请输入门店名称" />)}
            </Form.Item>
            <Form.Item label="门店简称">
              {getFieldDecorator("shop_jc", {
                initialValue: data && data.shop_jc,
                rules: [{ required: true, message: "请输入门店简称!" }]
              })(<Input placeholder="请输入门店简称" />)}
            </Form.Item>
            <Form.Item label="门店地址">
              {getFieldDecorator("location", {
                initialValue: data && {
                  province: data.province_code,
                  city: data.city_code,
                  area: data.area_code,
                  address: data.address
                },
                rules: [
                  {
                    required: true,
                    validator: (_rule, value, callback) => {
                      if (
                        value == null ||
                        value.province == null ||
                        value.city == null ||
                        value.area == null ||
                        value.address == null
                      ) {
                        callback("请输入完整地址！");
                      } else {
                        callback();
                      }
                    }
                  }
                ]
              })(<Address id={id}></Address>)}
            </Form.Item>
          </Form>
        </Modal>
      </Fragment>
    );
  }
}

export default class App extends React.Component {
  state = {
    loading: false,
    userInfo: null
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ loading: true });
    request(`http://114.67.90.231:8888/select_shop`, {
      method: "POST",
      body: {
        id: this.props.id
      }
    })
      .then(payload => this.setState({ userInfo: payload, loading: false }))
      .catch(error => {
        message.error(error.message);
        this.setState({ loading: false });
      });
  };

  render() {
    const { userInfo, loading } = this.state;
    const { id } = this.props;

    return (
      <div className={styles.shop}>
        {userInfo ? (
          <Spin spinning={loading} delay={150}>
            <h2 className="title">
              <span>门店信息</span>
              <ShopManage
                data={userInfo}
                refresh={this.refresh}
                id={id}
              ></ShopManage>
            </h2>
            <ul className={styles.userInfo}>
              <li>门店名称：{userInfo.shop_name}</li>
              <li>门店简称：{userInfo.shop_jc}</li>
              <li className={styles.full}>门店地址：{userInfo.address}</li>
              <li className={styles.full}>
                门店logo：<PicturesWall></PicturesWall>
                <p></p>
              </li>
            </ul>
          </Spin>
        ) : (
          !loading && (
            <div className={styles.noData}>
              <h2>
                <ShopManage
                  type="add"
                  refresh={this.refresh}
                  id={id}
                ></ShopManage>
              </h2>
              <div className={styles.empty}>
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="暂无店铺信息"
                />
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}
