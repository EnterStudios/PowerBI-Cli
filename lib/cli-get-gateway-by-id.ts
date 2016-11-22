import * as powerbi from 'powerbi-api';
import * as msrest from 'ms-rest';
import {Cli as cli} from './cli';
import {Config as config} from './config';
import * as program from 'commander';

export default function CliGetgatewayById() {
    let pkg = require('../package.json');

    program.version(pkg.version)
        .option('-c, --collection <collection>', 'The Power BI workspace collection')
        .option('-k, --accessKey <accessKey>', 'The Power BI workspace collection access key')
        .option('-g --gatewayId <gatewayId>', 'The Power BI gateway id')
		.option('-b --baseUri [baseUri]', 'The base uri to connect to');

    program.on('--help', function () {
        console.log('  Examples:');
        console.log('');
		console.log('    $ powerbi get-gateway-by-id -c <collection> -k <accessKey> -g <gatewayId>');
    });

    program.parse(process.argv);
    let settings = config.merge(program);

    if (!(settings.collection && settings.accessKey && settings.gatewayId)) {
        program.help();
    } else {
        try {
            let credentials = new msrest.TokenCredentials(settings.accessKey, 'AppKey');
            let client = new powerbi.PowerBIClient(credentials, settings.baseUri, null);

			client.gateways.getGatewayById(settings.collection, settings.gatewayId, (err, result) => {
				if (err) {
					return cli.error(err);
				}

				cli.print("================================================");
				cli.print('Getting gateway: %s', settings.gatewayId);
				cli.print("================================================");
				cli.print(result.name, result.id);
			});
        } catch (err) {
            cli.error(err);
        }
    }
}