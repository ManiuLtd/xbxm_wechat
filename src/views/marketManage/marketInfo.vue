<template>
	<div class="p-market-info">
		<div class="g-list-left fl">
			<ul>
				<li>
					<span>*</span>
					<h5>商场ID</h5>
					<h6>{{marketInfo.marketUniqueCode}}</h6>
				</li>
				<li>
					<span>*</span>
					<h5>负责人</h5>
					<h6>{{marketInfo.personLiableName}}</h6>
				</li>
				<li>
					<span>*</span>
					<h5>省市区</h5>
					<h6>{{marketInfo.firstLevName}}-{{marketInfo.secondLevName}}-{{marketInfo.thirdLevName}}</h6>
					<span class="u-waring-tip"><i class="el-icon-warning"></i><span>显示给用户</span></span>
				</li>
				<li>
					<span>*</span>
					<h5>详细地址</h5>
					<h6>{{marketInfo.detailAddress}}</h6>
					<span class="u-waring-tip"><i class="el-icon-warning"></i><span>显示给用户</span></span>
				</li>
				<li>
					<span>*</span>
					<h5>楼层</h5>
					<h6>{{marketInfo.floor}}</h6>
				</li>
				<li>
					<span>*</span>
					<h5>商场经度</h5>
					<h6>{{marketInfo.longtitude}}</h6>
				</li>
				<li>
					<span>*</span>
					<h5>状态</h5>
					<h6 :class="checkStatusMap[marketInfo.status].class">{{checkStatusMap[marketInfo.status].text}}</h6>
				</li>
			</ul>
		</div>
		<div class="g-list-right fl">
			<ul>
				<li>
					<span>*</span>
					<h5>商场名称</h5>
					<h6>{{marketInfo.marketName}}</h6>
					<span class="u-waring-tip"><i class="el-icon-warning"></i><span>显示给用户</span></span>
				</li>
				<li>
					<span>*</span>
					<h5>负责人电话</h5>
					<h6>{{marketInfo.phoneNumber}}</h6>
				</li>
				<li></li>
				<li></li>
				<li></li>
				<li>
					<span>*</span>
					<h5>商场纬度</h5>
					<h6>{{marketInfo.latitude}}</h6>
				</li>
			</ul>
		</div>
		<div class="u-button fl"><el-button type="primary" @click="backMarketList">返回</el-button></div>
	</div>
</template>

<script>
	import ApiSetting from "../../common/js/apiSetting";
	export default {
		data() {
			return{
				marketInfo:{
					status:1,
				},
				checkStatusMap:{
					0 :{
						class:'disable',
						text: "禁用"
					},
					1 :{
						class: "able",
						text:'启用'
					}
				}
			}
		},
		created(){
			// var marketId = this.$store.state.marketInfoId
			var marketId = this.$route.params.marketId
			this.getListData(marketId)
		},
		methods: {
			getListData(marketid){
				this.$http({
					url: ApiSetting.marketInfo,
					method: 'post',
					data:{marketId:marketid}
				}).then(res => {
		if(!res || res.data.errCode !== 0 || res === undefined || res.data === null) return
			this.marketInfo = res.data.data.marketInfo
				})
			},
			backMarketList(){
				this.$router.push('/marketList')
			}
		}
	}
</script>

<style lang="less">
 @import '../../styles/marketManage/marketInfo.less';
</style>