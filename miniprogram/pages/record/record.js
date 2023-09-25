import * as echarts from '../../ec-canvas/echarts';
const db = wx.cloud.database()
const runCollection = db.collection('run');

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  db.collection('rundata').get().then(res => {
    const data = res.data;
    const weeks = data.map(item => item.week);
    const nums = data.map(item => item.num);
    // 在这里使用 ECharts 设置折线图的配置项
    const option = {
      title: {
        text: '每周跑步次数变化',
        left: 'center'
      },
      
      xAxis: {
        type: 'category',
        data: weeks
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: nums,
        type: 'line',
        smooth: true
      }]
    };

    chart.setOption(option);
  }).catch(err => {
    console.error('获取数据失败', err);
  });

  return chart;
}

Page({
  data: {
    paceData: [], // 存储距离、平均配速和平均时间的数组
    ec: {
      onInit: initChart
    }
  },
    // 页面加载时的处理函数
    onLoad: function () {
      // 获取不同距离范围内的平均配速和平均时间数据
      this.calculateAverageData(1.5, 0.1); // 1.5km范围内，误差为0.1km
      this.calculateAverageData(2, 0.1);   // 2km范围内，误差为0.1km
      this.calculateAverageData(3, 0.1);   // 3km范围内，误差为0.1km
    },
  
    // 计算平均配速和平均时间
    calculateAverageData: function (targetDistance, errorRange) {
      const minDistance = targetDistance - errorRange;
      const maxDistance = targetDistance + errorRange;
  
      runCollection.where({
        distance: db.command.and(db.command.gte(minDistance), db.command.lte(maxDistance)),
      }).get().then(res => {
        const runData = res.data;
        if (runData.length > 0) {
          const totalMinutes = runData.reduce((sum, run) => sum + run.time, 0);
          const averagePace = (totalMinutes / runData.length / targetDistance).toFixed(1);
          const averageTime = (totalMinutes / runData.length).toFixed(1);
  
          // 将距离、平均配速和平均时间数据添加到数组中
          const paceData = this.data.paceData;
          paceData.push({ distance: targetDistance, pace: averagePace, time: averageTime });
  
          // 更新页面的数据属性
          this.setData({
            paceData: paceData,
          });
        }
      });
    },
});
