import React, { Component } from 'react';
import threeEntryPoint from '../../components/ThreeEntryPoint';

export default class Three extends Component {
  componentDidMount() {
    threeEntryPoint(this.threeRootElement);
  }
  render () {
      return (
        <div ref={element => this.threeRootElement = element} />
      );
  }
}