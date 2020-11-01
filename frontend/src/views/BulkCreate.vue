<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Bulk create applications
      </v-card-title>
      <div
        class="ma-4">
        <v-form
          ref="form"
          lazy-validation
        >
          <v-file-input
            @change="result=null"
            v-model="inputFile"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
            label="Upload Excel file"
          />
          <v-row class="py-4">
            <v-btn
              class="mx-4"
              @click="submitForm"
              color="success"
              :disabled="inputFile==null"
            >Submit
            </v-btn>
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

        </v-form>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import UniversityFilter from "@/components/UniversityFilter.vue"
import MajorFilter from "@/components/MajorFilter.vue";
import config from "@/config";

export default Vue.extend({
  name: "BulkCreate",
  components: {MajorFilter, UniversityFilter},
  data() {
    return {
      inputFile: null,
      result: null
    };
  },
  methods: {
    async submitForm() {
      const formData = new FormData();
      formData.append("file", this.$data.inputFile);
      this.$data.result = await (await fetch(config.api + "/api/admin/applications/bulkCreate", {
        method: "POST",
        credentials: "include",
        body: formData
      })).json();
      if(this.$data.result){
        this.$data.inputFile = null;
      }
    }
  }
});
</script>
