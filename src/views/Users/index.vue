<template>
  <div class="users">
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入内容"
                  v-model="keyword"
                  class="input-with-select">
          <el-button slot="append"
                     icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="12">
        <el-button type="primary"
                   style="margin-left: 30px"
                   @click="addFormVisible=true">新增用户</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="userList"
                  max-height="580"
                  border
                  style="width: 100%; margin-top: 30px">
          <el-table-column prop="username"
                           label="用户名">
          </el-table-column>
          <el-table-column prop="mobile"
                           label="手机">
          </el-table-column>
          <el-table-column prop="email"
                           label="地址"> </el-table-column>

          <el-table-column prop="role_name"
                           label="角色"> </el-table-column>
          <el-table-column prop="create_time"
                           label="创建时间"></el-table-column>

          <el-table-column label="用户状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"
                         @change="changeState(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="operation"
                           label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         type="primary"
                         icon="el-icon-edit"
                         circle
                         @click="showEditDialog(scope.row.id)"
                         title="编辑用户">
              </el-button>
              <el-button size="mini"
                         type="info"
                         icon="el-icon-setting"
                         circle
                         @click="showSetRoleDialog(scope.row.id)"
                         title="分配角色">
              </el-button>
              <el-button size="mini"
                         type="danger"
                         icon="el-icon-delete"
                         circle
                         title="删除用户"
                         @click="delUser(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :title="isAdd ? '新增用户' : '编辑用户：' + userForm.username"
               :visible.sync="addFormVisible"
               @close="closeDialog">
      <el-form ref="form"
               :model="userForm"
               :rules="addFormRulers">
        <el-form-item v-if="isAdd"
                      label="用户名"
                      :label-width="formLabelWidth"
                      prop="username">
          <el-input v-model="userForm.username"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="isAdd"
                      label="密码"
                      :label-width="formLabelWidth"
                      prop="password">
          <el-input v-model="userForm.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      :label-width="formLabelWidth"
                      prop="mobile">
          <el-input v-model="userForm.mobile"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      :label-width="formLabelWidth"
                      prop="email">
          <el-input v-model="userForm.email"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveUser('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色"
               :visible.sync="setRoleDialogVisible"
               @close="closeDialog">
      <el-radio v-model="radio"
                v-for="item in rolesList"
                :key="item.id"
                :label="item.id">{{item.roleName}}</el-radio>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    // 用于验证用户输入的手机号是否正确
    function checkMobile (rule, value, callback) {
      const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请填入正确的手机号'))
      }
    }
    // 用于验证用户输入的邮箱是否正确
    function checkEmail (rule, value, callback) {
      const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('请填入正确的邮箱'))
      }
    }
    return {
      isAdd: true,
      keyword: '',
      userList: [],
      formLabelWidth: '70px',
      value1: true,
      value2: false,
      radio: '1',
      userId: '',
      addFormVisible: false,
      setRoleDialogVisible: false,
      id: -1,
      userForm: {
        username: '',
        password: '',
        mobile: '',
        email: ''
      },
      rolesList: [],
      addFormRulers: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 6,
            message: '用户名必须在3-6个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  async created () {
    this.loadData()
  },
  methods: {
    async loadData () {
      const res = await this.$http.get('users', {
        params: {
          pagenum: 1,
          pagesize: 15
        }
      })
      this.userList = res.data.data.users
    },
    async changeState (user) {
      const url = 'users/' + user.id + '/state/' + user.mg_state
      const res = await this.$http.put(url)
      const { meta: { status } } = res.data
      if (status !== 200) {
        user.mg_state = !user.mg_state
        this.$message.success('设置用户状态失败')
        return false
      }
      this.$message.success('设置用户状态成功')
    },
    async saveUser (form) {
      if (this.isAdd) {
        this.addUser()
      } else {
        this.editeUser()
      }
    },
    async addUser () {
      try {
        await this.$refs.form.validate()
        const res = await this.$http.post('users', this.userForm)
        const { status, msg } = res.data.meta
        if (status === 400) {
          this.$message({
            message: msg,
            type: 'error',
            duration: 1000
          })
          return false
        }
        this.loadData()
        this.addFormVisible = false
        this.$message({
          message: '添加用户成功',
          type: 'success',
          duration: 1000
        })
      } catch (err) {
        this.$message.error(err)
      }
    },
    async editeUser () {
      try {
        await this.$refs.form.validate()
        const res = await this.$http.put('users/' + this.id, {
          email: this.userForm.email,
          mobile: this.userForm.mobile
        })
        const { status, msg } = res.data.meta
        if (status === 400) {
          this.$message({
            message: msg,
            type: 'error',
            duration: 1000
          })
          return false
        }
        this.loadData()
        this.addFormVisible = false
        this.$message({
          message: '修改用户信息成功',
          type: 'success',
          duration: 1000
        })
      } catch (err) {
        this.$message.error(err)
      }
    },
    async showEditDialog (id) {
      this.isAdd = false
      this.id = id
      const res = await this.$http.get('users/' + id)
      const { meta: { status }, data } = res.data
      if (status === 400) return this.$massage.error('请求的用户不存在')
      this.userForm.username = data.username
      this.userForm.mobile = data.mobile
      this.userForm.email = data.email
      this.addFormVisible = true
    },
    async showSetRoleDialog (id) {
      const { data: res1 } = await this.$http.get('roles')
      if (res1.meta.status !== 200) { return this.$message.error('获取角色列表失败') }
      this.rolesList = res1.data
      this.userId = id
      const { data: res2 } = await this.$http.get('users/' + id)
      if (res2.meta.status !== 200) { return this.$message.error('获取自身角色失败') }
      this.radio = res2.data.rid
      this.setRoleDialogVisible = true
    },
    async saveRole () {
      const { data: res } = await this.$http.put('users/' + this.userId + '/role', {
        rid: this.radio
      })
      if (res.meta.status !== 200) { return this.$message.error('分配失败') }
      this.setRoleDialogVisible = false
      this.loadData()
      this.$message({
        type: 'success',
        message: res.meta.msg
      })
    },
    async delUser (userInfo) {
      try {
        await this.$confirm('确定要删除用户：' + userInfo.username + '吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.$http.delete('users/' + userInfo.id)
        const { meta: { msg, status } } = res.data
        if (status !== 200) return this.$message.error(msg)
        this.loadData()
        this.$message({
          type: 'success',
          message: msg
        })
      } catch (err) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    closeDialog () {
      this.isAdd = true
      this.userForm.username = ''
      this.userForm.password = ''
      this.userForm.mobile = ''
      this.userForm.email = ''
    }
  }
}
</script>
