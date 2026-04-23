# from agentscope.tool import Toolkit, ToolResponse
#
# def web_search(query: str) -> ToolResponse:
#     """搜索网页"""
#     # ... 实现代码 ...
#
# def web_digest(url: str) -> ToolResponse:
#     """摘要网页"""
#     # ... 实现代码 ...
#
# toolkit = Toolkit()
# toolkit.add_tool(web_search)   # 或 toolkit.register(web_search)
# toolkit.add_tool(web_digest)

from agentscope.tool import Toolkit
print([m for m in dir(Toolkit) if not m.startswith('_')])