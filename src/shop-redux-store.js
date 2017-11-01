import createStore from '../node_modules/@0xcda7a/redux-es6/es/createStore.js';
import applyMiddleware from '../node_modules/@0xcda7a/redux-es6/es/applyMiddleware.js';
import origCompose from '../node_modules/@0xcda7a/redux-es6/es/compose.js';
import thunk from '../node_modules/redux-thunk/es/index.js';

import { findCategory, findCategoryIndex, findItem } from './shop-redux-helpers.js';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

const reducers = {
  // Response from fetch for categories data.
  _categoryItemsChanged(state, action) {
    const categories = state.categories.slice(0);
    const categoryIndex = findCategoryIndex(categories, action.categoryName);
    categories[categoryIndex] = {...categories[categoryIndex], items: action.data};
    // The current category may have changed if the user navigated before the
    // fetch returns, so update the current cateogry/item based on current state.
    const category = findCategory(categories, state.categoryName);
    return {
      ...state,
      categories,
      category,
      item: findItem(category, state.itemName),
      failure: false
    };
  },
  // Cart initialization/update from another window.
  _cartChanged(state, action) {
    const cart = action.cart;
    return {
      ...state,
      cart,
      numItems: computeNumItems(cart),
      total: computeTotal(cart)
    };
  },
  // Network error (set to true by unsucessful fetch).
  _failureChanged(state, action) {
    const failure = action.failure;
    return {
      ...state,
      failure
    };
  },
  // Opposite of navigator.onLine (updated by shop-app).
  _offlineChanged(state, action) {
    const offline = action.offline;
    return {
      ...state,
      offline
    };
  }
};

export function installReducers(r) {
  Object.assign(reducers, r);
}

export const store = createStore(
  (state, action) => {
    const r = reducers[action.type];
    return r ? r(state, action) : state;
  },
  getInitialState(),
  compose(applyMiddleware(thunk)));

window.addEventListener('storage', () => {
  store.dispatch({
    type: '_cartChanged',
    cart: getLocalCartData()
  });
});

function getInitialState() {
  const cart = getLocalCartData();
  return {
    categories: [
      {
        name: 'mens_outerwear',
        title: 'Men\'s Outerwear',
        image: 'images/mens_outerwear.jpg',
        placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAXAABAQEAAAAAAAAAAAAAAAAAAAIEAQEAAAAAAAAAAAAAAAAAAAACEAAAAwYHAQAAAAAAAAAAAAAAERMBAhIyYhQhkaEDIwUVNREBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A3dkr5e8tfpwuneJITOzIcmQpit037Bw4mnCVNOpAAQv/2Q=='
      },
      {
        name: 'ladies_outerwear',
        title: 'Ladies Outerwear',
        image: 'images/ladies_outerwear.jpg',
        placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAWQABAQAAAAAAAAAAAAAAAAAAAAEBAQEAAAAAAAAAAAAAAAAAAAIDEAABAwMFAQAAAAAAAAAAAAARAAEygRIDIlITMwUVEQEBAAAAAAAAAAAAAAAAAAAAQf/aAAwDAQACEQMRAD8Avqn5meQ0kwk1UyclmLtNj7L4PQoioFf/2Q=='
      },
      {
        name: 'mens_tshirts',
        title: 'Men\'s T-Shirts',
        image: 'images/mens_tshirts.jpg',
        placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAWwABAQEAAAAAAAAAAAAAAAAAAAMEAQEAAAAAAAAAAAAAAAAAAAAAEAABAwEJAAAAAAAAAAAAAAARAAESEyFhodEygjMUBREAAwAAAAAAAAAAAAAAAAAAAEFC/9oADAMBAAIRAxEAPwDb7kupZU1MTGnvOCgxpvzEXTyRElCmf//Z'
      },
      {
        name: 'ladies_tshirts',
        title: 'Ladies T-Shirts',
        image: 'images/ladies_tshirts.jpg',
        placeholder: 'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAAeAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAAQCwsLDAsQDAwQFw8NDxcbFBAQFBsfFxcXFxcfHhcaGhoaFx4eIyUnJSMeLy8zMy8vQEBAQEBAQEBAQEBAQEBAAREPDxETERUSEhUUERQRFBoUFhYUGiYaGhwaGiYwIx4eHh4jMCsuJycnLis1NTAwNTVAQD9AQEBAQEBAQEBAQED/wAARCAADAA4DASIAAhEBAxEB/8QAXwABAQEAAAAAAAAAAAAAAAAAAAMFAQEBAAAAAAAAAAAAAAAAAAABAhAAAQIDCQAAAAAAAAAAAAAAEQABITETYZECEjJCAzMVEQACAwAAAAAAAAAAAAAAAAAAATFBgf/aAAwDAQACEQMRAD8AzeADAZiFc5J7BC9Scek3VrtooilSNaf/2Q=='
      }
    ],
    cart,
    numItems: computeNumItems(cart),
    total: computeTotal(cart)
  };
}

function getLocalCartData() {
  const localCartData = localStorage.getItem('shop-cart-data');
  try {
    return JSON.parse(localCartData) || [];
  } catch (e) {
    return [];
  }
}

function computeNumItems(cart) {
  if (cart) {
    return cart.reduce((total, entry) => {
      return total + entry.quantity;
    }, 0);
  }

  return 0;
}

function computeTotal(cart) {
  if (cart) {
    return cart.reduce((total, entry) => {
      return total + entry.quantity * entry.item.price;
    }, 0);
  }

  return 0;
}