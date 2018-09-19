declare var require: any;

const process = function (SERVER_CONFIG): Array<any> {

    const configs = SERVER_CONFIG.map((config) => {
        //"http://2ee160ca.ngrok.io -> localhost:9200"
        const conf = config.split("->");
        const protocols = conf[0].trim().split(":")
        const ports = conf[1].trim().split(":")
        return {
            protocol: protocols[0],
            public: conf[0].trim() + "/",
            local: conf[1].trim(),
            port: ports[1],
            config: config

        }
    });
    return configs;
}
const SERVER_CONFIGS: Array<any> = process(require('./server.json'));

export class Helper {


    public static server(port: string, protocol: string = "http"): string {
        const configs = SERVER_CONFIGS.filter((config) => {
            return config.protocol === protocol && config.port === port
        });

        return configs[0].public
    }

    public static process = process;

    public static configs = SERVER_CONFIGS;

}