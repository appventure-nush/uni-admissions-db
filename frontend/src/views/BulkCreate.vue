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
          <v-switch
            v-model="randomize"
            label="Randomize student IDs"
            hint="Replace student IDs with unique but anonymous identifiers"
            :persistent-hint="true"
          />
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
              Applications successfully created
            </v-alert>
            <v-alert
              v-if="result && result.error"
              dense
              class="mx-4"
              type="error">
              {{ result.message }}
            </v-alert>
            <v-btn
              v-if="randomize && result && !result.error"
              class="mx-4"
              @click="downloadFile()"
              color="primary"
            >Download mappings
            </v-btn>
          </v-row>

        </v-form>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import config from "@/config";

export default Vue.extend({
  name: "BulkCreate",
  data() {
    return {
      inputFile: null,
      randomize: false,
      result: null,
    };
  },
  methods: {
    async submitForm() {
      const formData = new FormData();
      formData.append("file", this.$data.inputFile);
      if (this.$data.randomize) {
        formData.append("randomize", "true");
      }
      this.$data.result = await (await fetch(config.api + "/api/admin/applications/bulkCreate", {
        method: "POST",
        credentials: "include",
        body: formData
      })).json();
      if (this.$data.result) {
        this.$data.inputFile = null;
      }
    },
    downloadFile() {
      const blob = new Blob([this.$data.result.message], {type: "text/plain"});
      const download = document.createElement("a");
      download.download = "mapping.txt";
      download.href = window.URL.createObjectURL(blob);
      download.click();
      download.remove()
    }
  }
});
</script>
