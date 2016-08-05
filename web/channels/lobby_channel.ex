defmodule PhaserDemo.LobbyChannel do
  use PhaserDemo.Web, :channel
  require Logger

  def join("games:lobby", payload, socket) do
    if authorized?(payload) do
        Logger.debug "#{socket.assigns.user_id} joined the Lobby channel"
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def terminate(_reason, socket) do
      Logger.debug "#{socket.assigns.user_id} left the Lobby channel"
      socket
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (lobby:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  def handle_in("position", payload, socket) do
    broadcast_from socket, "position", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
