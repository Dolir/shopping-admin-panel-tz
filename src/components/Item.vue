<template>
  <div class="item-block">
    <h5>{{ data.name }}</h5>
    <div class="d-flex">
      <va-icon name="delete" color="danger" 
       @click="$emit('deleteItem', data)"  v-if="!submitted"/>
      <va-divider vertical  v-if="!submitted"/>
      <va-icon name="remove" color="primary"  @click="$emit('decrementItem', data)"  v-if="!submitted"/>
      <va-divider vertical  v-if="!submitted"/>
      <span class="item-quantity"> {{ data.quantity }}</span>
     
      <va-divider vertical  v-if="!submitted"/>
      <va-icon name="add" color="primary" @click="$emit('incrementItem', data)" v-if="!submitted"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "Item",
  props: {
    data: Object,
    submitted: Boolean
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-block h5 {
  font-size: 14px;
  color: rgb(161, 161, 161);
}
.item-quantity{
  width: 40px;
  display: flex;
  justify-content: center;
}
i {
  border-radius: 10px;
  transition-duration: 0.2s;
}
i:hover {
  background-color: rgb(243, 243, 243);

  transition-duration: 0.2s;
}
i:active{
  filter: brightness(90%);
}
</style>
