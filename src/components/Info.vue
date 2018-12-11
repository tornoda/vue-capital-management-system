<script>
export default {
  props: ['avatar', 'name', 'identity'],
  name: 'info',
  components: {}
}

</script>

<template>
    <el-row class="index">
      <el-col :span="8">
        <img :src="avatar" alt="">
      </el-col>
      <el-col :span="14">
        <div>{{name}}</div>
        <div>{{identity}}</div>
      </el-col>
    </el-row>
</template>