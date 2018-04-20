# -*- coding: utf-8 -*-
import asyncio
import aiohttp
import json
import time
from enum import IntEnum

class MessageType(IntEnum):
    REGISTER_ME = 0             # 새로운 노드 등록
    REQUEST_NODE_LIST = 1       # 노드 목록 요청
    REQUEST_MAKE_BLOCK = 2      # 블록 생성 요청(거래 발생)
    REQUEST_CONFIRM_BLOCK = 3   # 블록 생성 확인 요청(채굴 성공)

class Node(object):
    PORT = 9000
    MASTER = ("localhost", PORT) # FIX localhost to real ip

async def request_node_list():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect("http://{}:{}/ws".format(*Node.MASTER)) as ws:
            await ws.send_str(json.dumps({'type':MessageType.REQUEST_NODE_LIST}))
            msg = await ws.receive()
            print(msg.data)
            await session.close()

async def register_node():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect("http://{}:{}/ws".format(*Node.MASTER)) as ws:
            await ws.send_str(json.dumps({'type':MessageType.REGISTER_ME,
                                          'nodeinfo': ('192.168.0.1', 9001)}))

async def make_block():
    async with aiohttp.ClientSession() as session:
        async with session.ws_connect("http://{}:{}/ws".format(*Node.MASTER)) as ws:
            await ws.send_str(json.dumps({"type": MessageType.REQUEST_MAKE_BLOCK,
                                        "data":{"data": "good kk", "timestamp": int(time.time())}}))
            msg = await ws.receive()
            print(msg.data)
            await ws.close()


if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(make_block())