export default {
    namespace: "s_login",
    state: {
        inited: false,
        loading: false,
        list: [],
    },
    reducers: {
        sets(state, { payload: params }) {
            return { ...state, ...params }
        },
    },
    effects: {
        *login(action, { select, put, call }) {
            const { account, password, backToken, pointJson } = action.payload
            const params = { account, password, pointJson }
            yield put({ type: 'sets', payload: { loading: true } })
            const data = yield call(checkPuzzle, backToken, params)
            yield put({ type: 'sets', payload: { loading: false } })
            if (data) {
                action.callback(data)
            } else {
                action.callback()
            }
        }
    }
    
}