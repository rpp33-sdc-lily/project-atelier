import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ProductOverview from './product_overview/overview.jsx';
import QuestionsAndAnswers from './questions_and_answers/q&a.jsx';
import RatingsAndReviews from './ratings_and_reviews/ratings&reviews.jsx';
import RelatedItemsAndMyOutfits from './related_items_outfit_creation/related_items&outfit.jsx';
import { product, styles } from '../sampleData/sampleData.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productIsFetched: false,
      stylesAreFetched: false,
      product: {},
      styles: {},
      myOutfits: [],
      currentProductInOutfit: false,
      starRating: 0
    };
    this.initialId = 64624;
  }

  componentDidMount() {
    Promise.all([this.getProduct(this.initialId), this.getStyles(this.initialId), this.getOutfits()])
      .then((res) => {
        this.setState({
          product: res[0].data.data,
          productIsFetched: true,
          stylesAreFetched: true,
          styles: res[1].data.data,
          myOutfits: res[2]
        });
      })
      .then((res) => {
        if (this.state.myOutfits.includes(this.state.product.id.toString())) {
          this.setState({ currentProductInOutfit: true });
        }
      })
      .catch((err) => {
        console.log('Error Retrieving Data from Server', err);
      });
  }

  getProduct(id) {
    return axios({
      method: 'get',
      url: 'products/' + id,
    });
  }

  getStyles(id) {
    return axios({
      method: 'get',
      url: 'products/' + id + '/styles',
    });
  }

  getOutfits() {
    let localStorageOutfits = Object.keys(localStorage);
    return localStorageOutfits;
  }

  toggleOutfit(id) {
    if (!this.state.currentProductInOutfit) {
      localStorage.setItem(id, id);
      this.setState({ myOutfits: this.getOutfits(), currentProductInOutfit: true }, () => {
        console.log(this.state.myOutfits);
      });
    } else {
      localStorage.removeItem(id, id);
      this.setState({ myOutfits: this.getOutfits(), currentProductInOutfit: false }, () =>{
      });
    }
  }

  updateStarRating(rating) {
    this.setState({ starRating: rating });
  }

  render() {
    if (!this.state.productIsFetched || !this.state.stylesAreFetched) {
      return <div>Loading</div>;
    }
    return (
      <div>
        <ProductOverview currentProductInOutfit={this.state.currentProductInOutfit} product={this.state.product} styles={this.state.styles} starRating={this.state.starRating} toggleOutfit={this.toggleOutfit.bind(this)}/>
        <RelatedItemsAndMyOutfits product={this.state.product} myOutfits={this.state.myOutfits} toggleOutfit={this.toggleOutfit.bind(this)} starRating={this.state.starRating}/>
        <QuestionsAndAnswers product={this.state.product}/>
        <RatingsAndReviews
          starRating={this.state.starRating}
          updateStarRating={this.updateStarRating.bind(this)}/>
      </div>
    );
  }
}

export default App;