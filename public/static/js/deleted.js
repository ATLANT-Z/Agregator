//? Здесь всё удаленное, не обращай внимания. Это моя кубышка
//? Здесь всё удаленное, не обращай внимания. Это моя кубышка
//? Здесь всё удаленное, не обращай внимания. Это моя кубышка



// Клики в попапе по чекбоксам. Убирает чеккед везде, кроме этого
$('[data-tree-body] input[type="checkbox"]').click(function () {
    setTreeCheckbox(this);
});

function setTreeCheckbox(_this) {
    $(_this).prop("checked", true);

    let $treeBody = $(_this).closest('[data-tree-body]');
    let $checkboxes = $('input[type="checkbox"]', $treeBody);

    $checkboxes.each(function () {
        if ($(this).is(':checked') && this != _this)
            $(this).prop("checked", false);
    });
}

//обработчик снятия фокуса с инпута при редактировании имени каталога
function titleEditInputFocusOutHandler(_this) {
    let $this = $(_this);
    let $title = $this.closest('[data-tree-title-text]');
    $title.text($this.val());

    //Здесь что-то сделать, отправить на сервак может? Или как-то сохранить изменения.

    $this.remove();
}

//Таня сказала, пускай всегда выпадает
$('.search-drop-down-list').focusin(function () {
    $('.options', this).slideDown();
});
$(document).click(function (e) {
    if ($(e.target).closest('.filter-body').length == 0)
        $('.search-drop-down-list .options', this).slideUp();
});

//редактируем категорию (каталог) (кнопка с карандашиком) 
//Это когда у нас просто имя редактировалось
$('[data-edit-catalog-name-btn]').click(function (e) {
    stopClick(e);

    let $parent = $(this).closest('[data-tree-title]');
    let $titleText = $('[data-tree-title-text]', $parent);

    //Убираем пробелы в названии, если вдруг есть
    let titleText = $titleText.text().trim().replace(/\s+/g, ' ');

    //ЭТО ЕСЛИ НАДО ЗАМЕНИТЬ ПОЛЕ ДВОЙНЫМ КЛИКОМ, НАПРИМЕР
    $titleText.empty();
    $titleText.append(`<input type="text" onfocusout="titleEditInputFocusOutHandler(this)" onkeydown="uiGrowableInputKeyDownHandler(this)">`);
    let $input = $('input', $titleText);
    $input.get(0).focus();
    $input.val(titleText);
    setTrueWidthForInput($input);
});

class CalendarPickerRange {
    constructor() {
        this.$calendar = $('[data-calendar-picker-range]');

        this.initMonthBody();
        this.initExternEvents();
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
        let weekDays = getWeekDayNameArray();

        //init week row
        this.$calendar.each(function () {
            let $weekRow = $('[data-week-row]', this);

            for (let i = 0; i < 7; i++) {
                $weekRow.append(item.open + weekDays[i] + item.close);
            }
        });



        // init month block and day list
        let initDayList = this.initDayList.bind(this);
        let setDefaultRange = this.setDefaultRange.bind(this);
        this.$calendar.each(function () {
            let beginDateStr = $(this).attr('data-begin-date');
            let beginDate = new Date(beginDateStr + '-01');
            initDayList(this, beginDate);
            setDefaultRange(this);
        });

    }

    initDayList(calendarThis, beginDate) {
        let item = this.getItem();
        let monthNames = getMonthNameArray();
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

    setDefaultRange(calendarThis) {
        let $calendar = $(calendarThis);
        if ($calendar.is('[data-select-begin]') && $calendar.is('[data-select-end]')) {
            let selectBegin = new Date($calendar.attr('data-select-begin'));
            let selectEnd = new Date($calendar.attr('data-select-end'));

            let indexBegin = selectBegin.getDate();
            //преобразование разницы в дни
            let indexEnd = (selectEnd - selectBegin) / 1000 / 60 / 60 / 24;

            this.setRange(indexBegin - 1, indexBegin + indexEnd - 1, $calendar);
        }
        else {
            console.log('Данные для диапазона не указаны. Элемент:');
            console.log($calendar);
        }
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
            if ($(scopeItem).is('[data-filter-body]'))
                $parent = $(scopeItem)
            else
                $parent = $(scopeItem).closest('[data-filter-body]');

            let $parentCalendar = $('[data-calendar-picker-range]', $parent);
            let beginDateStr = $($parentCalendar).attr('data-current-date');
            let beginDate = new Date(beginDateStr);

            let $inputBeginVisible = $('[data-visible-input-date-begin]', $parent);
            let $inputEndVisible = $('[data-visible-input-date-end]', $parent);

            let $inputBeginField = $('[data-field-date-begin]', $parent);
            let $inputEndField = $('[data-field-date-end]', $parent);

            let beginDateSelect = new Date(beginDate);
            let endDateSelect = new Date(beginDate);
            beginDateSelect.setDate(begin + 1);
            endDateSelect.setDate(end + 1);

            $inputBeginVisible.val(dateToStr(beginDateSelect));
            $inputEndVisible.val(dateToStr(endDateSelect));

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
            beginDate.setDate(1);
            beginDate.setHours(12); // это чтоб при переходе времени не сломалось

            initDayList($parent, beginDate);
        });
        $('[data-calendar-next-btn]').click(function () {
            let $parent = $(this).closest('[data-calendar-picker-range]');

            let beginDateStr = $($parent).attr('data-current-date');
            let beginDate = new Date(beginDateStr);
            beginDate.setMonth(beginDate.getMonth() + 1);
            beginDate.setDate(1);
            beginDate.setHours(12); // это чтоб при переходе времени не сломалось

            initDayList($parent, beginDate);
        });

    }
}
//let calendar = new CalendarPickerRange();