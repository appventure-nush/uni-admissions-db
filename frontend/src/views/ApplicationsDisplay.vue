<template>
  <v-container fluid>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        max-width="600px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
          >
            filter
          </v-btn>
        </template>
        <v-card
        color="white">
          <v-card-title>
            <span class="headline">Filter</span>
          </v-card-title>
          <v-checkbox
            class="ma-2"
            v-for='column in headers.filter(it=> !["id", "studentId", "uniName"].includes(it.value))'
            v-bind:key="column.value"
            v-model="showColumns"
            :label="column.text"
            :value="column.value">
            <v-spacer/>
          </v-checkbox>
          <v-range-slider
            :disabled="!(showColumns.includes('gradCap'))"
            v-model="CAPrange"
            label="CAP range"
            min="2"
            max="5"
            :hint="CAPrange[0].toString() +' to ' + CAPrange[1]"
            persistent-hint="true"
            step="0.1"/>
        </v-card>
      </v-dialog>
    </v-row>
    <v-card>
      <v-card-title>
        Applications
        <v-spacer/>
      </v-card-title>
      <v-data-table
        :footer-props="{'items-per-page-options': [10,20,30,50]}"
        :headers='headers.filter(a=> ["id", "studentId", "uniName", ...showColumns].includes(a.value))'
        :items="parsedData"
        :loading="parsedData.length===0"
        :loading-text="fetchError ? fetchError : 'Loading...'"
        :options.sync="options"
        :server-items-length="totalItems"
        item-key="id"/>
    </v-card>
  </v-container>


</template>



<script lang="ts">
import Vue from "vue";
import {DataOptions, DataTableHeader} from "vuetify";
import Application, {ApplicationTableRow} from "../types/application";
import Paginated from "@/types/paginated";
import config from "@/config";

export default Vue.extend({
  name: "ApplicationsDisplay",
  data() {
    return {
      CAPrange: [4,5],
      headers: [
        {
          text: "ID",
          value: "id",
          divider: true,
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
      var cap = Math.round(this.$data.CAPrange[0]*10);
      i = 0;
      while (cap <= this.$data.CAPrange[1]) {
        queryString += `&filter[gradCap][${i/10.0}]=${cap.toString()}`;
        i += 10;
        cap += 0.1;
      }
      return fetch(`${config.api}/api/applications?${queryString}`, {
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
