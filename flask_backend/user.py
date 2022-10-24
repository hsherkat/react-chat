from dataclasses import dataclass, asdict


@dataclass
class User:
    id: str
    username: str = ""

    def __post_init__(self):
        self.username = f"User_{self.id[:5]}"

    def json(self):
        return asdict(self)


connected_users: dict[str, User] = dict()
