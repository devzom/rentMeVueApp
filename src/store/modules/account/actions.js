export const set = ({ commit }) => {
  const account = {
    email: "jonh@doe.com",
    username: "John"
  };

  commit("account/set", account);
};

export default {
  set
};
