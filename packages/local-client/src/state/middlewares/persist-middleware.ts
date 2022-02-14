// middleware = function that returns a f'n that returns a f'n
import { Dispatch } from 'redux';
import { Action } from '../actions';
import { ActionType } from '../action-types';
import { saveCells } from '../action-creators';
import { RootState } from '../reducers';
import { AnyObject } from 'immer/dist/internal';

export const persistMiddleware = ({
    dispatch,
    getState,
}: {
    dispatch: Dispatch<Action>;
    getState: () => RootState;
}) => {
    let timer: any;

    return (next: (action: Action) => void) => {
        return (action: Action) => {
            next(action); //always want to forward on actions

            if (
                [
                    ActionType.MOVE_CELL,
                    ActionType.UPDATE_CELL,
                    ActionType.INSERT_CELL_AFTER,
                    ActionType.DELETE_CELL,
                ].includes(action.type)
            ) {
                timer && clearTimeout(timer);

                timer = setTimeout(() => {
                    //only save cells after 250ms of no user inputs
                    saveCells()(dispatch, getState);
                }, 250);
            }
        };
    };
};
