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

    let $block = $('#' + $(this).attr('data-toggle-block-id'));

    if ($block.is(':hidden')) {
        $block.slideDown();
        $(this).addClass('active');
    }
    else {
        $block.slideUp();
        $(this).removeClass('active');
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


//function siblings(elem) {
//    return Array.from(elem.parentNode.children).filter(el => el !== elem);
//}

//var btns = document.querySelectorAll('.option-list__option');

//btns.forEach(item => {
//    item.addEventListener('click', event => {
//        document.querySelector('.option-list__option.selected')
//            .classList.remove('selected');

//        event.target.classList.add('selected');
//    });
//});

$('.option-list__option').click(function () {
    $(this).siblings().removeClass('selected');
    $(this).addClass('selected');
});