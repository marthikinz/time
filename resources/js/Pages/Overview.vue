<script lang='ts'>
import { defineComponent } from 'vue'
import '@fullcalendar/core/vdom' // solve problem with Vite
import FullCalendar, {CalendarOptions, EventApi, DateSelectArg, EventClickArg} from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from '../event-utils'
import { getHeight } from "../display-utils";
import TimeEntryModal from "../components/modal/TimeEntryModal.vue";

const Overview = defineComponent({
    components: {
        FullCalendar,
        TimeEntryModal
    },
    data() {
        return {
            isDayClicked: false,
            daySelectedInfo: {} as DateSelectArg,
            calendarOptions: {
                plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin // needed for dateClick
                ],
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                height:getHeight(),
                initialView: 'dayGridMonth',
                initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
                editable: true,
                selectable: true,
                selectMirror: true,
                dayMaxEvents: true,
                weekends: true,
                fixedWeekCount: false,
                showNonCurrentDates: false,
                select: this.handleDateSelect,
                eventClick: this.handleEventClick,
                eventsSet: this.handleEvents
                /* you can update a remote database when these fire:
                eventAdd:
                eventChange:
                eventRemove:
                */
            } as CalendarOptions,
            currentEvents: [] as EventApi[],
        }
    },
    methods: {
        handleWeekendsToggle() {
            this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
        },
        handleDateSelect(selectInfo: DateSelectArg) {
            this.daySelectedInfo = selectInfo;
            this.isDayClicked = true;
        },
        handleEventClick(clickInfo: EventClickArg) {
            if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
                clickInfo.event.remove()
            }
        },
        handleEvents(events: EventApi[]) {
            this.currentEvents = events
        },
        closeModal(title: string) {
            this.isDayClicked = false;
            let calendarApi = this.daySelectedInfo.view.calendar;
            calendarApi.unselect() // clear date selection

            if (title) {
                calendarApi.addEvent({
                    id: createEventId(),
                    title,
                    start: this.daySelectedInfo.startStr,
                    end: this.daySelectedInfo.endStr,
                    allDay: this.daySelectedInfo.allDay
                })
            }
        }
    }
})
export default Overview
</script>

<template>
    <div class='overview' >
        <div class='overview-sidebar'>
            <div class='overview-sidebar-section'>
                <h2>Instructions</h2>
                <ul>
                    <li>Select dates and you will be prompted to create a new event</li>
                    <li>Drag, drop, and resize events</li>
                </ul>
            </div>
            <div class='overview-sidebar-section'>
                <label>
                    <input
                        type='checkbox'
                        :checked='calendarOptions.weekends'
                        @change='handleWeekendsToggle'
                    />
                    toggle weekends
                </label>
            </div>
            <div class='overview-sidebar-section'>
                <h2>All Events ({{ currentEvents.length }})</h2>
                <ul>
                    <li v-for='event in currentEvents' :key='event.id'>
                        <b>{{ event.startStr }}</b>
                        <i>{{ event.title }}</i>
                    </li>
                </ul>
            </div>
        </div>
        <div class='overview-main'>
            <FullCalendar

                class='overview-calendar'
                :options='calendarOptions'
            >

            </FullCalendar>
        </div>
    </div>
    <TimeEntryModal
        v-show="isDayClicked"
        @close="closeModal"
   />
</template>

<style lang='css' scoped>

h2 {
    margin: 0;
    font-size: 16px;
}

ul {
    margin: 0;
    padding: 0 0 0 1.5em;
}

li {
    margin: 1.5em 0;
    padding: 0;
}

b { /* used for event dates/times */
    margin-right: 3px;
}

.overview {
    display: flex;
    min-height: 100%;
    font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
    font-size: 14px;
}

.overview-sidebar {
    width: 300px;
    line-height: 1.5;
    background: #eaf9ff;
    border-right: 1px solid #d3e2e8;
}

.overview-sidebar-section {
    padding: 2em;
}

.overview-main {
    flex-grow: 1;
    padding: 3em;
}


</style>
