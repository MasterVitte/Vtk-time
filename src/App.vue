<template>
	<div id="app" :class="{fixpanel: panel}">
		<Slideout menu="#menu" panel="#panel" :toggleSelectors="['.toggle-button']" @on-open="open"
		          @on-beforeopen="beforeopen" @on-translate="translate" @on-beforeclose="beforeclose" @on-close="close">
			<nav id="menu">
				<header class="menu-header">
					<span class="menu-header-title">VTK-TIME</span>
				</header>
				<section class="menu-section">
					<ul class="menu-section-list">
						<li v-for="link in linkMenu" :key="link.title" @click="somethingClicked">
							<router-link class="navbar-link" :to="`${link.url}`">{{link.title}}</router-link>
						</li>
					</ul>
				</section>
				<section class="menu-section">
					<ul class="menu-section-list">
						<li v-if="checkUser" @click="logout"><a href="" class="navbar-link">Выйти</a></li>
					</ul>
				</section>
			</nav>
			<main id="panel">
				<header>
					<div class="user-navbar">
						<div class="container">
							<b-diamond class="toggle-button"></b-diamond>
							<span class="header-logo">VTK-TIME</span>
						</div>
					</div>
					<div class="router-view" @click="fixPanel">
						<router-view></router-view>
					</div>
				</header>
			</main>
		</Slideout>
	</div>
</template>

<script>
import Slideout from 'vue-slideout'
import { BIconDiamond } from 'bootstrap-vue'

export default {
	name: 'app',
	components: {
		Slideout,
		'b-diamond': BIconDiamond
	},
	data() {
		return {
			panel: false
		}
	},
	methods: {
		logout() {
			this.$store.dispatch('logoutUser')
			this.$session.clear()
			this.$session.destroy()
		},
		fixPanel() {
			this.$children[0].slideout.close()
		},
		beforeopen() {
			this.panel = true
		},
		open() {},
		translate: function () {
			this.panel = true
		},
		beforeclose() {
			this.panel = false
		},
		close() {},
		somethingClicked: function () {
			this.$children[0].slideout.toggle()
		}
	},
	computed: {
		checkUser() {
			return this.$store.getters.user
		},
		linkMenu() {
			if (this.checkUser) {
				return [
					{title: 'Расписание', url: '/'},
					{title: 'Отделение', url: '/department'},
					{title: 'Специальность', url: '/specialty'},
					{title: 'Группа', url: '/group'},
					{title: 'Предмет', url: '/subject'},
					{title: 'Аудитория', url: '/room'},
					{title: 'Преподаватель', url: '/teacher'},
					{title: 'Образование', url: '/education'}
				]
			}
			return [
				{title: 'Расписание', url: '/'},
				{title: 'Войти', url: '/login'}
			]
		}
	}
}
</script>

<style>
@import '/assets/styles/index.css';

.fixpanel {
	position: fixed;
	height: 100vh;
	width: 100%;
}

.content-wrapper {
	min-height: calc(100vh - 65px)!important;
}

.user-navbar>.container {
	height: 64px !important;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.navbar-link {
	font-size: 16px;
}

.navbar-link:hover {
	color: #999999 !important;
}

#menu {
	background-color: #1D1F20;
	background-image: linear-gradient(145deg, #1D1F20, #404348);
	overflow: auto;
	touch-action: pan-x;
}

#menu a {
	color: #fff;
}

.menu-header {
	border-bottom: 1px solid #2a2d2f;
	height: 65px;
	display: flex;
	align-items: center;
}

.menu-header-title {
	font-weight: 400;
	letter-spacing: 0.5px;
	margin: 0;
	color: #fff;
	padding-left: 20px;
}

.menu-section {
	margin: 15px 0;
	padding-bottom: 40px;
	border-bottom: 1px solid #2a2d2f;
}

.menu-section:last-child {
	border-bottom: 0;
	margin-bottom: 64px;
}

.menu-section-list {
	padding:0;
	margin: 10px 0;
	list-style: none;
}

.menu-section-list a {
	display: block;
	padding: 10px 20px;
}

.slideout-menu {
	position: fixed;
	top: 0;
	bottom: 0;
	width: 256px;
	min-height: 100vh;
	overflow-y: scroll;
	-webkit-overflow-scrolling: touch;
	z-index: 0;
	display: none;
}

.slideout-menu-left {
	left: 0;
}

.slideout-panel {
	position: relative;
	z-index: 1;
	background-color: #fff;
	min-height: 100vh;
}

.slideout-open .slideout-menu {
	display: block;
}

.toggle-button {
	border: none;
	outline: none !important;
	cursor: pointer;
	outline: none;
	font-size: 1.5rem;
}

.date:hover {
	cursor: pointer;
}

.ui-messageBox__wrapper>form>div {
	margin-top: 60px;
	margin-bottom: 30px;
}

.sidebar-link {
	cursor: pointer;
}

@media all and (max-width: 768px) {
	.ui-messageBox {
		border-radius: 0 !important;
	}
	.ui-messageBox__footer {
		margin-bottom: 80px !important;
	}
}
</style>
