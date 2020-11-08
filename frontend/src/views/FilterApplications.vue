<template>
  <v-card>
    <v-card-title>
      Filter
    </v-card-title>
    <v-card-text>
      <v-tabs
        v-model="tabs"
        color="primary"
      >
        <v-tab
          class="ma-2"
          v-for='column in headers'
          :key="column.value">
          {{ column.text }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tabs">
        <v-tab-item
          v-for="column in headers"
          :key="column.value"
        >
          <v-card flat>
            <v-card-text>
              <v-switch
                v-if="column.value !== 'year'"
                @change="handleToggle(column.value)"
                :input-value="show.includes(column.value)"
                label="Show column"
              />
              <!--              Name = math.random() to prevent autofill -->
              <v-autocomplete
                :name="Math.random()"
                autocomplete="new-password"
                v-model="filterParams[column.value]"
                v-if="!range.includes(column.value) && !noFilter.includes(column.value)"
                :disabled="!show.includes(column.value)"
                :label="column.text"
                :filter="column.value === 'uniName' ? universityFilter : undefined"
                :items="getFilterItems(column.value)"
                chips
                clearable
                deletable-chips
                multiple
              />
              <v-range-slider
                v-model="filterParams[column.value]"
                v-if="range.includes(column.value)"
                :disabled="!show.includes(column.value)"
                :label="column.text"
                :max="Array.from(getFilterItems(column.value)).reverse()[0]"
                :min="getFilterItems(column.value)[0]"
                :step="column.value === 'gradCap' ? 0.1 : 1"
                thumb-label="always"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      <v-btn
        color="green"
        dark
        @click="$emit('filterUpdate', parseFilter(filterParams, true))">
        Done
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import api from "@/api";
import University from "@/types/university";
import Major from "@/types/major";
import config from "@/config";

export default Vue.extend({
  name: "FilterApplications",
  props: {
    headers: Array,
    show: Array,
  },
  data: function () {
    return {
      range: ["year", "gradCap"],
      noFilter: ["comment", "informant", "dateInformed"],
      tabs: null,
      summary: null,
      filterParams: {},
      universities: [] as University[],
      majors: [] as Major[],
    };
  },
  mounted() {
    api.getSummary().then(res => {
      this.$data.summary = res;
      this.$data.filterParams.year = [res.years[0], res.years[res.years.length - 1]];
      this.$data.filterParams.gradCap = [res.caps[0], res.caps[res.caps.length - 1]];
    });
    api.getMajors().then(res => {
      this.$data.majors = res;
    })
    api.getUniversities().then(res => {
      this.$data.universities = res;
    })
    this.show.push("year");
  },
  watch: {
    tabs: async function () {
      const queryString = this.parseFilter(this.$data.filterParams);
      this.$data.summary = await (await fetch(`${config.api}/api/summary?${queryString}`, {
        credentials: "include",
      })).json();
    }
  },
  methods: {
    handleToggle(column: string) {
      if (this.show.includes(column)) {
        this.show.splice(this.show.indexOf(column), 1);
      } else {
        this.show.push(column);
      }
    },
    getFilterItems(column: string) {
      if (this.$data.summary == null) {
        return [];
      }
      if (column == "gradCap") {
        return this.$data.summary[this.pluralize(column)].map((a: number | string) => {
          if (typeof a == "string") {
            return a;
          }
          return a / 10;
        });
      } else if (column == "uniName") {
        return this.$data.universities.filter((uni: University) =>
          this.checkRange(uni.uniId, this.$data.summary.universities)).map((uni: University) => uni.uniName)
      } else {
        return this.$data.summary[this.pluralize(column)];
      }
    },
    checkRange(item: number, range: Array<string | number>): boolean {
      if (item == range[0] || item == range[range.length - 1]) {
        return true
      }
      for (let i = 1; i < range.length - 1; i++) {
        if (range[i] == item) {
          return true;
        }
        if (range[i] == "..") {
          const lower = range[i - 1];
          const upper = range[i + 1];
          if (item <= upper && item >= lower) {
            return true;
          }
        }
      }
      return false;
    },
    pluralize(name: string) {
      const mapping = {
        category: "categories",
        status: "statuses",
        country: "countries",
        gradCap: "caps"
      } as any;
      if (!Object.keys(mapping).includes(name)) {
        return name + "s"
      }
      return mapping[name];
    },
    universityFilter(item: object, queryText: string, itemText: string): boolean {
      if (itemText.toLowerCase()
        .includes(queryText.toLowerCase())) {
        return true;
      }
      const acronym = Array.from(itemText)
        .filter(it => it === it.toUpperCase() && it !== it.toLowerCase())
        .join('');
      return acronym.includes(queryText.toUpperCase());
    },
    parseFilter(filter: { [name: string]: Array<any> }, parseAll = false): string {
      filter = Object.assign({}, filter);
      let out = ""
      const currentTab = (this.headers[this.$data.tabs] as any).value;
      for (let key in filter) {
        if (key == currentTab && !parseAll) {
          continue;
        }
        if (this.$data.range.includes(key)) {
          // Range support is yet to be added in backend
          if (key == "gradCap") {
            continue;
          }
          let c = 0;
          for (let i = filter[key][0]; i <= filter[key][1]; i++) {
            out += `&filter[${key}][${c}]=${i}`
            c++;
          }
          continue;
        }
        if (key == "uniName") {
          key = "uniId"
          filter["uniId"] = filter["uniName"].map(uniName => (this.$data.universities.find(
            (uni: University) => uni.uniName == uniName) as University).uniId
          )
        }
        for (let i = 0; i < filter[key].length; i++) {
          out += `&filter[${key}][${i}]=${filter[key][i]}`
        }
      }
      return out;
    }
  }
})
</script>

