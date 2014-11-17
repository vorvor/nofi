<?php
  print $messages;
  print '<div id="preloader"><img src="/misc/throbber.gif"></div>';
  print '<div id="close-all">Close all</div>';


  $markets = node_load_multiple(array(), array('type' => 'market'));
  $mtpl = file_get_contents(drupal_get_path('theme', 'nofi') . '/templates/market-row.tpl.php');
  
  $products = node_load_multiple(array(), array('type' => 'product'));
  $ptpl = file_get_contents(drupal_get_path('theme', 'nofi') . '/templates/product-row.tpl.php');
  
  print '<div id="message" style="display:none;">törlöd? <span id="delete-yes">igen</span> | <span id="delete-no">nem</span></div>';
  print '<div id="markets">';
  $c = 0;
  foreach($markets as $market) {
    $mrow = $mtpl;
    $mrow = str_replace('{market-id}', $market->nid, $mrow);
    $mrow = str_replace('{market-name}', $market->title, $mrow);
    ($c % 2 == 0) ? $class = 'even' : $class = 'odd';
    $c++;
    $mrow = str_replace('{even-odd}', $class, $mrow);
    $pout = '';
    $testc = 0;
    foreach ($products as $product) {
      $prow = $ptpl;
      $prow = str_replace('{product-id}', $product->nid, $prow);
      $prow = str_replace('{product-name}', $product->title, $prow);
      $prow = str_replace('{product-start-amount}', get_start_amount($market->nid, $product->nid), $prow);
      $prow = str_replace('{data-row}', get_reports($market->nid, $product->nid), $prow);
      $prow = str_replace('{market-id}', $market->nid, $prow);
      

      $pout.= $prow;
      $testc++;
      if ($testc > 2) {
        break;
      }
    }
    $mrow = str_replace('{product-row}', $pout, $mrow);
    
    print $mrow;
  }
  print '</div>';
  print $messages;