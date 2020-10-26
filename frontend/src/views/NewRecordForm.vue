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
          lazy-validation
        >
          <v-text-field
            v-model="studentId"
            label="Student ID"
            :rules="studentIdRules"
            required
          ></v-text-field>
          <UniversityFilter @update="$data.university = $event"/>
          <v-autocomplete
            v-model="status"
            :items="statuses"
            label="Select status"
          ></v-autocomplete>
        </v-form>
      </div>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import UniversityFilter from "@/components/UniversityFilter.vue"

export default Vue.extend({
  name: "NewRecordForm",
  components: {UniversityFilter},
  data() {
    return {
      studentId: "",
      studentIdRules: [
        (v: string) => /^20[0-9]{2}a[0-9]{3}$/.test(v) || "Invalid student ID",
      ],
      university: "",
      status: "",
      statuses: ["Accepted", "Offered", "Rejected", "Waitlist", "Interview"],
    };
  },
});
</script>
