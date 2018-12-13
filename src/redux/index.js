import {combineReducers} from 'redux';

import {expertReducer} from './modules/expert';
import {apptReducer} from './modules/appt';
import {qnaReducer} from './modules/qna';
import {knowledgeReducer} from './modules/knowledge';
import {newsReducer} from './modules/news';
import {mdtappsReducer} from './modules/mdtapps';
import {httpData} from './modules/http';

const reducers = combineReducers({
    expertReducer,
    apptReducer,
    mdtappsReducer,
    qnaReducer,
    knowledgeReducer,
    newsReducer,
    httpData,
});

export default reducers;