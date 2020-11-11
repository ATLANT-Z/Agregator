Date.prototype.daysInMonth = function () {
    let year = this.getFullYear();
    let month = this.getMonth() + 1;
    return new Date(year, month, 0).getDate();
};

Date.prototype.getNormDay = function () {
    let day = this.getDay();
    return (day + 6) % 7;
};

class CalendarPickerRange {

    constructor() {
        this.$calendar = $('[data-calendar-picker-range]');
        this.beginDateStr = this.$calendar.attr('data-begin-date');
        this.beginDate = new Date(this.beginDateStr + '-01');

        this.initMonthBody();
    }

    initMonthBody() {
        let item = {
            open: '<span class="month-item">',
            openEmpty: '<span class="month-item" data>',
            close: '</span>'
        }
        let weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вc'];
        let monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        //init week row
        this.$calendar.each(function () {
            let $weekRow = $('[data-week-row]', this);

            for (let i = 0; i < 7; i++) {
                $weekRow.append(item.open + weekDays[i] + item.close);
            }
        });

        // init day list
        let beginDate = this.beginDate;

        this.$calendar.each(function () {
            let $monthBlock = $('[data-month]', this);

            $monthBlock.each(function (index) {
                let date = beginDate;
                date.setMonth(beginDate.getMonth() + index);

                let daysCount = date.daysInMonth();
                let beginDay = date.getNormDay();

                let $monthName = $('[data-month-name]', this);
                $monthName.text(monthNames[date.getMonth()]);

                let $dayList = $('[data-day-list]', this);

                for (let i = 1; i < beginDay; i++) {
                    $dayList.append(item.openEmpty + item.close);
                }

                for (let i = 1; i <= daysCount; i++) {
                    $dayList.append(item.open + i + item.close);
                }
            });
        });
    }
}

let calendar = new CalendarPickerRange();


let isDownOnMonthItem = false;

$('[data-day-list] .month-item').on('mousedown', function () {
    $(this).addClass('select-begin');
    $(this).addClass('selected');

    isDownOnMonthItem = true;
});

$(document).on('mouseup', function () {
    isDownOnMonthItem = false;
});

$('[data-day-list] .month-item').on('mouseover', function () {
    if (isDownOnMonthItem) {
        $(this).addClass('selected');
    }
});
