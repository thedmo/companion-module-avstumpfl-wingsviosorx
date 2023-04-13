var udp = require('../../udp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_udp();
};

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(1,'Connecting'); // status ok!

	self.init_udp();
};

instance.prototype.init_udp = function() {
	var self = this;

	if (self.udp !== undefined) {
		self.udp.destroy();
		delete self.udp;
	}

	self.status(self.STATE_WARNING, 'Connecting');

	if (self.config.host !== undefined) {
		self.udp = new udp(self.config.host, self.config.port);

		self.udp.on('error', function (err) {
			debug("Network error", err);
			self.status(self.STATE_ERROR, err);
			self.log('error',"Network error: " + err.message);
		});

		// If we get data, thing should be good
		self.udp.on('data', function () {
			self.status(self.STATE_OK);
		});

		self.udp.on('status_change', function (status, message) {
			self.status(status, message);
		});
	}
};


// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			witdth: 6,
			regex: self.REGEX_PORT
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};


instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		
		'play':    {
			label: 'Play the show'
		},
		'pause':    {
			label: 'Pause the show'
		},
		'continue':     {
			label: 'Continue'
		},
		'esc':     {
			label: 'Escape'
		},

		'terminate': {
			label: 'Terminate Presentation Mode'
		},

		'playat':     {
			label: 'Play at specific time code',
			options: [
				{
					type: 'textinput',
					label:'Timeline number',
					id:   'tl',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label:'Position',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'stop':    {
			label: 'Stop the show [Timeline]',
			options: [
				{
					type: 'textinput',
					label:'Timeline number',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'startFull':  {
			label: 'Start presentation in Fullscreen Mode',
			options: [
				{
					type: 'textinput',
					label:'Timeline number',
					id:   'tl',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label:'Position',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'startPause':  {
			label: 'Start presentation in Pause Mode',
			options: [
				{
					type: 'textinput',
					label:'Timeline number',
					id:   'tl',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label:'Position',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'locatorPos':  {
			label: 'Locator to position marker',
			options: [
				{
					type: 'textinput',
					label:'Timeline number',
					id:   'tl',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label:'Position',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'scrubPos':  {
			label: 'Scrub to position marker',
			options: [
				{
					type: 'textinput',
					label:'Timeline number',
					id:   'tl',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label:'Position',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'mmStart':  {
			label: 'Multimode Start',
			options: [
				{
					type: 'textinput',
					label:'Timeline number',
					id:   'tl',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label:'Position',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'videoPlay':  {
			label: 'Video Play',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label:'Playlist Number',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'videoPlayNext':  {
			label: 'Video Play next',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'videoPlayPrevious':  {
			label: 'Video Play Previous',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'videoPlayPause':  {
			label: 'Video Play Pause',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'videoPlayStop':  {
			label: 'Video Play Stop',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'audioPlay':  {
			label: 'Audio Play',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label:'Playlist Number',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'audioPlayNext':  {
			label: 'Audio Play Next',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'audioPlayPrev':  {
			label: 'Audio Play Previous',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'audioPlayPause':  {
			label: 'Audio Play Pause',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'audioStop':  {
			label: 'Audio Stop',
			options: [
				{
					type: 'textinput',
					label:'Track ID',
					id:   'tl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'jumpNextMarker':  {
			label: 'Jump to the next position marker'
		},
		'jumpPrevMarker':  {
			label: 'Jump to the previous position marker'
		},
		'home':  {
			label: 'Home (Functional description)'
		},
		'end':  {
			label: 'End (Functional description)'
		},
		'showControl':  {
			label: 'Show Control Panel page',
			options: [
				{
					type: 'textinput',
					label:'Page ID',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'triggerAction':  {
			label: 'Trigger action button (control panel field)',
			options: [
				{
					type: 'textinput',
					label:'remote index of the control panel field',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'executeTrigger':  {
			label: 'Execute trigger',
			options: [
				{
					type: 'textinput',
					label:'remote index',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'enableTrigger':  {
			label: 'Enable trigger',
			options: [
				{
					type: 'textinput',
					label:'remote index; 0 = all triggers',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'disableTrigger':  {
			label: 'Disable trigger',
			options: [
				{
					type: 'textinput',
					label:'remote index; 0 = all triggers',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'enableTriggerScheduler':  {
			label: 'Enable trigger scheduler'
		},
		'disableTriggerScheduler':  {
			label: 'Disable trigger scheduler'
		},

		'runAutoMute':  {
			label: 'Run auto mute objects',
			options: [
				{
					type: 'textinput',
					label:'group; 0 = all auto mute objects',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'pauseAutoMute':  {
			label: 'pause auto mute objects',
			options: [
				{
					type: 'textinput',
					label:'group; 0 = all auto mute objects',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'resetAutoMute':  {
			label: 'reset auto mute objects',
			options: [
				{
					type: 'textinput',
					label:'group; 0 = all auto mute objects',
					id:   'pl',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'enableNetwork':  {
			label: 'Enable network'
		},
		'disableNetwork':  {
			label: 'Disable network'
		},
		
		'reenableNetwork':  {
			label: 'reEnable network'
		},
		'minimizeWindow':  {
			label: 'Minimize window'
		},

		'maximizeWindow':  {
			label: 'Maximize window'
		},
		'restoreWindow':  {
			label: 'restore Window'
		},
		'terminate':  {
			label: 'Terminate Wings Vioso RX'
		},
		'terminateREstart':  {
			label: 'Terminate and restart Wings Vioso RX'
		},
		'logOff':  {
			label: 'Log off user '
		},
		
		'shutdownRestart':  {
			label: 'Shut down and restart computer'
		},
		'shutdown':  {
			label: 'Shut down computer'
		},
		'shutdownOff':  {
			label: 'Shut down and switch off computer'
		},
	});
};

instance.prototype.action = function(action) {
	var self = this;
	var cmd
	var opt = action.options
	var buf = new Buffer(32);

	switch (action.action){

		case 'play':
		//0xFF 0x01 0x05 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x05;
			buf[3] = 0xFE;
			break;

		case 'pause':
		//0xFF 0x01 0x03 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x03;
			buf[3] = 0xFE;
			break;

		case 'continue':
		//0xFF 0x01 0x07 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x07;
			buf[3] = 0xFE;
			break;

		case 'esc':
		//0xFF 0x01 0x02 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x02;
			buf[3] = 0xFE;
			break;

		case 'terminate':
		//0xFF 0x01 0x01 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x01;
			buf[3] = 0xFE;
			break;

		case 'stop':
		//0xFF 0x01 0x02 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x02;
			buf[3] = 0xFE;
			break;

		case 'playat':
		//0xFF 0x03 0x05 0xXX 0xYY 0xFE
			if(opt.p1 != "") {
				buf = new Buffer(6);
				buf[4] = opt.pl;
				buf[5] = 0xFE;
			}
			else {
				buf = new Buffer(5);
				buf[4] = 0xFE;
			}

			
			buf[0] = 0xFF;
			buf[1] = 0x03;
			buf[2] = 0x05;
			buf[3] = opt.tl;
			break;

		case 'startFull':
		//0xFF 0x03 0x19 0xXX 0xYY 0xFE
			if(opt.p1 != "") {
				buf = new Buffer(6);
				buf[4] = opt.pl;
				buf[5] = 0xFE;
			}
			else {
				buf = new Buffer(5);
				buf[4] = 0xFE;
			}

			buf[0] = 0xFF;
			buf[1] = 0x03;
			buf[2] = 0x19;
			buf[3] = opt.tl;
			break;

		case 'startPause':
		//0xFF 0x03 0x1A 0xXX 0xYY 0xFE
			if(opt.p1 != "") {
				buf = new Buffer(6);
				buf[4] = opt.pl;
				buf[5] = 0xFE;
			}
			else {
				buf = new Buffer(5);
				buf[4] = 0xFE;
			}

			buf[0] = 0xFF;
			buf[1] = 0x03;
			buf[2] = 0x1A;
			buf[3] = opt.tl;
			break;

		case 'locatorPos':
		//0xFF 0x03 0x06 0xXX 0xYY 0xFE
			if(opt.p1 != "") {
				buf = new Buffer(6);
				buf[4] = opt.pl;
				buf[5] = 0xFE;
			}
			else {
				buf = new Buffer(5);
				buf[4] = 0xFE;
			}

			buf[0] = 0xFF;
			buf[1] = 0x03;
			buf[2] = 0x06;
			buf[3] = opt.tl;
			break;	
		
		case 'scrubPos':
		//0xFF 0x03 0x57 0xXX 0xYY 0xFE
			if(opt.p1 != "") {
				buf = new Buffer(6);
				buf[4] = opt.pl;
				buf[5] = 0xFE;
			}
			else {
				buf = new Buffer(5);
				buf[4] = 0xFE;
			}

			buf[0] = 0xFF;
			buf[1] = 0x03;
			buf[2] = 0x57;
			buf[3] = opt.tl;
			break;

		case 'mmStart':
		//0xFF 0x03 0x04 0xXX 0xYY 0xFE
			if(opt.p1 != "") {
				buf = new Buffer(6);
				buf[4] = opt.pl;
				buf[5] = 0xFE;
			}
			else {
				buf = new Buffer(5);
				buf[4] = 0xFE;
			}

			buf[0] = 0xFF;
			buf[1] = 0x03;
			buf[2] = 0x04;
			buf[3] = opt.t1;
			break;
		
		case 'videoPlay':
		// //0xFF 0x05 0x66 0xXX 0xXX 0xYY 0xYY  0xFE
		// 	if(opt.p1 != "") {
		// 		buf = new Buffer(6);
		// 		buf[4] = opt.p1;
		// 		buf[5] = 0xFE;
		// 	}
		// 	else {
		// 		buf = new Buffer(5);
		// 		buf[4] = 0xFE;
		// 	}

		// 	buf[0] = 0xFF;
		// 	buf[1] = 0x05;
		// 	buf[2] = 0x66;
		// 	buf[3] = opt.t1;
			break;

		case 'videoPlayNext':
		//0xFF 0x05 0x66 0xXX 0xXX 0x82 0x3e  0xFE
			// if(opt.p1 != "") {
			// 	buf = new Buffer(6);
			// 	buf[4] = opt.p1;
			// 	buf[5] = 0xFE;
			// }
			// else {
			// 	buf = new Buffer(5);
			// 	buf[4] = 0xFE;
			// }

			// buf[0] = 0xFF;
			// buf[1] = 0x05;
			// buf[2] = 0x66;
			// buf[3] = opt.t1;
			break;
		
		case 'videoPlayPrevious':
		//0xFF 0x05 0x66 0xXX 0xXX 0x83 0x3e  0xFE
			// buf = new Buffer(4);
			// buf[0] = 0xFF;
			// buf[1] = 0x01;
			// buf[2] = 0x02;
			// buf[3] = 0xFE;
			break;
	
		case 'videoPlayPause':
		//0xFF 0x03 0x66 0xXX 0xXX 0xFE
			// buf = new Buffer(4);
			// buf[0] = 0xFF;
			// buf[1] = 0x01;
			// buf[2] = 0x02;
			// buf[3] = 0xFE;	
			break;

		case 'videoPlayStop':
		//0xFF 0x03 0x66 0xXX 0xXX 0xFE
			// buf = new Buffer(4);
			// buf[0] = 0xFF;
			// buf[1] = 0x01;
			// buf[2] = 0x02;
			// buf[3] = 0xFE;
			break;

		case 'audioPlay':
		//0xFF 0x05 0x69 0xXX 0xXX 0xYY 0xYY  0xFE
			// buf = new Buffer(4);
			// buf[0] = 0xFF;
			// buf[1] = 0x01;
			// buf[2] = 0x02;
			// buf[3] = 0xFE;
			break;

		case 'audioPlayNext':
		//0xFF 0x05 0x69 0xXX 0xXX 0x82 0x3e  0xFE
			// buf = new Buffer(4);
			// buf[0] = 0xFF;
			// buf[1] = 0x01;
			// buf[2] = 0x02;
			// buf[3] = 0xFE;	
			break;

		case 'audioPlayPrev':
		//0xFF 0x05 0x69 0xXX 0xXX 0x83 0x3e  0xFE
			// buf = new Buffer(4);
			// buf[0] = 0xFF;
			// buf[1] = 0x01;
			// buf[2] = 0x02;
			// buf[3] = 0xFE;
			break;

		case 'audioPlayPause': 
		//0xFF 0x03 0x6A 0xXX 0xXX 0xFE
			// buf = new Buffer(4);
			// buf[0] = 0xFF;
			// buf[1] = 0x01;
			// buf[2] = 0x02;
			// buf[3] = 0xFE;
			break;

		case 'audioStop': 
		//0xFF 0x03 0x6B 0xXX 0xXX 0xFE
			// buf = new Buffer(4);
			// buf[0] = 0xFF;
			// buf[1] = 0x01;
			// buf[2] = 0x02;
			// buf[3] = 0xFE;
			break;
		
		case 'jumpNextMarker': 
		//0xFF 0x01 0x09 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x09;
			buf[3] = 0xFE;
			break;

		case 'jumpPrevMarker': 
		//0xFF 0x01 0x0A 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x0A;
			buf[3] = 0xFE;
			break;

		case 'home': 
		//0xFF 0x01 0x13 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x13;
			buf[3] = 0xFE;
			break;

		case 'end': 
		//0xFF 0x01 0x14 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x14;
			buf[3] = 0xFE;
			break;

		case 'showControl': 
		//0xFF 0x02 0x33 0xXX 0xFE
			buf = new Buffer(5);
			buf[0] = 0xFF;
			buf[1] = 0x02;
			buf[2] = 0x33;
			buf[3] = opt.pl;
			buf[4] = 0xFE;
			break;

		case 'triggerAction':
		//0xFF 0x02 0x34 0xXX 0xFE
			buf = new Buffer(5);
			buf[0] = 0xFF;
			buf[1] = 0x02;
			buf[2] = 0x34;
			buf[3] = opt.pl;
			buf[4] = 0xFE;
			break;

		case 'executeTrigger': 
		//0xFF 0x02 0x2E 0xXX 0xFE
			buf = new Buffer(5);
			buf[0] = 0xFF;
			buf[1] = 0x02;
			buf[2] = 0x2E;
			buf[3] = opt.pl;
			buf[4] = 0xFE;
			break;
		
		case 'enableTrigger': 
		//0xFF 0x02 0x52 0xXX 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x02;
			buf[2] = 0x52;
			buf[3] = opt.pl;
			buf[4] = 0xFE;
			
			break;

		case 'disableTrigger':
		//0xFF 0x02 0x53 0xXX 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x02;
			buf[2] = 0x53;
			buf[3] = opt.pl;
			buf[4] = 0xFE;
			break;
	
		case 'enableTriggerScheduler':
		//0xFF 0x01 0x22 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x22;
			buf[3] = 0xFE;
			break;

		case 'disableTriggerScheduler':
		//0xFF 0x01 0x23 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x23;
			buf[3] = 0xFE;
			break;
	
		case 'runAutoMute': 
		//0xFF 0x02 0x47 0xXX 0xFE
			buf = new Buffer(5);
			buf[0] = 0xFF;
			buf[1] = 0x02;
			buf[2] = 0x47;
			buf[3] = opt.pl;
			buf[4] = 0xFE;
			break;
			
		case 'pauseAutoMute':
		//0xFF 0x02 0x48 0xXX 0xFE
			buf = new Buffer(5);
			buf[0] = 0xFF;
			buf[1] = 0x02;
			buf[2] = 0x48;
			buf[3] = opt.pl;
			buf[4] = 0xFE;
			break;
	
		case 'resetAutoMute':
		//0xFF 0x02 0x49 0xXX 0xFE
			buf = new Buffer(5);
			buf[0] = 0xFF;
			buf[1] = 0x02;
			buf[2] = 0x49;
			buf[3] = opt.pl;
			buf[4] = 0xFE;
			break;
	
		case 'enableNetwork':
		//0xFF 0x01 0x3F 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x3F;
			buf[3] = 0xFE;
			break;

		case 'disableNetwork':
		//0xFF 0x01 0x40 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x40;
			buf[3] = 0xFE;
			break;
			
		case 'reenableNetwork':
		//0xFF 0x01 0x41 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x41;
			buf[3] = 0xFE;
			break;

		case 'minimizeWindow': 
		//0xFF 0x01 0x44 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x44;
			buf[3] = 0xFE;
			break;
	
		case 'maximizeWindow':
		//0xFF 0x01 0x45 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x45;
			buf[3] = 0xFE;
			break;

		case 'restoreWindow':
		//0xFF 0x01 0x46 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x46;
			buf[3] = 0xFE;
			break;

		case 'terminate':
		//0xFF 0x01 0x1C 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x1C;
			buf[3] = 0xFE;
			break;

		case 'terminateREstart': 
		//0xFF 0x01 0x1B 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x1B;
			buf[3] = 0xFE;
			break;
			
		case 'logOff':
		//0xFF 0x01 0x1E 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x1E;
			buf[3] = 0xFE;
			break;
			
		case 'shutdownRestart':
		//0xFF 0x01 0x1D 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x1D;
			buf[3] = 0xFE;
			break;

		case 'shutdown': 
		//0xFF 0x01 0x1F 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x1F;
			buf[3] = 0xFE;
			break;

		case 'shutdownOff': 
		//0xFF 0x01 0x20 0xFE
			buf = new Buffer(4);
			buf[0] = 0xFF;
			buf[1] = 0x01;
			buf[2] = 0x20;
			buf[3] = 0xFE;
			break;
	};


	// self.packet_counter = (self.packet_counter + 1) % 0xFFFFFFFF;

	// buf.writeUInt16BE(payload.length, 2);
	// buf.writeUInt32BE(self.packet_counter, 4);

	// if (typeof payload == 'string') {
	// 		buf.write(payload, 8, 'binary');
	// } else if (typeof payload == 'object' && payload instanceof Buffer) {
	// 		payload.copy(buf, 8);
	// }

	// var newbuf = buf.slice(0, 8 + payload.length);

	if (self.udp !== undefined ) {
		self.udp.send(buf);
	}

	// debug('action():', action);

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
