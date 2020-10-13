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
          <v-autocomplete
            :filter="universityFilter"
            no-data-text="A university with that name can't be found."
            v-model="university"
            :items="universities"
            label="Select university"
          >
            <template v-slot:item="props">
              {{ props.item.text }}
            </template>
          </v-autocomplete>
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
import University from "@/types/university";

export default Vue.extend({
  name: "NewRecordForm",
  data() {
    return {
      studentId: "",
      studentIdRules: [
        (v: string) => /^20[0-9]{2}a[0-9]{3}$/.test(v) || "Invalid student ID",
      ],
      university: "",
      universities: [] as University[],
      status: "",
      statuses: ["Accepted", "Offered", "Rejected", "Waitlist", "Interview"],
      // eslint-disable-next-line no-restricted-globals
      endpoint: location.hostname === "localhost" ? "https://uni-db.junron.dev" : location.origin,
    };
  },
  mounted() {
    const data = this.$data;
    this.fetchUniversities().then(universities => {
      data.universities = universities.map(it => ({
        text: it.uniName,
        value: it.uniId
      }));
    })
  },
  methods: {
    universityFilter(item: object, queryText: string, itemText: string): boolean {
      if (itemText.toLowerCase().includes(queryText.toLowerCase())) {
        return true
      }
      const acronym = Array.from(itemText).filter(it => it == it.toUpperCase() && it != it.toLowerCase()).join("")
      return acronym.includes(queryText.toUpperCase());
    },
    async fetchUniversities(): Promise<University[]> {
      return fetch(`${this.endpoint}/api/universities`, {
        credentials: "include",
      })
        .then((a) => a.text())
        .then((text) => {
          try {
            return JSON.parse(text);
          } catch (e) {
            console.log(e);
          }
          return null;
        })
        .catch((e) => {
          console.log(e);
          return null;
        });
    },
  }
});
</script>
