import Vue from "vue";
import "./plugins/vuex";
import "./plugins/axios";
import { router } from "./plugins/vue-router";
import "./plugins/bootstrap";
import "./plugins/font-awesome";
import App from "./App.vue";
import store from "./store";
import { msToTime } from "@/utils/time";

import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Toasted from "vue-toasted";
const toastOptions = {
  keepOnHover: true,
  duration: 2500,
  singleton: true
};

Vue.use(Toasted, toastOptions);
Vue.use(BootstrapVue);
import "./assets/app.css";

const defaultCurrency = "$";

Vue.config.productionTip = false;

Vue.filter("capitalize", value => {
  if (!value) return "";
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

Vue.filter("rentStatus", booking => {
  const { status: statusId } = booking;

  const statusType = [
    {
      status: 1,
      text: "During"
    },
    {
      status: 2,
      text: "Canceled"
    },
    {
      status: 3,
      text: "Finished"
    }
  ];

  return statusType.find(type => type.status === statusId)?.text || "Error";
});

Vue.filter("formatDateTime", dateTime => {
  if (!dateTime) return "---------";
  return new Date(dateTime).toLocaleString();
});

Vue.filter("price", (value, withCurrency = true) => {
  const price = new Intl.NumberFormat("en-US", {
    style: "decimal", // 'currency' '$100.00'
    currency: "USD"
  }).format(value); // 0.19 || 10

  return withCurrency ? `${price} ${defaultCurrency}` : price;
});

Vue.filter("calculateRentPrice", booking => {
  if (!booking) return `0 ${defaultCurrency}`;
  if (booking.status == 2) return "------";

  const perHour = booking.price_list.price_per_hour ?? 10.0;
  const perMinute = booking.price_list.price_per_minute ?? 0.19;

  const startTime = new Date(booking.start_at);
  const endTime = booking?.end_at ? new Date(booking.end_at) : Date.now();
  const differenceInMilliseconds = Math.abs(endTime - startTime);
  const timeDuration = msToTime(differenceInMilliseconds);

  const priceForHours = timeDuration.hours * perHour;
  const priceForMinutes = timeDuration.minutes * perMinute;
  const totalCost = (priceForHours + priceForMinutes).toFixed(2);

  return `${totalCost} ${defaultCurrency}`;
});

store.dispatch("auth/check");

new Vue({
  el: "#app",
  router,
  store,
  render: h => h(App)
});
