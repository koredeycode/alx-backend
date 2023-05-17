#!/usr/bin/env python3
"""
Module documentation
"""
from base_caching import BaseCaching
from collections import OrderedDict


class FIFOCache(BaseCaching):
    """
    inherits from BaseCaching. A caching system
    """
    def __init__(self):
        """
        initialization
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """
        assign to the dictionary
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            k, v = self.cache_data.popitem(False)
            print("DISCARD: {}".format(k))

    def get(self, key):
        """
        return the value in the cache data linked to key
        """
        return self.cache_data.get(key, None)
