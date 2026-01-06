import difflib

def generate_diff(old: str, new: str) -> str:
    """
    進化前(old) と進化後(new) のコード差分を生成する。
    ミニマルで読みやすい unified diff を返す。
    """

    old_lines = old.splitlines(keepends=True)
    new_lines = new.splitlines(keepends=True)

    diff = difflib.unified_diff(
        old_lines,
        new_lines,
        fromfile="before",
        tofile="after",
        lineterm=""
    )

    # diff はジェネレータなので join して文字列化
    return "".join(diff)
