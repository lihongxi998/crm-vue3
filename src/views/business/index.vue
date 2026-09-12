<template>
  <div class="business-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>商机管理</span>
          <div class="header-actions">
            <el-button type="success" size="small" @click="handleExport">导出</el-button>
            <el-button type="primary" size="small" @click="handleCreate">新建商机</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="商机名称">
          <el-input v-model="queryParams.name" placeholder="请输入商机名称" clearable />
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="queryParams.customerId" placeholder="请选择" clearable filterable style="width: 140px">
            <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="商机阶段">
          <el-select v-model="queryParams.stage" placeholder="请选择" clearable style="width: 120px">
            <el-option label="初步沟通" value="10" />
            <el-option label="需求确认" value="20" />
            <el-option label="报价阶段" value="30" />
            <el-option label="谈判阶段" value="40" />
            <el-option label="赢单" value="50" />
            <el-option label="输单" value="60" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="businesses" v-loading="loading" style="width: 100%" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="businessSn" label="商机编号" width="160" />
        <el-table-column prop="customerName" label="客户" width="150" />
        <el-table-column prop="businessName" label="商机名称" width="200" show-overflow-tooltip />
        <el-table-column prop="expectedAmount" label="预计金额" width="120">
          <template #default="{ row }">¥{{ (row.expectedAmount || 0).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="stageLabel" label="阶段" width="100">
          <template #default="{ row }">{{ row.stageLabel || getStageText(row.stage) }}</template>
        </el-table-column>
        <el-table-column prop="statusLabel" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusLabel || getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
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
import { listBusiness, delBusiness, listCustomer as listCrmCustomer } from '@/api/crm'

const loading = ref(false)
const selectedRows = ref<any[]>([])

const queryParams = reactive({
  name: '',
  customerId: undefined as number | undefined,
  stage: undefined as number | undefined
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const businesses = ref<any[]>([])
const customerList = ref<any[]>([])

const getStageText = (stage: number) => {
  const map: Record<number, string> = { 10: '初步沟通', 20: '需求确认', 30: '报价阶段', 40: '谈判阶段', 50: '赢单', 60: '输单' }
  return map[stage] || ''
}

const getStatusType = (status: number) => {
  const map: Record<number, any> = { 0: 'info', 10: 'warning', 20: 'primary', 50: 'success', 60: 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status: number) => {
  const map: Record<number, string> = { 0: '草稿', 10: '跟进中', 20: '已成交', 50: '赢单', 60: '输单' }
  return map[status] || ''
}

const loadData = async () => {
  loading.value = true
  try {
    const params = { ...queryParams, pageNo: pagination.pageNo, pageSize: pagination.pageSize }
    const res: any = await listBusiness(params)
    businesses.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载商机列表失败:', error)
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
  Object.assign(queryParams, { name: '', customerId: undefined, stage: undefined })
  pagination.pageNo = 1
  loadData()
}

const handleCreate = () => { ElMessage.info('新建商机功能开发中...') }
const handleEdit = (row: any) => { ElMessage.info(`编辑商机: ${row.businessName}`) }
const handleDetail = (row: any) => { ElMessage.info(`查看商机详情: ${row.businessSn}`) }
const handleExport = () => { ElMessage.info('导出功能开发中...') }

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该商机吗？', '提示', { type: 'warning' })
    await delBusiness([row.id])
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
.business-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.header-actions { display: flex; gap: 8px; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
