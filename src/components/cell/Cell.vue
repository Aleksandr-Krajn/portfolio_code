<template>
  <div class="cell">
    <div v-if="type === 'checkbox'" class="cell_item">
      <z-table-checkbox :active="active" :value="Boolean(Math.round(Math.random()))" />
    </div>
    <div v-else>
      {{ content }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cell',

  props: {
    type: [String],
    active: [Boolean],
    content: [String]
  }
}
</script>