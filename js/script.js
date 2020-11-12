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

$(document).click(function () {
    $('[data-dropdown-pop-block]').fadeOut();
    unActiveDropdownBtn();
});

$('[data-dropdown-pop-block]').click(function (e) {
    stopClick(e);
});

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

$('.search-drop-down-list').focusin(function () {
    $('.options', this).slideDown();
});

//$('.search-drop-down-list').parent().click(function (e) {
//    stopClick(e);
//});

$(document).click(function (e) {
    if ($(e.target).closest('.filter-body').length == 0)
        $('.search-drop-down-list .options', this).slideUp();
});