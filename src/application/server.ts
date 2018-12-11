export interface Server {

    listen(port?: number, hostname?: string, callback?: () => void): void;

}