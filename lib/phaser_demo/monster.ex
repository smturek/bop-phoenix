defmodule PhaserDemo.Monster do
    use GenServer
    alias PhaserDemo.{Endpoint, Randomise}
    require Logger

    defmodule State do
        defstruct id: nil,
            position: %{x: 0, y: 0}
    end

    ###PUBLIC API###
    def inspect(pid) do
        GenServer.call(pid, :inspect)
    end

    def set_position(process, position) do
        GenServer.call(process, {:set_position, position})
    end

    def start_link([id]) do
        Randomise.reseed_generator
        x = Randomise.random(876) + 16
        y = Randomise.random(492) + 16

        state = %State{id: id,
            position: %{x: x, y: y}}
        GenServer.start_link(__MODULE__, state, [name: {:global, id}])
    end

    ###GENSERVER CALLBACKS###
    def init(state) do
        # Endpoint.broadcast!("games:pryssac", "player:join", state)
        {:ok, state}
    end

    def handle_call(:inspect, _from, state) do
        {:reply, state, state}
    end

    def handle_call({:set_position, position}, _from, state) do
        Endpoint.broadcast!("games:pryssac", "position", position)
        {:reply, :ok, %{state | position: position}}
    end
end
