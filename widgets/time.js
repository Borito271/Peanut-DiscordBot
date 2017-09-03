const moment = require('moment');
const log = message => {
	console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

exports.run = function(client, widget, data){
	log(`WIDGET PROCESSED: ${widget.name}`);
	//message.channel.send("Current time: '" + Date.now() + "'");
	
	/*
	const widgetSettings = {
		serverID: widget.serverID,
		channelID: widget.channelID,
		messageID: widget.messageID,
		name: widget.name,
		type: widget.type,
		interval: widget.interval,
		intervalCount: 0,
		data: widget.data
	}
	
	//console.log(widgetSettings)
	client.widgets.set(widget.name, widgetSettings);
	*/
	
	client.guilds.get(widget.serverID).channels.get(widget.channelID).fetchMessage(widget.messageID).then(m => {
		m.edit(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${widget.data}`)
	});
	
};

exports.help = {
  name: 'time',
  description: 'Used to display the time.',
  usage: 'NA'
};