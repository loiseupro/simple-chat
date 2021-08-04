<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Simple chat example</title>	
	<script src="js/jquery-3.1.0.js"></script>
	<script src="js/chat.js"></script>
	<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.css">
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<script type="text/javascript">
		var id_chat = 0;
		var active_username = '';

		<?php if(isset($_GET['chat'])){ ?> var id_chat = "<?php echo $_GET['chat']; ?>"; <?php } ?>		
		<?php if(isset($_GET['username'])){ ?> var active_username = "<?php echo $_GET['username']; ?>"; <?php } ?>
	</script>

</head>
<body>

	<div class="choose-user">
		<h3>Choose user</h3>
		<div class="users"></div>
	</div>

	<div class="ada-chat">
		<div class="header">
			<div class="avatar">
				<span class="avatar-round">A</span>				
			</div>
			<div class="participants">
			</div>
			<span class="button-close">
				<i class="fa fa-close"></i>
			</span>
		</div>
		<div class="history">
			<div class="messages"></div>
			<div class="participants-avatar"></div>
		</div>
		<div class="insert">
			<input id="entry" type="text" class="write-msg"/>
		</div>
	</div>

	<!-- Template for build chat line of message in -->
	<div id="msg-in" style="display: none;">
		<div class="msg-in" data-id-line="the_id_line">
			<div class="avatar-container">
				<span class="avatar-round">the_avatar</span>	
			</div>
			<span class="msg-content">the_msg</span>
		</div>
	</div>

	<!-- Template for build chat line of message out -->
	<div id="msg-out" style="display: none;">
		<div class="msg-out" data-id-line="the_id_line">
			<div class="avatar-container"></div>
			<span class="msg-content">the_msg</span>
		</div>
	</div>

</body>
</html>