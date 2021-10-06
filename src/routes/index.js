export default [
  // Home
  {
    path: "/home",
    name: "home.index",
    component: () => import("@/views/Home/Index.vue"),

    // If the user needs to be authenticated to view this page
    meta: {
      auth: true
    }
  },

  // Login
  {
    path: "/login",
    name: "login.index",
    component: () => import("@/views/Login/Index.vue"),

    // If the user needs to be a guest to view this page.
    meta: {
      guest: true
    }
  },

  // Booking /s
  {
    path: "/bookings",
    name: "bookings.index",
    component: () => import("@/views/Bookings/Index.vue"),
    meta: {
      auth: true
    }
  },
  {
    path: "/bookings/:id",
    name: "bookings.id",
    component: () => import("@/views/Bookings/_id.vue"),
    props: true,
    beforeRouteEnter(to, from, next) {
      if (!Number.isNaN(to.params.id)) next();
      else next("/bookings");
    },
    meta: {
      auth: true
    }
  },

  // Reservation
  {
    path: "/reservation/:id",
    name: "reservation.id",
    component: () => import("@/views/Bookings/_vehicleId.vue"),
    beforeRouteEnter(to, from, next) {
      if (!Number.isNaN(to.params.id)) next();
      else next("/");
    },
    props: true,
    meta: {
      auth: true
    }
  },

  {
    path: "/",
    redirect: "/home"
  },

  {
    path: "/*",
    redirect: "/home"
  }
];
