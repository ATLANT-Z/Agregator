function stopClick(e, isPrevent = false) {
    e.stopPropagation();

    if (isPrevent)
        e.preventDefault();
}

function setRadio(_this) {
    $(_this).prop("checked", true);
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

// сортировать По? Остановка клика в выпадающем вниз попапе
$('[data-dropdown-pop-block]').click(function (e) {
    if (!$(this).is('[data-close-by-click]'))
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
        $block.css('display', 'flex');
        $block.hide();
        $block.slideDown();
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
//$(document).click(function () {
//    $('[data-popup-block]').fadeOut();
//});

$('.popup').click(function (e) {
    stopClick(e);
});


function defaultAjaxCallback() {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve(true);
        }, 10);
    });
}
function isCloseHandler(callback) {
    let functionName = $(this).attr('data-is-close');

    window[functionName]().then((message) => {
        callback.call(this, message);
    }).catch((message) => {
        callback.call(this, message);
    });
}

$('[data-pop-btn-close-parents]').click(function () {
    isCloseHandler.call(this, function (isClose) {
        if (isClose)
            $(this).parents('[data-popup-block]').fadeOut();
    });
});

$('[data-pop-btn-close-parent]').click(function () {
    isCloseHandler.call(this, function (isClose) {
        if (isClose)
            $(this).closest('[data-popup-block]').fadeOut();
    });
});

$('[data-dropdown-pop-btn-close-parents]').click(function () {
    isCloseHandler.call(this, function (isClose) {
        if (isClose)
            $(this).parents('[data-dropdown-pop-block]').fadeOut();
    });
});

$('[data-dropdown-pop-btn-close-parent]').click(function () {
    isCloseHandler.call(this, function (isClose) {
        if (isClose)
            $(this).parents('[data-dropdown-pop-block]').fadeOut();
    });
});

//Установить заголовок для тайтла, если есть [data-pop-title-text]
function setTitleForPop($block) {
    if ($(this).is('[data-pop-title-text]')) {
        let popTitleText = $(this).attr('data-pop-title-text');
        $('[data-pop-title]', $block).text(popTitleText);
    }
}
// Открыть попап по нажатию кнопки
$('[data-show-pop-with-id]').click(function (e) {
    stopClick(e);

    let $block = $('#' + $(this).attr('data-show-pop-with-id'));
    setTitleForPop.call(this, $block);

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

$('.sub-pages__page').click(function () {
    $(this).siblings('.sub-pages__page').removeClass('selected');
    $(this).addClass('selected');
});

//!События дерева
//!События дерева
//!События дерева
//Подвязка событий к дереву каталога у определённого родителя. 
// Например только в попапе "edit catalog"
//ПЕТЯ это инициализация кнопок удалить и редактировать. Думаю, тебе оно понадобится))
function initEditorsBtns(parent) {
    //редактируем категорию (каталог) (кнопка с карандашиком)
    function editCatalogBtnClick(e) {
        stopClick(e);

        let $parent = $(this).closest('[data-tree-title]');
        let $titleText = $('[data-tree-title-text]', $parent);
        let $parentCategory = $(this).closest('[data-tree-li-item]');

        //Убираем пробелы в названии, если вдруг есть
        let titleText = $titleText.text().trim().replace(/\s+/g, ' ');
        let catalogId = $parentCategory.attr('data-catalog-id');

        if (catalogId === undefined) {
            //При генерации ты, видимо, забыл задать data-catalog-id всем li (категориям)
            console.error('Нет айди у категории!');
            console.trace('Смотри сюда');
        }

        let $pop = $('#edit-category-pop');
        $('[data-category-name-input]', $pop).val(titleText);
        $('#ask-sure-delete-c-pop [data-pop-header] [data-category-name]').text(titleText);

        let $popCategory = $(`[data-catalog-id='${catalogId}']`, $pop);
        let $popCatalogTitle = $('>[data-tree-title]', $popCategory);

        setRadio($('input[type="radio"]', $popCatalogTitle).get(0));

        showCategoryByIdIn(catalogId, $pop);

        $pop.fadeIn();
    }
    $('[data-edit-catalog-btn]', parent).click(function (e) {
        editCatalogBtnClick.call(this, e);
    });
    //удаляем категорию (каталог) (кнопка с баком)
    $('[data-delete-catalog-btn]', parent).click(function (e) {
        editCatalogBtnClick.call(this, e);

        let $pop = $('#edit-category-pop');
        $('[data-show-pop-with-id="ask-sure-delete-c-pop"]', $pop)[0].click();
    });
}
function showCategoryByIdIn(id, parent) {
    let $popCategory = $(`[data-catalog-id='${id}']`, parent);

    if ($popCategory.length == 0) {
        console.warn('Такой категории нет');
        return;
    }

    $popCategory.parents('[data-tree-li-item]').each(function () {
        if (!$(this).hasClass('opened'))
            $('[data-tree-title-btn]', this)[0].click();
    });

    let delayTime = parseFloat($popCategory.css('transitionDuration')) * 1000 + 300;
    setTimeout(function () {
        $popCategory[0].scrollIntoView();
    }, delayTime);

    $popCategory.removeClass('category-blow');
    void $popCategory[0].offsetWidth;
    $popCategory.addClass('category-blow');
}
function initTreeEventsIn(parent) {
    //раскрытие дерева в каталоге по ширине
    $('[data-tree-toggle-btn]', parent).click(function () {
        $(this).parents('[data-tree-body]').toggleClass('toggled');
    });

    //клик по плюсику в дереве
    function expandBranch() {
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

        //делаем "селект" раскрывшейся категории (первый элемент - первый в нашем тайтле)
        $('[data-tree-title-text]', $parent)[0].click();
    }
    //разворачиваем ветку
    $('[data-tree-title-btn]', parent).click(function () {
        expandBranch.call(this);
    });


    //Реализация переноса экспорта
    {
        function expandTitleBtnBuilder() {
            let $btn = $('<div class="title__btn btn" data-tree-title-btn></div>');
            $btn.click(expandBranch);
            return $btn;
        }
        function getTreesStruct($parent) {
            if ($(this).closest('[data-exp-orig-tree]').length)
                return {
                    thisTree: $(this).closest('[data-exp-orig-tree]'),
                    anotherTree: $('[data-exp-new-tree]', $parent),
                }
            else if ($(this).closest('[data-exp-new-tree]').length)
                return {
                    thisTree: $(this).closest('[data-exp-new-tree]'),
                    anotherTree: $('[data-exp-orig-tree]', $parent),
                }
            else
                return undefined;
        }
        function finBuildBranch($selectedBranch) {
            let $list;

            if ($selectedBranch.is('.c-list')) {
                $list = $selectedBranch;
            }
            else if (!$selectedBranch.has('.c-list').length) {
                $selectedBranch.append('<ul class="c-list"></ul>');

                let $selectedTitle = $('[data-tree-title]', $selectedBranch).first();
                $selectedTitle.prepend(expandTitleBtnBuilder());

                $list = $('.c-list', $selectedBranch);
            }
            else if ($selectedBranch.has('.c-list').length) {
                $list = $('.c-list', $selectedBranch).first();
            }

            return $list;
        }
        function unBuildBranch($selectedBranch) {
            if ($selectedBranch.has('.c-list').length)
                if (!$('.c-list', $selectedBranch).children().length) {
                    $('.c-list', $selectedBranch).remove();

                    let $selectedTitle = $('[data-tree-title]', $selectedBranch).first();
                    $('[data-tree-title-btn]', $selectedTitle).remove();
                }
        }
        //Перенос из оригинала в профиль
        $('[data-exp-trees-parent] [data-tree-title]', parent).dblclick(function (e) {
            let $parent = $(this).closest('[data-exp-trees-parent]');
            let trees = getTreesStruct.call(this, $parent);

            let $parentTree = trees.thisTree;
            let $anotherTree = trees.anotherTree;

            let $parentBranch = $(this).closest('[data-tree-li-item]');

            let $selectedBranch = $('[data-tree-li-item].selected', $anotherTree);
            if (!$selectedBranch.length)
                $selectedBranch = $('[data-root-list]', $anotherTree);

            let $branchId = $parentBranch.attr('data-catalog-id');
            let $branchWithIdInAnotherTree = $(`[data-catalog-id="${$branchId}"]`, $anotherTree);


            function deleteBranch($removeBranch, $clearBranch) {
                let $thisParentBranch = $removeBranch.parents('[data-tree-li-item]').first();

                $removeBranch.remove();
                unBuildBranch($thisParentBranch);

                $clearBranch.removeClass('exported');
                $('[data-tree-li-item]', $clearBranch).removeClass('exported');
            }
            if ($parentTree.is('[data-exp-orig-tree]')) {
                if ($branchWithIdInAnotherTree.length) {
                    //Удаление из экспорта, клик в оригинале
                    deleteBranch($branchWithIdInAnotherTree, $parentBranch);
                }
                else {
                    //Добавление из оригинала в экспорт
                    let $list = finBuildBranch($selectedBranch);

                    $parentBranch.addClass('exported');
                    let $copyBranch = $parentBranch.clone(true).removeClass('selected');

                    $list.append($copyBranch);

                    $('[data-tree-li-item]', $parentBranch).addClass('exported');
                    $('[data-tree-li-item]', $copyBranch).addClass('exported');
                }
            }
            else if ($parentTree.is('[data-exp-new-tree]')) {
                if ($branchWithIdInAnotherTree.length) {
                    //Удаление из экспорта, клик в экспорте
                    deleteBranch($parentBranch, $branchWithIdInAnotherTree);
                }
            }
        });
    }

    //Убрать выделение по клику на тайтл дерева
    $('[data-exp-trees-parent] .tree-title').click(function () {
        let $tree = $(this).closest('[data-tree-body]');
        $('[data-tree-li-item]', $tree).removeClass('selected');
    });
    //клик по тайтлу в дереве. По ТЕКСТУ
    $('[data-tree-li-item] [data-tree-title-text]', parent).click(function () {
        $('[data-tree-li-item]', $(this).closest('[data-tree-body]')).removeClass('selected');
        $(this).closest('[data-tree-li-item]').toggleClass('selected');
    });

    initEditorsBtns(parent);

    /* Клики в попапе по чекбоксам  */
    $('[data-tree-body][data-tree-body-check-behav] input[type="checkbox"]').click(function () {
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
                $(this).prop("checked", !thisStatus);
        });
    });

    //поиск категории для экспорта из нового в оригинале
    $('[data-exp-new-tree] [data-search-catalog-btn]').click(function () {
        let $parent = $(this).closest('[data-tree-li-item]');
        let id = $parent.attr('data-catalog-id');
        showCategoryByIdIn(id, $('[data-exp-orig-tree]'));
    });

    //поиск категории для экспорта из попапа создания в новом
    $('#create-category-pop [data-search-catalog-btn]').click(function () {
        let $parent = $(this).closest('[data-tree-li-item]');
        let id = $parent.attr('data-catalog-id');
        showCategoryByIdIn(id, $('[data-exp-new-tree]'));
    });
}
initTreeEventsIn(document);



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
                <img src="public/static/assets/icons/crossGreen.svg" alt="">
            </span>
        </li>`
}

//шо делать, если поле в фильтрах каталога изменилось
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

//Упрощённая работа с чекбоксами
$('[data-child-input-click]').click(function () {
    $('input')[0].click();
});

//переключение страниц
$('[data-show-page-with-id]').click(function () {
    let $this = $(this);

    let targetId = $this.attr('data-show-page-with-id');

    let $targetPage = $(`#${targetId}`);
    let $currentPage = $('[data-page]').filter(':visible');

    $currentPage.hide();
    $targetPage.fadeIn();

    if ($(this).is('[data-second-text]')) {
        let currText = $this.text().trim();
        $this.text($this.attr('data-second-text'));
        $this.attr('data-second-text', currText);
        $this.attr('data-show-page-with-id', $currentPage.attr('id'));
    }
});

$('[data-change-vision]').click(function () {
    let isChanged = $(this).attr('data-change-vision') == 'true';
    $(this).attr('data-change-vision', !isChanged);

    if (!isChanged) {
        $('[data-sub-pages-first]').hide();
        $('[data-sub-pages-second]').show();
    }
    else {
        $('[data-sub-pages-first]').show();
        $('[data-sub-pages-second]').hide();
    }
});


//обработчик нажатия клавиши, чтоб расширять, для обычной передачи объекта
function uiGrowableInputKeyDownHandler(_this) {
    //задержка, чтобы буква отпечаталась
    setTimeout(function () {
        setTrueWidthForInput(_this);
    }, 5);
}
//обработчик нажатия клавиши, чтоб расширять
function uiGrowableInputKeyDownHandlerJQuery() {
    let _this = this;
    //задержка, чтобы буква отпечаталась
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

    $input.css('width', parseFloat($buffer.css('width')) + 5 + 'px');

    $buffer.remove();
}
//изменять ширину инпут при вводе
$('[data-ui-growable-input]').on('keydown', uiGrowableInputKeyDownHandlerJQuery);



//очистить форму поиска
$('[data-clear-search-input-btn]').click(function () {
    let $parent = $(this).closest('[data-search-form]');
    $('[data-search-input]', $parent).val('');
    $('[data-search-input]', $parent).trigger("change");
});


function popCaptionBuilder() {
    this.class = `ui-pop-caption`;
    return {
        class: `${this.class}`,
        code: `<div class="${this.class}" data-caption-text></div>`,
        time: 300,
    };
}
let POP_CAPTION = popCaptionBuilder();

$('[data-caption-on-focus]').on('mouseenter', function () {
    $(this).append(POP_CAPTION.code);
    let $cap = $(`.${POP_CAPTION.class}`, this);

    $cap.animate({
        opacity: 1,
    }, {
        duration: POP_CAPTION.time,
    });

    $('[data-caption-text]', this).text(
        $(this).attr('data-caption-on-focus')
    );
});

$('[data-caption-on-focus]').on('mouseleave', function () {
    let $cap = $(`.${POP_CAPTION.class}`, this);

    $cap.animate({
        opacity: 0,
    }, {
        duration: POP_CAPTION.time,
        complete: function () {
            $(this).remove();
        }
    });
});


$('[data-copy-btn]').click(function () {
    let $parent = $(this).closest('[data-copy-parent]');
    let $target = $('[data-copy-target]', $parent);

    var $temp = $("<input>");
    $("body").append($temp);
    let textToCopy = ($target.val() || $target.text()).trim();
    $temp.val(textToCopy).select();
    document.execCommand("copy");
    $temp.remove();


    let time = 2400;
    if ($target.is('input') || $target.is('textarea')) {
        $target.val('Тест скопирован!');
        setTimeout(() => {
            $target.val(textToCopy);
        }, time);
    }
    else {
        $target.text('Тест скопирован!');
        setTimeout(() => {
            $target.text(textToCopy);
        }, time);
    }

});

$('[data-all-checked]').click(function () {
    let $parent = $(this).closest('[data-checklist-parent]');

    let status = $(this).is(':checked');
    let $checkboxes = $('input[type="checkbox"]', $parent).not(this);

    $checkboxes.each(function () {
        let thisStatus = $(this).is(':checked');
        if (status !== thisStatus)
            $(this).prop("checked", !thisStatus);
    });
});
