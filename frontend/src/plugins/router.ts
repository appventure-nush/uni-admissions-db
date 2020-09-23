import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import ApplicationsDisplay from "../components/ApplicationsDisplay.vue";
import NewRecordForm from "@/components/NewRecordForm.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: ApplicationsDisplay,
  },
  {
    path: "/new-record",
    component: NewRecordForm,
  },
];

export default new VueRouter({
  routes,
});
