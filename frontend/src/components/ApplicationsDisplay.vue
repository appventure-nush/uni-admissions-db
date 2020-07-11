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

<script>
export default {
  name: "ApplicationsDisplay",
  data() {
    return {
      endpoint: "https://uni-db.chatbox2.ml",
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
          sortable: false,
        },
        {
          text: "Major Name",
          value: "majorName",
          sortable: false,
        },
        {
          text: "Major Category",
          value: "category",
          sortable: false,
        },
        {
          text: "University Name",
          value: "uniName",
          sortable: false,
        },
        {
          text: "Country",
          value: "country",
          sortable: false,
        },
        {
          text: "Status",
          value: "status",
          sortable: false,
        },
      ],
      loading: true,
      totalItems: 0,
      options: {},
      fetchError: false,
      fetchedData: [],
      majors: [],
      universities: [],
    };
  },
  watch: {
    // Watch for pagination changes
    options: {
      handler() {
        this.fetchData().then((data) => {
          this.fetchedData = data.data;
          this.totalItems = data.count;
        });
        this.fetchUniversities().then((data) => {
          this.universities = data;
        });
        this.fetchMajors().then((data) => {
          this.majors = data;
        });
      },
      deep: true,
    },
  },
  computed: {
    parsedData() {
      if (this.totalItems === 0 || this.universities.length === 0
        || this.majors.length === 0) return [];
      return this.fetchedData.map((item) => {
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
    async fetchData() {
      this.loading = true;
      const { page, itemsPerPage } = this.options;
      const queryString = `offset=${(page - 1) * itemsPerPage}&limit=${itemsPerPage}`;
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
    async fetchMajors() {
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
    async fetchUniversities() {
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
};
</script>
