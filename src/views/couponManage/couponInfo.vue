<template>
	<div class="p-coupon-info">
		<div class="g-list-left">
			<ul>
				<li>
					<h5>优惠券名称</h5>
					<h6>{{couponInfo.couponName}}</h6>
				</li>
				<li>
					<h5>优惠券面值</h5>
					<h6>{{couponInfo.couponMoney}}</h6>
				</li>
				<li>
					<h5>优惠券价格</h5>
					<h6>{{couponInfo.couponPrice}}</h6>
				</li>
				<li>
					<h5>发放数量</h5>
					<h6>{{couponInfo.sendNum}}</h6>
				</li>
				<li>
					<h5>领取有效期</h5>
					<h6>{{couponInfo.sendStartTime|moment("YYYY-MM-DD HH:mm:ss")}} — {{couponInfo.sendEndTime|moment("YYYY-MM-DD HH:mm:ss")}}</h6>
				</li>
				<li>
					<h5>使用有效期</h5>
					<h6>{{couponInfo.validStartTime|moment("YYYY-MM-DD HH:mm:ss")}} — {{couponInfo.validEndTime|moment("YYYY-MM-DD HH:mm:ss")}}</h6>
				</li>
				<li>
					<h5 class="u-market-range">商场范围</h5>
					<div class="u-list" v-if="market!=0">
						<el-scrollbar style="height: 100%">
							<p v-for="(item,index) in market" :key="index" class="u-overflow-content" :title="item.marketName">
								{{item.marketName}}
							</p>
						</el-scrollbar>
					</div>
					<h6 v-else>全场通用</h6>
				</li>
				<li>
					<h5>商户范围</h5>

					<div class="u-list" v-if="couponInfo.couponClass==1">
						<el-scrollbar style="height: 100%">
							<p v-for="(item,index) in merchant" :key="index" class="u-overflow-content" :title="item.marketName+item.merchantName">
								{{item.marketName}}/{{item.merchantName}}
							</p>
						</el-scrollbar>
					</div>
					<h6 v-else>全场通用</h6>

				</li>
				<li>
					<h5>使用条件</h5>
					<h6 v-if="couponInfo.couponType==0">满{{couponInfo.minimumMoney}}元使用</h6>
					<h6 v-else>不限制</h6>
				</li>
				<li>
					<h5>备注</h5>
					<h6>{{couponInfo.remark}}</h6>
				</li>
			</ul>
		</div>
		<el-button type="primary" @click="backMarketList" class="u-return-btn">返回</el-button>
	</div>
</template>

<script>
	import ApiSetting from "../../common/js/apiSetting";
	export default {
		data() {
			return {
				couponInfo: {},
				market: [],
				merchant: []
			};
		},
		created() {
			var batchNum = this.$route.params.batchNum;
			this.getListData(batchNum);
		},
		methods: {
			// 获取数据
			getListData(batchNum) {
				ApiSetting.couponInfo.data = {
					batchNum: batchNum
				};
				this.$http(ApiSetting.couponInfo).then(msg => {
					if (!msg || msg.data.errCode !== 0 || msg === undefined || msg === null) return
					this.couponInfo = msg.data.data;
					this.market = this.couponInfo.shopId;
					this.merchant = this.couponInfo.supplierId;
				});
			},
			// 返回
			backMarketList() {
				this.$router.push("/couponList");
			}
		}
	};
</script>

<style lang="less">
	@import "../../styles/couponManage/couponInfo.less";
</style>