<script>
import { mapMutations } from 'vuex'
export default {
  props: ["user"],
  name: "header-nav",
  components: {},
  methods: {
    ...mapMutations(["EXIT"]),

    handleMenuClick: function(cmdName) {
      switch (cmdName) {
        case "showProfile":
          this.showProfile();
          break;
        case "exit":
          this.$store.commit("EXIT");
        default:
          break;
      }
    },
    showProfile: function () {
      console.log('应该展示个人信息')
      this.$router.push("/info")
    }
  }
};
</script>

<template>
  <el-row class="header">
    <el-col :span="12" class="header-left">
      在线系统管理平台
    </el-col>
    <el-col :span="12" class="header-right">
      <img class="avatar" :src="user.avatar" alt="avatar">
      <div class="user-name">
        <p>欢迎</p>
        <p>{{user.name}}</p>
      </div>
      <el-dropdown class="dropdown" trigger="click" placement="bottom-end" @command="handleMenuClick">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="showProfile">个人信息</el-dropdown-item>
          <el-dropdown-item  command="exit">退出</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
    </el-col>
  </el-row>
</template>

<style scoped>
.header {
  background-color: blueviolet;
  padding: 8px 20px;
  color: #fff;
  line-height: 30px;
}
.header-left {
  /* float: left;
  width: 50%; */
  line-height: 40px;
  text-align: left;
}
.header-right {
  /* display: inline-block;
  width: 50%; */
  text-align: right;
  line-height: 100%;
}
.header-right * {
  vertical-align: middle;
}
.avatar {
  display: inline-block;
  margin-right: 10px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
}
.user-name {
  display: inline-block;
  line-height: 20px;
  text-align: center;
}
.dropdown {
  line-height: 100%;
  margin-left: 20px;
}
.el-dropdown-link {
  color: #fff;
  margin-left: -12px;
}
.el-dropdown-link:hover {
  cursor: pointer;
  padding-left: 5px;
  padding-left: 0;
}
.exit {
  margin-left: 10px;
}
</style>
