import React from 'react'
import { Error } from './error'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<Error message="test" />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})