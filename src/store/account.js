export default {
  namespaced: true,
  state: () => ({
    email: null,
    username: null
  }),
  mutations: {
    set(state, email) {
      state.email = email;
      state.username = email.split("@")[0];
    }
  },
  getters: {},
  actions: {
    set({ commit }) {
      const account = {
        email: "jonh@doe.com",
        username: "John"
      };

      commit("account/set", account);
    }
  }
};
