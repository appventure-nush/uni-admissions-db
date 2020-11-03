<template>
  <div>
    <UniversityFilter
      :uni-id="this.majorInfo == null ? 0 : this.majorInfo.uniId"
      @update="$data.university = $event"
    />
    <v-autocomplete
      :disabled="university==null && majorId==null"
      label="Select major"
      v-model="majorId"
      :items="majors"
      @input="update"
    >
      <template v-slot:item="props">
        {{ props.item.text }}
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import UniversityFilter from '@/components/UniversityFilter.vue';
import Vue from 'vue';
import api from "@/api";

export default Vue.extend({
  name: 'MajorFilter',
  props: {
    majorInfo: Object,
  },
  data() {
    return {
      university: null,
      major: null,
      majorId: this.majorInfo?.majorId,
      majors: [],
    };
  },
  watch: {
    university: async function (university) {
      const uniId = university ? university.value : -1;
      this.$data.majors = (await api.getMajors(uniId)).map(major => {
        return {
          text: major.majorName,
          value: major.majorId,
        };
      });
      // uni id changed
      if (uniId != this.majorInfo?.uniId) {
        this.$data.majorId = null;
        this.update();
      }
    }
  },
  methods: {
    update() {
      this.$emit("update", {
        uniId: this.$data.university?.value,
        majorId: this.$data.majorId,
      })
    }
  },
  components: {UniversityFilter}
});
</script>

