Date.prototype.daysInMonth = function () {
    let year = this.getFullYear();
    let month = this.getMonth() + 1;
    return new Date(year, month, 0).getDate();
};

Date.prototype.getNormDay = function () {
    let day = this.getDay();
    return (day + 6) % 7;
};

Date.prototype.getDateForInput = function () {
    return this.toISOString().split('T')[0];
};

class CalendarPickerRange {
    constructor() {
        this.$calendar = $('[data-calendar-picker-range]');

        this.initMonthBody();
        this.initExternEvents();
    }
    getWeekDayNameArray() {
        return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вc'];
    }
    getMonthNameArray() {
        return ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    }

    getItem() {
        return {
            open: '<span class="month-item">',
            openEmpty: '<span class="month-item-empty">',
            openDay: function (index = null) {
                return `<span class="month-item" data-day-num='${index}'>`;
            },
            close: '</span>'
        }
    }

    initMonthBody() {
        let item = this.getItem();
        let weekDays = this.getWeekDayNameArray();

        //init week row
        this.$calendar.each(function () {
            let $weekRow = $('[data-week-row]', this);

            for (let i = 0; i < 7; i++) {
                $weekRow.append(item.open + weekDays[i] + item.close);
            }
        });

        // init month block and day list
        let initDayList = this.initDayList.bind(this);
        this.$calendar.each(function () {
            let beginDateStr = $(this).attr('data-begin-date');
            let beginDate = new Date(beginDateStr + '-01');
            initDayList(this, beginDate);
        });

    }

    initDayList(calendarThis, beginDate) {
        let item = this.getItem();
        let monthNames = this.getMonthNameArray();
        let $monthBlock = $('[data-month]', calendarThis);

        $(calendarThis).attr('data-current-date', beginDate.getDateForInput());

        let currentDay = 0;
        $monthBlock.each(function (index) {
            let date = new Date(beginDate);
            date.setMonth(date.getMonth() + index);

            let daysCount = date.daysInMonth();
            let beginDay = date.getNormDay();

            let $monthName = $('[data-month-name]', this);
            $monthName.text(monthNames[date.getMonth()] + ' ' + date.getFullYear());

            let $dayList = $('[data-day-list]', this);
            $dayList.empty();

            for (let i = 0; i < beginDay; i++) {
                $dayList.append(item.openEmpty + item.close);
            }

            for (let i = 0; i < daysCount; i++) {
                $dayList.append(item.openDay(currentDay) + (i + 1) + item.close);
                currentDay++;
            }
        });
        this.initEvents(calendarThis);
    }

    initEvents(scope) {
        let isDownOnMonthItem = false;

        let $monthItems = $('[data-day-list] .month-item', scope);
        let indexSelectBegin, indexSelectEnd;
        let setRange = this.setRange.bind(this);


        $monthItems.on('mousedown', function () {
            indexSelectBegin = $(this).attr('data-day-num');
            indexSelectEnd = $(this).attr('data-day-num');

            setRange(indexSelectBegin, indexSelectEnd, this);

            isDownOnMonthItem = true;
        });

        $(document).on('mouseup', function (e) {
            isDownOnMonthItem = false;
        });

        $monthItems.on('mouseover', function () {
            if (isDownOnMonthItem) {
                indexSelectEnd = $(this).attr('data-day-num');
                setRange(indexSelectBegin, indexSelectEnd, this);
            }
        });
    }

    renderSelection(begin, end, scopeItem) {
        let $parent = $(scopeItem).closest('[data-calendar-picker-range]');
        let $itemsList = $('[data-day-num]', $parent);

        $itemsList.removeClass('select-begin');
        $itemsList.removeClass('select-end');
        $itemsList.removeClass('selected');
        for (let i = begin; i <= end; i++) {
            $itemsList.eq(i).addClass('selected');

            if (i == begin) {
                $itemsList.eq(i).addClass('select-begin');
            }

            if (i == end) {
                $itemsList.eq(i).addClass('select-end');
            }
        }
    }

    setRange(begin, end, scopeItem) {
        begin = +begin;
        end = +end;
        if (begin <= end) {
            let $parent;
            if ($(scopeItem).is('[data-calendar-picker-range]'))
                $parent = $(scopeItem)
            else
                $parent = $(scopeItem).closest('[data-calendar-picker-range]');

            let beginDateStr = $($parent).attr('data-current-date');
            let beginDate = new Date(beginDateStr);

            let $inputBeginVisible = $('[data-visible-input-date-begin]', $parent);
            let $inputEndVisible = $('[data-visible-input-date-end]', $parent);

            let $inputBeginField = $('[data-field-date-begin]', $parent);
            let $inputEndField = $('[data-field-date-end]', $parent);

            let beginDateSelect = new Date(beginDate);
            let endDateSelect = new Date(beginDate);
            beginDateSelect.setDate(begin + 1);
            endDateSelect.setDate(end + 1);

            $inputBeginVisible.val(this.dateToStr(beginDateSelect));
            $inputEndVisible.val(this.dateToStr(endDateSelect));

            $inputBeginVisible[0]['dateJs'] = beginDateSelect;
            $inputEndVisible[0]['dateJs'] = endDateSelect;

            $inputBeginField.val(beginDateSelect.getDateForInput());
            $inputEndField.val(endDateSelect.getDateForInput());


            this.renderSelection(begin, end, scopeItem);
        }
        else {
            console.log('Шарики за ролики заехали!');
        }
    }

    dateToStr(date) {
        let weekDays = this.getWeekDayNameArray();
        let monthNames = this.getMonthNameArray();


        return `${weekDays[date.getNormDay()]}, ` +
            `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    }

    initExternEvents() {
        let toggleParent = function (scope) {
            let $parentFilter = $(scope).closest('[data-filter-body]');
            let $parentCalendar = $('[data-calendar-picker-range]', $parentFilter);
            let $btn = $('[data-toggle-calendar-btn]', $parentFilter);

            if ($parentCalendar.is(':hidden')) {
                $btn.addClass('active');
                $parentCalendar.slideDown({
                    start: function () {
                        $(this).css({
                            display: "flex"
                        });
                    }
                });
            }
            else {
                $btn.removeClass('active');
                $parentCalendar.slideUp();
            }

        }

        $('[data-toggle-calendar-btn]').click(function () {
            toggleParent(this);
        });

        $('[data-hide-range]').click(function () {
            toggleParent(this);
        });

        $('[data-apply-range]').click(function () {
            let $parent = $(this).closest('[data-filter-body]');

            let begin = $('[data-visible-input-date-begin]', $parent).val();
            let end = $('[data-visible-input-date-end]', $parent).val();
            $('[data-range-input]', $parent).val(begin + ' - ' + end);

            toggleParent(this);
        });

        let initDayList = this.initDayList.bind(this);
        $('[data-calendar-prev-btn]').click(function () {
            let $parent = $(this).closest('[data-calendar-picker-range]');

            let beginDateStr = $($parent).attr('data-current-date');
            let beginDate = new Date(beginDateStr);
            beginDate.setMonth(beginDate.getMonth() - 1);

            initDayList($parent, beginDate);
        });
        $('[data-calendar-next-btn]').click(function () {
            let $parent = $(this).closest('[data-calendar-picker-range]');

            let beginDateStr = $($parent).attr('data-current-date');
            let beginDate = new Date(beginDateStr);
            beginDate.setMonth(beginDate.getMonth() + 1);

            initDayList($parent, beginDate);
        });

    }
}

let calendar = new CalendarPickerRange();




