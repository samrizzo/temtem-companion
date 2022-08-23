import React from 'react';
import './TemtemItem.css';

class TemtemItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = { temtemWeaknesses: [], temtemId: 0 };
    this.getTypeIcon = this.getTypeIcon.bind(this);
    this.setWeaknesses = this.setWeaknesses.bind(this);
  }

  componentDidMount() {
    let temtemNumber = this.props.temtem.number >= 100 ?
          this.props.temtem.number :
          this.props.temtem.number >= 10 ?
            `0${this.props.temtem.number}` :
            `00${this.props.temtem.number}`;
    this.setState({ temtemId: temtemNumber });
    this.setWeaknesses();
  }

  setWeaknesses() {
    let objKeys = Object.keys(this.props.temtem.weaknesses);
    let objValues = Object.values(this.props.temtem.weaknesses);

    let objectArray = [];

    for (let i = 0; i < objKeys.length; i++) {
        objectArray.push({ key: objKeys[i], value: objValues[i] });
    }

    let weaknessesArray = objectArray.filter(weakness => weakness.value >= 2);

    weaknessesArray !== null ? 
        this.setState({ temtemWeaknesses: weaknessesArray }) : 
        this.setState({ temtemWeaknesses: [], temtemId: 0 });
  }

  getTypeIcon(typeName) {
    let typeData = this.props.temtemTypes.filter(type => type.name === typeName);
    let selectedTypeIcon = typeData.map(item =>  {
        return item.icon;
    });
    
    let typeIcon = `https://temtem-api.mael.tech/${selectedTypeIcon[0]}`;
    return typeIcon;
  } 

  render() {
    return (
      <section className='temtem'>
        <section className='temtem-image-container'>
            <img className='temtem-image' src={this.props.temtem.portraitWikiUrl} alt={this.props.temtem.name}/>
        </section>
        <section className='temtem-attributes'>
            <section className='temtem-name-container'>
                <p>#{this.state.temtemId}</p>
                <p>{this.props.temtem.name}</p>
            </section>
            <section className='temtem-type-container'>
                {this.props.temtem.types.map(type => <img className='temtem-type' src={this.getTypeIcon(type)} title={type} alt={type}/>)}
                <p>({this.props.temtem.types.map(type => <span>{type}</span>)})</p>
            </section>
            <div className='divider'></div>
            <section className='temtem-weaknesses-container'>
                <p>Weaknesses</p>
                <section className='temtem-weaknesses'>
                  {this.state.temtemWeaknesses.map(type => <img className='temtem-type' src={this.getTypeIcon(type.key)} title={type.key} alt={type.key}/>)}
                  <p>({this.state.temtemWeaknesses.map(type => <span>{type.key}</span>)})</p>
                </section>
            </section>
        </section>
      </section>
    );
  }
}

export default TemtemItem;
