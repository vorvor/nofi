/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {


// To understand behaviors, see https://drupal.org/node/756722#behaviors
Drupal.behaviors.my_custom_behavior = {
  attach: function(context, settings) {
    
    cols = $('#markets .market-wrapper:nth-child(1) .market .product:nth-child(1) .product-data').length;
    for (c = 0; c < cols; c++) {
      if ($.cookie('col-' + c) != undefined) {
        $('.product-data-' + c + ' *').hide();
        $('.product-data-' + c + ' .colclose').show();
        $('.product-data-' + c + ' .colclose .icon-close').hide();
        $('.product-data-' + c + ' .colclose .icon-open').show();
        $('.product-data-' + c).animate({width :'30px'}, 800);
      }
    }
    
    function saveCloses() {
    mdata = '';
    $('.market-wrapper').each(function() {
      if ($('.market', this).css('display') == 'block') {
        close = $('.market', this).css('display');
      } else {
        close = $('.market', this).css('display');
      }
      mdata+= $('.market', this).attr('data-mid') + ':' + close +',';
    })
    $.cookie('closes', mdata);
    }
    if ($.cookie('closes') != undefined) {
      closes = $.cookie('closes').split(',');
      for (c = 0; c < closes.length; c++) {
        oneclose = closes[c].split(':');
        $('.market[data-mid="' + oneclose[0] + '"]').css('display', oneclose[1]);
      }
    }
    
    $('.cpanel').click(function() {
      var pid = $(this).parent().attr('data-pid');
      var mid = $(this).parent().parent().attr('data-mid');
      $.ajax({
        url: '/cpanel',
        data: {mid: mid, pid: pid},
        type: 'get',
        success: function(data) {
          $('#cpanel-wrapper-'+mid+'-'+pid).html(data);
          $('#cpanel-close').click(function() { 
            $(this).parent().hide();
            $(this).parent().html('');
          })
          $('#transport-submit').click(function() {
            from = $(this).closest('.market').attr('data-mid')
            pid = $(this).closest('.product').attr('data-pid');
            to = $(this).prev().val();
            amount = $('.transport-amount').val();
            $('#preloader').show();
            $(this).parent().parent().hide();
            $(this).parent().parent().html('');
            $('.prow-' + from + '-' + pid +' .product-data').remove();
            $('.prow-' + to + '-' + pid +' .product-data').remove();
            console.log('.prow-' + from + '-' + pid);
            $.ajax({
                url: '/transport_save',
                data: {from: from, pid: pid, to: to, amount: amount},
                type: 'get',
                success: function(data) {
                  $.ajax({
                    url: '/refresh_row',
                    data: {mid: from, pid: pid},
                    type: 'get',
                    success: function(data) {
                      $('.prow-' + from + '-' + pid).append(data);
                    }
                  })
                  
                  $.ajax({
                    url: '/refresh_row',
                    data: {mid: to, pid: pid},
                    type: 'get',
                    success: function(data) {
                      $('.prow-' + to + '-' + pid).append(data);
                      $('#preloader').hide();
                    }
                  })
                }
              })
          }).css('cursor','pointer');
          
          $('#start-amount-submit').click(function() {
            to = $(this).closest('.market').attr('data-mid')
            pid = $(this).closest('.product').attr('data-pid');
            
            amount = $('.start-amount').val();
            $(this).parent().parent().hide();
            $(this).parent().parent().html('');
            $('.prow-' + to + '-' + pid + ' .product-start-amount').html('<img src="/misc/throbber.gif">');
            
            $.ajax({
                url: '/start_amount_save',
                data: {pid: pid, to: to, amount: amount},
                type: 'get',
                success: function(data) {
                  $.ajax({
                    url: '/refresh_startamount',
                    data: {mid: to, pid: pid},
                    type: 'get',
                    success: function(data) {
                      $('.prow-' + to + '-' + pid + ' .product-start-amount').html(data);
                    }
                  })
                }
              })
          }).css('cursor','pointer');
          
          
          $('#report-submit').click(function() {
            market = $(this).closest('.market').attr('data-mid')
            pid = $(this).closest('.product').attr('data-pid');
            $('#preloader').show();
            amount = $('.report-amount').val();
            
            $(this).parent().parent().hide();
            $(this).parent().parent().html('');
            
            $('.prow-' + market + '-' + pid +' .product-data').remove();
            
            $.ajax({
                url: '/report_save',
                data: {pid: pid, market: market, amount: amount},
                type: 'get',
                success: function(data) {
                  $.ajax({
                    url: '/refresh_row',
                    data: {mid: market, pid: pid},
                    type: 'get',
                    success: function(data) {
                      $('.prow-' + market + '-' + pid).append(data);
                      $('#preloader').hide();
                    }
                  })
                }
              })
          }).css('cursor','pointer');
        }
        })
      $('.cpanel').next().hide();
      $('.cpanel').next().html('');
      $(this).next().slideToggle();
    })
    
    $('#markets').sortable({
        handle: ".drag-n-drop"
      });
    
    $('.market-name').click(function() {
      $(this).next().slideToggle(function() {
        saveCloses();
      });
      
    })
    
    $('.body').not('.cpanel').click(function() {
      $('.cpanel').next().hide();
    })
    
    $('.one-transport').click(function() {
      
      pos = $(this).offset();
      $('#message').css('left', pos.left + $(this).width() + 'px').css('top', pos.top + 'px').show().attr('data-transport', $(this).attr('data-transport'));
      
    })
    
    $('#delete-no').click(function() {
      $(this).parent().hide();
    })
    
    $('.colclose').live('click', function() {
      
      col = $(this).parent().attr('data-col');
      if ($('.icon-open', this).css('display') == 'none') {
        $('.product-data-' + col + ' *').hide();
        $('.product-data-' + col + ' .colclose').show();
        $('.product-data-' + col + ' .colclose .icon-close').hide();
        $('.product-data-' + col + ' .colclose .icon-open').show();
        $('.product-data-' + col).animate({width :'30px'}, 800);
        $.cookie('col-' + col, '1', {path: '/'});  
      } else {
        $('.product-data-' + col + ' *').show();
        
        $('.product-data-' + col + ' .colclose .icon-close').show();
        $('.product-data-' + col + ' .colclose .icon-open').hide();
        $('.product-data-' + col).animate({width :'490px'}, 800);
        $.removeCookie('col-' + col, {path: '/'});
      }
      
      
    })
    
    $('.refresh').live('click', function() {
      $(this).siblings('.product-data').remove();
      mid = $(this).closest('.market').attr('data-mid')
      pid = $(this).closest('.product').attr('data-pid');
      $.ajax({
          url: '/refresh_row',
          data: {mid: mid, pid: pid},
          type: 'get',
          success: function(data) {
            $('.prow-' + mid + '-' + pid).append(data);
          }
        }) 

      console.log('M:' + mid + 'P:' + pid);
    })
    
    $('#close-all').click(function() {
      
      if ($(this).html() == 'Close all') {
        $(this).html('Open all');
        $('.market').hide(function() {
        saveCloses();
      });
      } else {
        $(this).html('Close all');
        $('.market').show(function() {
        saveCloses();
      });
      }
    })

  }
};


})(jQuery, Drupal, this, this.document);
