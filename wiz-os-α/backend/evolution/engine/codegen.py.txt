import re

def generate_code(component: str, current_code: str, mutation: str):
    """
    選ばれた mutation を現在の UI コードに適用し、
    新しい UI コードを生成する。
    """

    # mutation は「変更後のコードそのもの」なので、
    # current_code を mutation で置き換えるだけで成立する。
    # ただし、必要に応じて component 名を埋め込む。

    new_code = mutation

    # コンポーネント名がズレていたら修正
    new_code = ensure_component_name(new_code, component)

    # コードの整形（余計な空行やスペースを削除）
    new_code = format_code(new_code)

    return new_code


# ---------------------------------------------------------
# Component 名の整合性を保つ
# ---------------------------------------------------------

def ensure_component_name(code: str, component: str):
    """
    コンポーネント名が正しく定義されているか確認し、
    ズレていたら修正する。
    """

    # function ComponentName() を探す
    match = re.search(r"function\s+([A-Za-z0-9_]+)\s*\(", code)
    if not match:
        return code

    current_name = match.group(1)

    if current_name != component:
        code = code.replace(f"function {current_name}", f"function {component}")

    return code


# ---------------------------------------------------------
# コード整形（静・精・ミニ）
# ---------------------------------------------------------

def format_code(code: str):
    """
    コードを静かで精密な形に整える。
    - 余計な空行を削除
    - インデントを整える
    - スペースの乱れを修正
    """

    # 連続空行を 1 行に
    while "\n\n\n" in code:
        code = code.replace("\n\n\n", "\n\n")

    # 行末スペース削除
    code = "\n".join([line.rstrip() for line in code.split("\n")])

    # 先頭・末尾の空行削除
    code = code.strip() + "\n"

    return code
