<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Applications
        <v-spacer/>
        <v-checkbox
          class="ma-2"
          v-for='column in headers.filter(it=> !["id", "studentId", "uniName"].includes(it.value))'
          v-bind:key="column.value"
          v-model="showColumns"
          :label="column.text"
          :value="column.value">
          <v-spacer/>
        </v-checkbox>
      </v-card-title>
      <v-data-table
        :footer-props="{'items-per-page-options': [10,20,30,50]}"
        :headers='headers.filter(a=> ["id", "studentId", "uniName", ...showColumns].includes(a.value))'
        :items="parsedData"
        :loading="parsedData.length===0"
        :loading-text="fetchError ? fetchError : 'Loading...'"
        :options.sync="options"
        :server-items-length="totalItems"
        item-key="id"
      >
        <template
          v-for='headerItem of headers'
          v-slot:[getSlotName(headerItem)]="{ header }">
          {{ header.text }}
          <v-icon
            @click.stop="filterColumn===headerItem.value ? filterColumn='' : filterColumn=headerItem.value">
            mdi-filter-variant
          </v-icon>
          <div
            v-if="filterColumn===headerItem.value">
            Filtered: {{headerItem.text}}
          </div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import {DataOptions, DataTableHeader} from "vuetify";
import Application, {ApplicationTableRow} from "../types/application";
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
          text: "CAP",
          value: "gradCap",
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
      options: {
        multiSort: true
      } as DataOptions,
      fetchError: false,
      fetchedData: [] as Array<Application>,
      showColumns: ["id", "studentId", "uniName", "gradCap", "majorName", "category", "country", "status"],
      filterColumn: ""
    };
  },
  watch: {
    // Watch for pagination changes
    options: {
      handler() {
        this.fetchData().then((data: Paginated<Application>) => {
          this.fetchedData = data.data;
          if (data.data[0].comment !== undefined && !this.headers.map(it => it.value).includes("comment")) {
            this.headers.push(
              {
                text: "Comment",
                value: "comment",
              },
              {
                text: "Informant",
                value: "informant",
              },
              {
                text: "Date informed",
                value: "dateInformed",
              }
            )
          }
          this.totalItems = data.count;
        });
      },
      deep: true,
    },
  },
  computed: {
    parsedData(): ApplicationTableRow[] {
      if (this.totalItems === 0) return [];
      return this.$data.fetchedData.map((item: Application) => {
        return {
          id: item.id,
          studentId: item.Student.studentId,
          majorName: item.Major.majorName,
          category: item.Major.category,
          uniName: item.University.uniName,
          country: item.University.country,
          status: item.status,
          comment: item.comment,
          dateInformed: item.dateInformed,
          informant: item.informant,
          gradCap: item.Student.gradCap
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
    getSlotName(header: DataTableHeader): string {
      return "header." + header.value;
    },
    async fetchData(): Promise<Paginated<Application>> {
      this.loading = true;
      const {page, itemsPerPage, sortBy, sortDesc} = this.options;
      let queryString = `offset=${(page - 1) * itemsPerPage}&limit=${itemsPerPage}`;
      if (sortDesc.length == 1) {
        queryString += `&sortBy[0][param]=${sortBy}&sortBy[0][order]=${sortDesc[0] ? "desc" : "asc"}`
      } else {
        for (var i = 0; i < sortDesc.length; i++) {
          queryString += `&sortBy[${i}][param]=${sortBy[i]}&sortBy[${i}][order]=${sortDesc[i] ? "desc" : "asc"}`
        }
      }
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
  },
});
</script>
