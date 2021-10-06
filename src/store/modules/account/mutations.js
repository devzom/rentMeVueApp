export default {
  set(state, email) {
    state.email = email;
    state.username = email.split("@")[0];
  }
};
