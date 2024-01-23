import React from 'react';
import { Card, Col, Row } from 'antd';

import useDuties from '../../hooks/useDuties';
import AddDutyItemForm, { AddDutyItemFormProps } from '../../components/Duties/AddDutyItemForm';
import DutyListForm, { DutyListFormData } from '../../components/Duties/DutyListForm';
import { getHashValue } from '../../utils/getHashValue';

type DutiesContainerProps = {}

const DutiesConatiner: React.FC<DutiesContainerProps> = () => {

  const { duties, setDuties, initialDuites, updateDuties, isLoading } = useDuties();

  const handleAddDutyItemFormSubmit: AddDutyItemFormProps["onFormSubmit"] = (duty) => {
     // Add the duty 
    setDuties(prevDuties => [
      ...prevDuties,
      duty,
    ])
  };

  const handleDutiesFormSubmit = async (formData: DutyListFormData) => {
    try {
      const formDataDuties = Object.entries(formData).map(item => ({
        id: item[0],
        name: item[1]
      }))

      // Use hash to check if the duty items are modified or not
      const initialDutiesHashed = await getHashValue(JSON.stringify(initialDuites));
      const dutiesHashed = await getHashValue(JSON.stringify(formDataDuties));
      const isModified = dutiesHashed !== initialDutiesHashed;
      // Do not send update request if not modified
      if (!isModified) return;

      // Send update request 
      await updateDuties(formDataDuties);

    } catch (error) {
      // Handle error
      console.error(error)
    }

  };

  return (
    <Row
      justify="center"
      align="middle"
      gutter={[0, 20]}
      className="dutyies-container"
    >
      <Col
        xs={{ span: 23 }}
        sm={{ span: 23 }}
        md={{ span: 21 }}
        lg={{ span: 20 }}
        xl={{ span: 18 }}
      >
        <Card title="Add a new duty" data-testid="add-duty-item-form-card">
          <AddDutyItemForm onFormSubmit={handleAddDutyItemFormSubmit} />
        </Card>
      </Col>

      <Col
        xs={{ span: 23 }}
        sm={{ span: 23 }}
        md={{ span: 21 }}
        lg={{ span: 20 }}
        xl={{ span: 18 }}
      >
        <DutyListForm 
          duties={duties}
          onFormFinish={handleDutiesFormSubmit} 
          isLoading={isLoading}
        />
      </Col>
    </Row>
  );
};

export default DutiesConatiner;
