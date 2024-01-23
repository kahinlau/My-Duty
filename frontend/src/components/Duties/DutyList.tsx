import React from 'react';

import { List } from 'antd';

import DutyItem, { Duty, DutyProps } from './DutyItem';

export type DutyListProps = Pick<DutyProps, "isLoading"> & {
  duties: Duty[];
}

// Render Duty list
const DutyList: React.FC<DutyListProps> = ({
  duties,
  isLoading,
}) => {
  return (
    <List
      className="duty-list"
      dataSource={duties}
      renderItem={(duty) => (
        <DutyItem
          duty={duty}
          isLoading={isLoading}
        />
      )}
    />
  );
  

}
export default DutyList;