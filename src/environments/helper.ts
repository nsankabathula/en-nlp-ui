import { INgRokResult, INgRokTunnel } from "src/app/models/ngrok.models";

declare var require: any;

const SERVER_CONFIGS: INgRokResult = require('./server.json');

export class Helper {
    /*
    
        public static server(port: string, protocol: string = "http"): string {
            const configs = SERVER_CONFIGS.filter((config) => {
                return config.protocol === protocol && config.port === port
            });
    
            return configs[0].public
        }
    */
    public static tunnel(name: string, protocol: string = "http"): string {
        const config = SERVER_CONFIGS.tunnels.find((tunnel: INgRokTunnel) => {
            return tunnel.name == name
        });

        return config.public_url + "/"
    }

    public static configs = SERVER_CONFIGS.tunnels;

}