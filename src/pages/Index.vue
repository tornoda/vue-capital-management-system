<script>
import Header from "../components/Header.vue";
import Home from "../components/Home.vue";
import Nav from "../components/Nav.vue";
import { mapState, mapMutations } from "vuex";
export default {
  name: "index",
  computed: {
    ...mapState(["user", "isAuthentication"])
  },
  components: {
    Header,
    Nav
  },
  methods: {
    ...mapMutations(["GET_INFO_FROM_STORAGE_REFRESHING"])
  },
  created() {
    // this.$http.get("");
    const { commit } = this.$store;
    if (this.isAuthentication === true) return false;
    commit("GET_INFO_FROM_STORAGE_REFRESHING");
    // this.$store.state.user = {
    //   name: "hello world",
    //   avatar:
    //     "http://b.hiphotos.baidu.com/image/pic/item/cf1b9d16fdfaaf51bae68ed9815494eef01f7a4a.jpg"
    // };
  }
};
</script>

<template>
  <div class="index">
    <Header :user="user"></Header>
    <Nav class="left-nav"></Nav>
    <div class="right-content">
      <router-view></router-view>
    </div>
    <!-- <el-row>
      <el-col :span="3">
      </el-col>
      <el-col :span="21">
      </el-col>
    </el-row> -->
  </div>
</template>

<style scoped>
.index {
  width: 100%;
  height: 100%;
}
.left-nav {
  position: fixed;
  width: 140px;
  overflow: hidden;
}
.right-content {
  margin-left: 140px
}
</style>
