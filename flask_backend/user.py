from dataclasses import dataclass, asdict


@dataclass
class User:
    id: str
    username: str = ""
    color: str = "Black"

    def __post_init__(self):
        if not self.username:
            self.username = f"User_{self.id[:5]}"

    def json(self):
        return asdict(self)


connected_users: dict[str, User] = dict()


def create_users_payload():
    return {user.id: user.json() for user in connected_users.values()}
