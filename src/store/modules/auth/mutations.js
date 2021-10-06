import store from "@/store";

export default {
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
};

// ===
// Private helpers
// ===
function getSavedState(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

function saveState(key, state) {
  window.localStorage.setItem(key, JSON.stringify(state));
}

function setDefaultAuthHeaders(state) {
  axios.defaults.headers.common.Authorization = state.currentUser
    ? state.currentUser.token
    : "";
}
