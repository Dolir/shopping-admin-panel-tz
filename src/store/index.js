import { createStore } from "vuex"
const uniq = (array) => [...new Set(array)]

export default createStore({
  state: {
    sessions: []
  },
  mutations: {
    addItems(state, payload) {
      const calculateProductQuantity = (event) => {
        const count = payload
          .filter(
            (element) =>
              event.productName === element.productName &&
              event.sessionId === element.sessionId
          )
          .map((element) => element.productCount)
          .reduce((first, second) => first + second)
        return Math.abs(count > 0 ? 0 : count)
      }

      const unifyItems = (events) => {
        return uniq(
          events.map((event) =>
            JSON.stringify({
              name: event.productName,
              sessionId: event.sessionId,
              quantity: calculateProductQuantity(event)
            })
          )
        ).map((event) => JSON.parse(event))
      }
      state.sessions = state.sessions.map((session) => ({
        ...session,
        products: unifyItems(payload).filter(
          (product) =>
            product.sessionId === session.sessionId && product.quantity
        )
      }))
    },
    addSessions(state, payload) {
      const filtered = payload.map((event, index, array) => {
        const session = array.filter(
          (elem) => elem.sessionId === event.sessionId
        )
        return JSON.stringify({
          enter: session[0].timestamp,
          exit: session[1].timestamp,
          sessionId: session[0].sessionId,
          products: [],
          submitted: false
        })
      })
      state.sessions = uniq(filtered).map((session) => JSON.parse(session))
    },
    addItem(state, payload) {
      const requiredSession = state.sessions.find(
        (session) => session.sessionId === payload.sessionId
      )
      requiredSession.products.unshift(payload)
    },
    incrementItem(state, payload) {
      const requiredSession = state.sessions.find(
        (session) => session.sessionId === payload.sessionId
      )
      const requiredProduct = requiredSession.products.find(
        (product) => product.name === payload.name
      )
      requiredProduct.quantity = parseInt(requiredProduct.quantity) +1
    },
    decrementItem(state, payload) {
      const requiredSession = state.sessions.find(
        (session) => session.sessionId === payload.sessionId
      )
      const requiredProduct = requiredSession.products.find(
        (product) => product.name === payload.name
      )
      if (requiredProduct.quantity > 1) requiredProduct.quantity -= 1
    },
    deleteItem(state, payload) {
      const requiredSession = state.sessions.find(
        (session) => session.sessionId === payload.sessionId
      )
      const newSessionProducts = requiredSession.products.filter(
        (product) => product.name !== payload.name
      )
      requiredSession.products = newSessionProducts
    },
    submitSession(state, payload) {
      const requiredSession = state.sessions.find(
        (session) => session.sessionId === payload.sessionId
      )
      requiredSession.submitted=true
    }
  },
  actions: {},
  modules: {}
})
