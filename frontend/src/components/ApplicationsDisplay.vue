<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Applications
        <v-spacer/>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="parsedData"
        :loading="parsedData.length===0"
        :loading-text="fetchError ? fetchError : 'Loading...'"
        :options.sync="options"
        :server-items-length="totalItems"
        item-key="id"
      />
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {DataOptions, DataTableHeader} from "vuetify";
import Application, {ApplicationTableRow} from "../types/application";
import Major from "../types/major";
import University from "../types/university";
import Paginated from "@/types/paginated";

export default Vue.extend({
  name: "ApplicationsDisplay",
  data() {
    return {
      // eslint-disable-next-line no-restricted-globals
      endpoint: location.hostname === "localhost" ? "https://uni-db.chatbox2.ml" : location.origin,
      headers: [
        {
          text: "ID",
          value: "id",
          divider: true,
          width: "10%",
        },
        {
          text: "Student Id",
          value: "studentId",
        },
        {
          text: "Major Name",
          value: "majorName",
        },
        {
          text: "Major Category",
          value: "category",
        },
        {
          text: "University Name",
          value: "uniName",
        },
        {
          text: "Country",
          value: "country",
        },
        {
          text: "Status",
          value: "status",
        },
      ] as Array<DataTableHeader>,
      loading: true,
      totalItems: 0,
      options: {} as DataOptions,
      fetchError: false,
      fetchedData: [] as Array<Application>,
      majors: [] as Array<Major>,
      universities: [] as Array<University>,
    };
  },
  watch: {
    // Watch for pagination changes
    options: {
      handler() {
        this.fetchData().then((data: Paginated<Application>) => {
          this.fetchedData = data.data;
          this.totalItems = data.count;
        });
        this.fetchUniversities().then((data: University[]) => {
          this.universities = data;
        });
        this.fetchMajors().then((data: Major[]) => {
          this.majors = data;
        });
      },
      deep: true,
    },
  },
  computed: {
    parsedData(): ApplicationTableRow[] {
      if (this.totalItems === 0 || this.universities.length === 0
        || this.majors.length === 0) return [];
      return this.$data.fetchedData.map((item: Application) => {
        const major = this.majors[item.majorId - 1];
        const university = this.universities[item.uniId - 1];
        return {
          id: item.id,
          studentId: item.studentId,
          majorName: major.majorName,
          category: major.category,
          uniName: university.uniName,
          country: university.country,
          status: item.status,
        };
      });
    },
  },
  mounted() {
    this.fetchData().then((data) => {
      this.fetchedData = data.data;
      this.totalItems = data.count;
    });
  },
  methods: {
    async fetchData(): Promise<Paginated<Application>> {
      this.loading = true;
      const {page, itemsPerPage, sortBy, sortDesc} = this.options;
      console.log(sortDesc, sortBy)
      var queryString = `offset=${(page - 1) * itemsPerPage}&limit=${itemsPerPage}`;
      if (sortDesc.length == 1) queryString += `&sortBy=${sortBy[0]}&sortDesc=${sortDesc[0]}`
      console.log(queryString)
      return fetch(`${this.endpoint}/api/applications?${queryString}`, {
        credentials: "include",
      })
        .then((a) => a.text())
        .then((text) => {
          try {
            this.fetchError = false;
            return JSON.parse(text);
          } catch (e) {
            this.fetchError = e.toString();
          }
          return null;
        })
        .catch((e) => {
          this.fetchError = e.toString();
          return null;
        });
    },
    async fetchMajors(): Promise<Major[]> {
      return fetch(`${this.endpoint}/api/majors`, {
        credentials: "include",
      })
        .then((a) => a.text())
        .then((text) => {
          try {
            this.fetchError = false;
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
    async fetchUniversities(): Promise<University[]> {
      return fetch(`${this.endpoint}/api/universities`, {
        credentials: "include",
      })
        .then((a) => a.text())
        .then((text) => {
          try {
            this.fetchError = false;
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
  },
});
</script>
