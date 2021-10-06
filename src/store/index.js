import Vuex from "vuex";

// Modules
import account from "./modules/account";
import auth from "./modules/auth";

export default new Vuex.Store({
  modules: {
    account,
    auth
  }
});
