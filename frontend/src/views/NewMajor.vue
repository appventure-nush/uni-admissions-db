<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        New major
      </v-card-title>
      <div
        class="ma-4">
        <v-form
          ref="form"
          lazy-validation
        >
          <UniversityFilter
            @update="$data.university = $event"
          />
          <v-text-field
            :error-messages="errorMessages"
            :disabled="university==null"
            v-model.trim="majorName"
            label="Major name"/>
          <v-autocomplete
            :disabled="university==null"
            :items="categories"
            multiple
            v-model="category"
            label="Category"
          />
          <v-row class="py-4">
            <v-btn
              :disabled="university == null || majorName == null || category == null || errorMessages.length !== 0"
              class="mx-4"
              @click="submitForm"
              color="success"
            >Submit
            </v-btn>
            <v-alert
              v-if="result && !result.error"
              dense
              class="mx-4"
              type="success">
              Major successfully created
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
import config from "@/config";
import api from "@/api";

export default Vue.extend({
  name: "NewMajor",
  components: {UniversityFilter},
  data() {
    return {
      category: null,
      majorName: null,
      categories: [],
      university: null,
      result: null,
      errorMessages: []
    };
  },
  mounted() {
    api.getSummary().then(res => {
      this.$data.categories = res.categories;
    });
  },
  watch: {
    majorName: async function (val) {
      if (!this.$data.university) {
        this.$data.errorMessages = [];
      }
      const majors = await api.getMajors(this.$data.university.value);
      for (const major of majors) {
        if (major.majorName.toLowerCase() == val.toLowerCase()) {
          this.$data.errorMessages = ["Major already exists"];
          return;
        }
      }
      this.$data.errorMessages = [];
    }
  },
  methods: {
    async submitForm() {
      this.$data.result = await api.sendPost(`${config.api}/api/admin/majors/create`, {
        majorName: this.$data.majorName,
        category: this.$data.category,
        uniId: this.$data.university.value
      });
      await api.getMajors(this.$data.university.value, true);
      if (!this.$data.result.error) {
        (this.$refs.form as HTMLFormElement).reset();
      }
    }
  }
});
</script>
