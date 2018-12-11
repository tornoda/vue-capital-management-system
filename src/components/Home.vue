<script>

export default {
  props: ['user'],
  name: 'home',
  components: {}
}

</script>

<template>
  <div class="index">
    <div class="filter"></div>
    <div class="container">
      <h1>欢迎来到来到在线管理，{{user}}</h1>
      <p>{{Date.now()}}</p>
    </div>
  </div>
</template>

<style scoped>
/* .index {
  position: relative;
  color: #fff;
}
.filter {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('../../public/img/bcground.jpeg') no-repeat;
  background-size: 100% 100%;
  filter: blur(2px);
}
.container {
  width: 100%;
  height: 100%;
  position: absolute;
} */
h1 {
  padding-top: 200px;
  font-size: 18px;
  line-height: 50px;
}
</style>
