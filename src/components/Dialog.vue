<script>
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import { Message } from "element-ui";
export default {
  // props: {
  //   // btname: {
  //   //   type: String,err
  //   //   required: true
  //   // },
  //   // btntype: {
  //   //   type: String,
  //   //   default: ""
  //   // },
  //   // btnsize: {
  //   //   type: String,
  //   //   default: "small"
  //   // },
  //   // getEditData: {
  //   //   type: Function,
  //   //   default: () => {}
  //   // },
  //   // rowindex: {
  //   //   type: Number,
  //   //   default: undefined
  //   // },
  //   option: Object,
  //   formdata: Object
  // },
  name: "fdialog",
  components: {},
  // data: function() {
  //   return {
  //     formData: Object.assign({}, this.formdata)
  //   };
  // },
  computed: {
    ...mapState(["allTableData", "currentIndex", "pagination", "dialog"]),
    ...mapGetters(["pageNumber"])
  },
  created: function() {
    console.log("created");
    // this.dialogVisible = this.visible
  },
  methods: {
    ...mapActions(["ADD_LIST_REMOTE", "EDIT_LIST_REMOTE"]),
    ...mapMutations([
      "SET_CURRENT_PAGE",
      "SET_CURRENT_PAGINATION",
      "HIDE_DIALOG"
    ]),
    handleSubmit() {
      const { type } = this.dialog.option;
      const { currentPage } = this.pagination;
      const { dispatch, commit } = this.$store;
      const _this = this;
      const updateUI = ({ successMsg, err }) => {
        if (err) {
          Message({
            type: "error",
            message: "失败"
          });
        }
        commit("SET_CURRENT_PAGE", _this.pageNumber);
        commit("SET_CURRENT_PAGINATION", _this.pageNumber);
        Message({
          type: "success",
          message: successMsg
        });
      };
      commit("HIDE_DIALOG");
      switch (type) {
        case "edit":
          dispatch("EDIT_LIST_REMOTE", _this.currentIndex)
            .then(() => {
              //本dialog组件只负责更新数据（远端服务器），不负责ui更新。
              updateUI({ successMsg: "修改成功" });
            })
            .catch(err => {
              console.log(err);
              updateUI({ err });
            });
            break;
        case "add":
          dispatch("ADD_LIST_REMOTE")
            .then(() => {
              updateUI({ successMsg: "添加成功" });
            })
            .catch(err => {
              updateUI({ err });
            });
            break;
        default:
          break;
      }
    },
    handleCancel() {
      const { commit } = this.$store;
      commit("HIDE_DIALOG");
    }
  }
};
</script>

<template>
  <div class="dialog">
    <!-- <el-button :type="btntype || ''" @click="dialogVisible = true; $emit('getEditData')" :size="btnsize">{{btname}}</el-button> -->
    <el-dialog
      class="dialog"
      :title="dialog.option.title"
      :visible.sync="dialog.option.visible"
      width="30%"
      :append-to-body="true"
    >
      <el-form label-position="right" label-width="80px" :model="dialog.data">
        <el-form-item label="收支类型" prop="type">
          <el-select class="select" v-model="dialog.data.type" placeholder="收支类型">
            <el-option label="餐饮" value="餐饮"></el-option>
            <el-option label="娱乐" value="娱乐"></el-option>
            <el-option label="教育" value="教育"></el-option>
            <el-option label="医疗" value="医疗"></el-option>
            <el-option label="其他" value="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收支描述" required>
          <el-input v-model="dialog.data.describe"></el-input>
        </el-form-item>
        <el-form-item label="收入" required>
          <el-input v-model="dialog.data.income"></el-input>
        </el-form-item>
        <el-form-item label="支出" required>
          <el-input v-model="dialog.data.expend"></el-input>
        </el-form-item>
        <el-form-item label="账户现金" required>
          <el-input v-model="dialog.data.cash"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="dialog.data.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <!-- 这里之所以可以直接修改props的值，是因为，这里改的的option里对象里的值，vue没有监听到option的改变，
        如果之间option = {...}的话，vue才会监听到，会提示不要直接修改props的值。option又是一个引用数据，
        引用着内存上的一块地址，这么修改对原始数据有影响，需要注意。如果需要没有影响，可以使用Object.assign({}, theObject)
        对数据进行拷贝，再传入组件。
        这里更推荐的做法是：使用事件$emit("eventinparent")来改变父组件的state，继而诱发组件更新-->
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.select {
  width: 100%;
}
</style>
switch (key) {
  case value:
    
    break;

  default:
    break;
}