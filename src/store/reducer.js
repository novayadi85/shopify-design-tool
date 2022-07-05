import { combineReducers } from "redux";
import {actionReducer} from 'use-redux-effect'
import countReducer from "./count/reducer";
import templateReducer from "./template/reducer";
import productReducer from "./product/reducer";

const rootReducer = combineReducers({
    count: countReducer,
    template: templateReducer,
    products: productReducer,
    action : actionReducer
})
export default rootReducer