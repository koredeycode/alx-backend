#!/usr/bin/env python3
"""
Module documentation
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    inherits from BaseCaching. A caching system
    """
    def put(self, key, item):
        """
        assign to the dictionary
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """
        return the value in the cache data linked to key
        """
        return self.cache_data.get(key, None)
