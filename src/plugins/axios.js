import Vue from "vue";
import axios from "axios";
import store from "@/store";

// axios.defaults.headers.common.Accept = "application/json";

const base = axios.create({
  baseURL: "https://assessment.hub2go.de/api"
});

base.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      store.dispatch("auth/logout");
    }

    return Promise.reject(error);
  }
);

window.axios = base;

// Vue.$http = base;
// export default base;
