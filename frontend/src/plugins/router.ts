import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import ApplicationsDisplay from "../views/ApplicationsDisplay.vue";
import NewApplicationForm from "@/views/NewApplicationForm.vue";
import BulkCreate from "@/views/BulkCreate.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    component: ApplicationsDisplay,
  },
  {
    path: "/new-record",
    component: NewApplicationForm,
  },
  {
    path: "/bulk-create",
    component: BulkCreate
  }
];

export default new VueRouter({
  routes,
});
