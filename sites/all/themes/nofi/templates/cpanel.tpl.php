<input type="text" class="transport-amount">
<select class="destination">
<?php
  $markets = node_load_multiple(array(), array('type' => 'market'));
  foreach($markets as $market) {
  print '<option value="' . $market->nid . '">' . $market->title . '</option>';
  }
?>
</select>