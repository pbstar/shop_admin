<template>
  <div class="rights">
    <el-table :data="rightsList" max-height="650" border style="width: 100%">
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column label="权限级别">
        <template slot-scope="scope">
          <span v-show="scope.row.level==0">
            <el-tag>一级权限</el-tag>
          </span>
          <span v-show="scope.row.level==1">
            <el-tag type="success">二级权限</el-tag>
          </span>
          <span v-show="scope.row.level==2">
            <el-tag type="info">三级权限</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="权限路径"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  async created () {
    const res = await this.$http.get('rights/list')
    const { meta: { msg, status }, data } = res.data
    if (status !== 200) return this.$message.error(msg)
    this.rightsList = data
  }
}
</script>
