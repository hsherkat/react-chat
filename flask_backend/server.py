from random import randint
from typing import Optional, Callable

from flask_socketio import emit

from flask_backend import socket
from flask_backend.user import User, is_moderator, get_user_by_name


class CommandError(Exception):
    ...


SERVER = User(id="server", username="SERVER")


def die(sides: int, n_rolls: int = 1):
    return [str(randint(1, sides)) for _ in range(n_rolls)]


def cmd_roll(calling_user: User, dice_string: str):
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
            f"{calling_user.username} rolled {dice_str} and got {results} for a total of {get_sum(results)}."
        )
        server_message(message)


def get_sum(results):
    return sum(map(int, results.split(" ")))


def cmd_moderator(calling_user: User, _):
    if is_moderator(calling_user):
        server_message(f"{calling_user.username} is a moderator.")
    else:
        server_message(f"{calling_user.username} is not a moderator.")


def cmd_kick(calling_user: User, target: str):
    if not is_moderator(calling_user):
        return
    target_user = get_user_by_name(target)
    if target_user is None:
        raise CommandError
    socket.emit('kick', to=target_user.id)
    server_message(f"Moderator {calling_user.username} has kicked {target_user.username}.")


def cmd_whisper(calling_user: User, args_str: str):
    target, message = args_str.split(" || ", 1)
    target_user = get_user_by_name(target)
    if target_user is None:
        raise CommandError
    server_message(f"{calling_user.username} whispers to you, '{message}'", to=target_user)
    server_message(f"You whisper to {target_user.username}, '{message}'", to=calling_user)


COMMANDS: dict[str, Callable] = {"roll": cmd_roll, "moderator": cmd_moderator, 'kick': cmd_kick, 'whisper': cmd_whisper}


def server_message(text: str, to: Optional[User] = None):
    payload = {"user": SERVER.json(), "text": text}
    if to is None:
        socket.emit("message", payload, broadcast=True)
    else:
        socket.emit("message", payload, to=to.id)


def handle_command(calling_user: User, text: str):
    command, *arg = text.split(" ", 1)
    args_str = '' if arg == [] else arg[0]
    print(f"{command=}")
    try:
        COMMANDS[command](calling_user, args_str)
    except KeyError:
        server_message("No such command.")
    except CommandError:
        server_message("Something went wrong with the command.")
