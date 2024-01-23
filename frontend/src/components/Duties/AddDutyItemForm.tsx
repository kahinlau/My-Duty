import React from 'react';
import { Form, Row, Col, Button, Input } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import { v4 as uuidv4 } from 'uuid';

import { Duty } from './DutyItem';

export type AddDutyItemFormProps =  {
  onFormSubmit: (duty: Duty) => void;
};

const AddDutyItemForm: React.FC<AddDutyItemFormProps> = ({ onFormSubmit }) => {
  const [form] = Form.useForm();

  const onFinish = () => {
    // Use 'temp-' as prefix to indicate new duty item
    onFormSubmit({
      id: `temp-${uuidv4()}`,
      name: form.getFieldValue('name'),
    });
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
    >
      <Row gutter={20}>
        <Col xs={24} sm={24} md={16} lg={20} xl={20}>
          <Form.Item
            name={'name'}
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input placeholder="Add your duty here" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={4} xl={4}>
          <Button type="primary" htmlType="submit">
            <PlusCircleFilled />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddDutyItemForm;