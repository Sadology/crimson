const { Collection } = require('discord.js')
var cache = require('global-cache');

// Manager
class CacheManager{
    /**
     * @param {Object} client Client object
    */
    constructor(client){
        this.client = client;
    }

    /**
     * @param {String} key Key value of the object
     * @param {Object} value Data in object
    */
    CreateCache(key, value){
        cache.set(key, value)
    }

    /**
     * @param {String} key Key value of the object
     * @param {Object} value Data in object
    */
    UpdateCache(key, value){

    }

    /**
     * @param {String} key Key value of the object
     * @param {Object} value Data in object
    */
    DeleteCache(key, value){

    }
}

module.exports = {CacheManager};