<template>
	<div class="p-index">
		<div class="g-general-situation">
			<p class="u-title">今日实时概况   <span class="u-update-time">更新时间：{{todayMap.updateTime|moment("YYYY-MM-DD HH:mm:ss")}}</span></p>
			<div class="m-data-list">
				<ul>
					<li>
						<div class="u-icon-circle">
							<i class="iconfont el-icon-wchat-zhanghu"></i>
						</div>
					</li>
					<li>
						<h4>今日收款总额</h4>
						<h5>{{todayMap.income}}</h5>
						<p class="u-contemporary">
							<span :class="todayMap.incomeCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-if="todayMap.incomeCompareYesterday<0">{{Number(todayMap.incomeCompareYesterday*100).toFixed(0)*-1}}%</span>
							<span :class="todayMap.incomeCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-else>{{Number(todayMap.incomeCompareYesterday*100).toFixed(0)}}%</span>
              同比昨日
						</p>
					</li>
					<li>
						<h4>交易流水</h4>
						<h5>{{todayMap.transNum}}</h5>
						<p class="u-contemporary">
							<span :class="todayMap.transNumCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-if="todayMap.transNumCompareYesterday<0">{{Number(todayMap.transNumCompareYesterday*100).toFixed(0)*-1}}%</span>
							<span :class="todayMap.transNumCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-else>{{Number(todayMap.transNumCompareYesterday*100).toFixed(0)}}%</span>
              同比昨日
						</p>
					</li>
					<li>
						<h4>购买用户数（个）</h4>
						<h5>{{todayMap.buyers}}</h5>
						<p class="u-contemporary">
							<span :class="todayMap.buyersCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-if="todayMap.buyersCompareYesterday<0">{{Number(todayMap.buyersCompareYesterday*100).toFixed(0)*-1}}%</span>
							<span :class="todayMap.buyersCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-else>{{Number(todayMap.buyersCompareYesterday*100).toFixed(0)}}%</span>
              同比昨日
						</p>
					</li>
					<li>
						<h4>新增用户数（个）</h4>
						<h5>{{todayMap.newCustomer}}</h5>
						<p class="u-contemporary">
							<span :class="todayMap.newCustomerCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'"  v-if="todayMap.newCustomerCompareYesterday<0">{{Number(todayMap.newCustomerCompareYesterday*100).toFixed(0)*-1}}%</span>
							<span :class="todayMap.newCustomerCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'"  v-else>{{Number(todayMap.newCustomerCompareYesterday*100).toFixed(0)}}%</span>
              同比昨日
						</p>
					</li>
					<li>
						<h4>客单价</h4>
						<h5>{{todayMap.unitPrice}}</h5>
						<p class="u-contemporary">
							<span :class="todayMap.unitPriceCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-if="todayMap.unitPriceCompareYesterday<0">{{Number(todayMap.unitPriceCompareYesterday*100).toFixed(0)*-1}}%</span>
							<span :class="todayMap.unitPriceCompareYesterday<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-else>{{Number(todayMap.unitPriceCompareYesterday*100).toFixed(0)}}%</span>
              同比昨日
						</p>
					</li>
				</ul>
			</div>	
		</div>
		<div class="g-weekly-user">
			<p class="u-title">最近一周购买用户</p>
			<div class="u-check-wchat-user">
				<div class="u-count-pie">
					<p>{{uvPie}}</p>
					<span>浏览小程序用户数</span>
					<p class="u-contemporary">
						<!-- <span class="el-icon-caret-bottom">{{uvCompareLastweek}}</span> -->
            <span :class="uvCompareLastweek<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-if="uvCompareLastweek<0">{{uvCompareLastweek*-1}}%</span>
						<span :class="uvCompareLastweek<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-else>{{uvCompareLastweek}}%</span><span>同比上周</span> 
					</p>
				</div>
				<div class="u-wechant-pie" id="weekly_pie" :style="{width: '280px', height: '200px'}">	
				</div>
				<div class="u-line-charts" :style="{width: '660px', height: '200px'}"></div>
			</div>
			<div class="u-buy-user">
				<div class="u-count-pie">
					<p>{{weekBuyers}}</p>
					<span>购买用户数</span>
					<p class="u-contemporary">
             <span :class="weekBuyersCompareLastweek<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-if="weekBuyersCompareLastweek<0">{{weekBuyersCompareLastweek*-1}}%</span>
						<span :class="weekBuyersCompareLastweek<0?'el-icon-caret-bottom':'el-icon-caret-top'" v-else>{{weekBuyersCompareLastweek}}%</span>
            同比上周
					</p>
				</div>
				<div class="u-pie-chart" :style="{width: '280px', height: '200px'}"></div>
				<div class="u-line-charts" :style="{width: '660px', height: '200px'}"></div>
			</div>
		</div>
		<div class="g-month-sell-rank">
			<p class="u-title">最近一周销售排行</p>
			<div class="u-rank-list">
				<p class="u-rank-title">商场收款排名</p>
				<table class="m-ranking-table">
					<tr>
						<th>排名</th>
						<th>商场名称</th>
						<th>销售额</th>
						<th>销量</th>
					</tr>
					<tr v-for="(item,index) in latestWeekRank" :key="index">
						<td>{{index+1}}</td>
						<td>{{item.marketName}}</td>
						<td>
							<span>{{item.amount}}</span>
								<el-progress
								 :percentage="item.amount/amount*100"
								 :show-text="false"
								 ></el-progress>
						</td>
						<td>{{item.transNum}}</td>	
					</tr>	
				</table>
			</div>
		</div>
		<div class="f-in"></div>
		<div class="g-weekly-sell-data">
			<p class="u-title">最近一周销售数据</p>
			<div class="u-bar-charts" :style="{width: '730px', height: '200px'}">        
      </div>
		</div>
		<div class="g-weekly-user-list">
			<p class="u-title">最近一周客单</p>
			<div class="u-latestWeekUnitPriceRate" :style="{width: '500px', height: '200px'}"></div>
		</div>
	</div>
</template>

<script>
import echarts from "echarts";
import ApiSetting from "../common/js/apiSetting";
import moment from "vue-moment/node_modules/moment/min/moment-with-locales.js"
export default {
  data() {
    return {
      // handleWeeklyPieEcharts:{}
      // 今日数据
      todayMap: {},
      // 最近一周销售排行
      latestWeekRank: [],
      // 榜首的销售量
      amount: 0,

      // 最近一周客单
      latestWeekUnitPriceRate: [],
      // 最近一周销售数据
      latestWeekAmount: [],
      // 最近一周时间
      latestWeek: [],
      // 浏览小程序用户数
      // --线状图----
      pvLineData: [],
      uvLineData: [],
      // 饼状图
      pvPie: 0,
      uvPie: 0,
      uvCompareLastweek: 0,
      // 用户购买数

      // 线状图
      oldLineData: [],
      newLineData: [],
      // 饼状图
      oldBuyers: 0,
      newBuyers: 0,
      weekBuyers: 0,
      weekBuyersCompareLastweek: 0,
      oldBuyersRate: 0,
      newBuyersRate: 0
    };
  },
  created() {
    this.getIndexData();
  },
  methods: {
    // 初始化数据
    getIndexData() {
      this.$http(ApiSetting.index).then(msg => {
        if (!msg || msg.data.errCode !== 0 || msg === undefined) return;
        this.dealIndexData(msg.data.data);
      });
    },

    dealIndexData(data) {
      // 今日时事概况
      this.todayMap = data.todayMap;
      // 最近一周销售排行
      this.latestWeekRank = data.latestWeekRank;
      if (this.latestWeekRank.length > 0) {
        this.amount = this.latestWeekRank[0].amount;
      }

      // 最近一周客单
      this.latestWeekUnitPriceRate = data.latestWeekUnitPriceRate;
      this.latestWeekUnitPriceRate.map(item => {
        item.name = item.name + "    " + item.value;
        item.value = item.value.replace("%", "");
      });
      // 最近一周时间数据
      this.lastestWeek = data.lastestWeek;
      for (let i in data.lastestWeek) {
        this.latestWeek.push(
          moment(data.lastestWeek[i]*1000).format("M-D dddd")
        );
      }

      // 最近一周销售数据
      for (let i in data.latestWeekAmount) {
        this.latestWeekAmount.push(data.latestWeekAmount[i]);
      }

      // 最近一周购买用户
      // 线状图
      let everydayDatas = data.latestWeekCustomer.everydayDatas;
      everydayDatas.map(item => {
        this.pvLineData.push(item.pv);
        this.uvLineData.push(item.pv);
        this.oldLineData.push(item.oldBuyers);
        this.newLineData.push(item.newBuyers);
      });

      let weekMap = data.latestWeekCustomer.weekMap;
      this.pvPie = weekMap.weekPv;
      this.uvPie = weekMap.weekUv;
      this.uvCompareLastweek = parseFloat(weekMap.uvCompareLastweek);

      this.newBuyers = weekMap.newBuyers;
      this.oldBuyers = weekMap.oldBuyers;
      this.weekBuyers = weekMap.weekBuyers;
      this.weekBuyersCompareLastweek = parseFloat(
        weekMap.weekBuyersCompareLastweek
      );
      this.newBuyersRate = weekMap.newBuyersRate;
      this.oldBuyersRate = weekMap.oldBuyersRate;

      // 渲染图表
      this.reder_chants();
    },
    reder_chants() {
      // 最近一周客单
      this.handleWeeklyUserPieEcharts();
      // 最近一周销售数据
      this.handleMonthBarEcharts();

      this.handleWechantPie();
      this.handleWechantLine();
      this.handleUserPie();
      this.handleUserLine();
    },

    // 浏览小程序用户数线状图
    handleWechantLine() {
      var latestWeek = this.latestWeek;
      var user_pie = echarts.init(
        document.querySelector(".u-check-wchat-user .u-line-charts")
      );
      user_pie.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          padding: [17, 0, 0, 0],
          x: "right",
          y: "top",
          icon: "square",
          itemWidth: 10,
          itemHeight: 10,
          data: ["UV", "PV"]
        },
        grid: {
          left: "6%",
          right: "5%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: latestWeek,
            axisLabel: {
              interval: 0,
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "UV",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: this.uvLineData
          },
          {
            name: "PV",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: this.pvLineData
          }
        ],
        color: ["#49A9EE", "#FF7623"]
      });
    },

    // 浏览小程序用户数饼状图
    handleWechantPie() {
      var user_pie = echarts.init(
        document.querySelector(".u-check-wchat-user .u-wechant-pie")
      );
      user_pie.setOption({
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          padding: [0, 20, 0, 24],
          x: "left",
          y: "bottom",
          data: [`PV ${this.pvPie}`, `UV ${this.uvPie}`],
          itemWidth: 10,
          itemHeight: 10,
          icon: "circle"
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["55%", "70%"],
            center: [94, 82],
            avoidLabelOverlap: true,
            data: [
              { value: this.pvPie, name: `PV ${this.pvPie}` },
              { value: this.uvPie, name: `UV ${this.uvPie}` }
            ],
            labelLine: {
              show: false
            },
            label: {
              show: false
            }
          }
        ],
        color: ["#49A9EE", "#FF7623"]
      });
    },

    // 购买用户数线状图
    handleUserLine() {
      var latestWeek = this.latestWeek;
      var user_pie = echarts.init(
        document.querySelector(".u-buy-user .u-line-charts")
      );
      user_pie.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          padding: [17, 0, 0, 0],
          x: "right",
          y: "top",
          icon: "square",
          itemWidth: 10,
          itemHeight: 10,
          data: ["新增购买", "重复购买"]
        },
        grid: {
          left: "6%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: latestWeek,
            axisLabel: {
              interval: 0
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "新增购买",
            type: "line",
            stack: "总量",
            areaStyle: { normal: {} },
            data: this.newLineData
          },
          {
            name: "重复购买",
            type: "line",
            stack: "总量",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: this.oldLineData
          }
        ],
        color: ["#49A9EE", "#FF7623"]
      });
    },

    // 购买用户饼状数
    handleUserPie() {
      var user_pie = echarts.init(
        document.querySelector(".u-buy-user .u-pie-chart")
      );
      user_pie.setOption({
        tooltip: {
          trigger: "item"
        },
        legend: {
          orient: "vertical",
          padding: [0, 20, 0, 24],
          x: "left",
          y: "bottom",
          data: [
            `新增购买 ${this.newBuyers} ${this.newBuyersRate}`,
            `重复购买 ${this.oldBuyers} ${this.oldBuyersRate}`
          ],
          itemWidth: 10,
          itemHeight: 10,
          icon: "circle"
        },
        series: [
          {
            name: "",
            type: "pie",
            radius: ["55%", "70%"],
            center: [94, 82],
            avoidLabelOverlap: true,
            data: [
              {
                value: this.newBuyers,
                name: `新增购买 ${this.newBuyers} ${this.newBuyersRate}`
              },
              {
                value: this.oldBuyers,
                name: `重复购买 ${this.oldBuyers} ${this.oldBuyersRate}`
              }
            ],
            labelLine: {
              show: false
            },
            label: {
              show: false
            }
          }
        ],
        color: ["#49A9EE", "#FF7623"]
      });
    },

    // 最近一周销售数据
    handleMonthBarEcharts() {
      var user_pie = echarts.init(
        document.querySelector(".g-weekly-sell-data .u-bar-charts")
      );
      user_pie.setOption({
        xAxis: {
          type: "category",
          data: this.latestWeek,
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: "value",
          max: Math.max(...this.latestWeekAmount)
        },
        series: [
          {
            data: this.latestWeekAmount,
            type: "bar",
            barWidth: 30
          }
        ],
        color: ["#49A9EE"]
      });
    },

    // 最近一周客单
    handleWeeklyUserPieEcharts() {
      var user_pie = echarts.init(
        document.querySelector(".g-weekly-user-list .u-latestWeekUnitPriceRate")
      );
      user_pie.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
          {
            name: "客单数量",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            data: this.latestWeekUnitPriceRate,
            center: [254, 102],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ],
        color: ["#61a8e8", "#8d96e3", "#e48a7f", "#a6d587", "#fad87e"]
      });
    }
  }
};
</script>

<style lang="less">
@import "../styles/index.less";
</style>
