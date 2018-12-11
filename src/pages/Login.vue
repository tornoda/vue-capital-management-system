<script>
import { mapMutations, mapActions, mapState } from "vuex";

export default {
  name: "login",
  components: {},
  data: function() {
    return {
      loginUser: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            required: true,
            message: "Email不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    ...mapMutations(["SET_AUTHENTICATION", "SET_USER", "SAVE_TOKEN_TO_LOCAL"]),
    ...mapActions(["LOGIN"]),

    submitForm: function(formRef) {
      const _this = this;
      const { dispatch, commit } = _this.$store;
      this.$refs[formRef]
        .validate() //验证表单合理性
        .then(valid => {
          if (!valid) {
            _this.$message({
              message: "请检查您的表单",
              type: "error"
            });
            return false;
          }
          // _this.LOGIN(_this.loginUser)
          dispatch("LOGIN", _this.loginUser).then(({ tokenDecoded, token }) => {
            const { id, name, avatar, identity } = tokenDecoded;
            if (tokenDecoded) commit("SET_AUTHENTICATION");
            commit("SET_USER", { id, name, avatar, identity });
            commit("SAVE_TOKEN_TO_LOCAL", token);
          });
        })
        .catch(err => {
          throw err;
        });
    }
  }
};
</script>

<template>
  <div class="login">
    <section class="form_container">
      <div class="mangner_tip">
        <span class="title">
          请登录
        </span>
      </div>
      <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="80px" class="login_form">
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="loginUser.email" placeholder="请输入Email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
      <div>
        <p>没有帐号？<span><router-link to="/register">点击注册</router-link></span></p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.login {
  width: 400px;
  margin: 35px auto;
}
.login_form {
  margin-top: 25px;
}
.mangner_tip {
  font-size: 24px;
}
</style>
