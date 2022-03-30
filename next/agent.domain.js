const
    EventEmitter  = require('events'),
    {Space, Node} = require('@nrd/fua.module.space'),
    util          = require('./agent.domain.util.js');

class DomainAgent {

    /**
     * @param options
     * @returns {Promise<DomainAgent>}
     */
    static async create(options) {
        if (options instanceof this) return options;
        const agent = new this(options);
        return await agent.initialize(options);
    } // DomainAgent.create

    #uri = '';

    #emitter    = new EventEmitter();
    /** @type {fua.module.space.Space} */
    #space      = null;
    /** @type {fua.module.space.Node} */
    #domainNode = null;
    /** @type {fua.module.space.Node} */
    #usersNode  = null;
    /** @type {fua.module.space.Node} */
    #groupsNode = null;

    constructor(options = {}) {
        util.assert(util.isNonEmptyString(options.uri), 'expected uri to be a non empty string');
        this.#uri = options.uri;
    } // DomainAgent#constructor

    async initialize(options = {}) {
        this.emit('initialize', options);

        util.assert(options.space instanceof Space, 'expected uri to be a non empty string');
        this.#space = options.space;

        this.#domainNode = this.#space.getNode(this.#uri);
        await this.#domainNode.load();
        util.assert(this.#domainNode.type, `node for "${this.#uri}" not found in the space`);

        this.#usersNode = this.#domainNode.getNode('dom:users');
        util.assert(this.#usersNode, `reference "dom:users" not found for "${this.#uri}"`);
        await this.#usersNode.load('@type');
        util.assert(this.#usersNode.type, `node for "${this.#usersNode.id}" not found in the space`);

        this.#groupsNode = this.#domainNode.getNode('dom:groups');
        util.assert(this.#groupsNode, `reference "dom:groups" not found for "${this.#uri}"`);
        await this.#groupsNode.load('@type');
        util.assert(this.#groupsNode.type, `node for "${this.#groupsNode.id}" not found in the space`);

        return this;
    } // DomainAgent#initialize

    get uri() {
        return this.#uri;
    } // DomainAgent#uri

    get node() {
        return this.#domainNode;
    } // DomainAgent#node

    get space() {
        return this.#space;
    } // DomainAgent#space

    async getAllUsers() {
        // REM this is the position to implement caching of users and scheduled refreshes
        // 1. load members of the user container
        await this.#usersNode.load('ldp:member');
        // 2. return all users in the container as array
        const usersArr = this.#usersNode.getNodes('ldp:member');
        this.emit('users-refreshed', usersArr);
        return usersArr;
    } // DomainAgent#getAllUsers

    async hasUserId(userId) {
        // 1. get all users as array
        const usersArr = await this.getAllUsers();
        // 2. get the user node to the id from the space
        const userNode = space.getNode(userId);
        // 3. return if the node is included in the users array
        return usersArr.includes(userNode);
    } // DomainAgent#hasUserId

    async getUserById(userId) {
        // 1. get all users as array
        const usersArr = await this.getAllUsers();
        // 2. get the user node to the id from the space
        const userNode = space.getNode(userId);
        // 3. return null if the node is not included in the users array
        if (!usersArr.includes(userNode)) return null;
        // 4. load the node and return
        return await userNode.load();
    } // DomainAgent#getUserById

    async getAllUsersByAttribute(predicateId, objectValue) {
        // 1. get all users as array
        const usersArr   = await this.getAllUsers();
        // 2. find all nodes that conform to the criteria of containing the sought attribute
        const
            soughtObject = space.getLiteral(objectValue),
            soughtTerm   = soughtObject.term,
            resultArr    = [];
        await Promise.all(usersArr.map(async (userNode) => {
            await userNode.load(predicateId);
            const
                objectArr = userNode.getLiterals(predicateId),
                termArr   = objectArr.map(object => object.term),
                conforms  = termArr.some(term => term.equals(soughtTerm));
            if (conforms) resultArr.push(userNode);
        }));
        // 3. return the found nodes as array
        return resultArr;
    } // DomainAgent#getAllUsersByAttribute

    async getUserByAttribute(predicateId, objectValue) {
        // 1. get all users with the searched attribute
        const matchArr = await this.getAllUsersByAttribute(predicateId, objectValue);
        // 2. throw if match is not unique, else return result or null
        util.assert(matchArr.length <= 1, 'expected match to be unique');
        if (matchArr.length === 0) return null;
        return await matchArr[0].load();
    } // DomainAgent#getUserByAttribute

    async userMemberOf(userNode, groupNode) {
        return await this.groupHasMember(groupNode, userNode);
    } // DomainAgent#userMemberOf

    async getAllGroups() {
        // REM this is the position to implement caching of groups and scheduled refreshes
        // 1. load members of the group container
        await this.#groupsNode.load('ldp:member');
        // 2. return all groups in the container as array
        const groupsArr = this.#groupsNode.getNodes('ldp:member');
        this.emit('groups-refreshed', groupsArr);
        return groupsArr;
    } // DomainAgent#getAllGroups

    async hasGroupId(groupId) {
        // 1. get all groups as array
        const groupsArr = await this.getAllGroups();
        // 2. get the group node to the id from the space
        const groupNode = space.getNode(groupId);
        // 3. return if the node is included in the groups array
        return groupsArr.includes(groupNode);
    } // DomainAgent#hasGroupId

    async getGroupById(groupId) {
        // 1. get all groups as array
        const groupsArr = await this.getAllGroups();
        // 2. get the group node to the id from the space
        const groupNode = space.getNode(groupId);
        // 3. return null if the node is not included in the groups array
        if (!groupsArr.includes(groupNode)) return null;
        // 4. load the node and return
        return await groupNode.load();
    } // DomainAgent#getGroupById

    async getAllGroupsByAttribute(predicateId, objectValue) {
        // 1. get all groups as array
        const groupsArr  = await this.getAllGroups();
        // 2. find all nodes that conform to the criteria of containing the sought attribute
        const
            soughtObject = space.getLiteral(objectValue),
            soughtTerm   = soughtObject.term,
            resultArr    = [];
        await Promise.all(groupsArr.map(async (groupNode) => {
            await groupNode.load(predicateId);
            const
                objectArr = groupNode.getLiterals(predicateId),
                termArr   = objectArr.map(object => object.term),
                conforms  = termArr.some(term => term.equals(soughtTerm));
            if (conforms) resultArr.push(groupNode);
        }));
        // 3. return the found nodes as array
        return resultArr;
    } // DomainAgent#getAllGroupsByAttribute

    async getGroupByAttribute(predicateId, objectValue) {
        // 1. get all groups with the searched attribute
        const matchArr = await this.getAllGroupsByAttribute(predicateId, objectValue);
        // 2. throw if match is not unique, else return result or null
        util.assert(matchArr.length <= 1, 'expected match to be unique');
        if (matchArr.length === 0) return null;
        return await matchArr[0].load();
    } // DomainAgent#getGroupByAttribute

    async getAllUsersOfGroup(groupNode) {
        if (util.isString(groupNode)) groupNode = await this.getGroupById(groupNode);
        else util.assert(groupNode instanceof Node, 'expected groupNode to be an instance of a space Node');
        await groupNode.load('ldp:member');
        return groupNode.getNodes('ldp:member');
    } // DomainAgent#getAllUsersOfGroup

    async groupHasMember(groupNode, userNode) {
        if (util.isString(userNode)) userNode = await this.getUserById(userNode);
        else util.assert(userNode instanceof Node, 'expected userNode to be an instance of a space Node');
        const groupUsersArr = await this.getAllUsersOfGroup(groupNode);
        return groupUsersArr.includes(userNode);
    } // DomainAgent#groupHasMember

    on(event, listener) {
        this.#emitter.on(event, listener);
        return this;
    } // DomainAgent#on

    once(event, listener) {
        this.#emitter.once(event, listener);
        return this;
    } // DomainAgent#once

    off(event, listener) {
        this.#emitter.off(event, listener);
        return this;
    } // DomainAgent#off

    emit(event, ...args) {
        this.#emitter.emit(event, ...args);
        return this;
    } // DomainAgent#emit

} // DomainAgent

module.exports = DomainAgent;
