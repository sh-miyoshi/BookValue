import React from 'react'
import { HyperLink } from './hyperLink'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<HyperLink url="https://www.google.com/" />)
    .toJSON();
  expect(tree).toMatchSnapshot();
})