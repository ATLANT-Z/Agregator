function stopClick(e) {
    e.stopPropagation();
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

$(document).click(function (e) {
    let isInParentClick = $(e.target).closest('[data-dropdown-pop-btn]').length != 0;
    let isParent = $(e.target).is('[data-dropdown-pop-btn]');

    if (isInParentClick || isParent)
        return;

    $('[data-dropdown-pop-block]').fadeOut();
    unActiveDropdownBtn();

});

$('[data-dropdown-pop-btn]').click(function (e) {
    let isInPopClick = $(e.target).closest('[data-dropdown-pop-block]').length != 0;
    let isPop = $(e.target).is('[data-dropdown-pop-block]');

    if (isInPopClick || isPop)
        return;

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

$('[data-toggle-block-id]').click(function (e) {
    stopClick(e);

    let id = $(this).attr('data-toggle-block-id')
    let $block = $('#' + id);

    if ($block.is(':hidden')) {
        $block.slideDown();
        $(`[data-toggle-block-id='${id}']`).addClass('active');
    }
    else {
        $block.slideUp();
        $(`[data-toggle-block-id='${id}']`).removeClass('active');
    }
});

/* POPUP */
/* POPUP */
/* POPUP */
$(document).click(function () {
    $('.popup-block').fadeOut();
});

$('.popup').click(function (e) {
    stopClick(e);
});

$('.popup__btn').click(function () {
    $(this).parents('.popup-block').fadeOut();
});

$('[data-target-pop-id]').click(function (e) {
    stopClick(e);

    let $block = $('#' + $(this).attr('data-target-pop-id'));

    if ($block.is(':hidden'))
        $block.fadeIn();
    else
        $block.fadeOut();
});


$('.option-list__option').click(function () {
    let $parent = $(this).closest('[data-dropdown-pop-btn]');
    let $title = $('[data-dropdown-pop-btn-title]', $parent);

    $title.text($('[data-option-title]', this).text());

    $(this).siblings().removeClass('selected');
    $(this).addClass('selected');
});

$('.tree-toggle-btn').click(function () {
    $(this).parents('.catalog-body__tree').toggleClass('toggled');
});

$('.title__btn').click(function () {
    let $parent = $(this).closest('.c-list__item');
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

$('.c-list__item .title__text').click(function () {
    $('.c-list__item').removeClass('selected');
    $(this).closest('.c-list__item').toggleClass('selected');
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

$('[data-clear-tag-list-btn]').click(function () {
    let $filters = $(this).closest('[data-filter-block]');

    let $tags = $('[data-tag-list] [data-tag]', $filters);
    $tags.each(function () {
        deleteTag.call(this);
    });
});


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

$('[data-submit-child-click]').click(function () {
    $('input[type="submit"]')[0].click();
});