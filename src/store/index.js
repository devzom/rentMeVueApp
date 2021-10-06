import Vuex from "vuex";

// Modules
import account from "./modules/account";
import auth from "./modules/auth";
import booking from "./modules/booking";

export default new Vuex.Store({
  modules: {
    account,
    auth,
    booking
  }
});
