<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
    <v-switch
      v-if="newApplication"
      v-model="newStudent"
      label="New student"
      @change="$data.studentId = getNextStudentId()"
    />

    <!--  Disable changing studentId for new students and when editing applications -->
    <v-text-field
      :disabled="newStudent || !newApplication"
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
      :major-info="majorInfo"
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
    </v-row>

  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import api from "@/api";
import MajorFilter from "@/components/MajorFilter.vue";
import UniversityFilter from "@/components/UniversityFilter.vue";
import Application from "@/types/application";

export default Vue.extend({
  name: "CreateApplication",
  components: {MajorFilter, UniversityFilter},
  props: {
    newApplication: {
      type: Boolean,
      default: true,
    },
    applicationData: Object,
  },
  data() {
    return {
      studentId: this.applicationData?.Student.studentId,
      majorInfo: this.applicationData ? {
        uniId: this.applicationData.University.uniId,
        majorId: this.applicationData.Major.majorId
      } : null,
      status: this.applicationData?.status,
      statuses: ["Offered", "Rejected", "Waitlist", "Applied", "Withdrawn"],
      newStudent: false,
      gradCap: 4,
      comment: this.applicationData?.comment,
      valid: !!this.applicationData,
    };
  },
  mounted() {
    api.getSummary().then(data => {
      this.$data.summary = data;
    });
  },
  methods: {
    checkStudentId(studentId: string) {
      // Existing applications have correct student ids
      if(!this.newApplication){
        return true;
      }
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
    submitForm() {
      const data = {
        newStudent: this.$data.newStudent,
        studentId: this.$data.studentId,
        gradCap: this.$data.gradCap,
        universityId: this.$data.majorInfo.uniId,
        majorId: this.$data.majorInfo.majorId,
        status: this.$data.status,
        comment: this.$data.comment,
      };
      this.$emit("submit", data);
    },
    reload() {
      api.getSummary().then(data => {
        this.$data.summary = data;
      });
      // Reload form
      (this.$refs.form as HTMLFormElement).reset();
    }
  }
});
</script>
