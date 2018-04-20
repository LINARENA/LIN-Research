# -*- coding: utf-8 -*-

import json
import time, random
import aiohttp
import asyncio
import argparse

from aiohttp import web
from enum import IntEnum

from blockchain import Block, BlockChain
from util import str2bool

DEFAULT_PORT = 9000

class MessageType(IntEnum):
    REGISTER_ME = 0             # 새로운 노드 등록
    REQUEST_NODE_LIST = 1       # 노드 목록 요청
    REQUEST_MAKE_BLOCK = 2      # 블록 생성 요청(거래 발생)
    REQUEST_CONFIRM_BLOCK = 3   # 블록 생성 확인 요청(채굴 성공)


class Node(object):
    __slots__ = ["nodes", "connections", "app", "chain", "session", "addr", "port"]
    MASTER = ("localhost", DEFAULT_PORT) # FIX localhost to real ip

    def __init__(self, addr, port=DEFAULT_PORT, *, master=False):
        self.addr = addr
        self.port = port

        self.nodes = [Node.MASTER]
        self.connections = []
        self.app = web.Application()
        self.chain = BlockChain()
        self.session = None

        if master == False:
            loop = asyncio.get_event_loop()
            loop.run_until_complete(self._init())

        # just for check with web-browser
        self.app.router.add_get("/query_node_list", self.response_node_list)
        self.app.router.add_get("/query_block_chain", self.response_block_chain)
        # blockchain node do
        self.app.router.add_get("/ws", self.ws_handler)
    
    async def _init(self):
        await self.query_nodes()
        await self.connect_to_peers(self.nodes)
        await self.register_node()

    async def register_node(self):
        msg = json.dumps({'type':MessageType.REGISTER_ME, 'nodeinfo': (self.addr, self.port)})
        await self.broadcast(msg)

    async def query_nodes(self):
        if self.session == None:
            self.session = aiohttp.ClientSession()
        ws = await self.session.ws_connect("http://{}:{}/ws".format(*Node.MASTER))
        await ws.send_str(json.dumps({'type':MessageType.REQUEST_NODE_LIST}))
        msg = await ws.receive()
        self.nodes = json.loads(msg.data)
        await ws.close()

    # just for check
    async def response_block_chain(self, request):
        return web.Response(text=self.chain.json(), content_type="application/json")

    async def response_node_list(self, request):
        return web.Response(text=json.dumps(self.nodes, indent=2), content_type="application/json")

    # blockchain do
    async def connect_to_peers(self, peers):
        if self.session == None:
            self.session = aiohttp.ClientSession()
        for peer in peers:
            if peer[0]==self.addr and peer[1]==self.port:
                continue
            conn = await self.session.ws_connect("http://{}:{}/ws".format(*peer))
            self.connections.append(conn)

    async def broadcast(self, msg):
        for peer in self.connections:
            await peer.send_str(msg)
    
    async def ws_handler(self, request):
        ws = web.WebSocketResponse()
        await ws.prepare(request)

        async for msg in ws:
            if msg.type == aiohttp.WSMsgType.TEXT:
                msg = json.loads(msg.data)
                if msg["type"] == MessageType.REGISTER_ME:
                    # 새로운 노드 연결
                    node = msg["nodeinfo"]
                    await self.connect_to_peers([node])
                    self.nodes.append(node)
                elif msg["type"] == MessageType.REQUEST_NODE_LIST:
                    # 노드 목록 알려줌
                    await ws.send_json(self.nodes)
                elif msg["type"] == MessageType.REQUEST_MAKE_BLOCK:
                    # 블록 생성함
                    await asyncio.sleep(random.randint(3, 10)) # 해시 푸는 속도라고 가정하자
                    tr_info = msg["data"]
                    _lastblock = self.chain.get_latest_block()
                    
                    new_block = Block(_lastblock.index+1, tr_info["data"], 
                                      tr_info["timestamp"], _lastblock.hash, '')
                    new_block.calculate()
                    if new_block.index > self.chain.latest_block.index:
                        self.chain.add_block(new_block)
                        # 컨펌 받기
                        await self.broadcast(json.dumps({"type":MessageType.REQUEST_CONFIRM_BLOCK, "chain":self.chain.json()}))
                        await ws.send_str("[+] Well done !")

                elif msg["type"] == MessageType.REQUEST_CONFIRM_BLOCK:
                    # 블록 생성 컨펌해줌
                    blocks = [Block.from_dict(j) for j in json.loads(msg["chain"])]
                    if len(blocks) > self.chain.length:
                        if BlockChain.is_valid_chain(blocks):
                            self.chain.blocks = blocks
                    else:
                        pass

            elif msg.type == aiohttp.WSMsgType.Error:
                print('ws connection closed with exception ', ws.exception())
        return ws



if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="basic blockchain node.")
    parser.add_argument("--addr", type=str, default="localhost", help="Node IP address")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Node tcp socket port")
    parser.add_argument("--master", type=str2bool, default=True, help="If this node is master")

    args = parser.parse_args()
    print(args.addr, args.port, args.master)
    
    node = Node(args.addr, args.port, master=args.master)
    web.run_app(node.app, port=args.port)