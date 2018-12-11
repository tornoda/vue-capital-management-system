<script>
import { Loading } from "element-ui";
import { mapActions } from "vuex";

export default {
  name: "register",
  components: {},
  data: function() {
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.registerUser.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerUser: {
        name: "",
        email: "",
        password: "",
        password2: "",
        identity: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          },
          {
            min: 2,
            max: 30,
            message: "长度在2到30之间",
            trigger: "blur"
          }
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "Email必填",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          {
            min: 6,
            max: 30,
            message: "密码长度在6-30为之间",
            trigger: "blur"
          }
        ],
        password2: [
          {
            validator: validatePass2,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    ...mapActions(["REGISTER"]),

    submitForm: function(formRef) {
      const _this = this;
      const { dispatch } = _this.$store;
      this.$refs[formRef]
        .validate()
        .then(valid => {
          if (!valid) {
            _this.$message({
              message: "请检查您的表单",
              type: "error"
            });
            return false;
          }
          // _this.REGISTER(_this.registerUser);
          dispatch('REGISTER', _this.registerUser)
        })
        .catch(err => {
          throw err;
        });
    }
  }
};
</script>

<template>
  <div class="register">
    <section class="form_container">
        <div class="mangner_tip">
            <span class="title">
                在线后台管理系统
            </span>
        </div>
        <el-form :model="registerUser" :rules="rules" ref="registerForm" label-width="80px" class="register_form">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="registerUser.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="registerUser.email" placeholder="请输入Email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="registerUser.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="password2">
            <el-input type="password" v-model="registerUser.password2" placeholder="确认密码"></el-input>
          </el-form-item>
          <el-form-item label="选择身份">
            <el-select v-model="registerUser.identity"  placeholder="请选择身份" class="register_identity">
              <el-option label="管理员" value="manager"></el-option>
              <el-option label="员工" value="empolyee"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit-btn" @click="submitForm('registerForm')">注册</el-button>
          </el-form-item>
        </el-form>
    </section>
  </div>
</template>

<style scoped>
.register {
  width: 400px;
  margin: 35px auto;
}
.register_form {
  margin-top: 25px;
}
.mangner_tip {
  font-size: 24px;
}
.register_identity {
  width: 320px;
}
</style>
