<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        New application
        {{ $data.studentId }}
      </v-card-title>
      <div
        class="ma-4">
        <CreateApplication
          ref="form"
          @submit="createApplication($event)"
        />
        <v-row>
          <v-alert
            v-if="result && !result.error"
            dense
            class="mx-4"
            type="success">
            Application successfully created
          </v-alert>
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
import api from "@/api";
import CreateApplication from "@/components/CreateApplication.vue";
import config from "@/config";
import Application from "@/types/application";

export default Vue.extend({
  name: "NewRecordForm",
  components: {CreateApplication},
  data: function () {
    return {
      result: null,
      application: {
        id: 1,
        Student: {
          studentId: "2020a001",
          gradCap: 5
        },
        Major: {
          "majorId": 1,
          "majorName": "Business Admin (Accountancy) & Communications & New Media",
          "category": "Unknown",
          "uniId": 28
        },
        University: {
          "uniId": 28,
          "uniName": "National University of Singapore",
          "country": "Singapore"
        },
        status: "Offered",
        comment: ""
      } as Application
    }
  },
  methods: {
    async createApplication(application: any) {
      if (application.newStudent) {
        const response = await this.createStudent(application);
        if (response.error) {
          this.$data.result = response;
          return;
        }
      }
      this.$data.result = await api.sendPost(`${config.api}/api/admin/applications/create`, application);
      if (!this.$data.result.error) {
        (this.$refs.form as any).reload()
      }
    },
    async createStudent(application: any) {
      return api.sendPost(`${config.api}/api/admin/students/create`, application)
    }
  }
});
</script>
