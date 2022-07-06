import { combineReducers } from "redux";
import countReducer from "./count/reducer";
import templateReducer from "./template/reducer";
import productReducer from "./product/reducer";
import sectionReducer from "./sections/reducer";
import blockReducer from "./block/reducer";

const rootReducer = combineReducers({
    count: countReducer,
    template: templateReducer,
    products: productReducer,
    sections: sectionReducer,
    blocks: blockReducer
})
export default rootReducer