from random import randint

from flask_backend import socket
from flask_backend.user import User


class CommandError(Exception):
    ...


SERVER = User(id="server", username="SERVER")


def die(sides: int, n_rolls: int = 1):
    return [str(randint(1, sides)) for _ in range(n_rolls)]


def cmd_roll(dice_string: str):
    """Rolls some dice!
    Example: "/roll 1d20 2d4"
    """
    args = dice_string.split()
    try:
        rolls = []
        for dice in args:
            n_rolls, sides = map(int, dice.split("d"))
            rolls.extend(die(sides, n_rolls))
    except Exception as e:
        raise CommandError(e)
    else:
        dice_str = " ".join(args)
        results = " ".join(rolls)
        message = (
            f"Rolled {dice_str} and got {results} for a total of {get_sum(results)}"
        )
        server_message(message)


def get_sum(results):
    return sum(map(int, results.split(" ")))


COMMANDS = {"roll": cmd_roll}


def server_message(text):
    payload = {"user": SERVER.json(), "text": text}
    socket.emit("message", payload, broadcast=True)


def handle_command(text):
    command, *arg = text.split(" ", 1)
    print(f"{command=}")
    try:
        COMMANDS[command](arg[0])
    except KeyError:
        server_message("No such command.")
    except CommandError:
        server_message("Something went wrong with the command.")
