import store from "@/store";
import Vue from "vue";

export default {
  namespaced: true,
  state: () => ({
    authenticated: false
  }),
  mutations: {
    check(state) {
      state.authenticated = !!localStorage.getItem("access_token");
      if (state.authenticated) {
        axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
          "access_token"
        )}`;

        const user = JSON.parse(localStorage.getItem("user"));
        store.commit("account/set", user.email);
      }
    },

    login(state, { user, access_token }) {
      state.authenticated = true;
      const token = `Bearer ${access_token}`;

      localStorage.setItem("user", JSON.stringify({ email: user }));
      localStorage.setItem("access_token", token);
      axios.defaults.headers.common.Authorization = token;
    },

    logout(state) {
      state.authenticated = false;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      axios.defaults.headers.common.Authorization = "";
    }
  },
  getters: {},
  actions: {
    check: ({ commit }) => {
      commit("check");
    },
    async login({ commit }, payload) {
      const userPayload = {
        email: payload.email,
        password: payload.password
      };

      await axios.post("/login", userPayload).then(({ data }) => {
        const access_token = data.data.token.access_token;
        commit("login", {
          user: userPayload.email,
          access_token
        });
        store.commit("account/set", payload.email);

        Vue.router.push({
          name: "home.index"
        });
      });
    },
    logout({ commit }) {
      commit("logout");
      Vue.router.push({
        name: "login.index"
      });
    }
  }
};
