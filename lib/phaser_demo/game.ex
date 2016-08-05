defmodule PhaserDemo.Game do
    use GenServer
    alias PhaserDemo.{Endpoint, Player, PlayerSupervisor, Randomise, MonsterSupervisor}
    require Logger

    def join(user_id) do
        PlayerSupervisor.start(user_id)
        {:ok, %{id: user_id, players: PlayerSupervisor.get_all, monsters: MonsterSupervisor.get_all}}
    end

    def leave(user_id) do
        Endpoint.broadcast!("games:play", "player:leave", %{id: user_id})
        PlayerSupervisor.stop(user_id)
    end

    def set_position(user_id, position) do
        pid = PlayerSupervisor.get_pid(user_id)
        if (pid) do
            Player.set_position(pid, position)
        end
    end

    def generateMonsters(level) do
        monsters = MonsterSupervisor.get_all

        if (Enum.empty?(monsters)) do
            monsters = add_multiple_monsters(level)
        end

        sendMonsters(monsters)
    end

    def add_multiple_monsters(level) do
        if (level <= 1) do
            makeMonster(level)
            MonsterSupervisor.get_all
        else
            makeMonster(level)
            add_multiple_monsters(level - 1)
        end
    end

    def makeMonster(id) do
        MonsterSupervisor.start(id)
    end

    def killMonster(id) do
        Logger.debug "You killed monster #{id}"
        MonsterSupervisor.stop(id)
    end

    def sendMonsters(monsters) do
        Endpoint.broadcast!("games:pryssac", "monsters:send", %{monsters: monsters})
    end
end
