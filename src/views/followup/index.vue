<template>
  <div class="followup-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>跟进记录</span>
          <div class="header-actions">
            <el-button type="success" size="small" @click="handleExport">导出</el-button>
            <el-button type="primary" size="small" @click="handleCreate">新建记录</el-button>
          </div>
        </div>
      </template>

      <el-form :inline="true" :model="queryParams" class="filter-form">
        <el-form-item label="跟进对象">
          <el-input v-model="queryParams.targetName" placeholder="请输入跟进对象" clearable />
        </el-form-item>
        <el-form-item label="跟进类型">
          <el-select v-model="queryParams.followType" placeholder="请选择" clearable style="width: 120px">
            <el-option label="电话沟通" value="phone" />
            <el-option label="面谈" value="face" />
            <el-option label="邮件" value="email" />
            <el-option label="微信" value="wechat" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建人">
          <el-input v-model="queryParams.creatorName" placeholder="请输入创建人" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="records" v-loading="loading" style="width: 100%" stripe>
        <el-table-column prop="targetName" label="跟进对象" width="150" />
        <el-table-column prop="targetType" label="对象类型" width="100">
          <template #default="{ row }">
            <el-tag>{{ row.targetType === 'clue' ? '线索' : row.targetType === 'contact' ? '联系人' : row.targetType === 'business' ? '商机' : '合同' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="followType" label="跟进方式" width="100" />
        <el-table-column prop="content" label="跟进内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="followTime" label="跟进时间" width="160" />
        <el-table-column prop="creatorName" label="创建人" width="100" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleDetail(row)">详情</el-button>
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
import { ElMessage } from 'element-plus'
import { listFollowUp } from '@/api/crm'

const loading = ref(false)

const queryParams = reactive({
  targetName: '',
  followType: '',
  creatorName: ''
})

const pagination = reactive({
  pageNo: 1,
  pageSize: 10,
  total: 0
})

const records = ref<any[]>([])

const loadData = async () => {
  loading.value = true
  try {
    const params = { ...queryParams, pageNo: pagination.pageNo, pageSize: pagination.pageSize }
    const res: any = await listFollowUp(params)
    records.value = res?.list || []
    pagination.total = res?.total || 0
  } catch (error: any) {
    console.error('加载跟进记录失败:', error)
    ElMessage.error(error.message || '加载失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  Object.assign(queryParams, { targetName: '', followType: '', creatorName: '' })
  pagination.pageNo = 1
  loadData()
}

const handleCreate = () => { ElMessage.info('新建跟进记录功能开发中...') }
const handleDetail = (row: any) => { ElMessage.info(`查看跟进详情`) }
const handleExport = () => { ElMessage.info('导出功能开发中...') }

onMounted(() => { loadData() })
</script>

<style scoped>
.followup-page { padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; font-weight: bold; }
.header-actions { display: flex; gap: 8px; }
.filter-form { margin-bottom: 20px; }
.pagination { margin-top: 20px; display: flex; justify-content: flex-end; }
</style>
