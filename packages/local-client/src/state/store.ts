import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import { ActionType } from './action-types';
import { persistMiddleware } from './middlewares/persist-middleware';

export const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk, persistMiddleware)
);
