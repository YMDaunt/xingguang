<template>
	<div class="sort-wrapper" @click.stop="" :class="className">
		<slot name="head"></slot>
		<div class="box-head"></div>
		<div class="box-body">
			<slot name="body"></slot>
		</div>
		<div class="box-foot"></div>
	</div>
</template>

<script>
	export default {
		props:["className"],
		data(){
			return {

			}
		},
		methods:{

		}
	}
</script>
