export interface INgRokResult {
    uri: string
    tunnels: Array<INgRokTunnel>
}

export interface INgRokTunnel {
    name: string
    public_url: string
    proto: "http" | "https" | "tcp"
    config: any
    metrics: any

}