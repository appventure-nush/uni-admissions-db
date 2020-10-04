import Vue from "vue";
import VueRouter from "vue-router";
import ApplicationsDisplay from "../components/ApplicationsDisplay.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: ApplicationsDisplay,
  },
];

export default new VueRouter({
  routes,
});
