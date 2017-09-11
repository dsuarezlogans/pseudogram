import React, { Component } from 'react';
import Firebase from 'firebase';

import FileUpload from './FileUpload';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      user: null,
      pictures: []
    }

    this.handleAuth = this.handleAuth.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleUpload =  this.handleUpload.bind(this);
  }

  componentWillMount () {
    Firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });

    Firebase.database().ref('pictures').on('child_added', snapshot => {
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
  }

  handleAuth() {
    const provider = new Firebase.auth.GoogleAuthProvider();

    Firebase.auth().signInWithPopup(provider)
      .then(res => console.log(`${res.user.email} ha iniciado sesion`))
      .catch(err => console.log(`Error ${err.code}: ${err.message}`));
  }

  handleLogout() {    
    Firebase.auth().signOut()
      .then(res => console.log(`ha iniciado cerrado sesion`))
      .catch(err => console.log(`Error ${err.code}: ${err.message}`));
  }

  handleUpload(event) {
        const file = event.target.files[0];
        const storageRef = Firebase.storage().ref(`/fotos/${file.name}`);
        const task = storageRef.put(file);

        task.on('state_changed', snapshot => {
            let percentage = (snapshot.byteTransferred / snapshot.totalBytes) * 100;
            this.setState({
                uploadValue: percentage
            })
        }, err => {
            console.log(err)
        }, () => {            
          const record = {
            photoURL: this.state.user.photoURL,
            displayName: this.state.user.displayName,
            image: task.snapshot.downloadURL
          };
          const dbRef = Firebase.database().ref('pictures');
          const newPicture = dbRef.push();
          newPicture.set(record);

        });
    }

  renderLoginButton() {
    if(this.state.user) {
      return (
        <div>
          <img src={this.state.user.photoURL} alt={this.state.user.displayName}/>
          <p>Hola, {this.state.user.displayName}</p>
          <button onClick={this.handleLogout}>Salir</button>
          <FileUpload onUpload={this.handleUpload}/>
          {
            this.state.pictures.map(pic => (
              <div>
                <img src={pic.image} alt=""/>
                <br/>
                <img src={pic.photoURL} alt=""/>
                <br/>
                <span>{pic.displayName}</span>
              </div>
            )).reverse()
          }
        </div>
      )
    }
    else {
      return (<button onClick={this.handleAuth}>Login con Google</button>);
    }
  }
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Pseudogram</h2>
        </div>
        <div className="App-intro">
          {this.renderLoginButton()}
        </div>
      </div>
    );
  }
}

export default App;
