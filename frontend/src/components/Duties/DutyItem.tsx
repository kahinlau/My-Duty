"use strict";

import React from 'react';
import { List, Skeleton, Input, Form } from 'antd';

export type Duty = {
  id: string;
  name: string;
}

export type DutyProps = {
  duty: Duty;
  isLoading: boolean;
};

// Render Duty Item
const DutyItem: React.FC<DutyProps> = ({
  duty,
  isLoading,
}) => {
  return (
    <List.Item
      key={duty.id}
    >
      <Skeleton title={false} paragraph={{ rows: 1 }} loading={isLoading} active>
        <List.Item.Meta
          title={
            <Form.Item
              name={duty.id}
              rules={[{ required: true, message: 'Required field' }]}
              initialValue={duty.name}
            >
              <Input />
            </Form.Item>
          }
        />
      </Skeleton>
    </List.Item>
  );
};


export default DutyItem;