/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';
import Tetris from '../src/screens/Tetris';
import {clearGrid, createGrid} from '../src/logic';

import {configure, shallow} from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()});

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// RENDERING

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

// GRID FUNCTIONS
describe('grid helper methods', () => {
  it('createGrid generate a valid 10x40 multidimensional array', () => {
    expect(createGrid()).toHaveLength(40);
    expect(createGrid()[0]).toHaveLength(10);
  });

  it('clearGrid set all the cells with "clear" field to 0', () => {
    const grid = [
      [
        {state: 'clear', value: 0},
        {state: 'clear', value: 0},
        {state: 'clear', value: 0},
      ],
      [
        {state: 'clear', value: 0},
        {state: 'clear', value: 1},
        {state: 'clear', value: 0},
      ],
      [
        {state: 'clear', value: 0},
        {state: 'merged', value: 1},
        {state: 'clear', value: 0},
      ],
    ];
    const expectedResult = [
      [
        {state: 'clear', value: 0},
        {state: 'clear', value: 0},
        {state: 'clear', value: 0},
      ],
      [
        {state: 'clear', value: 0},
        {state: 'clear', value: 0},
        {state: 'clear', value: 0},
      ],
      [
        {state: 'clear', value: 0},
        {state: 'merged', value: 1},
        {state: 'clear', value: 0},
      ],
    ];

    expect(clearGrid(grid)).toEqual(expectedResult);
  });
});
