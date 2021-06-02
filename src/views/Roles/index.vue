<template>
  <div class="roles">
    <el-row>
      <el-col :span="12">
        <el-button type="primary" style="margin-left: 30px" @click="addFormVisible=true">新增角色</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="rolesList" max-height="580" border style="width: 100%; margin-top: 30px">
          <el-table-column label="角色名称">
            <template slot-scope="scope">
              <el-link type="primary" @click="showRights(scope.row)">{{scope.row.roleName}}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" circle @click="showEditDialog(scope.row.id)" title="编辑角色">
              </el-button>
              <el-button size="mini" type="info" icon="el-icon-setting" circle @click="showSetRightDialog(scope.row)" title="分配权限">
              </el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" circle title="删除角色" @click="delRole(scope.row)">
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog :title="isAdd ? '新增角色' : '编辑角色：' + RoleForm.roleName" :visible.sync="addFormVisible" @close="closeDialog">
      <el-form ref="form" :model="RoleForm" :rules="addFormRulers">
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="RoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input v-model="RoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole('form')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="当前角色拥有的权限" :visible.sync="rightsDialog">
      <el-row v-for="one in RoleInfo.children" :key="one.id">
        <el-col :span="4">
          <el-tag class="rightsTag">{{one.authName}}</el-tag>
        </el-col>
        <el-col :span="20">
          <el-row v-for="two in one.children" :key="two.id">
            <el-col :span="5">
              <el-tag class="rightsTag" type="success">{{two.authName}}</el-tag>
            </el-col>
            <el-col :span="19">
              <el-tag class="rightsTag" v-for="three in two.children" :key="three.id" type="info">{{three.authName}}</el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" @close="closeDialog">
      <el-tree :data="rightsList" show-checkbox node-key="id" :default-expanded-keys="currentRights" :default-checked-keys="currentRights"
        :props="defaultProps" ref="treeRef">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="distribution">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isAdd: true,
      keyword: '',
      rolesList: [],
      rightsList: [],
      currentRights: [],
      RoleInfo: {},
      rightsDialog: false,
      setRightDialogVisible: false,
      formLabelWidth: '80px',
      value1: true,
      value2: false,
      addFormVisible: false,
      id: -1,
      roleId: -1,
      defaultProps: {
        label: 'authName'
      },
      RoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRulers: {
        roleName: [
          {
            required: true,
            message: '角色名称不能为空',
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
      const res = await this.$http.get('roles')
      const { meta: { msg, status }, data } = res.data
      if (status !== 200) return this.$message.error(msg)
      this.rolesList = data
    },
    showRights (RoleInfo) {
      this.RoleInfo = RoleInfo
      this.rightsDialog = true
    },
    async saveRole () {
      if (this.isAdd) {
        this.addRole()
      } else {
        this.editeRole()
      }
    },
    async addRole () {
      try {
        await this.$refs.form.validate()
        const res = await this.$http.post('roles', this.RoleForm)
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
          message: '添加角色成功',
          type: 'success',
          duration: 1000
        })
      } catch (err) {
        this.$message.error(err.message)
      }
    },
    async editeRole () {
      try {
        await this.$refs.form.validate()
        const res = await this.$http.put('roles/' + this.id, {
          roleName: this.RoleForm.roleName,
          roleDesc: this.RoleForm.roleDesc
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
          message: '修改角色信息成功',
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
      const res = await this.$http.get('roles/' + id)
      const { meta: { status }, data } = res.data
      if (status === 400) return this.$massage.error('请求的角色不存在')
      this.RoleForm.roleName = data.roleName
      this.RoleForm.roleDesc = data.roleDesc
      this.addFormVisible = true
    },
    async delRole (RoleInfo) {
      try {
        await this.$confirm('确定要删除角色：' + RoleInfo.roleName + '吗？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await this.$http.delete('roles/' + RoleInfo.id)
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
    // 展示所有权限
    async showSetRightDialog (roleInfo) {
      // 存储起来，保存权限的接口需要角色id
      this.roleId = roleInfo.id
      // 当点击分配权限按钮时，展示对应的对话框
      this.setRightDialogVisible = true
      // 获取当前角色拥有的权限
      this.getThreeKeys(roleInfo, this.currentRights)
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      // 如果返回状态为异常状态则报错并返回
      if (res.meta.status !== 200) { return this.$message.error('获取权限树失败') }
      // 如果返回状态正常，将请求的数据保存在data中
      this.rightsList = res.data
    },
    async distribution () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 转换成字符串
      const ids = keys.join(',')
      // 发送请求完成更新
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: ids }
      )
      if (res.meta.status !== 200) { return this.$message.error('分配权限失败') }
      this.$message.success('分配权限成功')
      // 关闭对话框
      this.closeDialog()
      this.loadData()
    },
    getThreeKeys (node, arr) {
      // 使用递归实现三级权限的获取
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getThreeKeys(item, arr)
      })
    },
    closeDialog () {
      this.isAdd = true
      this.setRightDialogVisible = false
      this.RoleForm.roleName = ''
      this.RoleForm.roleDesc = ''
      this.currentRights = []
    }
  }
}
</script>
<style scoped>
.rightsTag {
  margin: 5px 10px !important;
}
</style>
