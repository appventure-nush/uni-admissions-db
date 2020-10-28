<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        New application
        {{ $data.studentId }}
      </v-card-title>
      <div
        class="ma-4">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-switch
            v-model="newStudent"
            label="New student"
            @change="$data.studentId = getNextStudentId()"
          />

          <v-text-field
            :disabled="newStudent"
            v-model="studentId"
            label="Student ID"
            :rules="[checkStudentId]"
            required
          />
          <v-slider
            v-if="newStudent"
            v-model="gradCap"
            label="Graduation CAP"
            step="0.1"
            max="5"
            min="1"
            ticks="always"
            thumb-label="always"
            required
          />
          <MajorFilter
            @update="$data.majorInfo = $event"
          />
          <v-autocomplete
            v-model="status"
            :items="statuses"
            label="Select status"
            required
          />
          <v-textarea
            label="Comments"
            v-model="comment"
          />
          <v-row class="py-4">
            <v-btn
              class="mx-4"
              @click="submitForm"
              color="success"
              :disabled="checkForm()"
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
import api from "@/api";
import MajorFilter from "@/components/MajorFilter.vue";
import config from "@/config";

export default Vue.extend({
  name: "NewRecordForm",
  components: {MajorFilter, UniversityFilter},
  data() {
    return {
      studentId: null,
      majorInfo: null,
      status: null,
      statuses: ["Accepted", "Offered", "Rejected", "Waitlist", "Interview"],
      summary: null,
      newStudent: false,
      gradCap: 4,
      comment: "",
      valid: false,
      result: null
    };
  },
  mounted() {
    api.getSummary().then(data => {
      this.$data.summary = data;
    })
  },
  methods: {
    checkStudentId(studentId: string) {
      if (studentId == null) {
        return false;
      }
      const prefix = studentId.substring(0, 4);
      if (prefix.length != 4) {
        return "Invalid prefix";
      }
      const studentIds = this.$data.summary.studentIds;
      const thisYearStudentIds = studentIds.find((it: any) => it.year.toString() == prefix);
      const id = parseInt(studentId.substring(5, 8));
      if (!thisYearStudentIds) {
        if (prefix != new Date().getFullYear().toString()) {
          return "Invalid prefix";
        }
        // New student
        if (!this.$data.newStudent) {
          return "Invalid student ID";
        }
        return true;
      }
      if (!/^20[0-9]{2}a[0-9]{3}$/.test(studentId)) {
        return "Invalid student ID";
      }
      if (id > thisYearStudentIds.ids[thisYearStudentIds.ids.length - 1] || id < thisYearStudentIds[0]) {
        return "Invalid student ID";
      }
      return true;
    },
    getNextStudentId() {
      const prefix = new Date().getFullYear() + 'a';
      const studentIds = this.$data.summary.studentIds;
      const thisYearStudentIds = studentIds[studentIds.length - 1];
      if (thisYearStudentIds.year != new Date().getFullYear()) {
        // No existing records with current year
        return prefix + "001";
      }
      return prefix + (thisYearStudentIds.ids[thisYearStudentIds.ids.length - 1] + 1).toString().padStart(3, "0");
    },
    checkForm() {
      const {majorInfo, status, studentId} = this.$data;
      if (majorInfo == null || status == null || studentId == null) {
        return true;
      }
      return majorInfo.uniId == null || majorInfo.majorId == null;
    },
    async submitForm() {
      if (this.$data.newStudent) {
        const response = await this.createStudent();
        if (response.error) {
          this.$data.result = response;
          return;
        }
      }
      this.$data.result = await api.sendPost(`${config.api}/api/admin/applications/create`, {
        studentId: this.$data.studentId,
        universityId: this.$data.majorInfo.uniId,
        majorId: this.$data.majorInfo.majorId,
        status: this.$data.status,
        comment: this.$data.comment,
      });
      // Reload data
      api.getSummary().then(data => {
        this.$data.summary = data;
      });
      (this.$refs.form as HTMLFormElement).reset();
    },
    async createStudent() {
      return api.sendPost(`${config.api}/api/admin/students/create`, {
        studentId: this.$data.studentId,
        gradCap: this.$data.gradCap,
      })
    }
  }
});
</script>
