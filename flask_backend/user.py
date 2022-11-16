from dataclasses import dataclass, asdict

from flask import request


@dataclass
class User:
    id: str
    username: str = ""
    color: str = "Black"

    def __post_init__(self):
        if not self.username:
            self.username = f"User_{self.id[:5]}"

    def json(self) -> dict:
        return asdict(self)


connected_users: dict[str, User] = dict()
disconnected_users: dict[str, User] = dict()


def create_users_payload() -> dict[str, str]:
    return {user.id: user.json() for user in connected_users.values()}


def get_user() -> User:
    return connected_users[request.sid]


def get_user_by_name(name: str) -> User:
    user_matches = (user for user in connected_users.values() if user.username == name)
    return next(user_matches, None)
