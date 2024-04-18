from passlib.context import CryptContext

context = CryptContext(schemes=['argon2'], deprecated='auto')


def verify_password(password: str, hashed_password: str) -> bool:
    return context.verify(password, hashed_password)


def get_password_hash(password: str) -> str:
    return context.hash(password)
