import { INC, DEC } from "./type";

const initialState = {
    count: 0
}

const countReducer = (state = initialState, action) => {
    const { type } = action
    switch (type) {
        case INC:
            return { count: state.count + 1 }
        case DEC:
            return { count: state.count - 1 }
        default:
            return state
    }
}

export default countReducer