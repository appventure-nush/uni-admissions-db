<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawerShown"
      temporary app>
      <v-list-item>
        <v-list-item-content>
          <v-icon size="100">mdi-account</v-icon>
          <v-list-item-title>
            Welcome, {{ user.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list
        dense
        nav>
        <router-link v-for="item in routes"
                     :to="item.route"
                     @click="drawerShown = false"
                     style="text-decoration: none; color: inherit;"
                     :key="item.name">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider/>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary"
      dark>
      <v-app-bar-nav-icon v-show="isSignedIn" @click="drawerShown = !drawerShown"/>
      <v-toolbar-title>
        Uni Admissions DB
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <template v-if="!isSignedIn">
          <v-row>
            <div class="mx-4">
              You're not signed in.
            </div>
            <v-btn v-on:click="signIn" class="primary mx-4">
              Sign in
            </v-btn>
          </v-row>

        </template>
      </v-container>
      <router-view v-if="isSignedIn"/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import User from "./types/user";
import api from "@/api";

const clientId = "ad4c43c7-eaff-45f7-b7b4-fedc6bcb85ca";
export default Vue.extend({
  name: "App",
  components: {},
  data: () => ({
    isSignedIn: false,
    user: {
      name: "",
      email: "",
    } as User,
    admin: false,
    drawerShown: false,
    adminRoutes: [
      {
        name: "Create new application",
        route: "/new-record",
        icon: "mdi-table-plus",
      },
      {
        name: "Bulk create applications",
        route: "/bulk-create",
        icon: "mdi-table-large-plus",
      },
    ]
  }),
  computed: {
    routes(): Array<{
      name: string,
      route: string,
      icon: string
    }> {
      const base = [
        {
          name: "View applications",
          route: "/",
          icon: "mdi-file-table-box",
        }
      ];
      if (this.$data.admin) {
        base.push(...this.$data.adminRoutes);
      }
      return base;
    },
  },
  methods: {
    signIn() {
      // eslint-disable-next-line no-restricted-globals
      location.href = `https://login.microsoftonline.com/d72a7172-d5f8-4889-9a85-d7424751592a/oauth2/authorize?client_id=${clientId}&redirect_uri=${location.origin}&response_type=id_token&nonce=${Math.random() * 1000}`;
    },
    handleLogin() {
      // Generic MS Auth code
      // eslint-disable-next-line no-restricted-globals
      const hashParams = new Map<string, string>(location.hash.substring(1)
        .split("&")
        .map((a) => a.split("=")
          .map((b) => b.replace("/", ""))) as [string, string][]);
      const cookies = new Map<string, string>(document.cookie.split(" ")
        .map((a) => a.split("=")) as [string, string][]);
      const code = hashParams.get("id_token") || cookies.get("token");
      if (!code?.includes(".") || code?.match(/\./g)?.length !== 2) return;
      const [, claimsString] = code.split(".");
      const claims = JSON.parse(atob(claimsString));
      this.user = {
        name: claims.name,
        email: claims.unique_name,
      };
      this.isSignedIn = true;
      if (code) {
        const expiry = new Date();
        expiry.setTime(expiry.getTime() + 30 * 24 * 60 * 60 * 1000);
        document.cookie = `token=${code};expires=${expiry.toUTCString()}`;
        if (this.$route.path !== "/") {
          this.$router.push("/");
        }
      }
    },
  },
  mounted() {
    this.handleLogin();
    if (this.$data.user) {
      api.checkAdmin().then(admin =>
        this.$data.admin = admin
      );
    }
  },
});
</script>
