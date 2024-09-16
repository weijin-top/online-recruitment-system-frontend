<template>
  <div class="container">
    <div class="parent-num-container">
      <div style="background-color: #c23a3a;">
        <div>求职者人数</div>
        <div>{{ numCount.seekerCount }}</div>
      </div>
      <div style="background-color: #3ac23c;">
        <div>招聘者人数</div>
        <div>{{ numCount.recruiterCount }}</div>
      </div>
      <div style="background-color: #2159c0;">
        <div>公司数量</div>
        <div>{{ numCount.companyCount }}</div>
      </div>
      <div style="background-color: #6621c0;">
        <div>在招职位数量</div>
        <div>{{ numCount.positionCount }}</div>
      </div>
    </div>
    <!-- 图标 -->
    <div class="echarts-container">
      <div id="l2" class="echarts-item" />
      <div id="r2" class="echarts-item" />
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { queryStatNum, queryStatEdu, queryStatPosition } from '@/api/stat'

export default {
  name: 'Stat',
  data() {
    return {
      eduCount: {
        juniorCollegeAndBelowCount: 0,
        undergraduateCount: 0,
        masterCount: 0,
        doctorCount: 0
      },
      numCount: {
        seekerCount: 0,
        recruiterCount: 0,
        companyCount: 0,
        positionCount: 0
      },
      positionCount: [
        { month: '', count: 0 }
      ],
      months: [],
      counts: [],
      edus: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      Promise.all([
        this.getStatNum(),
        this.getStatEdu(),
        this.getStatPosition()
      ]).then(() => {
        this.updateData()
      })
    },
    getStatEdu() {
      return new Promise((resolve, reject) => {
        queryStatEdu().then(res => {
          if (res.code) {
            this.eduCount = res.data
          } else {
            this.eduCount = {
              juniorCollegeAndBelowCount: 0,
              undergraduateCount: 0,
              masterCount: 0,
              doctorCount: 0
            }
          }
          resolve()
        }).catch(reject)
      })
    },
    getStatNum() {
      return new Promise((resolve, reject) => {
        queryStatNum().then(res => {
          if (res.code) {
            this.numCount = res.data
          } else {
            this.numCount = {
              seekerCount: 0,
              recruiterCount: 0,
              companyCount: 0,
              positionCount: 0
            }
          }
          resolve()
        }).catch(reject)
      })
    },
    getStatPosition() {
      return new Promise((resolve, reject) => {
        queryStatPosition().then(res => {
          if (res.code) {
            this.positionCount = res.data
          } else {
            this.positionCount = [
              { month: '', count: 0 }
            ]
          }
          resolve()
        }).catch(reject)
      })
    },
    updateData() {
      this.months = this.positionCount.map(item => item.month)
      this.counts = this.positionCount.map(item => item.count)
      this.edus = [
        { value: this.eduCount.undergraduateCount, name: '本科' },
        { value: this.eduCount.masterCount, name: '硕士' },
        { value: this.eduCount.doctorCount, name: '博士' },
        { value: this.eduCount.juniorCollegeAndBelowCount, name: '专科及以下' }
      ]
      this.drawCharts()
    },
    drawCharts() {
      this.$nextTick(() => {
        this.pieChart()
        this.lineDrawing()
      })
    },
    pieChart() {
      var ec_left2 = echarts.init(document.getElementById('l2'), 'dark')
      var ec_left2_option = {
        title: {
          text: '学历要求',
          textStyle: {
            color: 'white'
          },
          left: 'left'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.edus
            // minAngle: 1 // 设置最小角度
          }
        ]
      }
      ec_left2.setOption(ec_left2_option)
    },
    lineDrawing() {
      var ec_right2 = echarts.init(document.getElementById('r2'), 'dark')
      var ec_right2_option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            lineStyle: {
              color: '#7171C6'
            }
          }
        },
        legend: {
          data: ['岗位需求'],
          left: 'right'
        },
        title: {
          text: '最近半年新增职位量变化',
          textStyle: {
            color: 'white'
          },
          left: 'left'
        },
        grid: {
          left: '4%',
          right: '6%',
          bottom: '4%',
          top: 50,
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.months
        }],
        yAxis: [{
          type: 'value',
          axisLine: {
            show: true
          },
          // 设置Y轴刻度不要小数
          minInterval: 1,
          boundaryGap: [0, 0.1],

          position: 'left',
          axisLabel: {
            show: true,
            color: 'white',
            fontSize: 12
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1
            }
          }
        }],
        series: [{
          name: '岗位量',
          type: 'line',
          smooth: true,
          yAxisIndex: 0,
          data: this.counts
        }]
      }
      ec_right2.setOption(ec_right2_option)
    }
  }
}
</script>

<style scoped>
.container {
  height: 100%;
  width: 100%;
  padding: 1em;
}
.parent-num-container {
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
}
.parent-num-container > div {
  width: 200px;
  height: 100px;
  border-radius: 20px;
  padding: 10px;
  color: #fff;
  font-size: 25px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
.echarts-item {
  width: 500px;
  height: 400px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
}
.echarts-container {
  display: flex;
  justify-content: space-around;
  margin-top: 150px;
}
</style>
