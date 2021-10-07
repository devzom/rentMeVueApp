import Vuex from "vuex";
// Modules
import account from "@/store/account";
import auth from "@/store/auth";
import booking from "@/store/booking";
import vehicle from "@/store/vehicle";

export default new Vuex.Store({
  modules: {
    account,
    auth,
    booking,
    vehicle
  }
});
