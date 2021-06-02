<template>
  <div class="login-container">
    <div class="login-box">
      <!-- 网站logo -->
      <div class="logo-box">
        <img src="./imgs/login.jpg" alt />
      </div>
      <!-- 表单 -->
      <el-form ref="form" :model="loginForm" class="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="输入用户名"
            prefix-icon="el-icon-user-solid"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
          type="password"
            v-model="loginForm.password"
            placeholder="输入密码"
            prefix-icon="iconfont icon-mima"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async submitForm (form) {
      try {
        // 校验表单
        await this.$refs.form.validate()
        // 如果验证通过，继续执行登录逻辑
        const res = await this.$http.post('login', this.loginForm)
        // 如果不熟悉解构赋值的语法，可以先用下面的语法
        // const status = res.data.meta.status
        // 解构赋值
        const { status, msg } = res.data.meta
        if (status === 400) {
          this.$message({
            message: msg,
            type: 'error',
            duration: 1000
          })
          return false
        }
        /**
         * 提示登录成功，即将跳转
         * $message是异步异步方法，所以先跳转后弹出提示
         * 如果希望先弹出提示，等到关闭后再跳转，需要再 onClose 事件编写代码
         * 注意：onclose 应该使用箭头函数，否则函数中的  this 执行为 undefined
         *
         */

        this.$message({
          message: '登录成功，即将跳转到后台首页',
          type: 'success',
          duration: 1000,
          onClose: () => {
            localStorage.setItem('token', res.data.data.token)
            this.$router.push('home')
          }
        })
      } catch (err) {
        this.$message.error(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login-container {
  background-image: url(./imgs/bj.jpg);
  background-size: 100% 100%;
  height: 100%;
  .login-box {
    width: 450px;
    height: 310px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 5px;
    .logo-box {
      position: absolute;
      width: 150px;
      height: 150px;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      background: #fff;
      padding: 5px;
      box-shadow: 0 0 10px #eee;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .loginForm {
      position: absolute;
      top: 120px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      text-align: center;
    }
  }
}
</style>
