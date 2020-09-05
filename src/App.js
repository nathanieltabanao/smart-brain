import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
    }
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;

    return (
      <div className='App'>
        <p>Hello World</p>
      </div>
    )
  }
}

export default App;
