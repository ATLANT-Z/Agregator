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

function getWeekDayNameArray() {
    return ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вc'];
}

function getMonthNameArray() {
    return ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
}

function dateToStr(date) {
    let weekDays = getWeekDayNameArray();
    let monthNames = getMonthNameArray();

    return `${weekDays[date.getNormDay()]}, ` +
        `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

$('[data-field-date-begin], [data-field-date-end]').on('change', function () {
    let $parent = $(this).closest('[data-filter-body]');

    let $begin = $('[data-field-date-begin]', $parent);
    let $end = $('[data-field-date-end]', $parent);
    let $userDateField = $('[data-user-date-field]', $parent);

    if ($begin.val().length && $end.val().length) {
        let beginInputVal = $begin.val();
        let endInputVal = $end.val();

        let beginStr = dateToStr(new Date(beginInputVal));
        let endStr = dateToStr(new Date(endInputVal));

        $userDateField.val(beginStr + ' - ' + endStr);
        $userDateField.trigger("change");
    }
    else {
        $userDateField.val('');
    }
});

$('[data-user-date-field]').on('change', function () {
    if ($(this).val().length == 0) {
        let $parent = $(this).closest('[data-filter-body]');

        let $begin = $('[data-field-date-begin]', $parent);
        let $end = $('[data-field-date-end]', $parent);

        $begin.val('');
        $end.val('');
    }
});


$('[data-field-date]').on('change', function () {
    let $parent = $(this).closest('[data-calendar-body]');

    let $datePicker = $('[data-field-date]', $parent);
    let $userDateField = $('[data-user-date-field]', $parent);

    if ($datePicker.val().length) {
        let dateVal = $datePicker.val();
        let dateStr = dateToStr(new Date(dateVal));

        $userDateField.val(dateStr);
        $userDateField.trigger("change");
    }
    else {
        $userDateField.val('');
    }
});

