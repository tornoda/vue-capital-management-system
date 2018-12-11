<script>
import { mapActions, mapState, mapGetters, mapMutations, Store } from "vuex";
import { Message } from "element-ui";
import Fdialog from "./Dialog.vue";
export default {
  name: "fundlist",
  components: { Fdialog },
  computed: {
    ...mapState([
      "tableData",
      "allTableData",
      "currentIndex",
      "dialog",
      "pagination",
      "datePicker"
    ]),
    ...mapGetters([
      "allTableDataNum",
      "isDatePickerDisabled",
      "pageNumber",
      "isResetBtnDisabled"
    ])
  },
  methods: {
    ...mapMutations([
      "SET_CURRENT_PAGE",
      "SET_ALL_DATA",
      "SET_CURRENT_PAGINATION",
      "FILTER_DATA",
      "FILTER_REMOVE",
      "SHOW_ADD_BTN",
      "SHOW_EDIT_BTN",
      "REMENBER_INDEX"
    ]),
    ...mapActions([
      "FETCH_PROFILES_DATA",
      "ADD_A_FUNDDATA",
      "DELETE_FUNDDATA",
      "EDIT_FUNDDATA"
    ]),
    updateTheTablePage: function(currentPage) {
      const { commit } = this.$store;
      commit("SET_CURRENT_PAGINATION", currentPage);
      commit("SET_CURRENT_PAGE", currentPage);
    },
    handleEdit: function({ index, data }) {
      const _this = this;
      const { dispatch } = this.$store;
      const newData = Object.assign({}, this.tableData[index], data);
      dispatch("EDIT_LIST_REMOTE", { index, newData })
        .then(() => {
          _this.updateTheTablePage(_this.pagination.currentPage);
          Message({
            type: "success",
            message: "更新成功"
          });
        })
        .catch(err => {
          Message({
            type: "error",
            message: `更新失败: ${err}`
          });
        });
    },
    handleDelete: function(index) {
      const { dispatch, commit } = this.$store;
      const _this = this;
      this.$confirm("确定删除数据？", "温馨提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        commit("REMENBER_INDEX", index);
        dispatch("DELETE_LIST_REMOTE")
          .then(() => {
            _this.updateTheTablePage(_this.pageNumber);
            Message({
              type: "success",
              message: "删除成功"
            });
            //删除成功后更新ui
          })
          .catch(err => {
            Message({
              type: "error",
              message: `删除失败：${err}`
            });
          });
      });
    },
    handleCurrentPageChange: function(currentPage) {
      const { commit } = this.$store;
      // this.pagination.currentPage = currentPage;
      this.updateTheTablePage(currentPage);
      // commit("SET_CURRENT_PAGE", currentPage);
    },
    handleFilter: function() {
      const { commit } = this.$store;
      commit("FILTER_DATA");
      this.updateTheTablePage(1);
    },
    handleFilterReset: function() {
      const { commit } = this.$store;
      commit("FILTER_REMOVE");
      this.updateTheTablePage(1);
    },
    showAddBtn: function() {
      const { commit } = this.$store;
      commit("SHOW_ADD_BTN");
    },
    showEditBtn: function(index, oldData) {
      const { commit } = this.$store;
      commit("REMENBER_INDEX", index);
      commit("SHOW_EDIT_BTN", oldData);
    }
  },
  created() {
    const { dispatch, commit } = this.$store;
    const _this = this;
    dispatch("FETCH_PROFILES_DATA").then(() => {
      commit("SET_CURRENT_PAGE");
      console.log(this.$store.getters.allTableDataNum);
    });
  }
};
</script>

<template>
  <div class="fundlist">
    <div class="date_filter">
      <el-date-picker
        v-model="datePicker.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      ></el-date-picker>
      <el-button
        class="filter-btn"
        size="small"
        :disabled="isDatePickerDisabled"
        @click="handleFilter"
      >筛选</el-button>
      <el-button
        class="filter-btn"
        size="small"
        :disabled="isResetBtnDisabled"
        @click="handleFilterReset"
      >重置</el-button>
    </div>
    <div class="btn-add">
      <!-- <Fdialog btname="添加" btntype="success" title="添加一条新数据" @confirm="handleAdd"></Fdialog> -->
      <el-button type="success" @click="showAddBtn" size="small">添加</el-button>
    </div>
    <div class="fundcontainer">
      <template v-if="tableData.length !== 0">
        <el-table border :data="tableData" style="width: 100%" :highlight-current-row="true">
          <el-table-column align="center" label="创建日期" width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.data }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="type" label="收支类型" width="90"></el-table-column>
          <el-table-column align="center" prop="describe" label="收支描述"></el-table-column>
          <el-table-column align="center" prop="income" label="收入" width="90"></el-table-column>
          <el-table-column align="center" prop="expend" label="支出" width="90"></el-table-column>
          <el-table-column align="center" prop="cash" label="账户现金" width="90"></el-table-column>
          <el-table-column align="center" prop="remark" label="备注"></el-table-column>
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <div class="btn-edit-delete">
                <el-button @click="showEditBtn(scope.$index, scope.row)" size="small">修改</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pagination.pageSize"
        :total="allTableDataNum"
        :current-page="pagination.currentPage"
        @current-change="handleCurrentPageChange"
      ></el-pagination>
    </div>
    <Fdialog></Fdialog>
  </div>
</template>

<style scoped>
/* .dialog-and-btn {
  text-align: right;
} */
.date_filter {
  text-align: left;
  padding-left: 20px;
  margin-top: 20px;
}
.filter-btn {
  margin-left: 20px;
}
.btn-add {
  text-align: right;
  margin-top: 20px;
  padding-right: 20px;
  margin-top: -36px;
}
.fundcontainer {
  margin: 20px 20px;
}
.btn-edit-delete {
  white-space: nowrap;
}
.btn-edit {
  display: inline-block;
  margin-right: 20px;
}
</style>
