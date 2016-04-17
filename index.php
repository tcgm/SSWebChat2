<head>
	<link rel="stylesheet" type="text/css" href="style.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>
	<script type="text/javascript" src="code.js"></script>
</head>
<html>
	<body>
		<div id="output"></div>
		<div id="wrapper">
			<div id="content">
				<div id="errorMessagePanel" class="box trans3 pagecenter hidden">
					<div id="errorMessageHeaderWrapper" class="center">
						<h3 id="errorMessageHeader" class="center noselect">Error</h3>
					</div>
					<div id="errorMessageBodyWrapper" class="center">
						<p id="errorMessageBody"></p>
					</div>
					<div id="errorMessageOKButtonWrapper">
						<div id="errorMessageOKButton" class="button right">Acknowledged</div>
					</div>
				</div>
				<div id="screenShadow" class="noselect trans3 hidden"></div>
				<div id="connectingGifWrapper" class="noselect trans3 hidden">
					<div id="connectingGifImage" class="right"></div>
					<div id="connectingGifText" class="left"><p>Connecting</p></div>
				</div>
				<div id="authorizingGifWrapper" class="connectionStatusWrapper noselect trans3 hidden">
					<div id="authorizingGifImage" class="connectionStatusImage right"></div>
					<div id="authorizingGifText" class="connectionStatusText left"><p>Authorizing</p></div>
				</div>
				<div id="navWrapper">
					<div id="topBarBackground"></div>
				</div>
				<div id="loginPanel" class="box trans3 pagecenter">
					<div id="usernameWrapper" class="center">
						<h3 class="center noselect">Username</h3>
						<input type="text" id="usernameField" name="user"></input>
					</div>
					<div id="passwordWrapper" class="center">
						<h3 class="center noselect">Password</h3>
						<input type="password" id="passwordField" name="password"></input>
					</div>
					<div id="loginPanelControlWrapper">
						<div id="passwordRememberTickboxWrapper" class="left">
							<input type="checkbox" id="passwordRememberTickbox"></input>
							<label for="passwordRememberTickbox" class="noselect-link">Remember Password</label>
						</div>
						<div id="connectButtonWrapper">
							<div id="connectButton" class="button right"><p>Connect</p></div>
						</div>
					</div>
				</div>
				<div id="chatWrapper">
					<div id="chatWindowWrapper">
						<div id="chatWindow">
							
						</div>
					</div>
					<div id="chatTabsWrapper">
						<nav id="chatTabs">
							<ul>Event</ul>
							<ul>All</ul>
							<ul>Trade</ul>
							<ul>Team</ul>
							<ul>Help</ul>
							<ul>Chat</ul>
						</nav>
					</div>
				</div>
				<div id="footerWrapper">
					<div id="bottomBarBackground"></div>
				</div>
			</div>
		</div>
	</body>
</html>