/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import Tetris from '../src/screens/Tetris';

import {configure, shallow} from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders app correctly', () => {
  renderer.create(<App />);
});

it('renders Tetris component correctly', () => {
  renderer.create(<Tetris />);
});

describe('Tetris component', () => {
  it('renders twenty rows', () => {
    const tetrisComponent = shallow(<Tetris />);
    expect(
      tetrisComponent.findWhere((node) => node.prop('testID') === 'tetris-row'),
    ).toHaveLength(20);
  });

  it('a row renders ten cells', () => {
    const tetrisComponent = shallow(<Tetris />);
    expect(
      tetrisComponent
        .findWhere((node) => node.prop('testID') === 'tetris-row')
        .first()
        .dive()
        .findWhere((node) => node.prop('testID') === 'tetris-cell'),
    ).toHaveLength(10);
  });
});
