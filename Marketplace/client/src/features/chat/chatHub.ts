import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export function createChatConnection() {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/chat", {
      accessTokenFactory: () => localStorage.getItem("mp_access_token") ?? ""

    })
    .withAutomaticReconnect()
    .build();

  return connection;
}