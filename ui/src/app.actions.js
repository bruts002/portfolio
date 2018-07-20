import { ACTIONS, APPS } from './App.consts';

export const setActiveApp = (app = APPS.TODO) => ({
    type: ACTIONS.SET_ACTIVE_APP,
    app
});
