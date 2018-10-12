import React, { Component } from 'react';
import './App.css';
import Crawl from '../Crawl/Crawl';
import Header from '../Header/Header';
import Button from '../Button/Button';
import CardContainer from '../CardContainer/CardContainer';
import fetchCall from '../../helpers/fetchCalls'
import FetchVehicles from '../../helpers/fetchVehicles'
import FetchPlanets from '../../helpers/fetchPlanets'
import FetchPeople from '../../helpers/fetchPeople'

class App extends Component {
  constructor() {
    super()

    this.state = {
      totalFavorites: 0,
      currentSelection: '',
      openingCrawl: {},
      people: [],
      vehicles: [],
      planets: [],
      error: false,
      loading: true,
    };
  }

  fetchPeople = new FetchPeople()
  fetchVehicles = new FetchVehicles()
  fetchPlanets = new FetchPlanets()

  componentDidMount() {
    this.crawlCall();
  }

  crawlCall = async () => {
    const url = 'https://swapi.co/api/films/';
    try {
      const films = await fetchCall(url);

      const randomNum = Math.floor(Math.random() * (films.count))
      this.setState({
        openingCrawl: films.results[randomNum], 
        loading: false,
        error: false
      })
    } catch(error) {
      this.setState({ 
        error: true, 
        currentSelection: '' 
      })
    }
  }


  handleSelection = (currentSelection) => {

    if (currentSelection === 'people') {
      this.callFetchPeople();
    } else if (currentSelection === 'vehicles') {
      this.callFetchVehicles();
    } else if (currentSelection === 'planets') {
      this.callFetchPlanets()
    }
  }

  callFetchVehicles = async () => {
    await this.setState({ loading: true })
    try {
      const cleanData = await this.fetchVehicles.fetchVehicles()
      this.setState({
        vehicles: cleanData,
        currentSelection: 'vehicles',
        loading: false,
        error: false
      })
    } catch(error) {
      this.setState({ error: true, currentSelection: '' })
    }
  }

  callFetchPeople = async () => {
    await this.setState({ loading: true })
    try{
      const cleanedPeople = await this.fetchPeople.fetchPeople();
      this.setState({
        people: cleanedPeople,
        currentSelection: 'people',
        loading: false,
        error: false
      })
    } catch(error) {
      this.setState({ error: true, currentSelection: '' })
    }
  }

  callFetchPlanets = async () => {
    await this.setState({ loading: true })
    try{
      const cleanedPlanets = await this.fetchPlanets.fetchPlanets()
      this.setState({
        planets: cleanedPlanets,
        currentSelection: 'planets',
        loading: false,
        error: false
      })
    } catch(error) {
      this.setState({ error: true })
    }
  }

  render() {
    const mockPeople = {results: 
      [ 
        {
          name: 'bob',
          homeworld: {name: 'earth', population: '7.5billion'},
          species: {name: 'human', language: 'english'}
        }
      ]
    }

    if( this.state.error ){
      return(
        <div className="App">Error</div>
      )
    } else if (this.state.loading) { 
      return(
        <div className="App">Loading</div>
      )
    } else {
      return (
        <div className="App">
          <Crawl film={this.state.openingCrawl}/>
          <main>
            <Header totalFavorites={this.state.totalFavorites} />
            <section className="content-wrapper">
              <section className='button-section'>
                <Button 
                  currentSelection={this.state.currentSelection}
                  handleSelection={this.handleSelection} 
                  buttonName='people' 
                />
                <Button 
                  currentSelection={this.state.currentSelection}
                  handleSelection={this.handleSelection} 
                  buttonName='planets' 
                />              <Button 
                  currentSelection={this.state.currentSelection}
                  handleSelection={this.handleSelection} 
                  buttonName='vehicles' 
                />
              </section>
              <section className='main-content'>
                <h1 className='category'>{this.state.currentSelection}</h1>
                <CardContainer 
                  data={mockPeople}
                  people={this.state.people}
                  planets={this.state.planets}
                  vehicles={this.state.vehicles}
                  selection={this.state.currentSelection}
                />
              </section>
            </section>
          </main>
        </div>
      );
    }
  }
}

export default App;
