import { ACTIONS, APPS } from './App.consts';

const initialState = {
    activeApp: APPS.todo
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTIONS.SET_ACTIVE_APP:
            return {
                ...state,
                activeApp: action.app
            };
        default:
            return initialState;
    }
};

export default appReducer;
