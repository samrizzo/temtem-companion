import React from 'react';
import './TemtemItem.css';

class TemtemItem extends React.Component {

  constructor(props) {
    super(props);

    this.formatTemtemNumber = this.formatTemtemNumber.bind(this);
    this.getTypeIcon = this.getTypeIcon.bind(this);
    this.setWeaknesses = this.setWeaknesses.bind(this);
  }

  componentDidMount() {
    //this.setWeaknesses();
  }

  formatTemtemNumber() {
    return this.props.temtem.number >= 100 ?
          this.props.temtem.number :
          this.props.temtem.number >= 10 ?
            `0${this.props.temtem.number}` :
            `00${this.props.temtem.number}`;
  }

  setWeaknesses() {
    let objKeys = Object.keys(this.props.temtem.weaknesses);
    let objValues = Object.values(this.props.temtem.weaknesses);

    let objectArray = [];

    for (let i = 0; i < objKeys.length; i++) {
        objectArray.push({ key: objKeys[i], value: objValues[i] });
    }

    let weaknessesArray = objectArray.filter(weakness => weakness.value >= 2);
    return weaknessesArray;
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

    let temtemNumber = this.formatTemtemNumber();
    let weaknessesArray = this.setWeaknesses();

    return (
      <section className='temtem'>
        <section className='temtem-image-container'>
            <img className='temtem-image' src={this.props.temtem.portraitWikiUrl} alt={this.props.temtem.name}/>
        </section>
        <section className='temtem-attributes'>
            <section className='temtem-name-container'>
                <p>#{temtemNumber}</p>
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
                  {weaknessesArray.map(type => <img className='temtem-type' src={this.getTypeIcon(type.key)} title={type.key} alt={type.key}/>)}
                  <p>({weaknessesArray.map(type => <span>{type.key}</span>)})</p>
                </section>
            </section>
        </section>
      </section>
    );
  }
}

export default TemtemItem;
