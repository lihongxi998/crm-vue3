<template>
  <div class="customer-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户管理</span>
          <el-button type="primary" size="small" @click="handleCreate">新建客户</el-button>
        </div>
      </template>
      
      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="客户名称">
          <el-input v-model="queryParams.name" placeholder="请输入客户名称" clearable />
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="queryParams.mobile" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="合作中" value="1" />
            <el-option label="未活跃" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      
      <el-table :data="customers" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="name" label="客户名称" width="180" />
        <el-table-column prop="mobile" label="手机号" width="130" />
        <el-table-column prop="telephone" label="电话" width="130" />
        <el-table-column prop="level" label="等级" width="100" />
        <el-table-column prop="source" label="来源" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '合作中' : '未活跃' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button size="small" type="primary" @click="handleDetail(row)">详情</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="pagination.pageNo"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next"
        @size-change="loadData"
        @current-change="loadData"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)

const queryParams = reactive({
  name: '',
  mobile: '',
  status: ''
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const customers = ref<any[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...queryParams,
      pageNo: pagination.pageNo,
      pageSize: pagination.pageSize
    }
    // Mock data for now - will work when backend is connected
    customers.value = []
    pagination.total = 0
  } catch (error: any) {
    console.error('加载客户列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { name: '', mobile: '', status: '' })
  pagination.pageNo = 1
  loadData()
}

const handleCreate = () => {
  ElMessage.info('新建客户功能开发中...')
}

const handleEdit = (row: any) => {
  ElMessage.info(`编辑客户: ${row.name}`)
}

const handleDetail = (row: any) => {
  ElMessage.info(`查看客户详情: ${row.name}`)
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该客户吗？', '提示', { type: 'warning' })
    ElMessage.success('删除成功')
    loadData()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.customer-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
