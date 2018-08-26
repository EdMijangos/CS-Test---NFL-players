import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    results:'',
  }

  render() {
    let items = '';
    if (this.state.results.length > 0) {
      let data = this.state.results;
      items = data.map(item=>{
        return(
          <div className="card" key={item.Name + item.arrest_count}>
            <p>NFL player: <span>{item.Name}</span></p>
          </div>
        )
      })
    }

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Look up which NFL players have commited a crime</h1>
        </header>

        <form onSubmit= {(event) => this.handlerInput(event)} >
          <p>
            Select a crime type:
            <select ref= {node => (this.selectNode = node)}>
              <option value="Assault">Assault</option>
              <option value="Drugs">Drugs</option>
              <option value="DUI">DUI</option>
              <option value="Theft">Theft</option>
            </select>
          </p>
          <p>
            (optional) Show results since... 
            <input type="date" ref={node => (this.dateNode = node)} />
          </p>
          <input type="submit" />
        </form>
        <div className="results">
          {items}
        </div>
      </div>
    );
  }

  handlerInput(event){
    event.preventDefault();
    let serverAPI = '/api/' + this.selectNode.value;
    if (this.dateNode.value) serverAPI += ('?date=' + this.dateNode.value);

    //Send request to the NodeJS server
    fetch(serverAPI)
    .then(res=>{
      if(!res.ok) throw new Error();
      return res.json();
    })
    .then(resp=>{
      this.setState({results: resp})
    })
  }
}

export default App;
