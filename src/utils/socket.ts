import { io, Socket } from "socket.io-client";

class SocketManager {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(serverUrl: string, token?: string): Socket {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ["websocket"],
      auth: token ? { accessToken: token } : undefined,
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("Socket connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }
}

export const socketManager = new SocketManager();
export default socketManager;
