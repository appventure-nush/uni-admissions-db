import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import ApplicationsDisplay from "../components/ApplicationsDisplay.vue";

Vue.use(VueRouter);

const routes : Array<RouteConfig> = [
  {
    path: "/",
    component: ApplicationsDisplay,
  },
];

export default new VueRouter({
  routes,
});
