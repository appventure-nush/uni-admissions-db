import Vue from "vue";
import VueRouter, {RouteConfig} from "vue-router";
import ApplicationsDisplay from "../views/ApplicationsDisplay.vue";
import NewApplicationForm from "@/views/NewApplicationForm.vue";
import BulkCreate from "@/views/BulkCreate.vue";
import NewMajor from "@/views/NewMajor.vue";

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
  },
    {
    path: "/new-major",
    component: NewMajor
  }
];

export default new VueRouter({
  routes,
});
