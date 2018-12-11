<script>

export default {
  name: 'Nav',
  components: {},
  data: () => ({
    submenu: [
      {
        titlename: '资金管理',
        titleicon: 'fa fa-bitcoin',
        subitems: [
          {
            titlename: '资金流水',
            to: '/index/fundlist'
          }
        ]
      },
      {
        titlename: '信息管理',
        titleicon: 'fa fa-info-circle',
        subitems: [
          {
            titlename: '个人信息',
            to: '/index/info'
          }
        ]
      }
    ]
  })
}

</script>

<template>
  <div class="nav">
    <el-menu
      default-active="2"
      class="">
      <router-link  class="router-link" to="/index">
        <el-menu-item index="1">
          <i class="fa fa-home"></i >首页
        </el-menu-item>
      </router-link>
      <template v-for="(item, idx) in submenu">
        <el-submenu :key="idx" :index="item.titlename">
          <template slot="title">
            <i :class="item.titleicon"></i>
            <span>{{item.titlename}}</span>
          </template>
          <template v-for="(subitem, index) in item.subitems">
            <router-link class="router-link" :to="subitem.to" :key="index">
              <el-menu-item :index="subitem.titlename">
                {{subitem.titlename}}
              </el-menu-item>
            </router-link>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<style scoped>
.nav {
  text-align: left;
}
.fa {
  padding-right: 5px;
}
.router-link {
  color: rgb(48, 49, 51);
  text-decoration: none;
}
.router-link:visited {
  color: rgb(48, 49, 51);
}
</style>
