import * as echarts from '../../ec-canvas/echarts';
const db = wx.cloud.database()

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
    ec: {
      onInit: initChart
    }
  },
})
