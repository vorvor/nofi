<?php
  print $messages;
  print '<div id="preloader"><img src="/misc/ajax-loader.gif"></div>';
  print '<div id="close-all">Close all</div>';


  //$markets = node_load_multiple(array(), array('type' => 'market'));
  $results = db_query('SELECT * FROM node n
                      LEFT JOIN field_data_field_carrier c ON c.entity_id = n.nid
                      WHERE n.type = :type
                      ORDER BY c.field_carrier_value DESC
                      ', array(':type' => 'market'));
  $markets = array();
  foreach ($results as $row) {
    $markets[$row->nid] = node_load($row->nid);
  }
  
  
  $mtpl = file_get_contents(drupal_get_path('theme', 'nofi') . '/templates/market-row.tpl.php');
  
  $products = node_load_multiple(array(), array('type' => 'product'));
  $ptpl = file_get_contents(drupal_get_path('theme', 'nofi') . '/templates/product-row.tpl.php');
  
  print '<div id="message" style="display:none;">törlöd? <span id="delete-yes">igen</span> | <span id="delete-no">nem</span></div>';
  print '<div id="markets" class="marketlist">';
  $c = 0;
  foreach($markets as $market) {
    $mrow = $mtpl;
    $mrow = str_replace('{market-id}', $market->nid, $mrow);
    $mrow = str_replace('{market-name}', $market->title . '(' . $market->field_address['und'][0]['value'] . ')', $mrow);
    $mrow = str_replace('{weight}',$c*1, $mrow);
    
    $iscarrier = count($market->field_carrier);
    $mrow = str_replace('{carrier}', 'iscarrier-' . $iscarrier, $mrow);
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