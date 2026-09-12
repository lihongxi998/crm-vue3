<template>
  <div class="home-page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="客户总数" :value="stats.totalCustomers" :loading="statsLoading">
            <template #prefix>
              <el-icon color="#409eff"><User /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="待跟进线索" :value="stats.pendingClues" :loading="statsLoading" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="本月合同额">
            <template #suffix>元</template>
            <template #defaultValue>{{ stats.monthContractAmount.toFixed(2) }}</template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <el-statistic title="商机转化率">
            <template #suffix>%</template>
            <template #defaultValue>{{ stats.businessConversionRate.toFixed(2) }}</template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>待办事项</span>
          </template>
          <el-empty v-if="!todosLoading && todoList.length === 0" description="暂无待办事项" />
          <el-empty v-else-if="todosLoading" description="加载中..." />
          <el-list v-else :data="todoList" style="max-height: 300px; overflow-y: auto">
            <el-list-item v-for="item in todoList" :key="item.id">
              <el-tag :type="item.type === 'urgent' ? 'danger' : 'warning'" size="small">{{ item.type === 'urgent' ? '紧急' : '普通' }}</el-tag>
              <span style="margin-left: 10px">{{ item.content }}</span>
            </el-list-item>
          </el-list>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最新公告</span>
          </template>
          <el-timeline>
            <el-timeline-item v-for="item in announcements" :key="item.id" :timestamp="item.date" placement="top">
              {{ item.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card style="margin-top: 20px">
      <template #header>
        <span>快捷操作</span>
      </template>
      <el-space wrap>
        <el-button type="primary" @click="$router.push('/customer')">
          <el-icon><User /></el-icon>
          客户管理
        </el-button>
        <el-button type="success" @click="$router.push('/business')">
          <el-icon><PriceTag /></el-icon>
          商机管理
        </el-button>
        <el-button type="warning" @click="$router.push('/contract')">
          <el-icon><Document /></el-icon>
          合同管理
        </el-button>
        <el-button type="info" @click="$router.push('/receivable')">
          <el-icon><Money /></el-icon>
          回款管理
        </el-button>
        <el-button @click="$router.push('/clue')">
          <el-icon><Search /></el-icon>
          线索管理
        </el-button>
      </el-space>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { User, PriceTag, Document, Money, Search } from '@element-plus/icons-vue'
import { listCustomer, listClue, listBusiness } from '@/api/crm'

const statsLoading = ref(false)
const todosLoading = ref(false)

const stats = reactive({
  totalCustomers: 0,
  pendingClues: 0,
  monthContractAmount: 156800,
  businessConversionRate: 35.6
})

const todoList = ref<any[]>([])
const announcements = ref([
  { id: 1, date: '2024-09-12', content: '客户管理系统升级完成' },
  { id: 2, date: '2024-09-10', content: '新增商机转化漏斗分析' },
  { id: 3, date: '2024-09-08', content: '合同管理模块上线' }
])

let statsTimer: ReturnType<typeof setTimeout> | null = null
let todoTimer: ReturnType<typeof setTimeout> | null = null

const loadStats = async () => {
  statsLoading.value = true
  try {
    const [customerRes, clueRes, businessRes] = await Promise.all([
      listCustomer({ page: 1, pageSize: 1 }),
      listClue({ status: 'pending' }),
      listBusiness({ stage: 'negotiation' })
    ])
    
    stats.totalCustomers = customerRes?.total || 0
    stats.pendingClues = clueRes?.list?.length || 0
    stats.businessConversionRate = businessRes?.total ? (businessRes.total / (customerRes?.total || 1) * 100) : 35.6
  } catch (error) {
    console.error('加载统计数据失败:', error)
  } finally {
    statsLoading.value = false
  }
}

const loadTodos = async () => {
  todosLoading.value = true
  try {
    const res: any = await listClue({ status: 'pending' })
    todoList.value = (res?.list || []).slice(0, 5).map((o: any) => ({
      id: o.id,
      type: 'urgent',
      content: `线索 ${o.name} 待跟进`
    }))
  } catch (error) {
    console.error('加载待办事项失败:', error)
  } finally {
    todosLoading.value = false
  }
}

const startPolling = () => {
  loadStats()
  loadTodos()
  
  statsTimer = setInterval(() => {
    loadStats()
  }, 30000)
  
  todoTimer = setInterval(() => {
    loadTodos()
  }, 60000)
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  if (statsTimer) clearInterval(statsTimer)
  if (todoTimer) clearInterval(todoTimer)
})
</script>

<style scoped>
.home-page { padding: 0; }
.stat-card { text-align: center; }
.stat-card :deep(.el-statistic__head) { font-size: 14px; color: #909399; }
.stat-card :deep(.el-statistic__content) { font-size: 28px; font-weight: bold; color: #303133; }
</style>
