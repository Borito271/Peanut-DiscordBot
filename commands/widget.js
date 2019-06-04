
exports.run = function(client, message, args){
	//Do stuff
	
	let action = args[0];
	let id = args[1];
	let type = args[2];
	let interval = parseInt(args[3]);
	
	args.splice(0, 4);
	let data = args.join(" ");
	
	data = data.trim();
	
	if(action == "add"){
		
		if (!message.channel.type == "dm") message.delete();

		let isError = true;
		if (interval && id && type) isError = false;

		if (isError){
			let settings = client.settings.get(message.guild.id);
			const commandNames = Array.from(client.widgetsType.keys());
			const longest = commandNames.reduce((long, str) => Math.max(long, str.length), 0);

			const widgets = client.widgetsType.map(c => `${c.help.name}${" ".repeat(longest - c.help.name.length)} :: ${c.help.description}\n//DATA: ${c.help.usage}`).join("\n");
			
			message.channel.send(`Error making widget: Missing parameters!\n\`\`\`asciidoc\n${settings.prefix}${this.help.usage.replace("{widgets}", widgets).replace("{widgetPrefix}", settings.prefix)}\`\`\``);
			return;
		}

		message.channel.send(`Widget placeholder. This is should be replaced soon. Identifier: \`${id}\``)
			.then( msg => {
				// Set the widget
				const widgetSettings = {
					serverID: msg.guild.id,
					channelID: msg.channel.id,
					messageID: msg.id,
					name: id,
					type: type,
					interval: interval,
					intervalCount: interval,
					data: data
				};
			
				client.logger.log(widgetSettings);
				client.widgets.set(id, widgetSettings);

				// Run the widget
				if (client.widgetsType.has(widgetSettings.type)){
					client.reloadWidget(widgetSettings.type);

					let command = widgetSettings.type;
					let cmd = client.widgetsType.get(command);

					if (cmd) {
						cmd.run(client, widgetSettings);
					}
				}

			});
		
		
		
		
	} else
	if (action == "delete" || action == "del"){
		
		if (client.widgets.has(id)) {
			//Deleted
			client.widgets.delete(id);
			message.channel.send(`\`${id}\` deleted.`);
		}
		else {
			//Failed
			message.channel.send(`Unable to delete. Make sure you typed \`${id}\` correctly.`);
		}
	} else
	if (action == "update"){
		//TODO
	} else
	{
		//console.log("Not supported!");
	}
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: ["widgets"],
	permLevel: 3
};


exports.help = {
	name: "widget",
	description: "Controls for dynamaically updated messages, called widgets.",
	usage: "widget add <unique name> <type> <interval> [data]\n{widgetPrefix}widget delete <unique name>\n\n= Avalible widget types =\n{widgets}"
};
