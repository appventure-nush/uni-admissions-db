<template>
  <v-container fluid>
    <v-card>
      <v-card-title>
        Applications
        <v-spacer/>
        <v-dialog
          v-model="filterDialog"
          max-width="1500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Filter
            </v-btn>
          </template>
          <FilterApplications
            :show.sync="showColumns"
            :headers='[{value: "year", text:"Year"}].concat(headers.filter(a=> !["id", "studentId"].includes(a.value)))'
            @filterUpdate="filter = $event; filterDialog = false"
          />
        </v-dialog>
      </v-card-title>
      <v-data-table
        :footer-props="{'items-per-page-options': [10,20,30,50]}"
        :headers='headers.filter(a=> ["id", "studentId", ...showColumns].includes(a.value))'
        :items="parsedData"
        :loading="parsedData.length===0"
        :loading-text="fetchError ? fetchError : 'Loading...'"
        :options.sync="options"
        :server-items-length="totalItems"
        item-key="id"
        @contextmenu:row="triggerMenu"/>

      <v-menu
        v-model="menu.show"
        :position-x="menu.x"
        :position-y="menu.y"
        absolute
        offset-y
      >
        <v-list
          dense
          v-if="selectedApplication">
          <v-subheader>
            Application {{ selectedApplication.id }} to {{ selectedApplication.University.uniName }}
          </v-subheader>
          <v-dialog
            v-model="menu.editing"
            @click:outside="menu.show = false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-list-item
                v-bind="attrs"
                v-on="on">
                <v-list-item-icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-list-item-icon>
                <v-list-item-title>
                  Edit
                </v-list-item-title>
              </v-list-item>
            </template>
            <EditApplicationForm
              :key="selectedApplication.id"
              :application="selectedApplication"
              @close="menu.show = menu.editing = false; reload()"
            />
          </v-dialog>
        </v-list>
      </v-menu>
    </v-card>
  </v-container>


</template>

<script lang="ts">
import Vue from "vue";
import {DataOptions, DataTableHeader} from "vuetify";
import Application, {ApplicationTableRow} from "@/types/application";
import Paginated from "@/types/paginated";
import config from "@/config";
import EditApplicationForm from "@/views/EditApplicationForm.vue";
import api from "@/api";
import FilterApplications from "@/views/FilterApplications.vue";


export default Vue.extend({
  name: "ApplicationsDisplay",
  components: {EditApplicationForm, FilterApplications},
  data() {
    return {
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
      menu: {
        show: false,
        x: 0,
        y: 0,
        editing: false,
      },
      selectedApplication: null as Application | null,
      filter: "",
      filterDialog: false,
    };
  },
  watch: {
    // Watch for pagination changes
    options: {
      handler() {
        this.update();
      },
      deep: true,
    },
    filter: function () {
      this.update();
    }
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
  async mounted() {
    await this.reload()
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
      queryString += this.$data.filter;
      // var cap = Math.round(this.$data.CAPrange[0] * 10);
      // i = 0;
      // while (cap <= this.$data.CAPrange[1]) {
      //   queryString += `&filter[gradCap][${i / 10.0}]=${cap.toString()}`;
      //   i += 10;
      //   cap += 0.1;
      // }
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
    async reload() {
      await this.fetchData().then((data) => {
        this.fetchedData = data.data;
        this.totalItems = data.count;
      });
    },
    async triggerMenu(event: MouseEvent, item: any) {
      event.preventDefault();
      this.$data.menu.show = false;
      this.$data.menu.x = event.clientX;
      this.$data.menu.y = event.clientY;
      const application = this.$data.fetchedData.find(
        (application: Application) => application.id === item.item.id
      ) as Application;
      const universityId = (await api.getUniversities()).find(university =>
        university.uniName == application.University.uniName)?.uniId;
      if (!universityId) {
        throw "Invalid university!";
      }
      const majorId = (await api.getMajors(universityId)).find(
        major => major.majorName == application.Major.majorName)?.majorId;
      if (!majorId) {
        throw "Invalid university!";
      }
      application.University.uniId = universityId;
      application.Major.majorId = majorId;
      application.Major.uniId = universityId;
      this.$data.selectedApplication = application;
      this.$nextTick(function () {
        this.$data.menu.show = true;
      });
    },
    update() {
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
    }
  },
});
</script>
