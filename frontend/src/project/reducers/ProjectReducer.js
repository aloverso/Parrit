const initialState = {
    id: 0,
    name: undefined,
    people: [],
    pairingBoards: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case 'LOAD_PROJECT':
            return action.project
        default:
            return state
    }
}
