import React from 'react';
import './TemtemApp.css';
import TemtemItem from './TemtemItem';

class TemtemApp extends React.Component {

  constructor(props) {
    super(props);
    this.state = { temtemData: [], filteredData: [], temtemTypes: [], type: 'ALL', search: '', theme: 'Light' };

    this.filterByType = this.filterByType.bind(this);
    this.searchTemtem = this.searchTemtem.bind(this);
    this.setTheme = this.setTheme.bind(this);
  }

  componentDidMount = () => {
    fetch('https://temtem-api.mael.tech/api/temtems?fields=number,name,types,portraitWikiUrl&weaknesses=true')
      .then(response => response.json())
      .then(data => {
        let sortedData = data.sort((a,b)=> (a.number > b.number ? 1 : -1));
        this.setState({ temtemData: sortedData, filteredData: sortedData });
      });
    fetch('https://temtem-api.mael.tech/api/types')
      .then(response => response.json())
      .then(data => {
        let sortedData = data.sort((a,b)=> (a.name > b.name ? 1 : -1));
        this.setState({ temtemTypes: sortedData });
      })
  }

  filterByType(event) {
    let selectedType = event.target.value;
    if (selectedType === 'ALL') {
      this.setState({ filteredData: this.state.temtemData });
    }
    else {
      let filteredItems = this.state.temtemData.filter(temtem => temtem.types.indexOf(selectedType) !== -1);
      this.setState({ filteredData: filteredItems });
    }
    this.setState({ type: selectedType, search: '' });
  }

  searchTemtem(event) {
    let searchTerm = event.target.value;
    
    if (searchTerm !== '') {
      if (this.state.type !== 'ALL') {
        let itemsFilterType = this.state.temtemData.filter(temtem => temtem.types.indexOf(this.state.type) !== -1);
        let filteredItems = itemsFilterType.filter(temtem => temtem.name.toLowerCase().includes(searchTerm.toLowerCase()));
        this.setState({ filteredData: filteredItems });
      }
      else {
        let filteredItems = this.state.temtemData.filter(temtem => temtem.name.toLowerCase().includes(searchTerm.toLowerCase()));
        this.setState({ filteredData: filteredItems });
      }
    }
    else {
      if (this.state.type !== 'ALL') {
        this.setState({ filteredData: this.state.temtemData.filter(temtem => temtem.types.indexOf(this.state.type) !== -1)});
      }
      else {
        this.setState({ filteredData: this.state.temtemData });
      }
    }
    this.setState({ search: searchTerm });
  }

  setTheme(event) {
    let selectedTheme = event.target.value;
    let body = document.getElementsByTagName('body')[0];

    if (selectedTheme === 'Dark') {
      body.classList.remove('temtem-app-light');
      body.classList.add('temtem-app-dark');
    }
    else {
      body.classList.remove('temtem-app-dark');
      body.classList.add('temtem-app-light');
    }

    this.setState({ theme: selectedTheme });
  }

  render() {
    return (
      <main className='temtem-app'>
        <h1>Temtem Companion</h1>
        <section className='temtem-app-theme-container'>
          <label>Theme</label>
          <select onChange={this.setTheme} value={this.state.theme}>
            <option key='light'>Light</option>
            <option key='dark'>Dark</option>
          </select>
        </section>
        <section className='temtem-search-container'>
          <label>Search by Temtem name</label>
          <input type='text' placeholder='Search for a temtem' onChange={this.searchTemtem} value={this.state.search}/>
        </section>
        <section className='temtem-search-container'>
          <label>Filter by Type</label>
          <select onChange={this.filterByType}>
            <option key='all'>ALL</option>
            {this.state.temtemTypes.map(type => <option key={type.name.toLowerCase()}>{type.name}</option>)}
          </select>
        </section>
        <section className='temtem-container'>
          {this.state.filteredData.map(temtemData => <TemtemItem temtem={temtemData} temtemTypes={this.state.temtemTypes}/>)}
          <p>{this.state.filteredData.length === 0 ? "No results found..." : ""}</p>
        </section>
      </main>
    );
  }
}

export default TemtemApp;
