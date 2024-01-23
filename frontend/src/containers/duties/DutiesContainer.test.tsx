import {cleanup, render} from '@testing-library/react';
import DutiesConatiner from '.';

beforeAll(() => {
  global.matchMedia = global.matchMedia || function () {
    return {
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };
});

afterEach(cleanup);

it('CheckboxWithLabel changes the text after click', () => {
  const {getByTestId} = render(
    <DutiesConatiner/>,
  );

  expect(getByTestId(/card/i)).toBeTruthy();
});