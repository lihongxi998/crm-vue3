<template>
  <div class="contact-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>联系人管理</span>
          <div class="header-actions">
            <el-button type="success" size="small" @click="handleExport">导出</el-button>
            <el-button type="primary" size="small" @click="handleCreate">新建联系人</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="姓名">
          <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="queryParams.customerId" placeholder="请选择" clearable filterable style="width: 140px">
            <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="queryParams.position" placeholder="请输入职位" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="contacts" v-loading="loading" style="width: 100%" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="contactSn" label="编号" width="140" />
        <el-table-column prop="customerName" label="客户" width="150" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="position" label="职位" width="120" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
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
import { listContact, delContact, listCustomer as listCrmCustomer } from '@/api/crm'

const loading = ref(false)
const selectedRows = ref<any[]>([])

const queryParams = reactive({
  name: '',
  customerId: undefined as number | undefined,
  position: ''
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const contacts = ref<any[]>([])
const customerList = ref<any[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const params = { ...queryParams, pageNo: pagination.pageNo, pageSize: pagination.pageSize }
    const res: any = await listContact(params)
    contacts.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载联系人列表失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const loadCustomerList = async () => {
  try {
    const res: any = await listCrmCustomer({ pageNo: 1, pageSize: 200 })
    customerList.value = res?.list || []
  } catch (e) { /* ignore */ }
}

const resetQuery = () => {
  Object.assign(queryParams, { name: '', customerId: undefined, position: '' })
  pagination.pageNo = 1
  loadData()
}

const handleCreate = () => { ElMessage.info('新建联系人功能开发中...') }
const handleEdit = (row: any) => { ElMessage.info(`编辑联系人: ${row.name}`) }
const handleDetail = (row: any) => { ElMessage.info(`查看联系人详情: ${row.contactSn}`) }
const handleExport = () => { ElMessage.info('导出功能开发中...') }

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该联系人吗？', '提示', { type: 'warning' })
    await delContact([row.id])
    ElMessage.success('删除成功')
    loadData()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e.message || '删除失败')
  }
}

const handleSelectionChange = (rows: any[]) => { selectedRows.value = rows }

onMounted(() => { loadData(); loadCustomerList() })
</script>

<style scoped>
.contact-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.header-actions { display: flex; gap: 8px; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
