import { io, Socket } from "socket.io-client";

type SocketEventCallback = () => void;

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private listeners: Set<SocketEventCallback> = new Set();

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  initialize(serverUrl: string, accessToken?: string): Socket {
    if (this.socket) {
      // 이미 소켓이 존재하면 토큰만 업데이트
      if (accessToken) {
        this.socket.auth = { accessToken };
      }
      return this.socket;
    }

    this.socket = io(serverUrl, {
      transports: ["websocket"],
      auth: accessToken ? { accessToken } : undefined,
      autoConnect: false,
    });

    this.socket.on("connect", () => {
      console.log("Socket.IO connected:", this.socket?.id);
      this.isConnected = true;
      this.notifyListeners();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket.IO disconnected:", reason);
      this.isConnected = false;
      this.notifyListeners();
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    return this.socket;
  }

  connect(accessToken?: string): void {
    if (!this.socket) {
      throw new Error("Socket not initialized. Call initialize() first.");
    }

    if (accessToken) {
      this.socket.auth = { accessToken };
    }

    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  disconnect(): void {
    if (this.socket?.connected) {
      this.socket.disconnect();
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  subscribe(callback: SocketEventCallback): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((callback) => callback());
  }
}

export const socketManager = SocketManager.getInstance();
