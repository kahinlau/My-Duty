import React from 'react';

import { Button, Card, Form, FormProps } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

import DutyList, { DutyListProps } from './DutyList';
import { Duty } from './DutyItem';

export type DutyListFormData = {
  [key: Duty["id"]]: Duty["name"]
};

type DutyListFormProps = DutyListProps & {
  onFormFinish: FormProps<DutyListFormData>["onFinish"];
};

// Wrap the DutyList and save button with Form
const DutyListForm: React.FC<DutyListFormProps> = ({
  duties,
  onFormFinish,
  isLoading,
}) => {
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      onFinish={onFormFinish}
      className="duty-form"
    >
      <Card title="Duty List" extra={
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={isLoading}
          htmlType="submit"
        >
          Save
        </Button>
      }>
        <DutyList duties={duties} isLoading={isLoading} />
      </Card>
    </Form>
  );
  

}
export default DutyListForm;