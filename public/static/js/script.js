function stopClick(e, isPrevent = false) {
    e.stopPropagation();

    if (isPrevent)
        e.preventDefault();
}

function activeDropdownBtn(btn) {
    $(btn).addClass('active');
}

function unActiveDropdownBtn(btn) {
    if (btn !== undefined)
        $(btn).removeClass('active');
    else {
        $('[data-dropdown-pop-btn]').removeClass('active');
    }
}


// сортировать По? Остановка клика
$('[data-dropdown-pop-block]').click(function (e) {
    stopClick(e);
});

// сортировать По?
$(document).click(function (e) {
    $('[data-dropdown-pop-block]').fadeOut();
    unActiveDropdownBtn();
});

// сортировать По?
$('[data-dropdown-pop-btn]').click(function (e) {
    stopClick(e);
    let $block = $('[data-dropdown-pop-block]', this);

    if ($block.is(':hidden')) {
        $block.fadeIn();
        activeDropdownBtn(this);
    }
    else {
        $block.fadeOut();
        unActiveDropdownBtn(this);
    }
});

//показываем какой-то блок. ФИЛЬТРЫ НАПРИМЕР
$('[data-toggle-block-with-id]').click(function (e) {
    stopClick(e);

    let id = $(this).attr('data-toggle-block-with-id');
    let $block = $('#' + id);

    if ($block.is(':hidden')) {
        $block.slideDown({
            start: function () {
                $(this).css({
                    display: "flex"
                });
            }
        });
        $(`[data-toggle-block-with-id='${id}']`).addClass('active');
    }
    else {
        $block.slideUp();
        $(`[data-toggle-block-with-id='${id}']`).removeClass('active');
    }
});

/* POPUP */
/* POPUP */
/* POPUP */
$(document).click(function () {
    $('[data-popup-block]').fadeOut();
});

$('.popup').click(function (e) {
    stopClick(e);
});

$('[data-pop-btn-close-parents]').click(function () {
    $(this).parents('[data-popup-block]').fadeOut();
});

$('[data-pop-btn-close-parent]').click(function () {
    $(this).closest('[data-popup-block]').fadeOut();
});

$('[data-show-pop-with-id]').click(function (e) {
    stopClick(e);

    let $block = $('#' + $(this).attr('data-show-pop-with-id'));

    if ($block.is(':hidden'))
        $block.fadeIn();
    else
        $block.fadeOut();
});

//опции в листе, в фильтрах. Где радио кнопки
$('.option-list__option').click(function () {
    let $parent = $(this).closest('[data-dropdown-pop-btn]');
    let $title = $('[data-dropdown-pop-btn-title]', $parent);

    $title.text($('[data-option-title]', this).text());

    $(this).siblings().removeClass('selected');
    $(this).addClass('selected');
});

//раскрытие дерева в каталоге по ширине
$('[data-tree-toggle-btn]').click(function () {
    $(this).parents('[data-tree-body]').toggleClass('toggled');
});

//клик по плюсику в дереве
$('[data-tree-title-btn]').click(function () {
    let $parent = $(this).closest('[data-tree-li-item]');
    let $list = $('>.c-list', $parent);

    if ($list.is(':hidden')) {
        $list.slideDown();
        $parent.addClass('opened');
    }
    else {
        $list.slideUp();
        $parent.removeClass('opened');
    }
});

//клик по тайтлу в дереве. По ТЕКСТУ
$('[data-tree-li-item] [data-tree-title-text]').click(function () {
    $('[data-tree-li-item]').removeClass('selected');
    $(this).closest('[data-tree-li-item]').toggleClass('selected');
});

///* Клики в попапе по чекбоксам  */
//$('[data-tree-body] input[type="checkbox"]').click(function () {
//    let $treeBody = $(this).closest('[data-tree-body]');
//    let $liItem = $(this).closest('[data-tree-li-item]');

//    let $parent;
//    if ($liItem.length == 0)
//        $parent = $treeBody;
//    else {
//        $parent = $liItem;
//    }

//    let status = $(this).is(':checked');
//    let $checkboxes = $('input[type="checkbox"]', $parent).not(this);

//    $checkboxes.each(function () {
//        let thisStatus = $(this).is(':checked');
//        if (status !== thisStatus)
//            $(this).prop("checked", !thisStatus);
//    });

//});

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

//Таня сказала, пускай всегда выпадает
//$('.search-drop-down-list').focusin(function () {
//    $('.options', this).slideDown();
//});
//$(document).click(function (e) {
//    if ($(e.target).closest('.filter-body').length == 0)
//        $('.search-drop-down-list .options', this).slideUp();
//});

function deleteTag() {
    let $tag = $(this).closest('[data-tag]');
    let inputId = $tag.attr('data-target-input-id');
    let $input = $(`[id='${inputId}']`);

    $input.val('');
    $tag.remove();

    if ($input.is('[readonly]'))
        $input.trigger('change');

    if ($input.is('[type="checkbox"]'))
        $input.prop('checked', false);
}
$('[data-tag-delete-btn]').click(deleteTag);


let TAG = {
    code:
        `<li class="data-tag data-tag-line__item" data-tag>
            <div class="data-tag__text" data-tag-title></div>
            <span class="ico-wrapper btn" data-tag-delete-btn>
                <img src="assets/icons/crossGreen.svg" alt="">
            </span>
        </li>`
}

//шо делать, если инпут в фильтрах изменился
function filterInputChangeHandler() {
    let $filterBlock = $(this).closest('[data-filter-block]');
    let $tagList = $('[data-tag-list]', $filterBlock);

    let $existingTag = $(`[data-target-input-id="${this.id}"]`, $tagList);
    $existingTag.remove();


    let attrValue = $(this).attr('data-to-tag-list');
    let inputValue = $(this).val();

    if ($(this).is('[type="checkbox"]') && !$(this).is(':checked'))
        return;

    let tagTitle;
    if (attrValue.length == 0) {
        tagTitle = inputValue;
    }
    else {
        tagTitle = attrValue;
    }

    if (tagTitle.length != 0) {
        let $tag = $(TAG.code);
        $tag.attr('data-target-input-id', this.id);
        $('[data-tag-title]', $tag).text(tagTitle);
        $('[data-tag-delete-btn]', $tag).click(deleteTag);

        $tagList.append($tag);
    }
}
$('[data-to-tag-list]').on('change', filterInputChangeHandler);

//чистим теги фильтров
$('[data-clear-tag-list-btn]').click(function () {
    let $filters = $(this).closest('[data-filter-block]');

    let $tags = $('[data-tag-list] [data-tag]', $filters);
    $tags.each(function () {
        deleteTag.call(this);
    });
});


//Обновляем постоянно состояние тег-листа. Если нет тегов - прячем.
let $tagListRows = $('[data-tag-list]');
setInterval(function () {
    $tagListRows.each(function () {
        let $this = $(this)
        if ($('[data-tag]', this).length == 0) {
            if ($this.is(':visible'))
                $this.closest('[data-tag-line]').slideUp();
        }
        else {
            if ($this.is(':hidden'))
                $this.closest('[data-tag-line]').slideDown();
        }
    });
}, 400);


//Упрощённая работа с сабмит
$('[data-child-submit-click]').click(function () {
    $('input[type="submit"]')[0].click();
});


//переключение страниц
$('[data-show-page-with-id]').click(function () {
    let $this = $(this);

    let targetId = $this.attr('data-show-page-with-id');

    let $targetPage = $(`#${targetId}`);
    let $currentPage = $('[data-page]').filter(':visible');

    $currentPage.hide();
    $targetPage.fadeIn();

    let currText = $this.text();
    $this.text($this.attr('data-second-text'));
    $this.attr('data-second-text', currText);

    $this.attr('data-show-page-with-id', $currentPage.attr('id'));
});

//редактируем имя каталога
$('[data-edit-catalog-name-btn]').click(function (e) {
    stopClick(e);

    let $parent = $(this).closest('[data-tree-title]');
    let $titleText = $('[data-tree-title-text]', $parent);
    let $parentCategory = $(this).closest('[data-tree-li-item]');

    let titleText = $titleText.text();
    let catalogId = $parentCategory.attr('data-catalog-id');

    if (catalogId === undefined) {
        //При генерации ты, видимо, забыл задать data-catalog-id всем li (категориям)
        console.error('Нет айди у категории!');
        console.trace('Смотри сюда');
    }

    let $pop = $('#edit-category-pop');
    $('[data-category-name-input]', $pop).val(titleText);

    let $popCategory = $(`[data-catalog-id='${catalogId}']`, $pop);
    let $popCatalogTitle = $('>[data-tree-title]', $popCategory);

    setTreeCheckbox($('input[type="checkbox"]', $popCatalogTitle).get(0));

    $pop.fadeIn();
    //ЭТО ЕСЛИ НАДО ЗАМЕНИТЬ ПОЛЕ ДВОЙНЫМ КЛИКОМ, НАПРИМЕР
    //$titleText.empty();
    //$titleText.append(`<input type="text" onfocusout="titleEditInputFocusOutHandler(this)" onkeydown="titleEditInputKeyDownHandler(this)">`);
    //let $input = $('input', $titleText);
    //$input.get(0).focus();
    //$input.val(titleText);
    //setTrueWidthForInput($input);
});

//обработчик нажатия клавиши, чтоб расширять
function titleEditInputKeyDownHandler(_this) {
    setTimeout(function () {
        setTrueWidthForInput(_this);
    }, 5);
}
//обработчик нажатия клавиши, чтоб расширять
function uiGrowableInputKeyDownHandlerJQuery() {
    let _this = this;
    setTimeout(function () {
        setTrueWidthForInput(_this);
    }, 5);
}

//изменять ширину инпут при вводе
function setTrueWidthForInput(input) {
    let $input = $(input);
    let $buffer = $('<span></span>');

    $buffer.css('font-size', $input.css('font-size'));
    $buffer.css('text-transform', $input.css('text-transform'));
    $buffer.css('font-weight', $input.css('font-weight'));

    $buffer.css('opacity', 0);
    $buffer.css('position', 'fixed');
    $buffer.css('width', 'auto');

    $('body').append($buffer);

    $buffer.text($input.val());

    $input.css('width', parseFloat($buffer.css('width')) + 20 + 'px');

    $buffer.remove();
}

//изменять ширину инпут при вводе
$('[data-ui-growable-input]').on('keydown', uiGrowableInputKeyDownHandlerJQuery);


//обработчик снятия фокуса с инпута при редактировании имени каталога
function titleEditInputFocusOutHandler(_this) {
    let $this = $(_this);
    let $title = $this.closest('[data-tree-title-text]');
    $title.text($this.val());

    //Здесь что-то сделать, отправить на сервак может? Или как-то сохранить изменения.

    $this.remove();
}



