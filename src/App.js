import React, {Component} from 'react';
import Navigation from './components/Navigation/Navigation'
import Signin from './components/SignIn/Signin'
import Register from './components/Register/Register'
import Logo from './components/Logo/Logo'
import ImageLinkForm  from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import './App.css';


const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area:800
      }
    }
  }
}

const initialState = {
  input: '',
  imageUrl:'',
  box: {},
  route:'signin',
  isSignedIn: false,
  user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  calculateFaceLocation = (data) => {
    const clarficaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarficaiFace.left_col * width,
      topRow: clarficaiFace.top_row * height,
      rightCol: width - (clarficaiFace.right_col * width),
      bottomRow: height - (clarficaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (x) => {
    this.setState({box: x});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl:this.state.input});
    fetch('http://localhost:3000/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input,
              })
          })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id,
              })
          })
          .then(response =>response.json())
          .then(count => {
            console.log(count, 'count')
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.entries,
    }})
  }

  render() {
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <Particles  className='particles'
                params={particleOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div> 
          : (
              route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
    );
  }
}

export default App;
