import React, { Fragment } from 'react';
import request from '~js/utils/request';
import { formatThousands } from '~js/utils/utils';
import moment from 'moment';
import styles from '~css/Goods/GoodsSearch.module.less';
import { history } from '~js/utils/utils';
import FormSearch from '~js/components/FormSearch/';
import serveTable from '~js/components/serveTable';
import {
  Input,
  DatePicker,
  Popconfirm,
  Col,
  Row,
  Button,
  Select,
  Table,
  Form,
  Drawer,
  message,
  Avatar,
  Modal,
  Checkbox
} from 'antd';
import {
  getCurrMonth,
  getCurrWeek,
  getDatePickerValue,
  getLastWeek,
  getToday,
  getLast7Days,
  getYesterday
} from '~js/utils/date-fns';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const { RangePicker } = DatePicker;
const { Option } = Select;

@Form.create()
class GoodsAction extends React.PureComponent {
  state = {
    visible: false
  };

  static expando = 0;

  showDrawer = () => {
    this.setState({ visible: true });
  };

  closeDrawer = () => {
    this.setState({ visible: false });
  };

  handleAddSubmit = e => {
    const { refresh, form } = this.props;

    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ visible: false });
        request('http://114.67.90.231:8888/insert_goods', {
          method: 'post',
          body: { ...values, id: this.props.id, user_name: this.props.user_name, user_id: this.props.user_id, status: 0 }
        }).then(payload => {
          message.success('添加成功！');
          form.resetFields();
          refresh();
        });
      }
    });
  };

  goodsAdd = () => {
    const { history } = this.props;

    history.push('/goodsadd');
  };

  render() {
    const { type, data } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Fragment>
        {type == 'add' ? (
          <Button type="primary" style={{ marginBottom: 3 }} icon="plus" onClick={this.showDrawer} onClick={this.goodsAdd}>
            添加商品
          </Button>
        ) : (
          <a style={{ margin: '0 5px' }} onClick={this.showDrawer}>
            编辑
          </a>
        )}
        <Drawer
          width={800}
          title={type == 'add' ? '新增商品' : '编辑商品'}
          closable={false}
          onClose={this.closeDrawer}
          visible={this.state.visible}
        >
          <Form
            onSubmit={type == 'add' ? this.handleAddSubmit : this.handleEditSubmit}
            className={`${styles.goodsOperate} fn-clear`}
          >
            <section>
              <FormItem label="商品名称">
                {getFieldDecorator('name', {
                  initialValue: data && data.name,
                  rules: [{ required: true, message: '请输入商品名称' }]
                })(<Input placeholder="请输入商品名称" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="库存量">
                {getFieldDecorator('inventory_quantity', {
                  initialValue: data && data.inventory_quantity,
                  rules: [{ required: true, message: '请输入库存量' }],
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  message: '请输入库存量',
                  getValueFromEvent: event => {
                    return event.target.value.replace(/\D/g, '');
                  }
                })(<Input placeholder="请输入库存量" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="销售价格">
                {getFieldDecorator('seling_price', {
                  initialValue: data && data.seling_price,
                  rules: [{ required: true, message: '请输入销售价格' }],
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  message: '请输入销售价格',
                  getValueFromEvent: event => {
                    return event.target.value.replace(/\D/g, '');
                  }
                })(<Input placeholder="请输入销售价格" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="库存下线">
                {getFieldDecorator('min_num', {
                  initialValue: data && data.min_num,
                  rules: [{ required: true, message: '请输入库存下线' }],
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  message: '请输入库存下线',
                  getValueFromEvent: event => {
                    return event.target.value.replace(/\D/g, '');
                  }
                })(<Input placeholder="请输入库存下线" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="商品单位">
                {getFieldDecorator('unit', {
                  initialValue: data && data.unit,
                  rules: [{ required: true, message: '请输入商品单位' }]
                })(<Input placeholder="请输入商品单位" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="货单编号">
                {getFieldDecorator('code_id', {
                  initialValue: data && data.code_id,
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  message: '请输入货单编号',
                  getValueFromEvent: event => {
                    return event.target.value.replace(/\D/g, '');
                  }
                })(<Input placeholder="请输入货单编号" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="供应商条码">
                {getFieldDecorator('s_code', {
                  initialValue: data && data.s_code
                })(<Input placeholder="请输入供应商条码" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="自定义条码">
                {getFieldDecorator('u_code', {
                  initialValue: data && data.u_code
                })(<Input placeholder="请输入自定义条码" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="商品链接">
                {getFieldDecorator('s_link', {
                  initialValue: data && data.s_link
                })(<Input placeholder="请输入商品链接" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="商品图片">
                {getFieldDecorator('s_photo', {
                  initialValue: data && data.s_photo
                })(<Input placeholder="请输入图片地址" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="商品分类">
                {getFieldDecorator('type_id', {
                  initialValue: data && data.type_id
                })(<Input placeholder="请输入商品分类" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="商品品类">
                {getFieldDecorator('unit_pinlei', {
                  initialValue: data && data.unit_pinlei
                })(<Input placeholder="请输入商品品类" />)}
              </FormItem>
            </section>
            <section>
              <FormItem label="阈值提醒">
                {getFieldDecorator('threshold_remind', {
                  initialValue: data && data.threshold_remind
                })(<Input placeholder="请输入阈值" />)}
              </FormItem>
            </section>
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px'
              }}
            >
              <Button
                style={{
                  marginRight: 8
                }}
                onClick={this.closeDrawer}
              >
                取消
              </Button>
              <Button htmlType="submit" type="primary">
                确定
              </Button>
            </div>
          </Form>
        </Drawer>
      </Fragment>
    );
  }
}

class ChangeGroup extends React.Component {
  state = {
    visible: false,
    data: [],
    secondData: [],
    thirdData: [],
    groupData: []
  };

  showModal = () => {
    request('http://114.67.90.231:8888/t_goods/term_select', {
      method: 'post',
      body: { type: 1 }
    }).then(payload =>
      this.setState({
        data: payload.pageData
      })
    );
    this.setState({
      visible: true
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  showSecondType = val => {
    request('http://114.67.90.231:8888/t_goods/term_select', {
      method: 'post',
      body: { type: 2, term_1_name: val.toString() }
    }).then(payload =>
      this.setState({
        secondData: payload.pageData
      })
    );
  };
  showThirdType = val => {
    request('http://114.67.90.231:8888/t_goods/term_select', {
      method: 'post',
      body: { type: 3, term_2_name: val.toString() }
    }).then(payload =>
      this.setState({
        thirdData: payload.pageData
      })
    );
  };

  getGroupData = val => {
    this.setState({ groupData: val.toString() });
  };

  confirm = () => {
    request('http://114.67.90.231:8888/t_goods/update_term', {
      method: 'post',
      body: {
        id: this.props.id,
        item_id: this.props.item_id,
        tag_ids: this.state.groupData
      }
    })
      .then(paylaod => message.success('修改成功'))
      .catch(error => message.error(error.message));
  };

  render() {
    const { data, secondData, thirdData } = this.state;

    return (
      <Fragment>
        {console.log(secondData)}

        <a style={{ margin: '0 5px' }} onClick={this.showModal}>
          改分组
        </a>
        <Modal
          className={styles.changeGroup}
          title="修改分组"
          onOk={this.confirm}
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >
          <div className={styles.groupItem}>
            <p style={{ fontWeight: 'bold' }}>一级:</p>
            <Checkbox.Group
              onChange={this.showSecondType}
              options={data.map(item => ({ label: item.term_1_name, value: item.term_1_name }))}
            ></Checkbox.Group>
          </div>
          {secondData.length ? (
            <div className={styles.groupItem}>
              <p style={{ fontWeight: 'bold' }}>二级:</p>
              <Checkbox.Group
                onChange={this.showThirdType}
                options={secondData.map(item => ({ label: item.term_2_name, value: item.term_2_name }))}
              ></Checkbox.Group>
            </div>
          ) : (
            ''
          )}
          {thirdData.length ? (
            <div className={styles.groupItem}>
              <p style={{ fontWeight: 'bold' }}>三级:</p>
              <Checkbox.Group
                onChange={this.getGroupData}
                options={thirdData.map(item => ({ label: item.name, value: item.term_id }))}
              ></Checkbox.Group>
            </div>
          ) : (
            ''
          )}
        </Modal>
      </Fragment>
    );
  }
}

@serveTable()
class GoodsTable extends React.Component {
  columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 200,
      render(name, record) {
        return <a href={record.share_url}>{name}</a>;
      }
    },
    {
      title: '库存',
      dataIndex: 'quantity',
      width: 200
    },
    {
      title: '价格',
      dataIndex: 'price',
      width: 200,
      render(seling_price) {
        return '￥' + formatThousands(seling_price);
      }
    },
    {
      title: '状态',
      dataIndex: 'is_display',
      width: 200,
      render(is_display) {
        return is_display == '1' ? (
          <span style={{ color: '#31c105' }}>已上架</span>
        ) : (
          <span style={{ color: '#fc5050' }}>未上架</span>
        );
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      width: 200,
      render(create_time) {
        return moment(create_time).format('YYYY-MM-DD');
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 200,
      render: (option, record) => {
        return (
          <Fragment>
            <a>编辑</a>
            <ChangeGroup id={this.props.id} item_id={record.item_id}></ChangeGroup>
            {record.is_display == 1 ? (
              <a style={{ margin: '0 5px' }} onClick={() => this.handleOff(this.props.id, record.item_id)}>
                下架
              </a>
            ) : (
              <a style={{ margin: '0 5px' }} onClick={() => this.handleOn(this.props.id, record.item_id)}>
                上架
              </a>
            )}
            <Popconfirm
              title="确定要删除商品吗？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => this.handleDelete(this.props.id, record.item_id)}
            >
              <a style={{ margin: '0 5px', color: 'red' }}>删除</a>
            </Popconfirm>
          </Fragment>
        );
      }
    }
  ];

  handleDelete = (id, item_id) => {
    request('http://114.67.90.231:8888/t_goods/delete', {
      method: 'post',
      body: {
        id: id,
        item_id: item_id
      }
    })
      .then(payload => {
        this.refresh();
        message.success('删除成功');
      })
      .catch(error => message.error(error.message));
  };
  handleOn = (id, item_id) => {
    const { table } = this.props;

    request('http://114.67.90.231:8888/t_goods/upload_goods', {
      method: 'post',
      notify: true,
      body: {
        id: id,
        item_id: item_id
      }
    })
      .then(payload => {
        this.refresh();
      })
      .catch(error => message.error(error.message));
  };

  handleOff = (id, item_id) => {
    const { table } = this.props;

    request('http://114.67.90.231:8888/t_goods/unload_goods', {
      method: 'post',
      notify: true,
      body: {
        id: id,
        item_id: item_id
      }
    })
      .then(payload => {
        this.refresh();
      })
      .catch(error => message.error(error.message));
  };

  handleSearch = ({ dateRange = [], ...rest }) => {
    const { id } = this.props;
    const { table } = this.props;
    const [start_time, end_time] = dateRange;

    table.search({ ...rest, id, start_time, end_time }, { ...table.pagination, current: 1 });
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
    const { table, supply, user_name, user_id, ...restProps } = this.props;

    return (
      <Fragment>
        <h2 className="title">
          <span>商品</span>
          <GoodsAction
            type="add"
            id={this.props.id}
            refresh={this.refresh}
            user_name={user_name}
            history={history}
            user_id={user_id}
          ></GoodsAction>
        </h2>
        <FormSearch onSearch={this.handleSearch}>
          {({ form }) => {
            const { getFieldDecorator } = form;
            return (
              <Fragment>
                <Row gutter={32}>
                  <Col span={8}>
                    <span className={styles.rowItem}>
                      <label>商品名称：</label>
                      {getFieldDecorator('name')(
                        <Input placeholder="名称，条形码，自编码..." style={{ width: 'calc(100% - 80px)' }} />
                      )}
                    </span>
                  </Col>
                  <Col span={8}>
                    <span className={styles.rowItem}>
                      <label>商品状态：</label>
                      {getFieldDecorator('is_display', { initialValue: 1 })(
                        <Select style={{ width: 'calc(100% - 80px)' }}>
                          <Option value={1}>已上架</Option>
                          <Option value={0}>未上架</Option>
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
                <Row gutter={32}>
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
  componentDidMount() {}
  render() {
    return (
      <div className={styles.goodManage}>
        <GoodsTable source={`http://114.67.90.231:8888/t_goods/select`} id={this.props.id}></GoodsTable>
      </div>
    );
  }
}
