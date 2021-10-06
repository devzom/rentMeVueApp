import Vuex from "vuex";

// Modules
import account from "./modules/account";
import auth from "./modules/auth";
import booking from "./modules/booking";
import vehicle from "./modules/vehicle";

export default new Vuex.Store({
  modules: {
    account,
    auth,
    booking,
    vehicle
  }
});
