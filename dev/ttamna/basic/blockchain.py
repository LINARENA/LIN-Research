# -*- coding: utf-8 -*-
import time
import json
import hashlib


class Block(object):
    """ block basic
    """
    __slots__ = ["index", "data", "timestamp", "prev_hash", "hash"]
    def __init__(self, index:int, data:str, timestamp:int, prev_hash:str, hash:str):
        self.index = index
        self.data = data
        self.timestamp = timestamp
        self.prev_hash = prev_hash
        self.hash = hash

    def calculate(self):
        self.hash = Block.calculate_hash(self.index, self.data, self.timestamp, self.prev_hash)

    def to_dict(self):
        return {prop: self.__getattribute__(prop) for prop in self.__slots__}

    def __eq__(self, other):
        if self.to_dict() == other.to_dict():
            return True
        else:
            return False

    @staticmethod
    def from_dict(dict_block):
        return Block(dict_block["index"], dict_block["data"], dict_block["timestamp"], dict_block["prev_hash"], dict_block["hash"])

    @staticmethod
    def get_genesis_block():
        index = 0
        data = "Hello Blockchain!"
        timestamp = 1523865204    # 'Mon Apr 16 16:53:24 2018'
        prev_hash = '0'
        hash = Block.calculate_hash(index, data, timestamp, prev_hash)
        return Block(index, data, timestamp, prev_hash, hash)
        
    @staticmethod
    def calculate_hash_for_block(block):
        return Block.calculate_hash(block.index, block.data, block.timestamp, block.prev_hash)

    @staticmethod
    def calculate_hash(index, data, timestamp, prev_hash):
        return hashlib.sha256((str(index)+data+str(timestamp)+prev_hash).encode('utf-8')).hexdigest()


class BlockChain(object):
    __slots__ = ["blocks"]
    def __init__(self):
        self.blocks = [Block.get_genesis_block()]
    
    def add_block(self, new_block):
        self.blocks.append(new_block)
    
    def get_latest_block(self):
        return self.blocks[-1]

    def replace_chain(self, chain):
        pass

    def json(self):
        return json.dumps([block.to_dict() for block in self.blocks], indent=2)

    @property
    def length(self):
        return len(self.blocks)

    @property
    def latest_block(self):
        return self.blocks[-1]

    @staticmethod
    def is_valid_chain(chain):
        if Block.get_genesis_block()!= chain[0]:
            return False
        
        prev = chain[0]
        for block in chain[1:]:
            c_prev_hash = Block.calculate_hash_for_block(prev)
            if c_prev_hash != prev.hash != block.prev_hash:
                return False
            if prev.index+1 != block.index:
                return False
            prev = block

        return True

