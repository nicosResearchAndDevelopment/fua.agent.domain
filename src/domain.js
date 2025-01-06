const
    Domain             = exports,
    {name: identifier} = require('../package.json'),
    assert             = require('@fua/core.assert');

assert(!global[identifier], 'unable to load a second uncached version of the singleton ' + identifier);
Object.defineProperty(global, identifier, {value: Domain, configurable: false, writable: false, enumerable: false});

const
    _Domain      = Object.create(null),
    EventEmitter = require('events'),
    Space        = require('@fua/agent.space'),
    is           = require('@fua/core.is');

Object.defineProperties(Domain, {
    uri:  {get: () => _Domain.uri || null, enumerable: true},
    node: {get: () => _Domain.domainNode || null, enumerable: true}
});

_Domain.emitter    = new EventEmitter();
_Domain.uri        = '';
_Domain.domainNode = null;
_Domain.usersNode  = null;
_Domain.groupsNode = null;

Domain.on    = _Domain.emitter.on.bind(_Domain.emitter);
Domain.once  = _Domain.emitter.once.bind(_Domain.emitter);
Domain.off   = _Domain.emitter.off.bind(_Domain.emitter);
_Domain.emit = _Domain.emitter.emit.bind(_Domain.emitter);

Domain.initialize = async function (options = {}) {
    assert(!_Domain.uri, 'already initialized');
    assert.object(options, {uri: is.string.token});
    _Domain.uri = options.uri;

    /** @type {fua.module.space.Node} */
    _Domain.domainNode = Space.getNode(_Domain.uri);
    await _Domain.domainNode.load();
    assert(_Domain.domainNode.type, `node for "${_Domain.uri}" not found in the space`);

    /** @type {fua.module.space.Node} */
    _Domain.usersNode = _Domain.domainNode.getNode('dom:users');
    assert(_Domain.usersNode, `reference "dom:users" not found for "${_Domain.uri}"`);
    await _Domain.usersNode.load('@type');
    assert(_Domain.usersNode.type, `node for "${_Domain.usersNode.id}" not found in the space`);

    /** @type {fua.module.space.Node} */
    _Domain.groupsNode = _Domain.domainNode.getNode('dom:groups');
    assert(_Domain.groupsNode, `reference "dom:groups" not found for "${_Domain.uri}"`);
    await _Domain.groupsNode.load('@type');
    assert(_Domain.groupsNode.type, `node for "${_Domain.groupsNode.id}" not found in the space`);

    return Domain;
};

/**
 * @returns {Promise<Array<fua.module.space.Node>>}
 */
Domain.getAllUsers = async function () {
    assert(_Domain.uri, 'not initialized');
    // REM this is the position to implement caching of users and scheduled refreshes
    // 1. load members of the user container
    await _Domain.usersNode.load('ldp:member');
    // 2. return all users in the container as array
    const usersArr = _Domain.usersNode.getNodes('ldp:member');
    _Domain.emit('users-refreshed', usersArr);
    return usersArr;
};

/**
 * @param {string} userId
 * @returns {Promise<boolean>}
 */
Domain.hasUserId = async function (userId) {
    assert(_Domain.uri, 'not initialized');
    // 1. get all users as array
    const usersArr = await Domain.getAllUsers();
    // 2. get the user node to the id from the space
    const userNode = Space.getNode(userId);
    // 3. return if the node is included in the users array
    return usersArr.includes(userNode);
};

/**
 * @param {string} userId
 * @returns {Promise<fua.module.space.Node | null>}
 */
Domain.getUserById = async function (userId) {
    assert(_Domain.uri, 'not initialized');
    // 1. get all users as array
    const usersArr = await Domain.getAllUsers();
    // 2. get the user node to the id from the space
    const userNode = Space.getNode(userId);
    // 3. return null if the node is not included in the users array
    if (!usersArr.includes(userNode)) return null;
    // 4. load the node and return
    return await userNode.load();
};

/**
 * @param {string} predicateId
 * @param {string} objectValue
 * @returns {Promise<Array<fua.module.space.Node>>}
 */
Domain.getAllUsersByAttribute = async function (predicateId, objectValue) {
    assert(_Domain.uri, 'not initialized');
    // 1. get all users as array
    const usersArr   = await Domain.getAllUsers();
    // 2. find all nodes that conform to the criteria of containing the sought attribute
    const
        soughtObject = Space.getLiteral(objectValue),
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
};

/**
 * @param {string} predicateId
 * @param {string} objectValue
 * @returns {Promise<fua.module.space.Node | null>}
 */
Domain.getUserByAttribute = async function (predicateId, objectValue) {
    assert(_Domain.uri, 'not initialized');
    // 1. get all users with the searched attribute
    const matchArr = await Domain.getAllUsersByAttribute(predicateId, objectValue);
    // 2. throw if match is not unique, else return result or null
    assert(matchArr.length <= 1, 'expected match to be unique');
    if (matchArr.length === 0) return null;
    return await matchArr[0].load();
};

/**
 * @param {fua.module.space.Node | string} userNode
 * @param {fua.module.space.Node | string} groupNode
 * @returns {Promise<boolean>}
 */
Domain.userMemberOf = async function (userNode, groupNode) {
    assert(_Domain.uri, 'not initialized');
    return await Domain.groupHasMember(groupNode, userNode);
};

/**
 * @returns {Promise<Array<fua.module.space.Node>>}
 */
Domain.getAllGroups = async function () {
    assert(_Domain.uri, 'not initialized');
    // REM this is the position to implement caching of groups and scheduled refreshes
    // 1. load members of the group container
    await _Domain.groupsNode.load('ldp:member');
    // 2. return all groups in the container as array
    const groupsArr = _Domain.groupsNode.getNodes('ldp:member');
    _Domain.emit('groups-refreshed', groupsArr);
    return groupsArr;
};

/**
 * @param {string} groupId
 * @returns {Promise<boolean>}
 */
Domain.hasGroupId = async function (groupId) {
    assert(_Domain.uri, 'not initialized');
    // 1. get all groups as array
    const groupsArr = await Domain.getAllGroups();
    // 2. get the group node to the id from the space
    const groupNode = Space.getNode(groupId);
    // 3. return if the node is included in the groups array
    return groupsArr.includes(groupNode);
};

/**
 * @param {string} groupId
 * @returns {Promise<fua.module.space.Node | null>}
 */
Domain.getGroupById = async function (groupId) {
    assert(_Domain.uri, 'not initialized');
    // 1. get all groups as array
    const groupsArr = await Domain.getAllGroups();
    // 2. get the group node to the id from the space
    const groupNode = Space.getNode(groupId);
    // 3. return null if the node is not included in the groups array
    if (!groupsArr.includes(groupNode)) return null;
    // 4. load the node and return
    return await groupNode.load();
};

/**
 * @param {string} predicateId
 * @param {string} objectValue
 * @returns {Promise<Array<fua.module.space.Node>>}
 */
Domain.getAllGroupsByAttribute = async function (predicateId, objectValue) {
    assert(_Domain.uri, 'not initialized');
    // 1. get all groups as array
    const groupsArr  = await Domain.getAllGroups();
    // 2. find all nodes that conform to the criteria of containing the sought attribute
    const
        soughtObject = Space.getLiteral(objectValue),
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
};

/**
 * @param {string} predicateId
 * @param {string} objectValue
 * @returns {Promise<fua.module.space.Node | null>}
 */
Domain.getGroupByAttribute = async function (predicateId, objectValue) {
    assert(_Domain.uri, 'not initialized');
    // 1. get all groups with the searched attribute
    const matchArr = await Domain.getAllGroupsByAttribute(predicateId, objectValue);
    // 2. throw if match is not unique, else return result or null
    assert(matchArr.length <= 1, 'expected match to be unique');
    if (matchArr.length === 0) return null;
    return await matchArr[0].load();
};

/**
 * @param {fua.module.space.Node | string} groupNode
 * @returns {Promise<Array<fua.module.space.Node>>}
 */
Domain.getAllUsersOfGroup = async function (groupNode) {
    assert(_Domain.uri, 'not initialized');
    if (is.string(groupNode)) groupNode = await Domain.getGroupById(groupNode);
    assert(Space.isNode(groupNode), 'expected groupNode to be an instance of a space Node');
    await groupNode.load('ldp:member');
    return groupNode.getNodes('ldp:member');
};

/**
 * @param {fua.module.space.Node | string} groupNode
 * @param {fua.module.space.Node | string} userNode
 * @returns {Promise<boolean>}
 */
Domain.groupHasMember = async function (groupNode, userNode) {
    assert(_Domain.uri, 'not initialized');
    if (is.string(userNode)) userNode = await Domain.getUserById(userNode);
    assert(Space.isNode(userNode), 'expected userNode to be an instance of a space Node');
    const groupUsersArr = await Domain.getAllUsersOfGroup(groupNode);
    return groupUsersArr.includes(userNode);
};

Object.freeze(Domain);
module.exports = Domain;
