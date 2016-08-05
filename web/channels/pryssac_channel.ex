defmodule PhaserDemo.PryssacChannel do
  use PhaserDemo.Web, :channel
  alias PhaserDemo.Game
  require Logger

  def join("games:pryssac", payload, socket) do
    if authorized?(payload) do
      Logger.debug "#{socket.assigns.user_id} joined the Play channel"
      case Game.join(socket.assigns.user_id) do
            {:ok, response} ->
                {:ok, response, socket}
            error ->
                error
      end
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def terminate(_reason, socket) do
    Logger.debug "#{socket.assigns.user_id} left the Play channel"
    Game.leave(socket.assigns.user_id)
    socket
  end

    # It is also common to receive messages from the client and
    # broadcast to everyone in the current topic (lobby).
    def handle_in("shout", payload, socket) do
        broadcast socket, "shout", payload
        {:noreply, socket}
    end

    # broadcast position data to everyone else
    def handle_in("position", payload, socket) do
    Game.set_position(socket.assigns.user_id, payload)
    {:noreply, socket}
    end

    def handle_in("collision", payload, socket) do
    Game.collision(socket.assigns.user_id, payload)
    {:noreply, socket}
    end

  def handle_in("generateMonsters", payload, socket) do
      Logger.debug "Generating monsters for level: #{payload}"
      Game.generateMonsters(payload)
      {:noreply, socket}
  end

  def handle_in("killMonster", payload, socket) do
      Game.killMonster(payload)
      {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
