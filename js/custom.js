/* 
 * Theme: Codeon - one page responsive template built for humans.
 * Version: v1.1
 * Author:  Design_mylife
 * Created on : May 31, 2014, 10:42:39 AM(india)
 * file: custome js(editable)
 */

/* ==============================================
 portfolio gallery slide
 =============================================== */
/*
$(window).load(function() {
    $('.portfolio-slide').flexslider({
        slideshowSpeed: 5000,
        directionNav: false,
        animation: "fade",
        controlNav:true
    });
});
*/




/* ==============================================
 Sticky Navbar
 =============================================== */

$(document).ready(function(){
    $(".navbar").sticky({topSpacing:0});
});




/* ==============================================
 Auto Close Responsive Navbar on Click
 =============================================== */

function close_toggle() {
    if ($(window).width() <= 768) {
        $('.navbar-collapse a').on('click', function(){
            $('.navbar-collapse').collapse('hide');
        });
    }
    else {
        $('.navbar .navbar-default a').off('click');
    }
}
close_toggle();

$(window).resize(close_toggle);



/* ==============================================
 Smooth Scroll To Anchor
 =============================================== */
$(function() {
    $('.scrollto a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {

            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 50
                }, 1000);
                return false;
            }
        }
    });
});



/*=========================*/
/*========portfolio mix====*/
/*==========================*/
$('#grid').mixitup();

/*=========================*/
/*========tooltip and popovers====*/
/*==========================*/
$("[data-toggle=popover]").popover();

$("[data-toggle=tooltip]").tooltip();


/*=========================*/
/*========Animation on scroll with wow.js====*/
/*==========================*/

/*wow = new WOW(
    {
        animateClass: 'animated',
        offset:       100,
        mobile:       true
    }
);
wow.init();*/

/************parallax*********************/
/*$(function(){
    $.stellar({
        horizontalScrolling: false
    });
});*/


/****************************version v1.1*********************/
// niceScroll
/*jQuery("html").niceScroll({
    scrollspeed: 50,
    mousescrollstep: 38,
    cursorwidth: 7,
    cursorborder: 0,
    cursorcolor: '#35bdf6',
    autohidemode: false,
    zindex: 9999999,
    horizrailenabled: false,
    cursorborderradius: 0
});*/

/* ==============================================
 Counter Up
 =============================================== */
/*jQuery(document).ready(function($) {
    $('.counter').counterUp({
        delay: 100,
        time: 800
    });
});*/





