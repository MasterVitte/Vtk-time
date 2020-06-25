<template>
	<div class="content-wrapper">
		<section>
			<div class="container home-container">
				<vue-topprogress ref="topProgress"></vue-topprogress>
				<div class="home-container-content">
					<div class="home-header__section row">
						<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 home-header__section-title no-padding">
							<h1 class="ui-title-1">Расписание</h1>
						</div>
						<div class="filter__section col-xs-12 col-sm-6 col-md-6 col-lg-6 no-padding">
							<p class="filter__title">Фильтр</p>
							<toggle-button :value="false" color="#007bff6b" :sync="true" v-model="filterGroup"
							               :labels="true"/>
						</div>
						<input type="text" v-model="activeTitleGroup" v-if="filterGroup" placeholder="Группа" class="filter__input">
						<!--<input type="text" v-model="activeTitleGroup" v-if="filterGroup" placeholder="Группа"-->
						       <!--class="filter__input" v-bind="compilationCurrentLessons()">-->
					</div>
					<!--<transition name="animation-window">-->
						<!--<div class="ui-messageBox__wrapper" v-if="view" :class="{active: view}"-->
						     <!--v-on:keyup.esc="cancelViewLesson">-->
							<!--<form>-->
								<!--<div class="ui-messageBox">-->
									<!--<div class="ui-messageBox__header row">-->
										<!--<div class="col-10 no-padding">-->
											<!--<span class="messageBox-title">{{ activeLesson.title }}</span>-->
										<!--</div>-->
										<!--<div class="col-2 no-padding justify-content-end">-->
											<!--<span class="button-close" @click="cancelViewLesson"></span>-->
										<!--</div>-->
									<!--</div>-->
									<!--<div class="ui-messageBox__content">-->
										<!--<div class="box-teacher__info">-->
											<!--<p class="modal__title">предмет: {{ activeLesson.subject.title }}</p>-->
										<!--</div>-->
										<!--<div class="box-teacher__info">-->
											<!--<p class="modal__title">преподаватель: {{-->
												<!--activeLesson.teacher[Object.keys(activeLesson.teacher)]['title'] }}</p>-->
										<!--</div>-->
										<!--<div class="box-teacher__info">-->
											<!--<p class="modal__title">аудитория: {{-->
												<!--activeLesson.subject.room[Object.keys(activeLesson.subject.room)]['title']-->
												<!--}}</p>-->
										<!--</div>-->
									<!--</div>-->
								<!--</div>-->
							<!--</form>-->
						<!--</div>-->
					<!--</transition>-->
					<div class="home-list">
						<b-container>
							<main class="b-calendar">
								<b-row>
									<b-col md="4">
										<div class="b-calendar__information">
											<div class="today d-flex justify-content-center align-items-center">
												<div class="weekDay">
													{{selectedWeekDay | capitalize}}
												</div>
												<div class="day">
													{{selectedDayAndMonth.day}}
												</div>
												<div class="month">
													{{selectedDayAndMonth.month | capitalize}}
												</div>
												<a href="#" id="goTodayLink" @click="goToday"
												   v-show="!todayInCurrentMonthAndYear || !todayIsEqualSelectDate">
													Today
												</a>
												<b-tooltip target="goTodayLink" v-show="!todayInCurrentMonthAndYear || !todayIsEqualSelectDate">
													Back to today
												</b-tooltip>
											</div>
										</div>
									</b-col>
									<b-col md="8">
										<div class="b-calendar__calendar">
											<div class="b-calendar__header">
												<b-row>
													<b-col class="year text-right" align-h="end">
														<span>{{year}}</span>
													</b-col>
												</b-row>
												<b-row align-v="center">
													<b-col class="text-left" align-h="start">
														<b-button id="subtractMonthBtn" class="arrow arrow-left" variant="light"
														          @click="subtractMonth">
															<font-awesome-icon :icon="lefticon"/>
														</b-button>
														<b-tooltip target="subtractMonthBtn">
															{{previousMonthAsString | capitalize}}
														</b-tooltip>
													</b-col>
													<b-col class="text-center" align-h="center">
														<span class="month">{{month}}</span>
													</b-col>
													<b-col class="text-right d-flex flex-row-reverse" align-h="end">
														<b-button id="addMonthBtn" class="arrow arrow-right" variant="light" @click="addMonth">
															<font-awesome-icon :icon="righticon"/>
														</b-button>
														<b-tooltip target="addMonthBtn">
															{{nextMonthAsString | capitalize}}
														</b-tooltip>
													</b-col>
												</b-row>
											</div>
											<div class="b-calendar__weekdays">
												<div class="weekday" v-for="(day, index) in days" :key="index">
													<strong>{{day}}</strong>
												</div>
											</div>
											<div class="b-calendar__dates">
												<div class="date text-right" :class="{
                                'today': date.today,
                                'blank': date.blank,
                                'no-border-right': date.key % 7 === 0,
                             }"
												     v-for="date in dateList" :key="date.key" :data-date="date.date"
												     @click="setSelectedDate(date.moment)">
													<span class="day">{{date.dayNumber}}</span>
													<span class="weekday">{{date.weekDay}}</span>
													<div class="additional" v-show="date.additional">
														<span class="year" v-show="date.additional.year">{{date.additional.year}}</span>
														<span class="month" v-show="date.additional.month">{{date.additional.month}}</span>
													</div>
												</div>
											</div>
										</div>
									</b-col>
								</b-row>
							</main>
						</b-container>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
	import {vueTopprogress} from 'vue-top-progress'
	import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
	import {library} from '@fortawesome/fontawesome-svg-core'
	import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons'
	import {ToggleButton} from 'vue-js-toggle-button'

	var moment = require('moment')

export default {
	components: {
		vueTopprogress,
		library,
		faArrowLeft,
		faArrowRight,
		FontAwesomeIcon,
		ToggleButton
	},
	data() {
		return {
			activeLesson: null,
			messageToggle: false,
			msg: null,
			maxdaylesson: 8,
			maxtimeweek: 36,
			titlesubject: '',
			today: moment(),
			dateContext: moment(),
			selectedDate: moment(),
			days: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
			filterGroup: false,
			activeTitleGroup: '',
		}
	},
	watch: {
		'loading': {
			handler(val, oldVal) {
				if (val === true) {
					this.$refs.topProgress.start()
				} else if (val === false) {
					this.$refs.topProgress.done()
				}
			}
		},
	},
	computed: {
		loading() {
			return this.$store.getters.loading
		},

		lefticon () {
			return faArrowLeft
		},

		righticon () {
			return faArrowRight
		},

		year: function () {
			return this.dateContext.format("Y");
		},

		month: function () {
			return this.dateContext.format("MMMM");
		},

		daysInMonth: function () {
			return this.dateContext.daysInMonth();
		},

		currentDate: function () {
			return this.dateContext.get("date");
		},

		firstDayOfMonth: function () {
			let firstDay = moment(this.dateContext).subtract(this.currentDate, "days");
			return firstDay.weekday();
		},

		previousMonth: function () {
			return moment(this.dateContext).subtract(1, "month");
		},
		previousMonthAsString: function () {
			return this.previousMonth.format("MMMM");
		},
		nextMonth: function () {
			return moment(this.dateContext).add(1, "month");
		},
		nextMonthAsString: function () {
			return this.nextMonth.format("MMMM");
		},

		daysInPreviousMonth: function () {
			return this.previousMonth.daysInMonth();
		},
		daysFromPreviousMonth: function () {
			let daysList = [];
			let count = this.daysInPreviousMonth - this.firstDayOfMonth;
			while (count < this.daysInPreviousMonth) {
				count++;
				daysList[count] = count;
			}

			return daysList.filter(function () {
				return true;
			});
		},

		dateList: function () {
			let $this = this;

			let dateList = [];

			let previousMonth = this.previousMonth;
			let nextMonth = this.nextMonth;

			//dates for display
			let formattedCurrentMonth = this.dateContext.format("MM");
			let formattedCurrentYear = this.year;
			let formattedPreviousMonth = previousMonth.format("MM");
			let formattedPreviousYear = previousMonth.format("Y");
			let formattedNextMonth = nextMonth.format("MM");
			let formattedNextYear = nextMonth.format("Y");

			//counters
			let countDayInCurrentMonth = 0;
			let countDayInPreviousMonth = 0;

			//filling in dates from the previous month
			this.daysFromPreviousMonth.forEach(function (dayFromPreviousMonth) {
				countDayInCurrentMonth++;
				countDayInPreviousMonth++;

				let formattedDay = $this.formattingDay(dayFromPreviousMonth);
				let previousMonth =
				$this.daysFromPreviousMonth.length ===
				countDayInPreviousMonth
				? $this.previousMonthAsString
				: false;
				let previousYear =
				formattedCurrentYear !== formattedPreviousYear &&
				$this.daysFromPreviousMonth.length ===
				countDayInPreviousMonth
				? formattedPreviousYear
				: false;
				let additional = {
					month: previousMonth,
					year: previousYear
				};

				if (!previousMonth && !previousYear) {
					additional = false;
				}

				dateList[countDayInCurrentMonth] = {
					key: countDayInCurrentMonth,
					dayNumber: formattedDay,
					date:
					formattedDay +
					"." +
					formattedPreviousMonth +
					"." +
					formattedPreviousYear,
					blank: true,
					today: false,
					additional: additional,
					weekDay: false,
					moment: moment(
					formattedPreviousYear +
					formattedPreviousMonth +
					formattedDay
					)
				};
			});

			//filling in dates from the current month
			while (countDayInCurrentMonth < this.firstDayOfMonth + this.daysInMonth) {
				countDayInCurrentMonth++;

				let day = countDayInCurrentMonth - countDayInPreviousMonth;
				let weekDay = this.getWeekDay(countDayInCurrentMonth);
				let formattedDay = this.formattingDay(day);

				dateList[countDayInCurrentMonth] = {
					key: countDayInCurrentMonth,
					dayNumber: formattedDay,
					date:
					formattedDay +
					"." +
					formattedCurrentMonth +
					"." +
					formattedCurrentYear,
					blank: false,
					today:
					formattedDay === this.initialDate &&
					this.todayInCurrentMonthAndYear,
					additional: false,
					weekDay: weekDay,
					moment: moment(
					formattedCurrentYear +
					formattedCurrentMonth +
					formattedDay
					)
				};
			}

			let daysInNextMonth = 7 - (countDayInCurrentMonth % 7);
			let countDayInCurrentMonthSaved = countDayInCurrentMonth;
			let day = 0;

			//filling in dates from the next month
			if (daysInNextMonth < 7) {
				while (
				countDayInCurrentMonth <
				countDayInCurrentMonthSaved + daysInNextMonth
				) {
					countDayInCurrentMonth++;
					day++;

					let formattedDay = this.formattingDay(day);
					let nextMonth = day === 1 ? this.nextMonthAsString : false;
					let nextYear =
					formattedCurrentYear !== formattedNextYear && day === 1
					? formattedNextYear
					: false;
					let additional = {
						month: nextMonth,
						year: nextYear
					};

					if (!nextMonth && !nextYear) {
						additional = false;
					}

					dateList[countDayInCurrentMonth] = {
						key: countDayInCurrentMonth,
						dayNumber: formattedDay,
						date:
						formattedDay +
						"." +
						formattedNextMonth +
						"." +
						formattedNextYear,
						blank: true,
						today: false,
						additional: additional,
						weekDay: false,
						moment: moment(
						formattedNextYear +
						formattedNextMonth +
						formattedDay
						)
					};
				}
			}

			return dateList.filter(function () {
				return true;
			});
		},

		initialDate: function () {
			return this.formattingDay(this.today.get("date"));
		},
		initialMonth: function () {
			return this.today.format("MMMM");
		},
		initialYear: function () {
			return this.today.format("Y");
		},
		todayInCurrentMonthAndYear: function () {
			return (
			this.month === this.initialMonth &&
			this.year === this.initialYear
			);
		},
		selectedDayAndMonth: function () {
			let dayAndMonth = this.selectedDate.format("D MMMM");
			dayAndMonth = dayAndMonth.split(" ");
			dayAndMonth = {
				day: dayAndMonth[0],
				month: dayAndMonth[1]
			};

			return dayAndMonth;
		},
		selectedWeekDay: function () {
			return this.selectedDate.format("dddd");
		},
		todayIsEqualSelectDate: function () {
			return (
			this.selectedDate.format("YYYYMMDD") ===
			this.today.format("YYYYMMDD")
			);
		}
	},
	methods: {
		addMonth: function () {
			this.dateContext = this.nextMonth;
		},
		subtractMonth: function () {
			this.dateContext = this.previousMonth;
		},
		setSelectedDate: function (moment) {
			this.selectedDate = moment;
		},
		goToday: function () {
			this.selectedDate = this.today;
			this.dateContext = this.today;
		},
		formattingDay(day) {
			return ("0" + day).slice(-2);
		},
		getWeekDay(day) {
			let index = day;
			if (index > 7) {
				index %= 7;
			}
			index = index === 0 ? 6 : index - 1;
			return this.days[index];
		}
	},
	filters: {
		capitalize: function (value) {
			if (!value) return "";
			value = value.toString();
			return value.charAt(0).toUpperCase() + value.slice(1);
		}
	}
}
</script>

<style scoped>

	@import '../assets/styles/index.css';

	.container {
		padding: 0 !important;
	}

	.home-header__section {
		margin-bottom: 20px !important;
	}

	.b-calendar > .row > .col-md-4 {
		padding: 0 !important;
	}

	#goTodayLink {
		margin-top: 2rem;
		cursor: pointer;
	}

	.home-container {
		display: flex;
		justify-content: center;
	}

	.home-container-content {
		width: 100%;
	}

	.filter__input {
		text-align: center;
		margin: 10px 0;
	}

	.home-list__header {
		margin-bottom: 20px;
	}

	@media all and (max-width: 768px) {
		.ui-title-1 {
			text-align: center;
		}
	}

	.table__container {
		min-height: 300px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.b-calendar {
		display: flex;
		align-items: center;
	}

	.b-calendar__information {
		background-color: rgba(0, 123, 255, 0.2);
		border-radius: 1.2rem 0 0 1.2rem;
		height: 100%;
	}

	.one__lesson {
		width: 100% !important;
		padding: 10px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.b-calendar__information .today {
		flex-direction: column;
		padding-top: 3em;
	}

	.b-calendar__information .today .weekDay {
		font-size: 1.2em;
		font-weight: 100;
		padding-bottom: 0.5em;
	}

	.b-calendar__information .today .day {
		font-size: 5.5em;
		font-weight: 600;
		line-height: 1;
	}

	.b-calendar__information .today .month {
		font-size: 2em;
		font-weight: 200;
		line-height: 1;
	}

	.ui-tag__wrapper {
		cursor: pointer;
	}

	.vue-js-switch {
		margin: 0;
	}

	.lesson__item {
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-direction: column;
	}

	.ui-tag {
		background-color: #fff;
		border: none;
	}

	.b-calendar__calendar {
		min-height: 40rem;
	}

	.filter__section {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.filter__title {
		margin-bottom: 0;
		margin-right: 8px;
	}

	.ui-title-1 {
		margin-bottom: 0;
	}

	.b-calendar__header {
		margin-bottom: 2rem;
	}

	.b-calendar__header .month {
		font-size: 1.25em;
		font-weight: 200;
		text-transform: capitalize;
	}

	.b-calendar__header .year {
		font-size: 1.5em;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.b-calendar__lessons {
		width: 100%;
	}

	.today__lessons {
		width: 100% !important;
		padding-top: 2em !important;
	}

	.weekday {
		text-align: center;
	}

	.b-calendar__header .arrow {
		background: transparent;
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 50%;
		color: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2.5rem;
		width: 2.5rem;
	}

	.b-calendar__header .arrow:hover {
		cursor: pointer;
	}

	.b-calendar__header .arrow-left i {
		-webkit-transform: translateX(-10%);
		transform: translateX(-10%);
	}

	.b-calendar__header .arrow-right i {
		-webkit-transform: translateX(10%);
		transform: translateX(10%);
	}

	.b-calendar__weekdays {
		display: flex;
		margin-bottom: 1.25rem;
	}

	.b-calendar__weekdays .weekday {
		width: calc(100% / 7);
		padding: 0.25rem 0.5rem;
	}

	.b-calendar__dates {
		display: flex;
		flex-wrap: wrap;
		position: relative;
	}

	.b-calendar__dates:after {
		content: "";
		position: absolute;
		bottom: 0;
		background-color: #fff;
		height: 1px;
		width: 100%;
		z-index: 1;
	}

	.b-calendar__dates .date {
		border-right: 1px solid rgba(0, 0, 0, 0.05);
		border-bottom: 1px solid rgba(0, 0, 0, 0.05);
		font-weight: 200;
		min-height: 4.5rem;
		padding: 0.25rem 0.5rem;
		position: relative;
		width: calc(100% / 7);
	}

	.b-calendar__dates .date.blank {
		background-color: rgba(0, 0, 0, 0.02);
		color: rgba(0, 0, 0, 0.2);
	}

	.b-calendar__dates .date.no-border-right {
		border-right: none;
	}

	.b-calendar__dates .date.today {
		background-color: rgba(0, 123, 255, 0.2);
	}

	.b-calendar__dates .date .weekday {
		display: none;
	}

	.b-calendar__dates .date .additional {
		font-size: 0.75em;
		position: absolute;
		bottom: 0.25rem;
		left: 0.5rem;
	}

	.b-calendar__dates .date .additional .year {
		padding-right: 0.25rem;
		font-size: 0.75em;
	}

	.change__view {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
	}

	.b-footer {
		padding: 15px 0;
	}

	section {
		padding-bottom: 0 !important;
	}

	@media (max-width: 768px) {
		.b-calendar__header .year {
			margin-top: 1rem;
		}

		.b-calendar__information {
			min-height: auto;
			padding-top: 2rem;
			padding-bottom: 2rem;
			border-radius: 2.5rem 2.5rem 0 0;
		}

		.b-calendar__information .today {
			padding-top: 0;
		}
	}

	@media all and (max-width: 576px) {
		.filter__section {
			justify-content: center;
		}

		.home-header__section-title {
			margin-bottom: 20px;
		}
	}

	@media (max-width: 480px) {
		.b-calendar__weekdays {
			display: none;
		}

		.b-calendar__dates .date {
			width: 100%;
			border: none;
			border-bottom: 1px solid rgba(0, 0, 0, 0.05);
			display: flex;
			justify-content: center;
			align-items: center;
		}

		.b-calendar__dates .date.blank {
			display: none;
		}

		.b-calendar__dates .date .weekday {
			display: block;
			margin-left: 0.25rem;
		}
	}
</style>