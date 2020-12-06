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