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

/* Клики в попапе по чекбоксам  */
$('[data-tree-body] input[type="checkbox"]').click(function () {
    let $treeBody = $(this).closest('[data-tree-body]');
    let $liItem = $(this).closest('[data-tree-li-item]');

    let $parent;
    if ($liItem.length == 0)
        $parent = $treeBody;
    else {
        $parent = $liItem;
    }

    let status = $(this).is(':checked');
    let $checkboxes = $('input[type="checkbox"]', $parent).not(this);

    $checkboxes.each(function () {
        let thisStatus = $(this).is(':checked');
        if (status !== thisStatus)
            this.click();
    });

});

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


