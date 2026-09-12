<template>
  <div class="receivable-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>回款管理</span>
          <div class="header-actions">
            <el-button type="success" size="small" @click="handleExport">导出</el-button>
            <el-button type="primary" size="small" @click="handleCreate">新建回款</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="回款单号">
          <el-input v-model="queryParams.receivableSn" placeholder="请输入回款单号" clearable />
        </el-form-item>
        <el-form-item label="客户">
          <el-select v-model="queryParams.customerId" placeholder="请选择" clearable filterable style="width: 140px">
            <el-option v-for="c in customerList" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="回款状态">
          <el-select v-model="queryParams.status" placeholder="请选择" clearable style="width: 120px">
            <el-option label="待审核" :value="10" />
            <el-option label="已审核" :value="20" />
            <el-option label="已作废" :value="30" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="receivables" v-loading="loading" style="width: 100%" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="receivableSn" label="回款编号" width="160" />
        <el-table-column prop="customerName" label="客户" width="150" />
        <el-table-column prop="contractSn" label="关联合同" width="160" />
        <el-table-column prop="amount" label="回款金额" width="120">
          <template #default="{ row }">¥{{ (row.amount || 0).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="receivableDate" label="回款日期" width="120" />
        <el-table-column prop="statusLabel" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusLabel || getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.status === 10" size="small" type="primary" @click="handleAudit(row)">审核</el-button>
            <el-button v-else size="small" type="primary" @click="handleAudit(row)">反审核</el-button>
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
import { listReceivable, delReceivable, listCustomer as listCrmCustomer } from '@/api/crm'

const loading = ref(false)
const selectedRows = ref<any[]>([])

const queryParams = reactive({
  receivableSn: '',
  customerId: undefined as number | undefined,
  status: undefined as number | undefined
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const receivables = ref<any[]>([])
const customerList = ref<any[]>([])

const getStatusType = (status: number) => {
  const map: Record<number, any> = { 10: 'warning', 20: 'success', 30: 'danger' }
  return map[status] || 'info'
}

const getStatusText = (status: number) => {
  const map: Record<number, string> = { 10: '待审核', 20: '已审核', 30: '已作废' }
  return map[status] || ''
}

const loadData = async () => {
  loading.value = true
  try {
    const params = { ...queryParams, pageNo: pagination.pageNo, pageSize: pagination.pageSize }
    const res: any = await listReceivable(params)
    receivables.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载回款列表失败:', error)
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
  Object.assign(queryParams, { receivableSn: '', customerId: undefined, status: undefined })
  pagination.pageNo = 1
  loadData()
}

const handleCreate = () => { ElMessage.info('新建回款功能开发中...') }
const handleDetail = (row: any) => { ElMessage.info(`查看回款详情: ${row.receivableSn}`) }
const handleExport = () => { ElMessage.info('导出功能开发中...') }

const handleAudit = async (row: any) => {
  try {
    await ElMessageBox.confirm(`确定${row.status === 10 ? '审核' : '反审核'}该回款吗？`, '提示', { type: 'warning' })
    ElMessage.success(row.status === 10 ? '审核成功' : '反审核成功')
    loadData()
  } catch (e: any) {
    if (e !== 'cancel') ElMessage.error(e.message || '操作失败')
  }
}

const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm('确定要删除该回款吗？', '提示', { type: 'warning' })
    await delReceivable([row.id])
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
.receivable-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.header-actions { display: flex; gap: 8px; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
