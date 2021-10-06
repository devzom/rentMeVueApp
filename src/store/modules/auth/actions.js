import Vue from "vue";
import store from "@/store";

export const check = ({ commit }) => {
  commit("check");
};

export const login = async ({ commit }, payload) => {
  const userPayload = {
    email: payload.email,
    password: payload.password
  };

  await axios.post("/login", userPayload).then(({ data }) => {
    const access_token = data.data.token.access_token;
    commit("login", { user: userPayload.email, access_token });
    store.commit("account/set", payload.email);

    Vue.router.push({
      name: "home.index"
    });
  });
};

export const logout = ({ commit }) => {
  commit("logout");
  Vue.router.push({
    name: "login.index"
  });
};

export default {
  check,
  login,
  logout
};
