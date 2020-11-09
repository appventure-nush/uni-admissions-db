<template>
  <v-autocomplete
    @input="$emit('update', universities.find(it=>it.value === universityId))"
    :filter="universityFilter"
    no-data-text="A university with that name can't be found."
    v-model="universityId"
    :items="universities"
    label="Select university"
  >
    <template v-slot:item="props">
      {{ props.item.text }}
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue';
import University from '@/types/university.d';
import api from "@/api";

export default Vue.extend({
  name: 'UniversityFilter',
  props: {
    uniId: Number,
  },
  data() {
    return {
      universities: [],
      universityId: this.uniId
    };
  },
  mounted() {
    api.getUniversities()
      .then((universities: University[]) => {
        this.$data.universities = universities.map(it => ({
          text: it.uniName,
          value: it.uniId
        }));
        if (this.uniId != 0) {
          this.$emit('update', this.$data.universities.find((it: any) => it.value === this.uniId));
        }
      });
  },
  methods: {
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
  }
});
</script>
