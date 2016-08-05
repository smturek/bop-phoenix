defmodule PhaserDemo.PlayerSupervisor do
    alias PhaserDemo.{Player, Randomise}
    require Logger

    def start_link do
        import Supervisor.Spec, warn: false
        children = [
            worker(Player, [], [restart: :transient])
        ]
        opts = [strategy: :simple_one_for_one, max_restart: 0, name: __MODULE__]
        Supervisor.start_link(children, opts)
    end

    def start(user_id) do
        Supervisor.start_child(__MODULE__, [[user_id]])
    end

    def stop(user_id) do
        Supervisor.terminate_child(__MODULE__, get_pid(user_id))
    end

    def get_pid(user_id) do
        :global.whereis_name(user_id)
    end

    def get_all do
        Supervisor.which_children(__MODULE__)
        |> Enum.map(&inspect_state(&1))
    end

    defp inspect_state({_, pid, _, _}), do: Player.inspect(pid)
end
