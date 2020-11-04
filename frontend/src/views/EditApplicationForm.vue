<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Editing application
      </v-card-title>
      <div class="ma-4">
        <CreateApplication
          ref="form"
          :new-application="false"
          :application-data="application"
          @submit="editApplication($event)"
        />
        <v-row>
          <v-alert
            v-if="result && result.error"
            dense
            class="mx-4"
            type="error">
            {{ result.message }}
          </v-alert>
        </v-row>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import CreateApplication from "@/components/CreateApplication.vue";
import api from "@/api";
import config from "@/config";

export default Vue.extend({
  name: "EditApplicationForm",
  props: {
    application: Object
  },
  components: {CreateApplication},
  data: function () {
    return {
      result: null,
    }
  },
  methods: {
    async editApplication(application: any) {
      application.id = this.application.id;
      this.$data.result = await api.sendPost(`${config.api}/api/admin/applications/edit`, application);
      if (!this.$data.result.error) {
        this.$emit("close");
      }
    },
  }
});
</script>
