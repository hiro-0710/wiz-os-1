import os

# VFS のルートディレクトリ
VFS_ROOT = "vfs_store"

# ディレクトリがなければ作成
os.makedirs(VFS_ROOT, exist_ok=True)


def _path(filename: str) -> str:
    """
    VFS 内の絶対パスを返す。
    """
    return os.path.join(VFS_ROOT, filename)


def read_file(filename: str) -> str:
    """
    VFS からファイルを読み込む。
    """
    path = _path(filename)

    if not os.path.exists(path):
        raise FileNotFoundError(f"{filename} not found in VFS")

    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def write_file(filename: str, content: str):
    """
    VFS にファイルを書き込む。
    """
    path = _path(filename)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
